import {CommonFacetCacheConfiguration} from './common-facetcache.utils';

export interface CommonFacetCacheAdapter {

    generateDropFacetCacheTables(): string[];

    generateCreateFacetCacheTables(): string[];

    generateCreateFacetCacheTriggerFunctions(): string[];

    generateDropFacetCacheTriggerFunctions(): string[];

    generateCreateFacetCacheUpdateCheckFunctions(): string[];

    generateDropFacetCacheUpdateCheckFunctions(): string[];

    generateCreateTableTriggerSql(table: string, triggerSql: string): string[];

    generateDropTableTriggerSql(table: string): string[];

    generateCreateUpdateScheduleSql(facetKey: string, updateSql: string, checkInterval: number): string[];

    generateDropUpdateScheduleSql(facetKey: string): string[];

    generateFacetTriggerCallSql(facetKey: string): string[];

    generateCreateFacetCacheConfigSql(configuration: CommonFacetCacheConfiguration): string[];

    generateRemoveFacetCacheConfigSql(configuration: CommonFacetCacheConfiguration): string[];

    generateUpdateFacetCacheSql(configuration: CommonFacetCacheConfiguration): string[];

    generateDeleteFacetCacheSql(configuration: CommonFacetCacheConfiguration): string[];

    generateSelectFacetCacheUpdateTriggerSql(): string;

    generateDeleteFacetCacheUpdateTriggerSql(configuration: CommonFacetCacheConfiguration): string[];

    generateCreateFacetViewSql(configuration: CommonFacetCacheConfiguration): string[];

    generateDropFacetViewSql(configuration: CommonFacetCacheConfiguration): string[];
}
