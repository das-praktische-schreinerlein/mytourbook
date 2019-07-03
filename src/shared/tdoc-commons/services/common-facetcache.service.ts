import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import * as Promise_serial from 'promise-serial';
import * as fs from 'fs';
import {utils} from 'js-data';

export interface CommonFacetCacheConfiguration {
    longKey: string;
    shortKey: string;
    name: string;
    facetSql: string;
    withLabel: boolean;
    valueType: 'string' | 'number' | 'date';
    triggerTables: string[];
}
export interface CommonFacetCacheServiceConfiguration {
    datastore: {
        createTablesScriptPath: string;
    };
    startUp: {
        checkDatastore: boolean;
        prepareDatastore: boolean;
        clearDatastore: boolean;
        prepareTrigger: boolean;
        prepareFacetViews: boolean;
    };
    facets: CommonFacetCacheConfiguration[];
}

export class CommonFacetCacheService {
    protected knex: any;
    protected sqlQueryBuilder: SqlQueryBuilder;
    protected configuration: CommonFacetCacheServiceConfiguration;

    public constructor(configuration: CommonFacetCacheServiceConfiguration, knex: any) {
        this.sqlQueryBuilder = new SqlQueryBuilder();
        this.configuration = configuration;
        this.knex = knex;
    }

    public checkDatastore(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return resolve();
        });
    }

    public createAllDatabaseRequirements(): Promise<boolean> {
        return this.createFacetCacheTables().then(value => {
            return this.createFacetCacheTriggerFunctions();
        }).then(value => {
            return this.createFacetCacheUpdateCheckFunctions();
        });
    }

    public dropAllDatabaseRequirements(): Promise<boolean> {
        return this.dropFacetCacheUpdateCheckFunctions().then(value => {
            return this.dropFacetCacheTriggerFunctions();
        }).then(value => {
            return this.dropFacetCacheTables();
        });
    }

    public createAllFacets(): Promise<boolean> {
        return this.createFacetsViews().then(value => {
            return this.createFacetsCacheConfigs();
        }).then(value => {
            return this.createFacetsTriggers();
        }).then(value => {
            return this.createFacetsUpdateSchedules();
        });
    }

    public dropAllFacets(): Promise<boolean> {
        return this.dropFacetsUpdateSchedules().then(value => {
            return this.dropFacetsTriggers();
        }).then(value => {
            return this.removeFacetsCacheConfigs();
        }).then(value => {
            return this.dropFacetsViews();
        });
    }

    public dropFacetCacheTables(): Promise<boolean> {
        return this.executeSqlFileOnScriptPath('drop-facetcache-tables.sql', ';');
    }

    public createFacetCacheTables(): Promise<boolean> {
        return this.executeSqlFileOnScriptPath('create-facetcache-tables.sql', ';');
    }

    public createFacetCacheTriggerFunctions(): Promise<boolean> {
        return this.executeSqlFileOnScriptPath('create-facetcache-trigger-functions.sql', '$$');
    }

    public dropFacetCacheTriggerFunctions(): Promise<boolean> {
        return this.executeSqlFileOnScriptPath('drop-facetcache-trigger-functions.sql', '$$');
    }

    public createFacetCacheUpdateCheckFunctions(): Promise<boolean> {
        return this.executeSqlFileOnScriptPath('create-facetcache-updatecheck-functions.sql', '$$');
    }

    public dropFacetCacheUpdateCheckFunctions(): Promise<boolean> {
        return this.executeSqlFileOnScriptPath('drop-facetcache-updatecheck-functions.sql', '$$');
    }

    public dropFacetsTriggers(): Promise<boolean> {
        return this.executeSqls(this.generateDropFacetTriggerSql());
    }

    public createFacetsTriggers(): Promise<boolean> {
        return this.executeSqls(this.generateCreateFacetTriggerSql());
    }

    public removeFacetsCacheConfigs(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises = [];
            const me = this;
            for (const configuration of this.configuration.facets) {
                promises.push(function () {
                    return me.removeFacetCacheConfig(configuration);
                });
            }

            return Promise_serial(promises, {parallelize: 1}).then(arrayOfResults => {
                return resolve(true);
            }).catch(reason => {
                return reject(reason);
            });
        });
    }

    public createFacetsCacheConfigs(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises = [];
            const me = this;
            for (const configuration of this.configuration.facets) {
                promises.push(function () {
                    return me.createFacetCacheConfig(configuration);
                });
            }

            return Promise_serial(promises, {parallelize: 1}).then(arrayOfResults => {
                return resolve(true);
            }).catch(reason => {
                return reject(reason);
            });
        });
    }

    public createFacetsViews(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises = [];
            const me = this;
            for (const configuration of this.configuration.facets) {
                promises.push(function () {
                    return me.createFacetView(configuration);
                });
            }

            return Promise_serial(promises, {parallelize: 1}).then(arrayOfResults => {
                return resolve(true);
            }).catch(reason => {
                return reject(reason);
            });
        });
    }

    public dropFacetsViews(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises = [];
            const me = this;
            for (const configuration of this.configuration.facets) {
                promises.push(function () {
                    return me.dropFacetView(configuration);
                });
            }

            return Promise_serial(promises, {parallelize: 1}).then(arrayOfResults => {
                return resolve(true);
            }).catch(reason => {
                return reject(reason);
            });
        });
    }

    public createFacetsUpdateSchedules(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises = [];
            const me = this;
            for (const configuration of this.configuration.facets) {
                promises.push(function () {
                    return me.createFacetUpdateSchedule(configuration);
                });
            }

            return Promise_serial(promises, {parallelize: 1}).then(arrayOfResults => {
                return resolve(true);
            }).catch(reason => {
                return reject(reason);
            });
        });
    }

    public dropFacetsUpdateSchedules(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises = [];
            const me = this;
            for (const configuration of this.configuration.facets) {
                promises.push(function () {
                    return me.dropFacetUpdateSchedule(configuration);
                });
            }

            return Promise_serial(promises, {parallelize: 1}).then(arrayOfResults => {
                return resolve(true);
            }).catch(reason => {
                return reject(reason);
            });
        });
    }

    public generateCreateFacetTriggerSql(): string[] {
        const tables = {};
        for (const configuration of this.configuration.facets) {
            const longKey = configuration.longKey;
            for (const table of configuration.triggerTables) {
                if (!tables[table]) {
                    tables[table] = [];
                }
                tables[table].push(longKey);
            }
        }

        let sqls: string[] = [];
        for (const table in tables) {
            const triggerSqls = [];
            for (const facetKey of tables[table]) {
                triggerSqls.push(this.generateFacetTriggerCallSql(facetKey));
            }

            sqls = sqls.concat(this.generateCreateTableTriggerSql(table, triggerSqls.join('\n')));
        }

        return sqls;
    }

    public generateDropFacetTriggerSql(): string[] {
        const tables = {};
        for (const configuration of this.configuration.facets) {
            const longKey = configuration.longKey;
            for (const table of configuration.triggerTables) {
                if (!tables[table]) {
                    tables[table] = [];
                }
                tables[table].push(longKey);
            }
        }

        let sqls: string[] = [];
        for (const table in tables) {
            sqls = sqls.concat(this.generateDropTableTriggerSql(table));
        }

        return sqls;
    }

    public generateCreateTableTriggerSql(table: string, triggerSql: string): string[] {
        const sqls: string[] = [];
        sqls.push('CREATE TRIGGER trigger_aft_upd_' + table + ' AFTER UPDATE ON ' + table + ' FOR EACH ROW\n' +
            'BEGIN\n' + triggerSql + 'END');
        sqls.push('CREATE TRIGGER trigger_aft_ins_' + table + ' AFTER INSERT ON ' + table + ' FOR EACH ROW\n' +
            'BEGIN\n' + triggerSql + 'END');
        sqls.push('CREATE TRIGGER trigger_aft_del_' + table + ' AFTER DELETE ON '+ table + ' FOR EACH ROW\n' +
            'BEGIN\n' + triggerSql + 'END');

        return sqls;
    }

    public generateDropTableTriggerSql(table: string): string[] {
        const sqls: string[] = [];
        sqls.push('DROP TRIGGER IF EXISTS trigger_aft_upd_' + table);
        sqls.push('DROP TRIGGER IF EXISTS trigger_aft_ins_' + table);
        sqls.push('DROP TRIGGER IF EXISTS trigger_aft_del_' + table);

        return sqls;
    }

    public generateCreateUpdateScheduleSql(facetKey: string, updateSql: string): string[] {
        const sqls: string[] = [];
        sqls.push('CREATE EVENT event_update_' + facetKey +
            ' ON SCHEDULE EVERY 1 MINUTE' +
            ' ON COMPLETION NOT PRESERVE ENABLE' +
            ' DO ' +
            '   BEGIN ' +
            '     CALL CheckFacetCacheUpdateTriggerTableAndExceuteSql("' + facetKey + '", \'' + updateSql + '\');' +
            '   END'
        );

        return sqls;
    }

    public generateDropUpdateScheduleSql(facetKey: string): string[] {
        const sqls: string[] = [];
        sqls.push('DROP EVENT IF EXISTS event_update_' + facetKey);

        return sqls;
    }

    public generateFacetTriggerCallSql(facetKey: string): string[] {
        const sqls: string[] = [];
        sqls.push('CALL InsertFacetCacheUpdateTriggerTableEntry(\'' + facetKey + '\');');

        return sqls;
    }

    public generateCreateFacetCacheConfigsSql(configurations: CommonFacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.generateCreateFacetCacheConfigSql(configuration));
        }

        return sqls;
    }

    public generateCreateFacetCacheConfigSql(configuration: CommonFacetCacheConfiguration): string[] {
        return ['INSERT INTO facetcacheconfig (fcc_usecache, fcc_key) VALUES (1, "' + configuration.longKey + '")',
        'INSERT INTO facetcacheupdatetrigger (ft_key)' +
        '        SELECT "' + configuration.longKey + '" from dual' +
        '            WHERE NOT EXISTS (SELECT 1 FROM facetcacheupdatetrigger WHERE ft_key="' + configuration.longKey + '");'];
    }

    public generateRemoveFacetCacheConfigsSql(configurations: CommonFacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.generateRemoveFacetCacheConfigSql(configuration));
        }

        return sqls;
    }

    public generateRemoveFacetCacheConfigSql(configuration: CommonFacetCacheConfiguration): string[] {
        return ['DELETE FROM facetcacheconfig WHERE fcc_key IN ("' + configuration.longKey + '")'];
    }

    public generateUpdateFacetsCacheSql(configurations: CommonFacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.generateUpdateFacetCacheSql(configuration));
        }

        return sqls;
    }

    public generateUpdateFacetCacheSql(configuration: CommonFacetCacheConfiguration): string[] {
        const sqls: string[] = [];
        const longKey = configuration.longKey;
        sqls.push('INSERT INTO facetcache (fc_key, fc_recid, fc_order, fc_count, fc_value_' + configuration.valueType + ', fc_label)' +
            ' SELECT "' + longKey + '" AS fc_key, null AS fc_recid, @CURROW AS fc_order, count, value ' +
            (configuration.withLabel === true ? ', label ' : ' ') + ' FROM fc_live_' + longKey);

        return sqls;
    }

    public generateDeleteFacetCacheSql(configuration: CommonFacetCacheConfiguration): string[] {
        const sqls: string[] = [];
        const longKey = configuration.longKey;
        sqls.push('DELETE from facetcache where fc_key in ("' + longKey + '")');

        return sqls;
    }

    public generateCreateFacetViewsSql(configurations: CommonFacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.generateCreateFacetViewSql(configuration));
        }

        return sqls;
    }

    public generateCreateFacetViewSql(configuration: CommonFacetCacheConfiguration): string[] {
        const longKey = configuration.longKey;
        const facetSql = configuration.facetSql;
        const sqls: string[] = [];
        sqls.push('CREATE VIEW fc_live_' + longKey + ' AS ' + facetSql);
        sqls.push('CREATE VIEW fc_cached_' + longKey + ' AS' +
            ' SELECT fc_count AS count, fc_label AS label, fc_value_' + configuration.valueType + ' AS value' +
            ' FROM facetcache WHERE fc_key in ("' + longKey + '") ORDER BY fc_order');
        sqls.push('CREATE VIEW fc_real_' + longKey + ' AS ' +
            '   (SELECT * FROM fc_live_' + longKey +
            '       WHERE NOT EXISTS (SELECT 1 FROM facetcacheconfig WHERE fcc_key IN ("' + longKey + '") AND fcc_usecache <> 0))' +
            ' UNION ' +
            '   (SELECT * FROM fc_cached_' + longKey +
            '       WHERE EXISTS (SELECT 1 FROM facetcacheconfig WHERE fcc_key IN ("' + longKey + '") AND fcc_usecache <> 0))'
        );

        return sqls;
    }

    public generateDropFacetViewsSql(configurations: CommonFacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.generateDropFacetViewSql(configuration));
        }

        return sqls;
    }

    public generateDropFacetViewSql(configuration: CommonFacetCacheConfiguration): string[] {
        const longKey = configuration.longKey;
        const facetSql = configuration.facetSql;
        const sqls: string[] = [];
        sqls.push('DROP VIEW IF EXISTS fc_live_' + longKey);
        sqls.push('DROP VIEW IF EXISTS fc_cached_' + longKey);
        sqls.push('DROP VIEW IF EXISTS fc_real_' + longKey);

        return sqls;
    }

    protected createFacetView(configuration: CommonFacetCacheConfiguration): Promise<boolean> {
        return this.executeSqls(this.generateCreateFacetViewSql(configuration));
    }

    protected dropFacetView(configuration: CommonFacetCacheConfiguration): Promise<boolean> {
        return this.executeSqls(this.generateDropFacetViewSql(configuration));
    }

    protected createFacetCacheConfig(configuration: CommonFacetCacheConfiguration): Promise<boolean> {
        return this.executeSqls(this.generateCreateFacetCacheConfigSql(configuration));
    }

    protected removeFacetCacheConfig(configuration: CommonFacetCacheConfiguration): Promise<boolean> {
        return this.executeSqls(this.generateRemoveFacetCacheConfigSql(configuration));
    }

    protected createFacetUpdateSchedule(configuration: CommonFacetCacheConfiguration): Promise<boolean> {
        return this.executeSqls(
            this.generateCreateUpdateScheduleSql(configuration.longKey,
                this.generateUpdateFacetCacheSql(configuration).join(';')));
    }

    protected dropFacetUpdateSchedule(configuration: CommonFacetCacheConfiguration): Promise<boolean> {
        return this.executeSqls(this.generateDropUpdateScheduleSql(configuration.longKey));
    }

    protected executeSqlFileOnScriptPath(sqlFile: string, splitter: string): Promise<boolean> {
        return this.executeSqls(
            fs.readFileSync(this.configuration.datastore.createTablesScriptPath + '/' + sqlFile, {encoding: 'utf8'}).split(splitter));
    }

    protected executeSqls(sqls: string[]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises = [];
            const me = this;
            const sqlBuilder = this.knex;
            for (const sql of sqls) {
                promises.push(function () {
                    console.error("sql:", sql);
                    if (sql === undefined || sql.trim() === '') {
                        return utils.resolve(true);
                    }
/**
                    return new Promise<boolean>(resolve1 => {
                        return resolve1(true);
                    });
**/
                    return sqlBuilder.raw(me.transformToSqlDialect(sql));
                });
            }

            return Promise_serial(promises, {parallelize: 1}).then(arrayOfResults => {
                return resolve(true);
            }).catch(reason => {
                return reject(reason);
            });
        });
    }

    protected transformToSqlDialect(sql: string): string {
        const client = this.knex.client['config']['client'];
        if (client === 'sqlite3') {
            sql = sql.replace(/ FROM dual /g, ' ');
        }
        return this.sqlQueryBuilder.transformToSqlDialect(sql, client);
    }
}
