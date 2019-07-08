import {FacetCacheConfiguration} from './facetcache.utils';

export interface FacetCacheAdapter {
    supportsDatabaseManagedUpdate(): boolean;

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

    generateCreateFacetCacheConfigSql(configuration: FacetCacheConfiguration): string[];

    generateRemoveFacetCacheConfigSql(configuration: FacetCacheConfiguration): string[];

    generateUpdateFacetCacheSql(configuration: FacetCacheConfiguration): string[];

    generateDeleteFacetCacheSql(configuration: FacetCacheConfiguration): string[];

    generateSelectFacetCacheUpdateTriggerSql(): string;

    generateDeleteFacetCacheUpdateTriggerSql(configuration: FacetCacheConfiguration): string[];

    generateCreateFacetViewSql(configuration: FacetCacheConfiguration): string[];

    generateDropFacetViewSql(configuration: FacetCacheConfiguration): string[];
}
