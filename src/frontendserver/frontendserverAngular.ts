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
import {MytbAngularUniversalModule} from './mytb-angular-universal.module';
import * as fs from 'fs';
import {DnsBLModule} from './shared-node/server-commons/dnsbl.module';
import {CacheModeType, ServerModuleConfig} from './mytb-simple-server.module';

const minimist = require ('minimist');

const argv = minimist(process.argv.slice(2));

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();
const debug = argv['debug'] || false;
const staticFolder = join(process.cwd(), 'dist/static');
const distProfile = 'DIST_PROFILE';
const distServerProfile = 'DIST_SERVER_PROFILE';
const filePathConfigJson = argv['frontend'] || 'config/frontend.json';
const filePathBackendConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
const filePathFirewallConfigJson = argv['f'] || argv['firewall'] || 'config/firewall.json';

export interface ServerConfig {
    filePathErrorDocs: string;
    backendConfig: {
        cacheConfig: CacheConfig;
    };
    firewallConfig: FirewallConfig;
    frontendConfig: {
        port: number,
        cacheFolder: string,
        redirectFileJson?: string,
        redirectOnlyCached?: boolean
    };
}

const serverConfig: ServerConfig = {
    filePathErrorDocs: './error_docs/',
    backendConfig: JSON.parse(fs.readFileSync(filePathBackendConfigJson, { encoding: 'utf8' })),
    firewallConfig: JSON.parse(fs.readFileSync(filePathFirewallConfigJson, { encoding: 'utf8' })),
    frontendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' }))
};

const frontendConfig: ServerModuleConfig = {
    distServerProfile: distServerProfile,
    staticFolder: staticFolder,
    distProfile: distProfile,
    cacheFolder: serverConfig.frontendConfig.cacheFolder,
    cacheMode: CacheModeType.USE_CACHE,
    redirectFileJson: serverConfig.frontendConfig.redirectFileJson || undefined,
    redirectOnlyCached: serverConfig.frontendConfig.redirectOnlyCached || false
};

// Express server
const app = express();

ConfigureServerModule.configureServer(app, serverConfig.backendConfig);
FirewallModule.configureFirewall(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
DnsBLModule.configureDnsBL(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
MytbAngularUniversalModule.configureDefaultServer(app, frontendConfig);
ConfigureServerModule.configureDefaultErrorHandler(app);

// Start up the Node server
app.listen(serverConfig.frontendConfig.port, function () {
    console.log('MyTB app listening on port ' + serverConfig.frontendConfig.port);

    // disable debug-logging
    if (!debug) {
        console.trace = function() {};
        console.debug = function() {};
        console.log = function() {};
    }
});
