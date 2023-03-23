import * as fs from 'fs';
import {
    NameValidationRule,
    SimpleConfigFilePathValidationRule,
    ValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {AbstractDbCommand, DbCommandOptions} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract-db.command';

export interface DbPublishCommandOptions extends DbCommandOptions {
    profile: string,
    target: string
}

export class DbPublishCommand extends AbstractDbCommand<DbPublishCommandOptions> {
    protected static TARGETS = ['mytbexportbetadb', 'mytbexportproddb', 'mytbexportbetadb_update', 'mytbexportproddb_update'];
    protected static PROFILES = ['sqlite', 'mysql'];

    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            publishConfigFile: new SimpleConfigFilePathValidationRule(true),
            profile: new NameValidationRule(true),
            target: new NameValidationRule(true)
        };
    }

    protected definePossibleActions(): string[] {
        return ['publishDB'];
    }

    protected configureProcessingFiles(dbCommandOptions: DbPublishCommandOptions , functionFiles: string[], sqlFiles: string[])
        : Promise<DbPublishCommandOptions> {
        const profilePath = dbCommandOptions.basePath + '/' + dbCommandOptions.profile + '/mytbexportdb/';
        switch (dbCommandOptions.target) {
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
                sqlFiles.push(profilePath + 'import_02_close_mytbdb-to-mytbexportbetadb.sql');
                break;
            case 'mytbexportproddb':
                functionFiles.push(profilePath + 'import_01_create-functions.sql');
                sqlFiles.push(profilePath + 'import_01_create-model.sql');
                sqlFiles.push(profilePath + 'import_02_configure-mytbdb-to-mytbexportbetadb.sql');
                sqlFiles.push(profilePath + 'import_03_import-data-from-mytbexportbetadb-to-mytbexportproddb.sql');
                sqlFiles.push(profilePath + 'import_03_clean-blocked-data.sql');
                sqlFiles.push(profilePath + 'import_03_clean-private-data.sql');
                sqlFiles.push(profilePath + 'import_02_manage-common-data.sql');
                sqlFiles.push(profilePath + 'import_02_manage-private-data.sql');
                sqlFiles.push(profilePath + 'import_02_merge-person-object-fields.sql');
                sqlFiles.push(profilePath + 'import_02_update-desc.sql');
                sqlFiles.push(profilePath + 'import_02_close_mytbdb-to-mytbexportbetadb.sql');
                break;
            case 'mytbexportbetadb_update':
            case 'mytbexportproddb_update':
                sqlFiles.push(profilePath + 'import_02_configure-mytbdb-to-mytbexportbetadb.sql');
                sqlFiles.push(profilePath + 'import_02_manage-common-data.sql');
                sqlFiles.push(profilePath + 'import_02_manage-private-data.sql');
                sqlFiles.push(profilePath + 'import_02_merge-person-object-fields.sql');
                sqlFiles.push(profilePath + 'import_02_update-desc.sql');
                sqlFiles.push(profilePath + 'import_02_close_mytbdb-to-mytbexportbetadb.sql');
                break;
            default:
                return Promise.reject('ERROR - unknown target: "' + dbCommandOptions.target + '"');
        }

        if (!fs.existsSync(profilePath) || !fs.lstatSync(profilePath).isDirectory()) {
            return Promise.reject('ERROR - profilePath not exists: "' + profilePath + '"');
        }

        return Promise.resolve(dbCommandOptions);
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

    protected configureDbCommandOptions(argv: {}): Promise<DbPublishCommandOptions> {
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

        const knexConfig = publishConfig['environments'][targetProfile];
        const options: DbPublishCommandOptions = {
            basePath: basePath,
            profile: profile,
            target: target,
            knexConfig: knexConfig
        }

        return Promise.resolve(options);
    }
}
