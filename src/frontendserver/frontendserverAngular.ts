// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {enableProdMode} from '@angular/core';
import * as express from 'express';
import {join} from 'path';
import {FirewallConfig} from '@dps/mycms-server-commons/dist/server-commons/firewall.commons';
import {ConfigureServerModule} from '@dps/mycms-server-commons/dist/server-commons/configure-server.module';
import {FirewallModule} from '@dps/mycms-server-commons/dist/server-commons/firewall.module';
import {AngularUniversalFrontendServerModule} from './angular-universal-frontend-server.module';
import * as fs from 'fs';
import {DnsBLModule} from '@dps/mycms-server-commons/dist/server-commons/dnsbl.module';
import {CacheModeType, ServerModuleConfig} from './simple-frontend-server.module';
import {BackendConfigType} from './backend.commons';

const minimist = require ('minimist');

const argv = minimist(process.argv.slice(2));

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();
const debug = argv['debug'] || false;
const staticFolder = join(process.cwd(), 'dist/static');
const distProfile = 'DIST_PROFILE';
const distServerProfile = 'DIST_SERVER_PROFILE';
const filePathConfigJson = argv['frontend'];
const filePathBackendConfigJson = argv['c'] || argv['backend'];
const filePathFirewallConfigJson = argv['f'] || argv['firewall'];
if (filePathConfigJson === undefined || filePathBackendConfigJson === undefined || filePathFirewallConfigJson === undefined) {
    console.error('ERROR - parameters required frontendConfig:  "--frontend" backendConfig: "-c | --backend" firewallConfig: "-f | --firewall"');
    process.exit(-1);
}

export interface ServerConfig {
    filePathErrorDocs: string;
    backendConfig: BackendConfigType;
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
AngularUniversalFrontendServerModule.configureDefaultServer(app, frontendConfig);
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
