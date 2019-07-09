import {FacetCacheConfiguration} from './facetcache.utils';
import * as fs from 'fs';
import {FacetCacheAdapter} from './facetcache.adapter';

export class MysqlFacetCacheAdapter implements FacetCacheAdapter {
    protected sqlScriptPath: string;

    constructor(sqlScriptPath: string) {
        this.sqlScriptPath = sqlScriptPath;
    }

    public supportsDatabaseManagedUpdate(): boolean {
        return true;
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

    public generateCreateUpdateScheduleSql(facetKey: string, updateSql: string, checkInterval: number): string[] {
        const sqls: string[] = [];
        sqls.push('CREATE EVENT event_update_' + facetKey +
            ' ON SCHEDULE EVERY ' + checkInterval + ' MINUTE' +
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

    public generateCreateFacetCacheConfigsSql(configurations: FacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.generateCreateFacetCacheConfigSql(configuration));
        }

        return sqls;
    }

    public generateCreateFacetCacheConfigSql(configuration: FacetCacheConfiguration): string[] {
        return ['INSERT INTO facetcacheconfig (fcc_usecache, fcc_key) VALUES (1, "' + configuration.longKey + '")',
        'INSERT INTO facetcacheupdatetrigger (ft_key)' +
        '        SELECT "' + configuration.longKey + '" from dual' +
        '            WHERE NOT EXISTS (SELECT 1 FROM facetcacheupdatetrigger WHERE ft_key="' + configuration.longKey + '");'];
    }

    public generateRemoveFacetCacheConfigsSql(configurations: FacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.generateRemoveFacetCacheConfigSql(configuration));
        }

        return sqls;
    }

    public generateRemoveFacetCacheConfigSql(configuration: FacetCacheConfiguration): string[] {
        return ['IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = "facetcacheconfig") ' +
        ' THEN ' +
        '   DELETE IGNORE FROM facetcacheconfig WHERE fcc_key IN ("' + configuration.longKey + '");' +
        ' END IF'];
    }

    public generateSelectTrueIfTableFacetCacheConfigExistsSql(): string {
        return this.generateSelectTrueIfTableExistsSql('facetcacheconfig');
    }

    public generateUpdateFacetsCacheSql(configurations: FacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.generateUpdateFacetCacheSql(configuration));
        }

        return sqls;
    }

    public generateUpdateFacetCacheSql(configuration: FacetCacheConfiguration): string[] {
        const sqls: string[] = [];
        const longKey = configuration.longKey;
        sqls.push('INSERT INTO facetcache (fc_key, fc_order, fc_count,' +
            '   fc_value_' + configuration.valueType +
            (configuration.withLabel === true ? ', fc_label' : '') +
            (configuration.withId === true ? ', fc_recid ' : ' ') +
            '   )' +
            ' SELECT "' + longKey + '" AS fc_key, @i:=@i+1 AS fc_order, count, value ' +
            (configuration.withLabel === true ? ', label ' : ' ') +
            (configuration.withId === true ? ', id ' : ' ') +
            ' FROM fc_live_' + longKey + ', (SELECT @i:=0) AS temp');

        return sqls;
    }

    public generateDeleteFacetCacheSql(configuration: FacetCacheConfiguration): string[] {
        const sqls: string[] = [];
        const longKey = configuration.longKey;
        sqls.push('DELETE IGNORE from facetcache where fc_key in ("' + longKey + '")');

        return sqls;
    }

    public generateSelectFacetCacheUpdateTriggerSql(): string {
        return 'SELECT ft_key from facetcacheupdatetrigger';
    }

    public generateDeleteFacetCacheUpdateTriggerSql(configuration: FacetCacheConfiguration): string[] {
        const sqls: string[] = [];
        const longKey = configuration.longKey;
        sqls.push('DELETE IGNORE from facetcacheupdatetrigger where ft_key in ("' + longKey + '")');

        return sqls;
    }

    public generateCreateFacetViewsSql(configurations: FacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.generateCreateFacetViewSql(configuration));
        }

        return sqls;
    }

    public generateCreateFacetViewSql(configuration: FacetCacheConfiguration): string[] {
        const longKey = configuration.longKey;
        const facetSql = configuration.facetSql;
        const sqls: string[] = [];
        sqls.push('CREATE VIEW fc_live_' + longKey + ' AS ' + facetSql);
        sqls.push('CREATE VIEW fc_cached_' + longKey + ' AS' +
            ' SELECT fc_count AS count, ' +
            (configuration.withLabel === true ? 'fc_label AS label, ' : '') +
            (configuration.withId === true ? 'fc_recid AS id, ' : '') +
            '    fc_value_' + configuration.valueType + ' AS value' +
            ' FROM facetcache WHERE fc_key in ("' + longKey + '") ORDER BY fc_order');
        sqls.push('CREATE VIEW fc_real_' + longKey + ' AS ' +
            '   SELECT * FROM fc_live_' + longKey +
            '       WHERE NOT EXISTS (SELECT 1 FROM facetcacheconfig WHERE fcc_key IN ("' + longKey + '") AND fcc_usecache <> 0)' +
            ' UNION ' +
            '   SELECT * FROM fc_cached_' + longKey +
            '       WHERE EXISTS (SELECT 1 FROM facetcacheconfig WHERE fcc_key IN ("' + longKey + '") AND fcc_usecache <> 0)'
        );

        return sqls;
    }

    public generateDropFacetViewsSql(configurations: FacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.generateDropFacetViewSql(configuration));
        }

        return sqls;
    }

    public generateDropFacetViewSql(configuration: FacetCacheConfiguration): string[] {
        const longKey = configuration.longKey;
        const sqls: string[] = [];
        sqls.push('DROP VIEW IF EXISTS fc_live_' + longKey);
        sqls.push('DROP VIEW IF EXISTS fc_cached_' + longKey);
        sqls.push('DROP VIEW IF EXISTS fc_real_' + longKey);

        return sqls;
    }

    public generateCreateFacetCacheTables(): string[] {
        return this.extractSqlFileOnScriptPath('create-facetcache-tables.sql', ';');
    }

    public generateCreateFacetCacheTriggerFunctions(): string[] {
        return this.extractSqlFileOnScriptPath('create-facetcache-trigger-functions.sql', '$$');
    }

    public generateCreateFacetCacheUpdateCheckFunctions(): string[] {
        return this.extractSqlFileOnScriptPath('create-facetcache-updatecheck-functions.sql', '$$');
    }

    public generateDropFacetCacheTables(): string[] {
        return this.extractSqlFileOnScriptPath('drop-facetcache-tables.sql', ';');
    }

    public generateDropFacetCacheTriggerFunctions(): string[] {
        return this.extractSqlFileOnScriptPath('drop-facetcache-trigger-functions.sql', '$$');
    }

    public generateDropFacetCacheUpdateCheckFunctions(): string[] {
        return this.extractSqlFileOnScriptPath('drop-facetcache-updatecheck-functions.sql', '$$');
    }

    public generateSelectTrueIfTableExistsSql(table): string {
        return 'SELECT "true" FROM information_schema.tables WHERE table_schema=DATABASE() AND table_name="' + table + '"';
    }

    protected extractSqlFileOnScriptPath(sqlFile: string, splitter: string): string[] {
        return fs.readFileSync(this.sqlScriptPath + '/' + sqlFile, {encoding: 'utf8'}).split(splitter);
    }
}
