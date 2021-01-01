import {AbstractCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract.command';
const DBMigrate = require('db-migrate');

export class DbMigrateCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const migrationDbConfigFile = argv['migrationDbConfigFile'];
        if (migrationDbConfigFile === undefined) {
            console.error('ERROR - parameters required migrationDbConfigFile: "--migrationDbConfigFile"');
            process.exit(-1);
        }
        const migrationsDir = argv['migrationsDir'];
        if (migrationsDir === undefined) {
            console.error('ERROR - parameters required migrationsDir: "--migrationsDir"');
            process.exit(-1);
        }
        const migrationEnv = argv['migrationEnv'];
        if (migrationEnv === undefined) {
            console.error('ERROR - parameters required migrationEnv: "--migrationEnv"');
            process.exit(-1);
        }

        const options = {
            config: migrationDbConfigFile,
            cmdOptions: {
                'migrations-dir': migrationsDir
            },
            env: migrationEnv,
            throwUncatched: true
        };
        const dbMigrate = DBMigrate.getInstance(true, options);
        return dbMigrate.up();
    }
}
