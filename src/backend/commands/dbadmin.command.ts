import * as fs from 'fs';
import {SimpleConfigFilePathValidationRule} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {ValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {AbstractDbCommand, DbCommandOptions} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract-db.command';
import {BackendConfigType} from '../modules/backend.commons';

export interface DbAdminCommandOptions extends DbCommandOptions {
    action: string;
    profile: string;
}

export class DbAdminCommand extends AbstractDbCommand<DbAdminCommandOptions> {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            backend: new SimpleConfigFilePathValidationRule(true),
            basePath: new SimpleConfigFilePathValidationRule(false),
        };
    }

    protected definePossibleActions(): string[] {
        return [
            'fixture-fix-gpx-timecorrector',
            'fixture-update-tour-min-dates',
            'action-update-media-coor-by-gpstrackpoints',
        ];
    }

    protected configureProcessingFiles(dbCommandOptions: DbAdminCommandOptions , functionFiles: string[], sqlFiles: string[])
        : Promise<DbAdminCommandOptions> {
        const profilePath = dbCommandOptions.basePath + '/' + dbCommandOptions.profile + '/mytbdb/';

        if (dbCommandOptions.action === 'action-update-media-coor-by-gpstrackpoints') {
            sqlFiles.push(profilePath + 'fixture-update-imagecoor-by-gpstrackpoints.sql');
            sqlFiles.push(profilePath + 'fixture-update-videocoor-by-gpstrackpoints.sql');
        } else if (dbCommandOptions.action.startsWith('fixture')) {
            sqlFiles.push(profilePath + dbCommandOptions.action + '.sql');
        } else {
            return Promise.reject('ERROR - unknown action: "' + dbCommandOptions.action + '"');
        }

        if (!fs.existsSync(profilePath) || !fs.lstatSync(profilePath).isDirectory()) {
            return Promise.reject('ERROR - profilePath not exists: "' + profilePath + '"');
        }

        return Promise.resolve(dbCommandOptions);
    }

    protected configureDbCommandOptions(argv: {}): Promise<DbAdminCommandOptions> {
        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const basePath = argv['basePath'] || 'installer/db';
        if (!fs.existsSync(basePath) || !fs.lstatSync(basePath).isDirectory()) {
            return Promise.reject('ERROR - basePath not exists: "' + basePath + '"');
        }

        const action  = argv['action'];
        const backendConfig: BackendConfigType = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));
        const knexConfig = backendConfig.TourDocSqlMytbDbAdapter;
        const options: DbAdminCommandOptions = {
            action: action,
            profile: knexConfig.client === 'sqlite3' ? 'sqlite' : 'mysql',
            basePath: basePath,
            knexConfig: knexConfig
        }

        return Promise.resolve(options);
    }
}
