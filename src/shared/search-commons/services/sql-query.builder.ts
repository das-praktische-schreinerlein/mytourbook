import {AdapterFilterActions, AdapterOpts, AdapterQuery, MapperUtils} from './mapper.utils';
import {isDate} from 'util';
import {DateUtils} from '../../commons/utils/date.utils';

export interface SelectQueryData {
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

export interface WriteQueryData {
    tableConfig: TableConfig;
    from: string;
    fields: {};
}

export interface TableFacetConfig {
    selectField?: string;
    selectFrom?: string;
    orderBy?: string;
    selectLimit?: number;
    noFacet?: boolean;
    selectSql?: string;
    constValues?: string [];
    action: string;
    filterField?: string;
    filterFields?: string[];
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
    modes?: string[];
}

export interface TableConfig {
    key: string;
    tableName: string;
    selectFrom: string;
    selectFieldList: string[];
    facetConfigs: {};
    filterMapping: {};
    fieldMapping: {};
    sortMapping: {};
    writeMapping?: {};
    actionTags?: {};
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

    public transformToSqlDialect(sql: string, client: string): string {
        if (client === 'sqlite3') {
            const replace = ' CONCAT(';
            while (sql.indexOf(replace) > 0) {
                const start = sql.indexOf(replace);
                const end = sql.indexOf(')', start);
                const sqlPre = sql.substr(0, start + 1);
                const sqlAfter = sql.substr(end + 1);
                const toBeConverted = sql.substr(start + replace.length, end - start - replace.length);
// TODO: check security
                sql = sqlPre + toBeConverted.replace(/, /g, ' || ') + sqlAfter;
            }
            sql = sql.replace(/GREATEST\(/g, 'MAX(');
            sql = sql.replace(/SUBSTRING_INDEX\(/g, 'SUBSTR(');
            sql = sql.replace(/CHAR_LENGTH\(/g, 'LENGTH(');
            sql = sql.replace(/GROUP_CONCAT\(DISTINCT (.*?) ORDER BY (.*?) SEPARATOR (.*?)\)/g, 'GROUP_CONCAT($1, $3)');
            sql = sql.replace(/GROUP_CONCAT\((.*?) SEPARATOR (.*?)\)/g, 'GROUP_CONCAT($1, $2)');
            sql = sql.replace(/MONTH\((.*?)\)/g, 'CAST(STRFTIME("%m", $1) AS INT)');
            sql = sql.replace(/WEEK\((.*?)\)/g, 'CAST(STRFTIME("%W", $1) AS INT)');
            sql = sql.replace(/YEAR\((.*?)\)/g, 'CAST(STRFTIME("%Y", $1) AS INT)');
            sql = sql.replace(/DATE_FORMAT\((.+?), GET_FORMAT\(DATE, "ISO"\)\)/g, 'DATETIME($1)');
            sql = sql.replace(/TIME_TO_SEC\(TIMEDIFF\((.*?), (.*?)\)\)\/3600/g, '(JULIANDAY($1) - JULIANDAY($2)) * 24');
        }
        // console.error("sql", sql);

        return sql;
    }

    public selectQueryTransformToSql(query: SelectQueryData): string {
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

    public queryTransformToAdapterWriteQuery(tableConfig: TableConfig, method: string, props: any,
                                              adapterOpts: AdapterOpts): WriteQueryData {
        const query: WriteQueryData = {
            from: tableConfig.tableName,
            fields: {},
            tableConfig: tableConfig
        };

        for (const key in tableConfig.writeMapping) {
            const prop = tableConfig.writeMapping[key];
            const fieldName = key.replace(tableConfig.tableName + '.', '');
            let value;
            if (props[prop]) {
                value = props[prop];
            } else {
                // extract with :field:
                value = prop;

                let propValue;
                if (value !== undefined && value !== null) {
                    const replacers = prop.toString().match(/:.*?:/g);
                    if (replacers.length === 1) {
                        for (const replacer of replacers) {
                            const propKey = replacer.replace(/^:(.*):$/, '$1');
                            if (props.hasOwnProperty(propKey) && props[propKey] !== undefined) {
                                propValue = props[propKey];
                                if (isDate(propValue)) {
                                    propValue = DateUtils.dateToLocalISOString(propValue);
                                }
                                value = value.replace(replacer, propValue);
                            } else {
                                value = undefined;
                                break;
                            }
                        }
                    } else {
                        for (const replacer of replacers) {
                            const propKey = replacer.replace(/^:(.*):$/, '$1');
                            value = value.replace(replacer, props[propKey]);
                            if (props.hasOwnProperty(propKey) && props[propKey] !== undefined) {
                                propValue = props[propKey];
                                if (isDate(propValue)) {
                                    propValue = DateUtils.dateToLocalISOString(propValue);
                                }
                                value = value.replace(replacer, propValue);
                            } else {
                                value = null;
                                break;
                            }
                        }
                    }
                }
            }

            if (value === undefined || value === 'undefined') {
                value = null;
            }
            query.fields[fieldName] = value;
        }
        // console.error("query", query.fields);

        return query;
    }

    public queryTransformToAdapterSelectQuery(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery,
                                              adapterOpts: AdapterOpts): SelectQueryData {
        adapterQuery.loadTrack = adapterQuery.loadTrack || adapterOpts['loadTrack'];

        const query = this.createAdapterSelectQuery(tableConfig, method, adapterQuery, adapterOpts);
        if (query === undefined) {
            return undefined;
        }

        const fields = this.getAdapterSelectFields(tableConfig, method, adapterQuery);
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
                    const orderBy = facetConfig.orderBy ? facetConfig.orderBy : 'count desc';
                    const from = facetConfig.selectFrom !== undefined ? facetConfig.selectFrom : tableConfig.tableName;
                    facets.set(key, 'SELECT count(*) AS count, ' + facetConfig.selectField + ' AS value '
                        + 'FROM ' + from + ' GROUP BY value ORDER BY ' + orderBy);
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

    protected createAdapterSelectQuery(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery,
                                       adapterOpts: AdapterOpts): SelectQueryData {
        // console.error('createAdapterSelectQuery adapterQuery:', adapterQuery);
        // console.log('createAdapterSelectQuery adapterOpts:', adapterOpts);

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

        const query: SelectQueryData = {
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
        // console.log('createAdapterSelectQuery result:', query);

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

    protected getAdapterSelectFields(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery): string[] {
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

    protected generateGroupByForQuery(tableConfig: TableConfig, method: string, query: SelectQueryData, adapterQuery: AdapterQuery): void {
        let addFields = [];
        if (tableConfig.optionalGroupBy !== undefined) {
            for (const groupByConfig of tableConfig.optionalGroupBy) {
                for (const fieldName of groupByConfig.triggerParams) {
                    if (adapterQuery.where.hasOwnProperty(fieldName)
                        || (adapterQuery.additionalWhere && adapterQuery.additionalWhere.hasOwnProperty(fieldName))
                        || (adapterQuery.loadTrack && fieldName === 'loadTrack')) {
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
            const values = [];
            for (const singleValue of this.mapperUtils.prepareSingleValue(value, ',').split(',')) {
                values.push(singleValue.trim()
                    .replace(tableConfig.key + '_', '')
                    .replace(tableConfig.key.toUpperCase() + '_', ''));
            }
            value = values;
        }

        if (tableConfig.facetConfigs.hasOwnProperty(fieldName)) {
            if (tableConfig.facetConfigs[fieldName].noFacet === true) {
                return undefined;
            }

            action = tableConfig.facetConfigs[fieldName].action || action;
            realFieldName = tableConfig.facetConfigs[fieldName].selectField || tableConfig.facetConfigs[fieldName].filterField;

            if (realFieldName === undefined && tableConfig.facetConfigs[fieldName].filterFields) {
                const filters = [];
                for (realFieldName of tableConfig.facetConfigs[fieldName].filterFields) {
                    filters.push(this.generateFilter(realFieldName, action, value));
                }

                return '(' + filters.join(' OR ') + ')';
            }
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
            query = fieldName + ' LIKE "%'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '%" AND ' + fieldName + ' LIKE "%') + '%" ';
        } else if (action === AdapterFilterActions.EQ1 || action === AdapterFilterActions.EQ2) {
            query = fieldName + ' = "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '" AND ' + fieldName + ' =  "') + '" ';
        } else if (action === AdapterFilterActions.GT) {
            query = fieldName + ' > "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', ' AND ' + fieldName + ' > ') + '"';
        } else if (action === AdapterFilterActions.GE) {
            query = fieldName + ' >= "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', ' AND ' + fieldName + ' >= ') + '"';
        } else if (action === AdapterFilterActions.LT) {
            query = fieldName + ' < "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', ' AND ' + fieldName + ' < ') + '"';
        } else if (action === AdapterFilterActions.LE) {
            query = fieldName + ' <= "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', ' AND ' + fieldName + ' <= ') + '"';
        } else if (action === AdapterFilterActions.IN) {
            query = fieldName + ' in ("' + value.map(
                    inValue => this.mapperUtils.escapeAdapterValue(inValue.toString())
                ).join('", "') + '")';
        } else if (action === AdapterFilterActions.IN_NUMBER) {
            query = fieldName + ' in (CAST("' + value.map(
                inValue => this.mapperUtils.escapeAdapterValue(inValue.toString())
            ).join('" AS INT), CAST("') + '" AS INT))';
        } else if (action === AdapterFilterActions.NOTIN) {
            query = fieldName + ' not in ("' + value.map(
                    inValue => this.mapperUtils.escapeAdapterValue(inValue.toString())
                ).join('", "') + '")';
        } else if (action === AdapterFilterActions.LIKEIN) {
            query = '(' + value.map(
                inValue => {
                    return fieldName + ' LIKE "%'
                        + this.mapperUtils.escapeAdapterValue(inValue.toString()) + '%" ';
                }
            ).join(' OR ') + ')';
        } else if (action === AdapterFilterActions.IN_CSV) {
            query = '(' + value.map(
                inValue => {
                    return fieldName + ' LIKE "%,' + this.mapperUtils.escapeAdapterValue(inValue.toString()) + ',%" OR '
                        + fieldName + ' LIKE "%,' + this.mapperUtils.escapeAdapterValue(inValue.toString()) + '" OR '
                        + fieldName + ' LIKE "' + this.mapperUtils.escapeAdapterValue(inValue.toString()) + ',%" OR '
                        + fieldName + ' LIKE "' + this.mapperUtils.escapeAdapterValue(inValue.toString()) + '" ';
                }
            ).join(' OR ') + ')';
        }
        return query;
    }
}

