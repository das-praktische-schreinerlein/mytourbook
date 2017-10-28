import express from 'express';
import honeypot from 'honeypot';
import {DnsBLConfig, FirewallConfig} from './firewall.commons';
import {DnsBLCacheEntry, DnsBLQuery, GenericDnsBLModule} from './generic-dnsbl.module';

export class DnsBLModule extends GenericDnsBLModule {
    private pot;

    public static configureDnsBL(app: express.Application, firewallConfig: FirewallConfig, filePathErrorDocs: string): DnsBLModule {
        if (!firewallConfig || !firewallConfig.dnsBLConfig || !firewallConfig.dnsBLConfig.apiKey) {
            console.error('cant configure DnsBLModule because API-Key required!');
            return;
        }

        return new DnsBLModule(app, firewallConfig, firewallConfig.dnsBLConfig, filePathErrorDocs);
    }

    constructor(protected app: express.Application, protected firewallConfig: FirewallConfig, protected config: DnsBLConfig,
                protected filePathErrorDocs: string) {
        super(app, firewallConfig, firewallConfig.dnsBLConfig, filePathErrorDocs);
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
                me.checkResultOfDnsBLClient(query, potErr, !(!potRes), potRes).then(value => {
                    return resolve(value);
                });
            });
        });
    }
}
