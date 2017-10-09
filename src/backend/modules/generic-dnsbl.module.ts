import express from 'express';
import {DnsBLConfig, FirewallCommons, FirewallConfig} from './firewall.commons';

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

    constructor(protected app: express.Application, protected firewallConfig: FirewallConfig, protected config: DnsBLConfig,
                protected filePathErrorDocs: string) {
        this.configureDnsBLClient();
        this.configureMiddleware();
    }

    protected abstract configureDnsBLClient();

    protected abstract callDnsBLClient(query: DnsBLQuery): Promise<DnsBLCacheEntry>;

    protected checkResultOfDnsBLClient(query: DnsBLQuery, err, blocked: boolean, details: any): DnsBLCacheEntry {
        let potCacheEntry: DnsBLCacheEntry = this.getCachedResult(query.ip);
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
            console.warn('DnsBLModule: error while reading for query:' +  [query.ip, query.req.url].join(' '), err);
            if (!potCacheEntry) {
                potCacheEntry.state = DnsBLCacheEntryState.NORESULT;
            } else if (potCacheEntry.state === DnsBLCacheEntryState.OK) {
                potCacheEntry.state = DnsBLCacheEntryState.NORESULT;
            }
            potCacheEntry.ttl = (Date.now() + this.config.errttl);
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

        return potCacheEntry;
    }

    protected configureMiddleware() {
        const me = this;
        me.app.use(function(req, res, _next) {
            const ip = req['clientIp'];
            const cacheEntry: DnsBLCacheEntry = me.getCachedResult(ip);
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

    protected getCachedResult(ip: string): DnsBLCacheEntry {
        return this.dnsBLResultCache[ip];
    }

    protected putCachedResult(ip: string, cacheEntry: DnsBLCacheEntry) {
        this.dnsBLResultCache[ip] = cacheEntry;
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
