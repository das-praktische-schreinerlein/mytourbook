// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {enableProdMode} from '@angular/core';
import * as express from 'express';
import {join} from 'path';
import {FirewallConfig} from './shared-node/server-commons/firewall.commons';
import {CacheConfig} from './shared-node/server-commons/datacache.module';
import {ConfigureServerModule} from './shared-node/server-commons/configure-server.module';
import {FirewallModule} from './shared-node/server-commons/firewall.module';
import {CacheModeType, MytbAngularUniversalModule, UniversalModuleConfig} from './mytb-angular-universal.module';
import * as fs from 'fs';

const minimist = require ('minimist');

// disable debug-logging
const debug = false;
if (!debug) {
    console.debug = function() {};
    console.log = function() {};
}

const argv = minimist(process.argv.slice(2));

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

const distFolder = join(process.cwd(), 'dist');
const distProfile = 'mytbdev/de/'; //'DIST_PROFILE'; 'mytbdev/de/';
const distServerProfile = 'mytbdev-server/de/'; //'DIST_SERVER_PROFILE'; 'mytbdev-server/de/';
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

const frontendConfig: UniversalModuleConfig = {
    distServerProfile: distServerProfile,
    distFolder: distFolder,
    distProfile: distProfile,
    cacheFolder: 'cache/',
    cacheMode: CacheModeType.CACHED_ONLY
};

// Express server
const app = express();

ConfigureServerModule.configureServer(app, serverConfig.backendConfig);
FirewallModule.configureFirewall(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
//DnsBLModule.configureDnsBL(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
MytbAngularUniversalModule.configureDefaultServer(app, frontendConfig);

// Start up the Node server
app.listen(serverConfig.frontendPort, function () {
    console.log('MyTB app listening on port ' + serverConfig.frontendPort);
});

