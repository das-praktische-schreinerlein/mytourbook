// These are important and needed before anything else
import * as express from 'express';
import * as fs from 'fs';
import minimist from 'minimist';
import {AdminServerConfig, AdminServerModuleLoader} from './adminserver-module.loader';

const argv = minimist(process.argv.slice(2));

const debug = argv['debug'] || false;
const filePathConfigJson = argv['adminbackend'];
const filePathFirewallConfigJson = argv['firewall'];
if (filePathConfigJson === undefined || filePathFirewallConfigJson === undefined) {
    console.error('ERROR - parameters required adminbackend: "--adminbackend" firewallConfig: "--firewall"');
    process.exit(-1);
}

const serverConfig: AdminServerConfig = {
    apiAdminPrefix: '/adminapi/v1',
    adminBackendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' })),
    filePathErrorDocs: './error_docs/',
    firewallConfig: JSON.parse(fs.readFileSync(filePathFirewallConfigJson, { encoding: 'utf8' }))
};

// create server
const app = express();

// load modules
AdminServerModuleLoader.loadAdminModules(app, serverConfig);

// start server as seen on https://nodejs.org/api/net.html#net_server_listen
const bindIp = serverConfig.adminBackendConfig.bindIp ? serverConfig.adminBackendConfig.bindIp : '127.0.0.1';
const tcpBacklog = serverConfig.adminBackendConfig.tcpBacklog ? serverConfig.adminBackendConfig.tcpBacklog : 511;
app.listen(serverConfig.adminBackendConfig.port, bindIp,  tcpBacklog, function () {
    console.log('MyTB app listening on ip/port/tcpBacklog', bindIp, serverConfig.adminBackendConfig.port, tcpBacklog);

    if (!debug) {
        console.log = function() {};
    }
    if (!debug || debug === true || parseInt(debug, 10) < 1) {
        console.trace = function() {};
        console.debug = function() {};
    }
});

