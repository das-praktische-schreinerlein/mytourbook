import {AdapterFilterActions, AdapterOpts, AdapterQuery, MapperUtils} from './mapper.utils';

export interface QueryData {
    where: string[];
    offset: number;
    limit: number;
    sort: string[];
    tableConfig: TableConfig;
    from: string;
    groupByFields: string[];
    fields: string[];
    having: string[];
}

export interface TableFacetConfig {
    selectField?: string;
    selectFrom?: string;
    selectLimit?: number;
    noFacet?: boolean;
    selectSql?: string;
    constValues?: string [];
    action: string;
}

export interface OptionalGroupByConfig {
    triggerParams?: string[];
    from?: string;
    groupByFields?: string[];
}

export interface LoadDetailDataConfig {
    profile: string[];
    sql: string;
    parameterNames: string[];
}

export interface TableConfig {
    tableName: string;
    selectFrom: string;
    selectFieldList: string[];
    facetConfigs: {};
    filterMapping: {};
    fieldMapping: {};
    sortMapping: {};
    groupbBySelectFieldList?: boolean;
    groupbBySelectFieldListIgnore?: string[];
    optionalGroupBy?: OptionalGroupByConfig[];
    loadDetailData?: LoadDetailDataConfig[];
    spartialConfig?: {
        lat: string;
        lon: string;
        spatialField: string;
        spatialSortKey: string;
    };
}

export class SqlQueryBuilder {
    protected mapperUtils = new MapperUtils();

    public queryTransformToSql(query: QueryData): string {
        const sql = 'select ' +
            (query.fields && query.fields.length > 0 ? query.fields.join(', ') : '') + ' ' +
            'from ' + query.from + ' ' +
            (query.where && query.where.length > 0 ? 'where ' + query.where.join(' AND ') : '') + ' ' +
            (query.groupByFields && query.groupByFields.length > 0 ? ' group by ' + query.groupByFields.join(', ') : '') + ' ' +
            (query.having && query.having.length > 0 ? 'having ' + query.having.join(' AND ') : '') + ' ' +
            (query.sort && query.sort.length > 0 ? 'order by ' + query.sort.join(', ') + ' ' : '') +
            (query.limit ? 'limit ' + (query.offset || 0) + ', ' + query.limit : '');
        // console.error("sql:", sql);

        return sql;
    }

    public queryTransformToAdapterQuery(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery,
                                           adapterOpts: AdapterOpts): QueryData {
        const query = this.createAdapterQuery(tableConfig, method, adapterQuery, adapterOpts);
        if (query === undefined) {
            return undefined;
        }

        const fields = this.getAdapterFields(tableConfig, method, adapterQuery);
        if (fields !== undefined && fields.length > 0) {
            query.fields = fields;
        }

        if (this.isSpatialQuery(tableConfig, adapterQuery)) {
            let spatialField = tableConfig.spartialConfig.spatialField;
            if (method === 'count') {
                spatialField = this.getSpatialSql(tableConfig, adapterQuery);
            }
            const spatialParams = this.getSpatialParams(tableConfig, adapterQuery, spatialField);
            if (spatialParams !== undefined && spatialParams.length > 0) {
                if (method === 'count') {
                    query.where.push(spatialParams);
                } else {
                    query.having.push(spatialParams);
                }
            }
        }

        const sortParams = this.getSortParams(tableConfig, method, adapterQuery, adapterOpts);
        if (sortParams !== undefined) {
            query.sort = sortParams;
        }

        query.from = this.getAdapterFrom(tableConfig);

        this.generateGroupByForQuery(tableConfig, method, query, adapterQuery);

        return query;
    }

    public getFacetSql(tableConfig: TableConfig, adapterOpts: AdapterOpts): Map<string, string> {
        const facetConfigs = tableConfig.facetConfigs;

        const facets = new Map<string, string>();
        for (const key in facetConfigs) {
            if (adapterOpts.showFacets === true || (adapterOpts.showFacets instanceof Array && adapterOpts.showFacets.indexOf(key) >= 0)) {
                const facetConfig: TableFacetConfig = facetConfigs[key];
                if (!facetConfig) {
                    continue;
                }


                if (facetConfig.selectField !== undefined) {
                    const from = facetConfig.selectFrom !== undefined ? facetConfig.selectFrom : tableConfig.tableName;
                    facets.set(key, 'SELECT count(*) AS count, ' + facetConfig.selectField + ' AS value '
                        + 'FROM ' + from + ' GROUP BY value ORDER By count desc');
                } else if (facetConfig.selectSql !== undefined) {
                    facets.set(key, facetConfig.selectSql);
                } else if (facetConfig.constValues !== undefined) {
                    const sqls = [];
                    facetConfig.constValues.forEach(value => {
                        sqls.push('SELECT 0 AS count, "' + value + '" AS value');
                    });

                    facets.set(key, sqls.join(' UNION ALL '));
                }
            }
        }

        return facets;
    };

    public isSpatialQuery(tableConfig: TableConfig, adapterQuery: AdapterQuery): boolean {
        if (adapterQuery !== undefined && adapterQuery.spatial !== undefined && adapterQuery.spatial.geo_loc_p !== undefined &&
            adapterQuery.spatial.geo_loc_p.nearby !== undefined && tableConfig.spartialConfig !== undefined) {
            return true;
        }

        return false;
    };

    protected createAdapterQuery(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery,
                                 adapterOpts: AdapterOpts): QueryData {
        // console.log('createAdapterQuery adapterQuery:', adapterQuery);
        // console.log('createAdapterQuery adapterOpts:', adapterOpts);

        const newParams = [];
        if (adapterQuery.where) {
            for (const fieldName of Object.getOwnPropertyNames(adapterQuery.where)) {
                const filter = adapterQuery.where[fieldName];
                const action = Object.getOwnPropertyNames(filter)[0];
                const value = adapterQuery.where[fieldName][action];
                const res = this.mapFilterToAdapterQuery(tableConfig, fieldName, action, value);
                if (res !== undefined) {
                    newParams.push(res);
                }
            }
        }
        if (adapterQuery.additionalWhere) {
            for (const fieldName of Object.getOwnPropertyNames(adapterQuery.additionalWhere)) {
                const filter = adapterQuery.additionalWhere[fieldName];
                const action = Object.getOwnPropertyNames(filter)[0];
                const value = adapterQuery.additionalWhere[fieldName][action];
                const res = this.mapFilterToAdapterQuery(tableConfig, fieldName, action, value);
                if (res !== undefined) {
                    newParams.push(res);
                }
            }
        }

        const query: QueryData = {
            where: newParams.length <= 0 ? [] : newParams,
            having: [],
            offset: undefined,
            limit: undefined,
            sort: [],
            tableConfig: tableConfig,
            from: 'dual',
            groupByFields: [],
            fields: []};
        if (method === 'findAll') {
            query.offset = adapterOpts.offset * adapterOpts.limit;
            query.limit = adapterOpts.limit;
        }
        // console.log('createAdapterQuery result:', query);

        return query;
    }

    protected getAdapterFrom(tableConfig: TableConfig): string {
        return tableConfig.selectFrom || '';
    }

    protected getSortParams(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): string[] {
        if (method === 'count') {
            return undefined;
        }

        const form = adapterOpts.originalSearchForm;
        const sortMapping = tableConfig.sortMapping;
        let sortKey: string;
        if (form && form.sort) {
            sortKey = form.sort;
        }
        // ignore distance-sort if not spatial-search
        if (!this.isSpatialQuery(tableConfig, adapterQuery) && tableConfig.spartialConfig !== undefined &&
            tableConfig.spartialConfig.spatialSortKey === sortKey) {
            sortKey = 'relevance';
        }
        if (sortKey === undefined || sortKey.length < 1)  {
            sortKey = 'relevance';
        }

        if (sortMapping.hasOwnProperty(sortKey)) {
            return [sortMapping[sortKey]];
        }

        return [sortMapping['relevance']];
    };

    protected getSpatialParams(tableConfig: TableConfig, adapterQuery: AdapterQuery, spatialField: string): string {
        if (this.isSpatialQuery(tableConfig, adapterQuery)) {
            const [lat, lon, distance] = this.mapperUtils.escapeAdapterValue(adapterQuery.spatial.geo_loc_p.nearby).split(/_/);
            return spatialField + ' <= ' + distance;
        }

        return undefined;
    };

    protected getSpatialSql(tableConfig: TableConfig, adapterQuery: AdapterQuery): string {
        if (this.isSpatialQuery(tableConfig, adapterQuery)) {
            const [lat, lon, distance] = this.mapperUtils.escapeAdapterValue(adapterQuery.spatial.geo_loc_p.nearby).split(/_/);
            const distanceSql =
                '(3959 ' +
                ' * ACOS (' +
                '     COS ( RADIANS(' + lat + ') )' +
                '     * COS( RADIANS(' + tableConfig.spartialConfig.lat + ') )' +
                '     * COS( RADIANS(' + tableConfig.spartialConfig.lon + ') - RADIANS(' + lon + ') )' +
                '     + SIN ( RADIANS(' + lat + ') )' +
                '     * SIN( RADIANS(' + tableConfig.spartialConfig.lat + ') )' +
                ' )' +
                ')';
            return distanceSql;
        }

        return undefined;
    }

    protected getAdapterFields(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery): string[] {
        if (method === 'count') {
            return ['COUNT( DISTINCT ' + tableConfig.filterMapping['id'] + ')'];
        }

        const fields = [];
        for (const field of tableConfig.selectFieldList) {
            fields.push(field);
        }

        const distanceSql = this.getSpatialSql(tableConfig, adapterQuery);
        if (distanceSql !== undefined) {
            fields.push(distanceSql + ' AS geodist');
        }

        return fields;
    }

    protected generateGroupByForQuery(tableConfig: TableConfig, method: string, query: QueryData, adapterQuery: AdapterQuery): void {
        let addFields = [];

        if (tableConfig.optionalGroupBy !== undefined) {
            for (const groupByConfig of tableConfig.optionalGroupBy) {
                for (const fieldName of groupByConfig.triggerParams) {
                    if (adapterQuery.where.hasOwnProperty(fieldName)) {
                        query.from += ' ' + groupByConfig.from;
                        addFields = addFields.concat(groupByConfig.groupByFields);
                        break;
                    }
                }
            }
        }

        if (method === 'count') {
            return;
        }

        if (tableConfig.groupbBySelectFieldList !== true && addFields.length <= 0) {
            return;
        }

        const fields = query.fields;
        const groupFields = [];
        fields.forEach(field => {
            const newField = field.replace(/.*? AS /gi, '');
            if (tableConfig.groupbBySelectFieldListIgnore !== undefined &&
                tableConfig.groupbBySelectFieldListIgnore.indexOf(newField) >= 0) {
                return;
            }

            groupFields.push(newField);
        });

        if (groupFields !== undefined && groupFields.length > 0) {
            query.groupByFields = query.groupByFields.concat(groupFields);
        }
        query.fields = query.fields.concat(addFields);
    }

    protected mapToAdapterFieldName(tableConfig: TableConfig, fieldName: string): string {
        switch (fieldName) {
            default:
                break;
        }

        return this.mapperUtils.mapToAdapterFieldName(tableConfig.fieldMapping, fieldName);
    }

    protected mapFilterToAdapterQuery(tableConfig: TableConfig, fieldName: string, action: string, value: any): string {
        let realFieldName = undefined;
        if (fieldName === 'id') {
            value = [this.mapperUtils.prepareSingleValue(value, '_').replace(/.*_/g, '')];
        }

        if (tableConfig.facetConfigs.hasOwnProperty(fieldName)) {
            if (tableConfig.facetConfigs[fieldName].noFacet === true) {
                return undefined;
            }

            realFieldName = tableConfig.facetConfigs[fieldName].selectField || tableConfig.facetConfigs[fieldName].filterField;
            action = tableConfig.facetConfigs[fieldName].action || action;
        }
        if (realFieldName === undefined && tableConfig.filterMapping.hasOwnProperty(fieldName)) {
            realFieldName = tableConfig.filterMapping[fieldName];
        }
        if (realFieldName === undefined) {
            realFieldName = this.mapToAdapterFieldName(tableConfig, fieldName);
        }


        return this.generateFilter(realFieldName, action, value);
    }

    protected generateFilter(fieldName: string, action: string, value: any): string {
        let query = '';

        if (action === AdapterFilterActions.LIKEI || action === AdapterFilterActions.LIKE) {
            query = fieldName + ' like "%'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '%", "%') + '%" ';
        } else if (action === AdapterFilterActions.EQ1 || action === AdapterFilterActions.EQ2) {
            query = fieldName + ' = "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '", "') + '" ';
        } else if (action === AdapterFilterActions.GT) {
            query = fieldName + ' > "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '"';
        } else if (action === AdapterFilterActions.GE) {
            query = fieldName + ' >= "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '"';
        } else if (action === AdapterFilterActions.LT) {
            query = fieldName + ' < "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '"';
        } else if (action === AdapterFilterActions.LE) {
            query = fieldName + ' <= "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '"';
        } else if (action === AdapterFilterActions.IN) {
            query = fieldName + ' in ("' + value.map(
                    inValue => this.mapperUtils.escapeAdapterValue(inValue.toString())
                ).join('", "') + '")';
        } else if (action === AdapterFilterActions.NOTIN) {
            query = fieldName + ' not in ("' + value.map(
                    inValue => this.mapperUtils.escapeAdapterValue(inValue.toString())
                ).join('", "') + '")';
        } else if (action === AdapterFilterActions.LIKEIN) {
            query = '(' + value.map(
                inValue => {
                    return fieldName + ' like "%'
                        + this.mapperUtils.escapeAdapterValue(inValue.toString()) + '%" ';
                }
            ).join(' or ') + ')';
        }
        return query;
    }
}

