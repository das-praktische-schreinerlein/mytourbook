import {SimpleConfigFilePathValidationRule} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {ValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {PasswordUtils} from '@dps/mycms-commons/dist/commons/utils/password.utils';
import {ConfigInitializerUtil} from '@dps/mycms-commons/dist/tools/config-initializer.util';
import * as Promise_serial from 'promise-serial';
import {ConfigInitializerCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/config-initializer.command';

export class ExtendedConfigInitializerCommand extends ConfigInitializerCommand {
    protected solrconfigbasepath: string;
    protected installerdbbasepath: string;

    public static replaceTourDocSolrPasswordInBackendConfig(file: string, solrPassword: string, required: boolean): Promise<boolean> {
        return ConfigInitializerUtil.replaceSolrPasswordInBackendConfig(file, 'solrCoreTourDocReadPassword', solrPassword, required);
    }

    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            ...super.createValidationRules(),
            'solrconfigbasepath': new SimpleConfigFilePathValidationRule(false),
            'installerdbbasepath': new SimpleConfigFilePathValidationRule(false)
        };
    }

    protected definePossibleActions(): string[] {
        return super.definePossibleActions().concat([
            'resetSolrPasswords', 'resetMysqlDevPasswords', 'resetMysqlExportBetaPasswords', 'resetMysqlExportProdPasswords',
            'setSolrPasswords', 'setMysqlDevPasswords', 'setMysqlExportBetaPasswords', 'setMysqlExportProdPasswords']);
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        this.configbasepath = argv['configbasepath'] || 'config';
        this.solrconfigbasepath = argv['solrconfigbasepath'] || 'installer/solr';
        this.installerdbbasepath = argv['installerdbbasepath'] || 'installer/db';
        const tokenkey = argv['tokenkey'];
        const newpassword = argv['newpassword'];

        const action = argv['action'];
        switch (action) {
            case 'resetServicePasswords':
                return this.setSolrPasswords(PasswordUtils.createNewDefaultPassword(30)).then(() => {
                    return this.setMysqlDevPasswords(PasswordUtils.createNewDefaultPassword(30));
                }).then(() => {
                    return this.setMysqlExportBetaPasswords(PasswordUtils.createNewDefaultPassword(30));
                }).then(() => {
                    return this.setMysqlExportProdPasswords(PasswordUtils.createNewDefaultPassword(30));
                });
            case 'resetSolrPasswords':
                return this.setSolrPasswords(PasswordUtils.createNewDefaultPassword(30));
            case 'resetMysqlDevPasswords':
                return this.setMysqlDevPasswords(PasswordUtils.createNewDefaultPassword(30));
            case 'resetMysqlExportBetaPasswords':
                return this.setMysqlExportBetaPasswords(PasswordUtils.createNewDefaultPassword(30));
            case 'resetMysqlExportProdPasswords':
                return this.setMysqlExportProdPasswords(PasswordUtils.createNewDefaultPassword(30));
            case 'resetTokenCookie':
                return this.setTokenCookie(tokenkey, PasswordUtils.createNewDefaultPassword(30));
            case 'setSolrPasswords':
                return this.setSolrPasswords(newpassword);
            case 'setMysqlDevPasswords':
                return this.setMysqlDevPasswords(newpassword);
            case 'setMysqlExportBetaPasswords':
                return this.setMysqlExportBetaPasswords(newpassword);
            case 'setMysqlExportProdPasswords':
                return this.setMysqlExportProdPasswords(newpassword);
            case 'setTokenCookie':
                return this.setTokenCookie(tokenkey, newpassword);
            default:
                return super.processCommandArgs(argv);
        }
    }

    protected setSolrPasswords(newpassword: string): Promise<any> {
        if (newpassword === undefined || newpassword.length < 8) {
            return Promise.reject('valid newpassword required');
        }

        return PasswordUtils.createSolrPasswordHash(newpassword).then(solrPasswordHash => {
            const me = this;
            const promises = [];
            promises.push(function () {
                return ExtendedConfigInitializerCommand.replaceTourDocSolrPasswordInBackendConfig(
                    me.configbasepath + '/backend.dev.json', newpassword, false);
            });
            promises.push(function () {
                return ExtendedConfigInitializerCommand.replaceTourDocSolrPasswordInBackendConfig(
                    me.configbasepath + '/backend.beta.json', newpassword, false);
            });
            promises.push(function () {
                return ExtendedConfigInitializerCommand.replaceTourDocSolrPasswordInBackendConfig(
                    me.configbasepath + '/backend.prod.json', newpassword, false);
            });
            promises.push(function () {
                return ConfigInitializerUtil.replaceSolrPasswordInDbPublishConfig(
                    me.configbasepath + '/dbpublish.json', newpassword, false);
            });
            promises.push(function () {
                return ConfigInitializerUtil.replaceSolrDefaultPasswordHashInSolrConfig(
                    me.solrconfigbasepath + '/security.json', solrPasswordHash, false);
            });
            promises.push(function () {
                return ConfigInitializerUtil.replaceSolrUserPasswordInSolrConfig(
                    me.solrconfigbasepath + '/security.json', 'mytbread', solrPasswordHash, false);
            });
            promises.push(function () {
                return ConfigInitializerUtil.replaceSolrUserPasswordInSolrConfig(
                    me.solrconfigbasepath + '/security.json', 'mycmsread', solrPasswordHash, false);
            });

            return Promise_serial(promises, {parallelize: 1}).then(() => {
                return Promise.resolve('DONE - setSolrPasswords');
            }).catch(reason => {
                return Promise.reject(reason);
            });
        });
    }

    protected setMysqlDevPasswords(newpassword: string): Promise<any> {
        if (newpassword === undefined || newpassword.length < 8) {
            return Promise.reject('valid newpassword required');
        }

        const me = this;
        const promises = [];
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInBackendConfig(
                me.configbasepath + '/backend.dev.json',
                'TourDocSqlMytbDbAdapter',
                newpassword, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInCreateUserSql(
                me.installerdbbasepath + '/mysql/mytbdb/init_02_create-user.sql',
                '.*?',
                newpassword, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInDbMigrateConfig(
                me.configbasepath + '/db-migrate-database.json',
                'mytbdb_mysql',
                newpassword, false);
        });

        return Promise_serial(promises, {parallelize: 1}).then(() => {
            return Promise.resolve('DONE - setMysqlDevPasswords');
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

    protected setMysqlExportBetaPasswords(newpassword: string): Promise<any> {
        if (newpassword === undefined || newpassword.length < 8) {
            return Promise.reject('valid newpassword required');
        }

        const me = this;
        const promises = [];
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInBackendConfig(
                me.configbasepath + '/backend.dev.json',
                'TourDocSqlMytbExportDbAdapter',
                newpassword, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInBackendConfig(
                me.configbasepath + '/backend.beta.json',
                'TourDocSqlMytbExportDbAdapter',
                newpassword, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInBackendConfig(
                me.configbasepath + '/dbpublish.json',
                'mytbexportbetadb_mysql',
                newpassword, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInCreateUserSql(
                me.installerdbbasepath + '/mysql/mytbexportdb/init_02_create-user.sql',
                'testmytbexportbetadb',
                newpassword, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInSolrCoreConfig(
                me.solrconfigbasepath + '/coremytbbeta/core.properties',
                newpassword, false);
        });

        return Promise_serial(promises, {parallelize: 1}).then(() => {
            return Promise.resolve('DONE - setMysqlExportBetaPasswords');
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

    protected setMysqlExportProdPasswords(newpassword: string): Promise<any> {
        if (newpassword === undefined || newpassword.length < 8) {
            return Promise.reject('valid newpassword required');
        }

        const me = this;
        const promises = [];
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInBackendConfig(
                me.configbasepath + '/backend.prod.json',
                'TourDocSqlMytbExportDbAdapter',
                newpassword, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInBackendConfig(
                me.configbasepath + '/dbpublish.json',
                'mytbexportproddb_mysql',
                newpassword, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInCreateUserSql(
                me.installerdbbasepath + '/mysql/mytbexportdb/init_02_create-user.sql',
                'testmytbexportproddb',
                newpassword, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInSolrCoreConfig(
                me.solrconfigbasepath + '/coremytbprod/core.properties',
                newpassword, false);
        });

        return Promise_serial(promises, {parallelize: 1}).then(() => {
            return Promise.resolve('DONE - setMysqlExportProdPasswords');
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }
}
