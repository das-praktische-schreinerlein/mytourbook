import minimist from 'minimist';
import {AdminCommandConfigType, AdminCommandManager} from './commands/admin-command.manager';
import fs from 'fs';

const argv = minimist(process.argv.slice(2));

const filePathConfigJson = argv['adminclibackend'];
if (filePathConfigJson === undefined) {
    console.error('ERROR - parameters required adminclibackend: "--adminclibackend"');
    process.exit(-1);
}

const adminBackendConfig: AdminCommandConfigType = JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' }));

// disable debug-logging
const debug = argv['debug'] || false;
if (!debug) {
    console.log = function() {};
}
if (!debug || debug === false || parseInt(debug, 10) < 1) {
    console.trace = function() {};
    console.debug = function() {};
}

const adminCommandManager = new AdminCommandManager(adminBackendConfig);
adminCommandManager.process(argv).then(value => {
    console.log('DONE - command finished:', value, argv);
    process.exit(0);
}).catch(reason => {
    console.error('ERROR - command failed:', reason, argv);
    process.exit(-1);
});
