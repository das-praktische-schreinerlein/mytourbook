import express from 'express';
import * as fs from 'fs';
import {ServerConfig, ServerModuleLoader} from './server-module.loader';

// disable debug-logging
const debug = false;
if (!debug) {
    console.debug = function() {};
    console.log = function() {};
}

const filePathConfigJson = 'config/backend.json';
const filePathFirewallConfigJson = 'config/firewall.json';
const serverConfig: ServerConfig = {
    apiPrefix: '/api/v1',
    filePathErrorDocs: './error_docs/',
    backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' })),
    firewallConfig: JSON.parse(fs.readFileSync(filePathFirewallConfigJson, { encoding: 'utf8' }))
};

// create server
const app = express();

// load modules
ServerModuleLoader.loadModules(app, serverConfig);

// start server
app.listen(serverConfig.backendConfig['port'], function () {
    console.log('MyTB app listening on port ' + serverConfig.backendConfig['port']);
});

