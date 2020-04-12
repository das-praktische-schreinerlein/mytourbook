// These are important and needed before anything else
import * as express from 'express';
import {join} from 'path';
import {FirewallConfig} from '@dps/mycms-server-commons/dist/server-commons/firewall.commons';
import {CacheConfig} from '@dps/mycms-server-commons/dist/server-commons/datacache.module';
import {ConfigureServerModule} from '@dps/mycms-server-commons/dist/server-commons/configure-server.module';
import {FirewallModule} from '@dps/mycms-server-commons/dist/server-commons/firewall.module';
import * as fs from 'fs';
import {DnsBLModule} from '@dps/mycms-server-commons/dist/server-commons/dnsbl.module';
import {CacheModeType, ServerModuleConfig, SimpleFrontendServerModule} from './simple-frontend-server.module';

const minimist = require ('minimist');

const argv = minimist(process.argv.slice(2));

// Faster server renders w/ Prod mode (dev mode never needed)
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
    cacheMode: CacheModeType.CACHED_ONLY,
    redirectFileJson: serverConfig.frontendConfig.redirectFileJson || undefined,
    redirectOnlyCached: serverConfig.frontendConfig.redirectOnlyCached || false
};

// Express server
const app = express();

ConfigureServerModule.configureServer(app, serverConfig.backendConfig);
FirewallModule.configureFirewall(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
DnsBLModule.configureDnsBL(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
SimpleFrontendServerModule.configureDefaultServer(app, frontendConfig);
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
