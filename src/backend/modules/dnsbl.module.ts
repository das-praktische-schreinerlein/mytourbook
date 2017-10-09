import express from 'express';
import honeypot from 'honeypot';
import {DnsBLConfig, FirewallConfig} from './firewall.commons';
import {DnsBLQuery, GenericDnsBLModule} from './generic-dnsbl.module';

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

    protected callDnsBLClient(query: DnsBLQuery) {
        const me = this;
        this.pot.query(query.ip, function(potErr, potRes) {
            return me.checkResultOfDnsBLClient(query, potErr, !(!potRes), potRes);
        });
    }
}
