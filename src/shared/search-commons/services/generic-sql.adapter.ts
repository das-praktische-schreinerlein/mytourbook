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
    sort: string;
    table: string;
    from: string;
    fields: string;
    having: string[];
}

export interface TableFacetConfig {
    selectField?: string;
    selectFrom?: string;
    selectSql?: string;
    constValues?: string [];
    action: string;
}

export interface TableConfig {
    tableName: string;
    selectFrom: string;
    selectFieldList: string[];
    facetConfigs: {};
    filterMapping: {};
    fieldMapping: {};
    sortMapping: {};
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

    count(mapper: Mapper, query: any, opts?: any): Promise<number> {
        query = query || {};
        opts = opts || {};

        return super.count(mapper, query, opts);
    }

    create<T extends Record>(mapper: Mapper, props: any, opts?: any): Promise<T> {
        opts = opts || {};

        opts.adapterQuery = true;
        opts.params = this.getParams(opts);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        const query = {
            add: {
                doc: this.mapToAdapterDocument(this.extractTable('create', mapper, props, opts), props)
            },
            commit: {}
        };
        return super.create(mapper, query, opts);
    }

    createMany<T extends Record>(mapper: Mapper, props: any, opts: any): Promise<T> {
        throw new Error('createMany not implemented');
    }

    destroy(mapper: Mapper, id: string | number, opts?: any): Promise<any> {
        opts = opts || {};

        opts.adapterQuery = true;
        opts.params = this.getParams(opts);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        const query = {
            delete: {
                id: id
            },
            commit: {}
        };
        opts.adapterDeletequery = query;
        return super.destroy(mapper, id, opts);
    }

    destroyAll(mapper: Mapper, query: any, opts: any): Promise<any> {
        throw new Error('destroyAll not implemented');
    }

    find<T extends Record>(mapper: Mapper, id: string | number, opts: any): Promise<T> {
        opts = opts || {};
        return super.find(mapper, id, opts);
    }

    findAll<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<T[]> {
        query = query || {};
        opts = opts || {};

        return super.findAll(mapper, query, opts);
    }

    facets<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<Facets> {
        let op;
        query = query || {};
        opts = opts || {};

        opts.adapterFacet = true;
        const me = this;

        // beforeCount lifecycle hook
        op = opts.op = 'beforeFacets';
        return utils.resolve(this[op](mapper, query, opts))
            .then(() => {
                // Allow for re-assignment from lifecycle hook
                op = opts.op = 'count';
                this.dbg(op, mapper, query, opts);
                return this._facets(mapper, query, opts);
            })
            .then((results) => {
                let [data, result] = results;
                return utils.resolve(data);
            });
    }

    sum (mapper: Mapper, field: string, query: any, opts?: any): Promise<any> {
        throw new Error('sum not implemented');
    }

    update<T extends Record>(mapper: Mapper, id: string | number, props: any, opts: any): Promise<T> {
        opts = opts || {};

        opts.adapterQuery = true;
        opts.params = this.getParams(opts);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        const query = {
            add: {
                doc: this.mapToAdapterDocument(this.extractTable('update', mapper, props, opts), props)
            },
            commit: {}
        };
        return super.update(mapper, id, query, opts);
    }

    updateAll(mapper: Mapper, props: any, query: any, opts?: any): Promise<any> {
        throw new Error('updateAll not implemented');
    }

    updateMany<T extends Record>(mapper: Mapper, records: T[], opts?: any): Promise<any> {
        throw new Error('updateMany not implemented');
    }

    beforeFacets(mapper: Mapper, query: IDict, opts: IDict): any {
        return utils.Promise.resolve(true);
    }

    afterCount(mapper: Mapper, props: IDict, opts: any, result: any): Promise<number> {
        return utils.Promise.resolve(result);
    }

    afterCreate<T extends Record>(mapper: Mapper, props: IDict, opts: any, result: any): Promise<T> {
        return this.find(mapper, props['add']['doc']['id'], opts);
    }

    afterUpdate<T extends Record>(mapper: Mapper, id: number | string, opts: any, result: any): Promise<T> {
        return this.find(mapper, id, opts);
    }

    afterFind<T extends Record>(mapper: Mapper, id: number | string, opts: any, result: any): Promise<T> {
        if (! (Array.isArray(result))) {
            return utils.Promise.reject('generic-solr-adapter.afterFind: no array as result');
        }
        if (result.length !== 1) {
            return utils.Promise.reject('generic-solr-adapter.afterFind: result is not unique');
        }

        return utils.Promise.resolve(result[0]);
    }

    afterFacets(mapper: Mapper, props: IDict, opts: any, result: any): Promise<number> {
        return utils.Promise.resolve(result);
    }

    afterDestroy<T extends Record>(mapper: Mapper, id: number | string, opts: any, result: any): Promise<T> {
        return utils.Promise.resolve(<T>undefined);
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

    _find(mapper: Mapper, id: string | number, opts: any) {
        opts = opts || {};

        const a = true;
        if (a) { throw new Error('Not implemented'); } // TODO

        opts.adapterQuery = true;

        const me = this;
        opts.params = opts.params || {};
        opts.params.where = opts.params.where || {};
        opts.params.where.id = { '==': id};
        opts.offset = 0;
        opts.limit = 10;

        const queryData = me.queryTransformToAdapterQuery('find', mapper, {}, opts);
        if (queryData === undefined) {
            return utils.resolve([]);
        }


        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        return sqlBuilder.raw(this.queryTransformToSql(queryData));
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

                    return allResolve([facets]);
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
        const docs = result;
        if (docs.length === 1) {
            return [docs[0]['count(*)']];
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

    protected abstract getTableConfig(method: string, mapper: Mapper, params: any, opts: any, query: any): TableConfig;

    protected abstract getTableConfigForTable(table: string): TableConfig;

    protected getAdapterFrom(method: string, mapper: Mapper, params: any, opts: any, query: any): string {
        return this.getTableConfigForTable(query.table).selectFrom || '';
    }

    protected getMappingForTable(table: string): {} {
        return this.getTableConfigForTable(table).fieldMapping || {};
    }

    protected getSortParams(method: string, mapper: Mapper, params: any, opts: any, query: any): string {
        const form = opts.originalSearchForm || {};

        const tableConfig = this.getTableConfig(method, mapper, params, opts, query);
        const sortMapping = tableConfig.sortMapping;

        if (sortMapping.hasOwnProperty(form.sort)) {
            return sortMapping[form.sort];
        }

        return sortMapping['default'];
    };

    protected getSpatialParams(method: string, mapper: Mapper, params: any, opts: any, query: any, spatialField: string): string {
        const tableConfig = this.getTableConfig(method, mapper, params, opts, query);
        if (params !== undefined && params.spatial !== undefined && params.spatial.geo_loc_p !== undefined &&
            params.spatial.geo_loc_p.nearby !== undefined && tableConfig.spartialConfig !== undefined) {
            const [lat, lon, distance] = this.mapperUtils.escapeAdapterValue(params.spatial.geo_loc_p.nearby).split(/_/);
            return spatialField + ' <= ' + distance;
        }

        return undefined;
    };

    protected getSpatialSql(method: string, mapper: Mapper, params: any, opts: any, query: any): string {
        const tableConfig = this.getTableConfigForTable(query.table);
        if (params !== undefined && params.spatial !== undefined && params.spatial.geo_loc_p !== undefined &&
            params.spatial.geo_loc_p.nearby !== undefined && tableConfig.spartialConfig !== undefined) {
            const [lat, lon, distance] = this.mapperUtils.escapeAdapterValue(params.spatial.geo_loc_p.nearby).split(/_/);
            const distanceSql =
                '(3959 ' +
                ' * acos (' +
                '     cos ( radians(' + lat + ') )' +
                '     * cos( radians(' + tableConfig.spartialConfig.lat + ') )' +
                '     * cos( radians(' + tableConfig.spartialConfig.lon + ') - radians(' + lon + ') )' +
                '     + sin ( radians(' + lat + ') )' +
                '     * sin( radians(' + tableConfig.spartialConfig.lat + ') )' +
                ' )' +
                ')';
            return distanceSql;
        }

        return undefined;
    }

    protected getFacetSql(method: string, mapper: Mapper, params: any, opts: any, query: any): Map<string, string> {
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
                    facets.set(key, 'select count(*) as count, ' + facetConfig.selectField + ' as value '
                        + 'from ' + from + ' group by value order by count desc');
                } else if (facetConfig.selectSql !== undefined) {
                    facets.set(key, facetConfig.selectSql);
                } else if (facetConfig.constValues !== undefined) {
                    const sqls = [];
                    facetConfig.constValues.forEach(value => {
                        sqls.push('select 0 as count, "' + value + '" as value');
                    });

                    facets.set(key, sqls.join(' union all '));
                }
            }
        }

        return facets;
    };

    protected getAdapterFields(method: string, mapper: Mapper, params: any, opts: any, query: any): string[] {
        if (method === 'count') {
            return ['count(*)'];
        }

        const tableConfig = this.getTableConfigForTable(query.table);
        const fields = [];
        for (const field of tableConfig.selectFieldList) {
            fields.push(field);
        }

        const distanceSql = this.getSpatialSql(method, mapper, params, opts, query);
        if (distanceSql !== undefined) {
            fields.push(distanceSql + ' as geodist');
        }

        return fields;
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
    return 'select ' +
        (query.fields ? query.fields : '') + ' ' +
        'from ' + query.from + ' ' +
        (query.where && query.where.length > 0 ? 'where ' + query.where.join(' AND ') : '') + ' ' +
        (query.having && query.having.length > 0 ? 'having ' + query.having.join(' AND ') : '') + ' ' +
        (query.sort ? 'order by ' + query.sort + ' ' : '') +
        (query.limit ? 'limit ' + (query.offset || 0) + ', ' + query.limit : '');
    }

    protected queryTransformToAdapterQuery(method: string, mapper: Mapper, params: any, opts: any): QueryData {
        const query = this.createAdapterQuery(method, mapper, params, opts);
        if (query === undefined) {
            return undefined;
        }

        const fields = this.getAdapterFields(method, mapper, params, opts, query);
        if (fields !== undefined && fields.length > 0) {
            query['fields'] = fields.join(', ');
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
        console.error('sqlQuery:', query);

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
                sort: '',
                table: table,
                from: 'dual',
                fields: ''};
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
            sort: '',
            fields: ''};
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

