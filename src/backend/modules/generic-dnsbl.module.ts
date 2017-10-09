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
    private dnsBLCache = {};

    constructor(protected app: express.Application, protected firewallConfig: FirewallConfig, protected config: DnsBLConfig,
                protected filePathErrorDocs: string) {
        this.configureDnsBLClient();
        this.configureMiddleware();
    }

    protected abstract configureDnsBLClient();

    protected abstract callDnsBLClient(query: DnsBLQuery);

    protected checkResultOfDnsBLClient(query: DnsBLQuery, err, blocked: boolean, details: any) {
        console.log('DnsBLModule: check IP:' + query.ip + ' URL:' + query.req.url);
        let potCacheEntry: DnsBLCacheEntry = this.dnsBLCache[query.ip];
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
                potCacheEntry.ttl = (Date.now() + this.config.errttl);
                potCacheEntry.state = DnsBLCacheEntryState.NORESULT;
            } else if (potCacheEntry.state === DnsBLCacheEntryState.OK) {
                potCacheEntry.state = DnsBLCacheEntryState.NORESULT;
            }
            potCacheEntry.ttl = this.config.errttl;
        } else if (!blocked) {
            // OK
            potCacheEntry.ttl = (Date.now() + this.config.dnsttl);
            potCacheEntry.state = DnsBLCacheEntryState.OK;
        } else {
            // BLOCKED
            potCacheEntry.ttl = (Date.now() + this.config.dnsttl);
            potCacheEntry.state = DnsBLCacheEntryState.BLOCKED;
        }

        this.dnsBLCache[query.ip] = potCacheEntry;

        return this.resolveResult(potCacheEntry, query, this.firewallConfig, this.filePathErrorDocs);
    }

    protected configureMiddleware() {
        const me = this;
        me.app.use(function(req, res, _next) {
            const ip = req['clientIp'];

            const cacheEntry: DnsBLCacheEntry = me.dnsBLCache[ip];
            const query: DnsBLQuery = {
                ip: ip,
                req: req,
                res: res,
                _next: _next,
                alreadyServed: false,
                timeoutTimer: undefined
            };
            if (cacheEntry && cacheEntry.ttl >= Date.now()) {
                return me.resolveResult(cacheEntry, query, me.firewallConfig, me.filePathErrorDocs);
            }

            if (me.config.whitelistIps.indexOf(ip) >= 0) {
                return _next();
            }

            query.timeoutTimer = setTimeout(() => {
                me.checkResultOfDnsBLClient(query, 'timeout after ' + me.config.timeout, false,
                    'timeout after ' + me.config.timeout);
            }, me.config.timeout);
            me.callDnsBLClient(query);
        });
    }

    protected resolveResult(cacheEntry: DnsBLCacheEntry, query: DnsBLQuery, firewallConfig: FirewallConfig, filePathErrorDocs: string) {
        if (query.timeoutTimer) {
            clearTimeout(query.timeoutTimer);
        }
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
}
