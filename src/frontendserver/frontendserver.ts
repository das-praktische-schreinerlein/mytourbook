// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {enableProdMode} from '@angular/core';
import * as express from 'express';
import {join} from 'path';
import minimist from 'minimist';
import {FirewallConfig} from './shared-node/server-commons/firewall.commons';
import {CacheConfig} from './shared-node/server-commons/datacache.module';
import {ConfigureServerModule} from './shared-node/server-commons/configure-server.module';
import {FirewallModule} from './shared-node/server-commons/firewall.module';
import {DnsBLModule} from './shared-node/server-commons/dnsbl.module';
import {MytbAngularModule} from './mytb-ngexpress.module';
import * as fs from 'fs';

// disable debug-logging
const debug = false;
if (!debug) {
    console.debug = function() {};
    console.log = function() {};
}

const argv = []; //minimist(process.argv.slice(2));

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

const distFolder = join(process.cwd(), 'dist');
const distProfile = 'DIST_PROFILE';
const distServerProfile = 'DIST_SERVER_PROFILE';
const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
const filePathFirewallConfigJson = argv['f'] || argv['firewall'] || 'config/firewall.json';

export interface ServerConfig {
    filePathErrorDocs: string;
    backendConfig: {
        cacheConfig: CacheConfig;
    };
    firewallConfig: FirewallConfig;
    frontendPort: number;
}

const serverConfig: ServerConfig = {
    filePathErrorDocs: './error_docs/',
    backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' })),
    firewallConfig: JSON.parse(fs.readFileSync(filePathFirewallConfigJson, { encoding: 'utf8' })),
    frontendPort: 4002
};

// Express server
const app = express();

// ConfigureServerModule.configureServer(app, serverConfig.backendConfig);
FirewallModule.configureFirewall(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
// DnsBLModule.configureDnsBL(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
MytbAngularModule.configureRoutes(app, distFolder, distProfile, distServerProfile);

// Start up the Node server
app.listen(serverConfig.frontendPort['port'], function () {
    console.log('MyTB app listening on port ' + serverConfig.frontendPort['port']);
});

