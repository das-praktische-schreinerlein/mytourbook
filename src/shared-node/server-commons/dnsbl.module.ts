import express from 'express';
import honeypot from 'honeypot';
import {DnsBLConfig, FirewallConfig} from './firewall.commons';
import {DnsBLCacheEntry, DnsBLQuery, GenericDnsBLModule} from './generic-dnsbl.module';
import {DataCacheModule} from './datacache.module';

export class DnsBLModule extends GenericDnsBLModule {
    private pot;
    private maxThreatScore = 20;

    public static configureDnsBL(app: express.Application, firewallConfig: FirewallConfig, filePathErrorDocs: string): DnsBLModule {
        if (!firewallConfig || !firewallConfig.dnsBLConfig || !firewallConfig.dnsBLConfig.apiKey) {
            console.error('cant configure DnsBLModule because API-Key required!');
            return;
        }

        const cache = new DataCacheModule(firewallConfig.dnsBLConfig);
        return new DnsBLModule(app, firewallConfig, firewallConfig.dnsBLConfig, filePathErrorDocs, cache);
    }

    constructor(protected app: express.Application, protected firewallConfig: FirewallConfig, protected config: DnsBLConfig,
                protected filePathErrorDocs: string, protected cache: DataCacheModule) {
        super(app, firewallConfig, firewallConfig.dnsBLConfig, filePathErrorDocs, cache);
        if (firewallConfig.dnsBLConfig.maxThreatScore) {
            this.maxThreatScore = firewallConfig.dnsBLConfig.maxThreatScore;
        }
    }

    protected configureDnsBLClient() {
        this.pot = new honeypot(this.config.apiKey);
    }

    protected callDnsBLClient(query: DnsBLQuery): Promise<DnsBLCacheEntry> {
        const me = this;
        return new Promise<DnsBLCacheEntry>((resolve, reject) => {
            query.timeoutTimer = setTimeout(() => {
                me.checkResultOfDnsBLClient(query, 'timeout after ' + me.config.timeout, false,
                    'timeout after ' + me.config.timeout).then(value => {
                    return resolve(value);
                });
            }, me.config.timeout);
            console.log('DnsBLModule: call DnsBL for IP:' + query.ip + ' URL:' + query.req.url);
            this.pot.query(query.ip, function (potErr, potRes) {
                let blocked = false;
                if (potRes) {
                    const potResData = potRes.toString().split('.').map(Number);
                    if (potResData.length === 4) {
                        if (potResData[3] !== 0 || potResData[2] > me.maxThreatScore) {
                            console.error('DnsBLModule: blocked ' + query.ip + ' potResult because of score>' + me.maxThreatScore, potRes);
                            blocked = true;
                        } else {
                            console.log('DnsBLModule: not blocked  ' + query.ip + ' potResult:', potRes);
                        }
                    } else {
                        console.error('DnsBLModule: not blocked  ' + query.ip + ' illegal potResult:', potRes);
                    }
                } else {
                    console.log('DnsBLModule: not blocked  ' + query.ip + ' no potResult:', potRes);
                }
                me.checkResultOfDnsBLClient(query, potErr, blocked, potRes).then(value => {
                    return resolve(value);
                });
            });
        });
    }
}