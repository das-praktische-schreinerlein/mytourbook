import express from 'express';
import honeypot from 'honeypot';
import {FirewallCommons, FirewallConfig} from './firewall.commons';

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


export class DnsBLModule {
    public static configureDnsBL(app: express.Application, firewallConfig: FirewallConfig, filePathErrorDocs: string) {
        if (!firewallConfig || !firewallConfig.dnsBLConfig || !firewallConfig.dnsBLConfig.apiKey) {
            console.error('cant configure DnsBLModule because API-Key required!');
            return;
        }

        const dnscache = {};
        const pot = new honeypot(firewallConfig.dnsBLConfig.apiKey);
        app.use(function(req, res, _next) {
            const ip = req['clientIp'];

            const cacheEntry: DnsBLCacheEntry = dnscache[ip];
            if (cacheEntry && cacheEntry.ttl >= Date.now()) {
                return DnsBLModule.resolveResult(cacheEntry, req, res, _next, firewallConfig, filePathErrorDocs);
            }

            if (firewallConfig.dnsBLConfig.whitelistIps.indexOf(ip) >= 0) {
                return _next();
            }

            pot.query(ip, function(potErr, potRes) {
                console.log('DnsBLModule: check IP:' + ip + ' URL:' + req.url);
                let potCacheEntry: DnsBLCacheEntry = dnscache[ip];
                if (!potCacheEntry) {
                    potCacheEntry = {
                        created: Date.now(),
                        updated: undefined,
                        details: undefined,
                        state: undefined,
                        ttl: undefined,
                        ip: ip,
                    };
                }

                potCacheEntry.updated = Date.now();
                potCacheEntry.details = potRes;

                if (potErr) {
                    // NORESULT
                    if (!potCacheEntry) {
                        potCacheEntry.ttl = (Date.now() + firewallConfig.dnsBLConfig.errttl);
                        potCacheEntry.state = DnsBLCacheEntryState.NORESULT;
                    } else if (potCacheEntry.state === DnsBLCacheEntryState.OK) {
                        potCacheEntry.state = DnsBLCacheEntryState.NORESULT;
                    }
                    potCacheEntry.ttl = firewallConfig.dnsBLConfig.errttl;
                } else if (!potRes) {
                    // OK
                    potCacheEntry.ttl = (Date.now() + firewallConfig.dnsBLConfig.dnsttl);
                    potCacheEntry.state = DnsBLCacheEntryState.OK;
                } else {
                    // BLOCKED
                    potCacheEntry.ttl = (Date.now() + firewallConfig.dnsBLConfig.dnsttl);
                    potCacheEntry.state = DnsBLCacheEntryState.BLOCKED;
                }

                dnscache[ip] = potCacheEntry;

                return DnsBLModule.resolveResult(potCacheEntry, req, res, _next, firewallConfig, filePathErrorDocs);
            });
        });
    }

    private static resolveResult(cacheEntry: DnsBLCacheEntry, req, res, _next, firewallConfig: FirewallConfig, filePathErrorDocs: string) {
        if (cacheEntry.state !== DnsBLCacheEntryState.BLOCKED) {
            return _next();
        }

        console.error('DnsBLModule: BLOCKED blacklisted IP:' + req['clientIp'] + ' URL:' + req.url);
        return FirewallCommons.resolveBlocked(req, res, firewallConfig, filePathErrorDocs);
    }
}
