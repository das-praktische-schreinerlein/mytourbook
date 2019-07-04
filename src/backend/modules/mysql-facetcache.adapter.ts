import {CommonFacetCacheConfiguration} from './common-facetcache.utils';
import {CommonFacetCacheAdapter} from './common-facetcache.adapter';
import * as fs from 'fs';

export class CommonMysqlFacetCacheAdapter implements CommonFacetCacheAdapter {
    protected sqlScriptPath: string;

    constructor(sqlScriptPath: string) {
        this.sqlScriptPath = sqlScriptPath;
    }

    public generateCreateTableTriggerSql(table: string, triggerSql: string): string[] {
        const sqls: string[] = [];
        sqls.push('CREATE TRIGGER trigger_aft_upd_' + table + ' AFTER UPDATE ON ' + table + ' FOR EACH ROW\n' +
            'BEGIN\n' + triggerSql + 'END');
        sqls.push('CREATE TRIGGER trigger_aft_ins_' + table + ' AFTER INSERT ON ' + table + ' FOR EACH ROW\n' +
            'BEGIN\n' + triggerSql + 'END');
        sqls.push('CREATE TRIGGER trigger_aft_del_' + table + ' AFTER DELETE ON ' + table + ' FOR EACH ROW\n' +
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
        return ['IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = "facetcacheconfig") ' +
        ' THEN ' +
        '   DELETE IGNORE FROM facetcacheconfig WHERE fcc_key IN ("' + configuration.longKey + '");' +
        ' END IF'];
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
            (configuration.withLabel === true ? ', label ' : ' ') +
            (configuration.withId === true ? ', id ' : ' ') +
            ' FROM fc_live_' + longKey);

        return sqls;
    }

    public generateDeleteFacetCacheSql(configuration: CommonFacetCacheConfiguration): string[] {
        const sqls: string[] = [];
        const longKey = configuration.longKey;
        sqls.push('DELETE IGNORE from facetcache where fc_key in ("' + longKey + '")');

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
            ' SELECT fc_count AS count, ' +
            (configuration.withLabel ? 'fc_label AS label, ' : '') +
            (configuration.withId ? 'fc_recid AS id, ' : '') +
            '    fc_value_' + configuration.valueType + ' AS value' +
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
        const sqls: string[] = [];
        sqls.push('DROP VIEW IF EXISTS fc_live_' + longKey);
        sqls.push('DROP VIEW IF EXISTS fc_cached_' + longKey);
        sqls.push('DROP VIEW IF EXISTS fc_real_' + longKey);

        return sqls;
    }

    generateCreateFacetCacheTables(): string[] {
        return this.extractSqlFileOnScriptPath('create-facetcache-tables.sql', ';');
    }

    generateCreateFacetCacheTriggerFunctions(): string[] {
        return this.extractSqlFileOnScriptPath('create-facetcache-trigger-functions.sql', '$$');
    }

    generateCreateFacetCacheUpdateCheckFunctions(): string[] {
        return this.extractSqlFileOnScriptPath('create-facetcache-updatecheck-functions.sql', '$$');
    }

    generateDropFacetCacheTables(): string[] {
        return this.extractSqlFileOnScriptPath('drop-facetcache-tables.sql', ';');
    }

    generateDropFacetCacheTriggerFunctions(): string[] {
        return this.extractSqlFileOnScriptPath('drop-facetcache-trigger-functions.sql', '$$');
    }

    generateDropFacetCacheUpdateCheckFunctions(): string[] {
        return this.extractSqlFileOnScriptPath('drop-facetcache-updatecheck-functions.sql', '$$');
    }

    protected extractSqlFileOnScriptPath(sqlFile: string, splitter: string): string[] {
        return fs.readFileSync(this.sqlScriptPath + '/' + sqlFile, {encoding: 'utf8'}).split(splitter);
    }
}
