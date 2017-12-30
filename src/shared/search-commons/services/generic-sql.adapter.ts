import {IDict} from 'js-data-http';
import {Mapper, Record, utils} from 'js-data';
import {Facet, Facets} from '../model/container/facets';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {Adapter} from 'js-data-adapter';
import knex from 'knex';
import {GenericFacetAdapter} from './generic-search.adapter';
import {isArray} from 'util';
import {MapperUtils} from './mapper.utils';
import {GenericAdapterResponseMapper} from './generic-adapter-response.mapper';

export class AdapterFilterActions {
    static LIKEI = 'likei';
    static LIKE = 'like';
    static EQ1 = '==';
    static EQ2 = 'eq';
    static GT = '>';
    static GE = '>=';
    static LT = '<';
    static LE = '<=';
    static IN = 'in';
    static LIKEIN = 'likein';
    static NOTIN = 'notin';
}

export interface QueryData {
    where: string[];
    offset: number;
    limit: number;
    sort: string[];
    table: string;
    from: string;
    groupByFields: string[];
    fields: string[];
    having: string[];
}

export interface TableFacetConfig {
    selectField?: string;
    selectFrom?: string;
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

export interface TableConfig {
    tableName: string;
    selectFrom: string;
    selectFieldList: string[];
    facetConfigs: {};
    filterMapping: {};
    fieldMapping: {};
    sortMapping: {};
    groupbBySelectFieldList: boolean;
    groupbBySelectFieldListIgnore: string[];
    optionalGroupBy: OptionalGroupByConfig[];
    spartialConfig: {
        lat: string;
        lon: string
    };
}

export function Response (data, meta, op) {
    meta = meta || {};
    this.data = data;
    utils.fillIn(this, meta);
    this.op = op;
}

export abstract class GenericSqlAdapter <R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>>
    extends Adapter implements GenericFacetAdapter<R, F, S> {
    protected knex: any;
    protected mapperUtils = new MapperUtils();
    protected mapper: GenericAdapterResponseMapper;


    constructor(config: any, mapper: GenericAdapterResponseMapper) {
        super(config);
        this.knex = knex(config.knexOpts);
        this.mapper = mapper;
    }

    create<T extends Record>(mapper: Mapper, props: any, opts?: any): Promise<T> {
        throw new Error('create not implemented');
    }

    createMany<T extends Record>(mapper: Mapper, props: any, opts: any): Promise<T> {
        throw new Error('createMany not implemented');
    }

    destroy(mapper: Mapper, id: string | number, opts?: any): Promise<any> {
        throw new Error('destroy not implemented');
    }

    destroyAll(mapper: Mapper, query: any, opts: any): Promise<any> {
        throw new Error('destroyAll not implemented');
    }

    find<T extends Record>(mapper: Mapper, id: string | number, opts: any): Promise<T> {
        throw new Error('find not implemented');
    }

    sum (mapper: Mapper, field: string, query: any, opts?: any): Promise<any> {
        throw new Error('sum not implemented');
    }

    update<T extends Record>(mapper: Mapper, id: string | number, props: any, opts: any): Promise<T> {
        throw new Error('update not implemented');
    }

    updateAll(mapper: Mapper, props: any, query: any, opts?: any): Promise<any> {
        throw new Error('updateAll not implemented');
    }

    updateMany<T extends Record>(mapper: Mapper, records: T[], opts?: any): Promise<any> {
        throw new Error('updateMany not implemented');
    }

    count(mapper: Mapper, query: any, opts?: any): Promise<number> {
        query = query || {};
        opts = opts || {};

        return super.count(mapper, query, opts);
    }

    findAll<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<T[]> {
        query = query || {};
        opts = opts || {};

        return super.findAll(mapper, query, opts);
    }

    facets<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<Facets> {
        query = query || {};
        opts = opts || {};

        opts.adapterFacet = true;

        return this._facets(mapper, query, opts);
    }

    afterCount(mapper: Mapper, props: IDict, opts: any, result: any): Promise<number> {
        return utils.Promise.resolve(result);
    }

    _count(mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.query = opts.query || query;

        opts.adapterQuery = true;
        const me = this;
        const queryData = me.queryTransformToAdapterQuery('count', mapper, query, opts);
        if (queryData === undefined) {
            return utils.resolve([0]);
        }
        opts.query = queryData;

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const raw = sqlBuilder.raw(this.queryTransformToSql(queryData));
        const result = new Promise((resolve, reject) => {
            raw.then(function doneSearch(dbresults: any) {
                    let [dbdata, dbresult] = dbresults;
                    dbresult = dbresult || {};
                    let response = new Response(dbdata, dbresult, 'count');
                    response = me.respond(response, opts);
                    const count = me.extractCountFromRequestResult(mapper, response, opts);
                    return resolve(count);
                }).catch(function errorSearch(reason) {
                    console.error('_facets failed:' + reason);
                    return reject(reason);
                });
        });

        return result;
    };

    _findAll(mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.query = opts.query || query;

        opts.adapterQuery = true;
        const me = this;
        const queryData = me.queryTransformToAdapterQuery('findAll', mapper, query, opts);
        if (queryData === undefined) {
            return utils.resolve([[]]);
        }
        opts.query = queryData;

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const raw = sqlBuilder.raw(this.queryTransformToSql(queryData));
        const result = new Promise((resolve, reject) => {
            raw.then(function doneSearch(dbresults: any) {
                    let [dbdata, dbresult] = dbresults;
                    dbresult = dbresult || {};
                    let response = new Response(dbdata, dbresult, 'count');
                    response = me.respond(response, opts);

                    const records: R[] = me.extractRecordsFromRequestResult(mapper, response, opts);
                    return resolve([records]);
                }).catch(function errorSearch(reason) {
                    console.error('_findAll failed:' + reason);
                    return reject(reason);
                });
        });

        return result;
    };

    _facets(mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.query = opts.query || query;

        // init data with dummy-query
        opts.adapterQuery = true;
        const me = this;
        const queryData = me.queryTransformToAdapterQuery('findAll', mapper, query, opts);
        if (queryData === undefined) {
            return utils.resolve([[]]);
        }
        opts.query = queryData;

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const result = new Promise((allResolve, allReject) => {
            const queries = me.getFacetSql('facet', mapper, query, opts, query);
            const promises = [];
            queries.forEach((value, key) => {
                const raw = sqlBuilder.raw(value);
                promises.push(new Promise((resolve, reject) => {
                    raw.then(function doneSearch(dbresults: any) {
                            let [dbdata, dbresult] = dbresults;
                            dbresult = dbresult || {};
                            let response = new Response(dbdata, dbresult, 'count');
                            response = me.respond(response, opts);
                            const facet: Facet = me.extractFacetFromRequestResult(mapper, response, opts);

                            return resolve([key, facet]);
                        },
                        function errorSearch(reason) {
                            console.error('_facets failed:' + reason);

                            return reject(reason);
                        });
                }));
            });

            Promise.all(promises).then(function doneSearch(facetResults: any[]) {
                    const facets = new Facets();
                    facetResults.forEach(facet => {
                        facets.facets.set(facet[0], facet[1]);
                    });

                    return allResolve(facets);
                }).catch(function errorSearch(reason) {
                    console.error('_facets failed:' + reason);
                    return allReject(reason);
                });
        });

        return result;
    };

    deserialize(mapper: Mapper, response: any, opts: any) {
        if (opts.adapterQuery) {
            if (response && (typeof response.data === 'string') && response.data.startsWith('JSONP_CALLBACK(')) {
                const json = response.data.substring('JSONP_CALLBACK('.length, response.data.length - 2);
                response.data = JSON.parse(json);
            }

            return this.deserializeResponse(mapper, response, opts);
        }

        // do default behavior
        return this.deserializeCommon(mapper, response, opts);
    }

    getParams(opts) {
        opts = opts || {};
        if (opts.params === undefined) {
            return {};
        }
        return utils.copy(opts.params);
    }

    deserializeCommon(mapper, response, opts): any {
        opts = opts || {};
        if (utils.isFunction(opts.deserialize)) {
            return opts.deserialize(mapper, response, opts);
        }
        if (utils.isFunction(mapper.deserialize)) {
            return mapper.deserialize(mapper, response, opts);
        }
        if (response && response.hasOwnProperty('data')) {
            return response.data;
        }
        return response;
    }

    deserializeResponse(mapper: Mapper, response: any, opts: any) {
        // console.log('deserializeResponse:', response);

        // check response
        if (response === undefined) {
            return this.deserializeCommon(mapper, response, opts);
        }
        if (response.data === undefined) {
            return this.deserializeCommon(mapper, response, opts);
        }

        // count
        if (opts.adapterCount) {
            return this.extractCountFromRequestResult(mapper, response.data, opts);
        }

        // facet
        if (opts.adapterFacet) {
            return this.extractFacetFromRequestResult(mapper, response.data, opts);
        }

        return this.extractRecordsFromRequestResult(mapper, response.data, opts);

    }

    extractCountFromRequestResult(mapper: Mapper, result: any, opts: any): [number] {
        const docs: any[] = result;
        if (docs.length === 1) {
            for (const fieldName of Object.getOwnPropertyNames(docs[0])) {
                if (fieldName.startsWith('COUNT(')) {
                    return [docs[0][fieldName]];
                }
            }
        }

        return [0];
    }

    extractRecordsFromRequestResult(mapper: Mapper, result: any, opts: any): R[] {
        if (!isArray(result)) {
            return [];
        }

        // got documents
        const docs = result;
        const records = [];
        for (const doc of docs) {
            records.push(this.mapResponseDocument(mapper, doc, opts.query.table, opts));
        }

        return records;
    }

    extractFacetFromRequestResult(mapper: Mapper, result: any, opts: any): Facet {
        if (!isArray(result)) {
            return undefined;
        }

        // got documents
        const values = [];
        const facet = new Facet();
        for (const doc of result) {
            values.push([doc['value'] + '', doc['count']]);
        }
        facet.facet = values;

        return facet;
    }


    mapResponseDocument(mapper: Mapper, doc: any, table: string, opts: any): Record {
        return this.mapper.mapResponseDocument(mapper, doc, this.getMappingForTable(table), opts);
    }

    mapToAdapterDocument(table: string, props: any): any {
        return this.mapper.mapToAdapterDocument(this.getMappingForTable(table), props);
    }

    protected abstract extractTable(method: string, mapper: Mapper, params: any, opts: any): string;

    protected abstract getTableConfig(method: string, mapper: Mapper, params: any, opts: any, query: QueryData): TableConfig;

    protected abstract getTableConfigForTable(table: string): TableConfig;

    protected getAdapterFrom(method: string, mapper: Mapper, params: any, opts: any, query: QueryData): string {
        return this.getTableConfigForTable(query.table).selectFrom || '';
    }

    protected getMappingForTable(table: string): {} {
        return this.getTableConfigForTable(table).fieldMapping || {};
    }

    protected getSortParams(method: string, mapper: Mapper, params: any, opts: any, query: QueryData): string[] {
        if (method === 'count') {
            return undefined;
        }

        const form = opts.originalSearchForm || {};

        const tableConfig = this.getTableConfig(method, mapper, params, opts, query);
        const sortMapping = tableConfig.sortMapping;

        if (sortMapping.hasOwnProperty(form.sort)) {
            return [sortMapping[form.sort]];
        }

        return [sortMapping['default']];
    };

    protected getSpatialParams(method: string, mapper: Mapper, params: any, opts: any, query: QueryData, spatialField: string): string {
        const tableConfig = this.getTableConfig(method, mapper, params, opts, query);
        if (params !== undefined && params.spatial !== undefined && params.spatial.geo_loc_p !== undefined &&
            params.spatial.geo_loc_p.nearby !== undefined && tableConfig.spartialConfig !== undefined) {
            const [lat, lon, distance] = this.mapperUtils.escapeAdapterValue(params.spatial.geo_loc_p.nearby).split(/_/);
            return spatialField + ' <= ' + distance;
        }

        return undefined;
    };

    protected getSpatialSql(method: string, mapper: Mapper, params: any, opts: any, query: QueryData): string {
        const tableConfig = this.getTableConfigForTable(query.table);
        if (params !== undefined && params.spatial !== undefined && params.spatial.geo_loc_p !== undefined &&
            params.spatial.geo_loc_p.nearby !== undefined && tableConfig.spartialConfig !== undefined) {
            const [lat, lon, distance] = this.mapperUtils.escapeAdapterValue(params.spatial.geo_loc_p.nearby).split(/_/);
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

    protected getFacetSql(method: string, mapper: Mapper, params: any, opts: any, query: QueryData): Map<string, string> {
        const tableConfig = this.getTableConfig(method, mapper, params, opts, query);
        const facetConfigs = tableConfig.facetConfigs;

        const facets = new Map<string, string>();
        for (const key in facetConfigs) {
            if (opts.showFacets === true || (opts.showFacets instanceof Array && opts.showFacets.indexOf(key) >= 0)) {
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

    protected getAdapterFields(method: string, mapper: Mapper, params: any, opts: any, query: QueryData): string[] {
        const tableConfig = this.getTableConfigForTable(query.table);
        if (method === 'count') {
            return ['COUNT( DISTINCT ' + tableConfig.filterMapping['id'] + ')'];
        }

        const fields = [];
        for (const field of tableConfig.selectFieldList) {
            fields.push(field);
        }

        const distanceSql = this.getSpatialSql(method, mapper, params, opts, query);
        if (distanceSql !== undefined) {
            fields.push(distanceSql + ' AS geodist');
        }

        return fields;
    }

    protected generateGroupByForQuery(method: string, mapper: Mapper, params: any, opts: any, query: QueryData): void {
        const tableConfig = this.getTableConfigForTable(query.table);
        let addFields = [];

        if (tableConfig.optionalGroupBy !== undefined) {
            for (const groupByConfig of tableConfig.optionalGroupBy) {
                for (const fieldName of groupByConfig.triggerParams) {
                    if (params.where.hasOwnProperty(fieldName)) {
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

    protected mapToAdapterFieldName(table, fieldName: string): string {
        switch (fieldName) {
            default:
                break;
        }

        return fieldName;
    }

    protected queryTransform(mapper, params, opts) {
        opts = opts || {};
        if (utils.isFunction(opts.queryTransform)) {
            return opts.queryTransform(mapper, params, opts);
        }
        if (utils.isFunction(mapper.queryTransform)) {
            return mapper.queryTransform(mapper, params, opts);
        }
        return params;
    }

    protected queryTransformToSql(query: QueryData): string {
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

    protected queryTransformToAdapterQuery(method: string, mapper: Mapper, params: any, opts: any): QueryData {
        const query = this.createAdapterQuery(method, mapper, params, opts);
        if (query === undefined) {
            return undefined;
        }

        const fields = this.getAdapterFields(method, mapper, params, opts, query);
        if (fields !== undefined && fields.length > 0) {
            query.fields = fields;
        }

        let spatialField = 'geodist';
        if (method === 'count') {
            spatialField = this.getSpatialSql(method, mapper, params, opts, query);
        }
        const spatialParams = this.getSpatialParams(method, mapper, params, opts, query, spatialField);
        if (spatialParams !== undefined && spatialParams.length > 0) {
            if (method === 'count') {
                query.where.push(spatialParams);
            } else {
                query.having.push(spatialParams);
            }
        }

        const sortParams = this.getSortParams(method, mapper, params, opts, query);
        if (sortParams !== undefined) {
            query.sort = sortParams;
        }

        query.from = this.getAdapterFrom(method, mapper, params, opts, query);

        this.generateGroupByForQuery(method, mapper, params, opts, query);

        return query;
    }

    protected createAdapterQuery(method: string, mapper: Mapper, params: any, opts: any): QueryData {
        // console.log('createAdapterQuery params:', params);
        // console.log('createAdapterQuery opts:', opts);

        const table = this.extractTable(method, mapper, params, opts);
        if (table === undefined || table === '') {
            return undefined;
        }

        const newParams = [];
        if (params.where) {
            for (const fieldName of Object.getOwnPropertyNames(params.where)) {
                const filter = params.where[fieldName];
                const action = Object.getOwnPropertyNames(filter)[0];
                const value = params.where[fieldName][action];
                const res = this.mapFilterToAdapterQuery(mapper, fieldName, action, value, table);
                if (res !== undefined) {
                    newParams.push(res);
                }
            }
        }
        if (params.additionalWhere) {
            for (const fieldName of Object.getOwnPropertyNames(params.additionalWhere)) {
                const filter = params.additionalWhere[fieldName];
                const action = Object.getOwnPropertyNames(filter)[0];
                const value = params.additionalWhere[fieldName][action];
                const res = this.mapFilterToAdapterQuery(mapper, fieldName, action, value, table);
                if (res !== undefined) {
                    newParams.push(res);
                }
            }
        }

        if (newParams.length <= 0) {
            const query: QueryData = {
                where: [],
                having: [],
                offset: undefined,
                limit: undefined,
                sort: [],
                table: table,
                from: 'dual',
                groupByFields: [],
                fields: []};
            if (method === 'findAll') {
                query.offset = opts.offset * opts.limit;
                query.limit = opts.limit;
            }
            return query;
        }

        const query: QueryData = {
            where: newParams,
            having: [],
            offset: undefined,
            limit: undefined,
            from: 'dual',
            table: table,
            sort: [],
            groupByFields: [],
            fields: []};
        if (method === 'findAll') {
            query.offset = opts.offset * opts.limit;
            query.limit = opts.limit;
        }
        console.log('createAdapterQuery result:', query);
        return query;
    }

    protected mapFilterToAdapterQuery(mapper: Mapper, fieldName: string, action: string, value: any, table: string): string {
        const tableConfig = this.getTableConfigForTable(table);
        let realFieldName = undefined;
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
            realFieldName = this.mapToAdapterFieldName(table, fieldName);
        }


        return this.generateFilter(mapper, realFieldName, action, value, table);
    }

    protected generateFilter(mapper: Mapper, fieldName: string, action: string, value: any, table: string): string {
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

