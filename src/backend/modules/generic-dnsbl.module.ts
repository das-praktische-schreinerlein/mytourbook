import express from 'express';
import {DnsBLConfig, FirewallCommons, FirewallConfig} from './firewall.commons';
import * as redis from 'redis';
import isIP from 'validator/lib/isIP';

export enum DnsBLCacheEntryState {
    OK, BLOCKED, NORESULT
}

export interface DnsBLCacheEntry {
    created: number;
    updated: number;
    ip: string;
    ttl: number;
    state: DnsBLCacheEntryState;
    details: any;
}

export interface DnsBLQuery {
    ip: string;
    req: any;
    res: any;
    _next: any;
    alreadyServed: boolean;
    timeoutTimer: any;
}


export abstract class GenericDnsBLModule {
    private dnsBLResultCache = {};
    private queryCache = {};
    private redisClient;
    private redisPrefix = 'dnsbl:';

    constructor(protected app: express.Application, protected firewallConfig: FirewallConfig, protected config: DnsBLConfig,
                protected filePathErrorDocs: string) {
        this.configureDnsBLClient();
        this.configureMiddleware();
        this.configureRedisStore();
    }

    protected abstract configureDnsBLClient();

    protected abstract callDnsBLClient(query: DnsBLQuery): Promise<DnsBLCacheEntry>;

    protected configureRedisStore() {
        if (this.config.cacheRedisUrl) {
            this.redisClient = redis.createClient({url: this.config.cacheRedisUrl, password: this.config.cacheRedisPass,
                db: this.config.cacheRedisDB});
        }
    }

    protected checkResultOfDnsBLClient(query: DnsBLQuery, err, blocked: boolean, details: any): Promise<DnsBLCacheEntry> {
        return new Promise<DnsBLCacheEntry>((resolve, reject) => {
            this.getCachedResult(query.ip).then(value => {
                let potCacheEntry: DnsBLCacheEntry = value;
                if (!potCacheEntry) {
                    potCacheEntry = {
                        created: Date.now(),
                        updated: undefined,
                        details: undefined,
                        state: undefined,
                        ttl: undefined,
                        ip: query.ip,
                    };
                }

                potCacheEntry.updated = Date.now();
                potCacheEntry.details = details;

                if (err) {
                    // NORESULT
                    if (err.code === 'ENOTFOUND') {
                        // not known: OK
                        potCacheEntry.ttl = (Date.now() + this.config.dnsttl);
                        potCacheEntry.state = DnsBLCacheEntryState.OK;
                    } else {
                        // ERROR
                        console.warn('DnsBLModule: error while reading for query:' + [query.ip, query.req.url].join(' '), err);
                        if (potCacheEntry.state !== DnsBLCacheEntryState.BLOCKED) {
                            potCacheEntry.state = DnsBLCacheEntryState.NORESULT;
                        }
                        potCacheEntry.ttl = (Date.now() + this.config.errttl);
                    }
                } else if (!blocked) {
                    // OK
                    potCacheEntry.ttl = (Date.now() + this.config.dnsttl);
                    potCacheEntry.state = DnsBLCacheEntryState.OK;
                } else {
                    // BLOCKED
                    potCacheEntry.ttl = (Date.now() + this.config.dnsttl);
                    potCacheEntry.state = DnsBLCacheEntryState.BLOCKED;
                }

                this.putCachedResult(query.ip, potCacheEntry);

                this.resolveResult(potCacheEntry, query, this.firewallConfig, this.filePathErrorDocs);

                return resolve(potCacheEntry);
            });
        });
    }

    protected configureMiddleware() {
        const me = this;
        me.app.use(function(req, res, _next) {
            const ip = req['clientIp'];
            // check for valid ip4
            if (isIP(ip, '6')) {
                return _next();
            }
            if (!isIP(ip, '4')) {
                console.error('DnsBLModule: BLOCKED invalid IP:' + ip + ' URL:' + req.url);
                return FirewallCommons.resolveBlocked(req, res, me.firewallConfig, me.filePathErrorDocs);
            }

            // check for dnsbl
            me.getCachedResult(ip).then(value => {
                const cacheEntry: DnsBLCacheEntry = value;
                const query = me.createQuery(ip, req, res, _next);

                // already cached
                if (me.isCacheEntryValid(cacheEntry)) {
                    return me.resolveResult(cacheEntry, query, me.firewallConfig, me.filePathErrorDocs);
                }

                // whitelisted
                if (me.isWhitelisted(ip)) {
                    return _next();
                }

                // same query running
                let promise = me.getCachedQuery(ip);
                if (promise) {
                    promise.then(function(parentCacheEntry: DnsBLCacheEntry) {
                        return me.resolveResult(parentCacheEntry, query, me.firewallConfig, me.filePathErrorDocs);
                    });
                    return;
                }

                // do new query
                promise = me.callDnsBLClient(query);
                me.putCachedQuery(ip, promise);
            });
        });
    }

    protected resolveResult(cacheEntry: DnsBLCacheEntry, query: DnsBLQuery, firewallConfig: FirewallConfig, filePathErrorDocs: string) {
        // remove from queryCache
        this.removeCachedQuery(query.ip);

        // delete timer
        if (query.timeoutTimer) {
            clearTimeout(query.timeoutTimer);
        }

        // ignore if already served
        if (query.alreadyServed) {
            return;
        }


        query.alreadyServed = true;
        if (cacheEntry.state !== DnsBLCacheEntryState.BLOCKED) {
            return query._next();
        }

        console.error('DnsBLModule: BLOCKED blacklisted IP:' + query.req['clientIp'] + ' URL:' + query.req.url);
        return FirewallCommons.resolveBlocked(query.req, query.res, firewallConfig, filePathErrorDocs);
    }

    protected createQuery(ip: string, req, res, _next): DnsBLQuery {
        return {
            ip: ip,
            req: req,
            res: res,
            _next: _next,
            alreadyServed: false,
            timeoutTimer: undefined
        };
    }

    protected isCacheEntryValid(cacheEntry: DnsBLCacheEntry): boolean {
        return cacheEntry && cacheEntry.ttl >= Date.now();
    }

    protected isWhitelisted(ip: string): boolean {
        return this.config.whitelistIps.indexOf(ip) >= 0;
    }

    protected getCachedResult(ip: string): Promise<DnsBLCacheEntry> {
        return new Promise<DnsBLCacheEntry>((resolve, reject) => {
            if (this.dnsBLResultCache[ip]) {
                return resolve(this.dnsBLResultCache[ip]);
            } else if (this.redisClient) {
                this.redisClient.get(this.redisPrefix + ip, function (er, data) {
                    if (er) {
                        console.error('DnsBLModule: error while calling redis:', er);
                    }
                    if (!data || data === null || data === 'null') {
                        return resolve();
                    }

                    let result;
                    try {
                        result = JSON.parse(data.toString());
                    } catch (er) {
                        console.error('DnsBLModule: cant parse redisresult:', data);
                        return resolve();
                    }
                    return resolve(result);
                });
            } else {
                return resolve();
            }
        });
    }

    protected putCachedResult(ip: string, cacheEntry: DnsBLCacheEntry) {
        this.dnsBLResultCache[ip] = cacheEntry;
        this.redisClient.set(this.redisPrefix + ip, JSON.stringify(cacheEntry));
    }

    protected getCachedQuery(ip: string): Promise<DnsBLCacheEntry> {
        return this.queryCache[ip];
    }

    protected putCachedQuery(ip: string, query: Promise<DnsBLCacheEntry>) {
        this.queryCache[ip] = query;
    }

    protected removeCachedQuery(ip: string) {
        delete this.queryCache[ip];
    }
}
