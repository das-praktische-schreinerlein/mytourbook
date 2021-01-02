import {AbstractCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract.command';
const DBMigrate = require('db-migrate');

export class DbMigrateCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const migrationDbConfigFile = argv['migrationDbConfigFile'];
        if (migrationDbConfigFile === undefined) {
            return Promise.reject('ERROR - parameters required migrationDbConfigFile: "--migrationDbConfigFile"');
        }

        const migrationsDir = argv['migrationsDir'];
        if (migrationsDir === undefined) {
            return Promise.reject('ERROR - parameters required migrationsDir: "--migrationsDir"');
        }

        const migrationEnv = argv['migrationEnv'];
        if (migrationEnv === undefined) {
            return Promise.reject('ERROR - parameters required migrationEnv: "--migrationEnv"');
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
