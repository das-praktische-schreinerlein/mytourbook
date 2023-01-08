import minimist from 'minimist';
import {AdminCommandConfigType, AdminCommandManager} from './commands/admin-command.manager';
import fs from 'fs';

const argv: string[] = minimist(process.argv.slice(2));

const filePathConfigJson = argv['adminclibackend'];
if (filePathConfigJson === undefined) {
    console.error('ERROR - parameters required adminclibackend: "--adminclibackend"');
    process.exit(-1);
}

const adminBackendConfig: AdminCommandConfigType = JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' }));
const adminCommandManager = new AdminCommandManager(adminBackendConfig);
if (argv['help'] || argv['usage']) {
    console.error('help -> prepared commands: ', JSON.stringify(adminCommandManager.listPreparedCommands(), null, 2));
    console.error('help -> available commands and parameters: ', JSON.stringify(adminCommandManager.listAvailableCommands(), null, 2));
    process.exit(0);
}

// disable debug-logging
const debug = argv['debug'] || false;
console.log('Debug-level level/log/trace', debug, !(!debug), !(!debug || debug === true || parseInt(debug, 10) < 1));
if (!debug) {
    console.log = function() {};
}
if (!debug || debug === true || parseInt(debug, 10) < 1) {
    console.trace = function() {};
    console.debug = function() {};
}

adminCommandManager.runCommand(argv).then(value => {
    console.log('DONE - command finished:', value, argv);
    process.exit(0);
}).catch(reason => {
    console.error('ERROR - command failed:', reason, argv);
    process.exit(-1);
});
