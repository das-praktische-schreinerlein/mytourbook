import * as fs from 'fs';
import {AbstractCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract.command';
import {DatabaseService} from '../modules/database.service';
import * as knex from 'knex';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';

export class DbPublishCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const profile = argv['profile'];
        if (profile === undefined || (profile !== 'sqlite' && profile !== 'mysql')) {
            console.error('ERROR - parameters required profile: "--profile sqlite|mysql"');
            process.exit(-1);
        }

        const target = argv['target'];
        if (target === undefined || (target !== 'mytbexportbetadb' && target !== 'mytbexportproddb')) {
            console.error('ERROR - parameters required target: "--target mytbexportbetadb|mytbexportproddb"');
            process.exit(-1);
        }

        const publishConfigFile = argv['publishConfigFile'];
        if (publishConfigFile === undefined || !fs.existsSync(publishConfigFile) || !fs.lstatSync(publishConfigFile).isFile()) {
            console.error('ERROR - parameters required publishConfigFile: "--publishConfigFile"');
            process.exit(-1);
        }

        const publishConfig = JSON.parse(fs.readFileSync(publishConfigFile, { encoding: 'utf8' }));
        const targetProfile = target + '_' + profile;
        if (publishConfig === undefined || !publishConfig['environments'] || !publishConfig['environments'][targetProfile]) {
            console.error('ERROR - invalid publishConfigFile or targetProfile', publishConfigFile, targetProfile);
            process.exit(-1);
        }

        const basePath = publishConfig['basePath'];
        if (basePath === undefined) {
            console.error('ERROR - invalid publishConfigFile required basePath: "--basePath"');
            process.exit(-1);
        }

        const profilePath = basePath + '/' + profile + '/mytbexportdb/';
        if (!fs.existsSync(profilePath) || !fs.lstatSync(profilePath).isDirectory()) {
            console.error('ERROR - profilePath not exists', profilePath);
            process.exit(-1);
        }

        const knexConfig = publishConfig['environments'][targetProfile];
        const knexOpts = {
            client: knexConfig['client'],
            connection: knexConfig['connection']
        };

        const functionFiles = [];
        const sqlFiles = [];
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
                sqlFiles.push(profilePath + 'import_03_clean-private-data.sql');
                break;
            default:
                console.error('ERROR - parameters required target: "--target mytbexportbetadb|mytbexportproddb"');
                process.exit(-1);
        }

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
    }
}
