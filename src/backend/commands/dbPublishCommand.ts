import * as fs from 'fs';
import {DatabaseService} from '../modules/database.service';
import * as knex from 'knex';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {CommonAdminCommand, SimpleConfigFilePathValidationRule} from './common-admin.command';
import {NameValidationRule, ValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export class DbPublishCommand extends CommonAdminCommand {
    protected static TARGETS = ['mytbexportbetadb', 'mytbexportproddb', 'mytbexportbetadb_update', 'mytbexportproddb_update'];
    protected static PROFILES = ['sqlite', 'mysql'];

    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            publishConfigFile: new SimpleConfigFilePathValidationRule(true),
            profile: new NameValidationRule(true),
            target: new NameValidationRule(true)
        };
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        const profile = argv['profile'];
        if (profile === undefined || (!DbPublishCommand.PROFILES.includes(profile))) {
            return Promise.reject('ERROR - parameters required profile: "--profile ' + DbPublishCommand.PROFILES + '"');
        }

        const target = argv['target'];
        if (target === undefined || (!DbPublishCommand.TARGETS.includes(target))) {
            return Promise.reject('ERROR - parameters required target: "--target ' + DbPublishCommand.TARGETS + '"');
        }

        const publishConfigFile = argv['publishConfigFile'];
        if (publishConfigFile === undefined || !fs.existsSync(publishConfigFile) || !fs.lstatSync(publishConfigFile).isFile()) {
            return Promise.reject('ERROR - parameters required publishConfigFile: "--publishConfigFile"');
        }

        const publishConfig = JSON.parse(fs.readFileSync(publishConfigFile, { encoding: 'utf8' }));
        const targetProfile = this.configureTargetProfile(target, profile);
        if (publishConfig === undefined || !publishConfig['environments'] || !publishConfig['environments'][targetProfile]) {
            return Promise.reject('ERROR - invalid publishConfigFile: "' + publishConfigFile + '"' +
                ' or targetProfile: "' + targetProfile + '"');
        }

        const basePath = publishConfig['basePath'];
        if (basePath === undefined) {
            return Promise.reject('ERROR - invalid publishConfigFile required basePath: "--basePath"');
        }

        const functionFiles: string[] = [];
        const sqlFiles: string[] = [];
        return this.configureProcessingFiles(basePath, target, profile, functionFiles, sqlFiles).then(() => {
            const knexConfig = publishConfig['environments'][targetProfile];
            const knexOpts = {
                client: knexConfig['client'],
                connection: knexConfig['connection']
            };

            let sqls = [];
            for (const file of functionFiles) {
                sqls = sqls.concat(DatabaseService.extractSqlFileOnScriptPath(file, '$$'));
            }
            for (const file of sqlFiles) {
                sqls = sqls.concat(DatabaseService.extractSqlFileOnScriptPath(file, ';'));
            }

            const databaseService = new DatabaseService(knex(knexOpts), new SqlQueryBuilder());

            console.log('dbPublish - executing sqls', profile, target, basePath, sqls.length, sqlFiles);
            return databaseService.executeSqls(sqls);
        })
    }

    protected configureProcessingFiles(basePath: string, target: string, profile: string, functionFiles: string[], sqlFiles: string[])
        : Promise<any> {
        const profilePath = basePath + '/' + profile + '/mytbexportdb/';
        switch (target) {
            case 'mytbexportbetadb':
                functionFiles.push(profilePath + 'import_01_create-functions.sql');
                sqlFiles.push(profilePath + 'import_01_create-model.sql');
                sqlFiles.push(profilePath + 'import_02_configure-mytbdb-to-mytbexportbetadb.sql');
                sqlFiles.push(profilePath + 'import_02_import-data-from-mytbdb-to-mytbexportbetadb.sql');
                sqlFiles.push(profilePath + 'import_02_manage-private-data.sql');
                sqlFiles.push(profilePath + 'import_02_manage-common-data.sql');
                sqlFiles.push(profilePath + 'import_02_manage-private-data.sql');
                sqlFiles.push(profilePath + 'import_02_merge-person-object-fields.sql');
                sqlFiles.push(profilePath + 'import_02_update-desc.sql');
                break;
            case 'mytbexportproddb':
                functionFiles.push(profilePath + 'import_01_create-functions.sql');
                sqlFiles.push(profilePath + 'import_01_create-model.sql');
                sqlFiles.push(profilePath + 'import_03_import-data-from-mytbexportbetadb-to-mytbexportproddb.sql');
                sqlFiles.push(profilePath + 'import_03_clean-blocked-data.sql');
                sqlFiles.push(profilePath + 'import_03_clean-private-data.sql');
                break;
            case 'mytbexportbetadb_update':
            case 'mytbexportproddb_update':
                sqlFiles.push(profilePath + 'import_02_manage-common-data.sql');
                sqlFiles.push(profilePath + 'import_02_manage-private-data.sql');
                sqlFiles.push(profilePath + 'import_02_merge-person-object-fields.sql');
                sqlFiles.push(profilePath + 'import_02_update-desc.sql');
                break;
            default:
                return Promise.reject('ERROR - unknown target: "' + target + '"');
        }

        if (!fs.existsSync(profilePath) || !fs.lstatSync(profilePath).isDirectory()) {
            return Promise.reject('ERROR - profilePath not exists: "' + profilePath + '"');
        }

        return Promise.resolve();
    }

    protected configureTargetProfile(target: string, profile: string): string {
        switch (target) {
            case 'mytbexportbetadb':
            case 'mytbexportbetadb_update':
                return 'mytbexportbetadb_' + profile;
            case 'mytbexportproddb':
            case 'mytbexportproddb_update':
                return 'mytbexportproddb_' + profile;
            default:
                return undefined;
        }
    }
}
