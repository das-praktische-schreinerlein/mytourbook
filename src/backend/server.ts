// These are important and needed before anything else
import * as express from 'express';
import * as fs from 'fs';
import minimist from 'minimist';
import {ServerConfig, ServerModuleLoader} from './server-module.loader';

const argv = minimist(process.argv.slice(2));

const debug = argv['debug'] || false;
const filePathConfigJson = argv['c'] || argv['backend'];
const filePathFirewallConfigJson = argv['f'] || argv['firewall'];
if (filePathConfigJson === undefined || filePathFirewallConfigJson === undefined) {
    console.error('ERROR - parameters required backendConfig: "-c | --backend" firewallConfig: "-f | --firewall"');
    process.exit(-1);
}

const serverConfig: ServerConfig = {
    apiDataPrefix: '/api/v1',
    apiAssetsPrefix: '/api/assets',
    apiPublicPrefix: '/api/static',
    filePathErrorDocs: './error_docs/',
    backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' })),
    firewallConfig: JSON.parse(fs.readFileSync(filePathFirewallConfigJson, { encoding: 'utf8' }))
};

// create server
const app = express();

// load modules
ServerModuleLoader.loadModules(app, serverConfig);

// start server as seen on https://nodejs.org/api/net.html#net_server_listen
const bindIp = serverConfig.backendConfig.bindIp ? serverConfig.backendConfig.bindIp : '127.0.0.1';
app.listen(serverConfig.backendConfig.port, bindIp,  511, function () {
    console.log('MyTB app listening on ip/port', bindIp, serverConfig.backendConfig.port);
    if (!debug) {
        console.log = function() {};
    }
    if (!debug || debug === true || parseInt(debug, 10) < 1) {
        console.trace = function() {};
        console.debug = function() {};
    }
});

