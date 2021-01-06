import {CommonAdminCommand, SimpleConfigFilePathValidationRule, SimpleFilePathValidationRule} from './common-admin.command';
import {NameValidationRule, ValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

const DBMigrate = require('db-migrate');

// TODO move to commons
export class DbMigrateCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            migrationDbConfigFile: new SimpleConfigFilePathValidationRule(true),
            migrationsDir: new SimpleFilePathValidationRule(true),
            migrationEnv: new NameValidationRule(true)
        };
    }

    protected processCommandArgs(argv: {}): Promise<any> {
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
