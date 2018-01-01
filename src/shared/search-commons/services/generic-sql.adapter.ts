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
import {AdapterOpts, AdapterQuery, MapperUtils} from './mapper.utils';
import {GenericAdapterResponseMapper} from './generic-adapter-response.mapper';
import {QueryData, SqlQueryBuilder, TableConfig} from './sql-query.builder';

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
    protected sqlQueryBuilder: SqlQueryBuilder = new SqlQueryBuilder();
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
        opts.queryData = queryData;

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const raw = sqlBuilder.raw(this.queryTransformToSql(queryData));
        const result = new Promise((resolve, reject) => {
            raw.then(function doneSearch(dbresults: any) {
                    let [dbdata, dbresult] = dbresults;
                    dbresult = dbresult || {};
                    let response = new Response(dbdata, dbresult, 'count');
                    response = me.respond(response, opts);
                    const count = me.extractCountFromRequestResult(response);
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
        opts.queryData = queryData;

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const raw = sqlBuilder.raw(this.queryTransformToSql(queryData));
        const result = new Promise((resolve, reject) => {
            raw.then(function doneSearch(dbresults: any) {
                let [dbdata, dbresult] = dbresults;
                dbresult = dbresult || {};
                let response = new Response(dbdata, dbresult, 'count');
                response = me.respond(response, opts);

                const records: R[] = me.extractRecordsFromRequestResult(mapper, response, queryData);
                return utils.resolve(records);
            }).then(function doneSearch(records: R[]) {
                return me.loadDetailData('findAll', mapper, query, opts, records);
            }).then(function doneSearch(records: R[]) {
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

        const tableConfig = this.getTableConfig(<AdapterQuery>query);
        const facetConfigs = tableConfig.facetConfigs;
        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const result = new Promise((allResolve, allReject) => {
            const queries = me.getFacetSql(<AdapterQuery>query, <AdapterOpts>opts);
            const promises = [];
            queries.forEach((value, key) => {
                const raw = sqlBuilder.raw(value);
                promises.push(new Promise((resolve, reject) => {
                    raw.then(function doneSearch(dbresults: any) {
                            let [dbdata, dbresult] = dbresults;
                            dbresult = dbresult || {};
                            let response = new Response(dbdata, dbresult, 'count');
                            response = me.respond(response, opts);
                            const facet: Facet = me.extractFacetFromRequestResult(response);
                            if (facetConfigs[key] && facetConfigs[key].selectLimit > 0) {
                                facet.selectLimit = facetConfigs[key].selectLimit;
                            }

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
            return this.extractCountFromRequestResult(response.data);
        }

        // facet
        if (opts.adapterFacet) {
            return this.extractFacetFromRequestResult(response.data);
        }

        return this.extractRecordsFromRequestResult(mapper, response.data, <QueryData>opts.queryData);

    }

    extractCountFromRequestResult(result: any): [number] {
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

    extractRecordsFromRequestResult(mapper: Mapper, result: any, queryData: QueryData): R[] {
        if (!isArray(result)) {
            return [];
        }

        // got documents
        const docs = result;
        const records = [];
        for (const doc of docs) {
            records.push(this.mapResponseDocument(mapper, doc, queryData.tableConfig));
        }

        return records;
    }

    extractFacetFromRequestResult(result: any): Facet {
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


    mapResponseDocument(mapper: Mapper, doc: any, tableConfig: TableConfig): Record {
        return this.mapper.mapResponseDocument(mapper, doc, tableConfig.fieldMapping);
    }

    mapToAdapterDocument(tableConfig: TableConfig, props: any): any {
        return this.mapper.mapToAdapterDocument(tableConfig.fieldMapping, props);
    }

    loadDetailData(method: string, mapper: Mapper, params: any, opts: any, records: R[]): Promise<R[]> {
        const tableConfig = this.getTableConfig(<AdapterQuery>params);
        const loadDetailDataConfigs = tableConfig.loadDetailData;
        if (loadDetailDataConfigs === undefined || loadDetailDataConfigs.length <= 0 || records.length <= 0) {
            return utils.resolve(records);
        }

        const me = this;
        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const result: Promise<R[]> = new Promise((allResolve, allReject) => {
            const promises = [];
            records.forEach(record => {
                loadDetailDataConfigs.forEach((loadDetailDataConfig) => {
                    let sql = loadDetailDataConfig.sql;
                    loadDetailDataConfig.parameterNames.forEach(parameterName => {
                        let value = this.mapperUtils.prepareSingleValue(record[parameterName], '_');
                        if (value !== undefined && parameterName === 'id') {
                            value = value.replace(/.*_/, '');
                        }
                        sql = sql.replace(':' + parameterName, value);
                    });
                    const raw = sqlBuilder.raw(sql);
                    promises.push(new Promise((resolve, reject) => {
                        raw.then(function doneSearch(dbresults: any) {
                            return resolve([loadDetailDataConfig.profile, record, dbresults[0]]);
                        },
                        function errorSearch(reason) {
                            console.error('loadDetailData failed:' + reason);

                            return reject(reason);
                        });
                    }));
                });
            });

            Promise.all(promises).then(function doneSearch(loadDetailsResults: any[]) {
                loadDetailsResults.forEach(loadDetailsResult => {
                    const [profile, record, dbresults] = loadDetailsResult;
                    me.mapper.mapDetailDataToAdapterDocument(mapper, profile, record, dbresults);
                });
                return allResolve(records);
            }).catch(function errorSearch(reason) {
                console.error('loadDetailData failed:' + reason);
                return allReject(reason);
            });
        });

        return result;
    }

    protected abstract extractTable(params: AdapterQuery): string;

    protected abstract getTableConfig(params: AdapterQuery): TableConfig;

    protected getFacetSql(adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): Map<string, string> {
        const tableConfig = this.getTableConfig(adapterQuery);
        return this.sqlQueryBuilder.getFacetSql(tableConfig, adapterOpts);
    };

    protected queryTransformToSql(query: QueryData): string {
        return this.sqlQueryBuilder.queryTransformToSql(query);
    }

    protected queryTransformToAdapterQuery(method: string, mapper: Mapper, params: any, opts: any): QueryData {
        const tableConfig = this.getTableConfig(<AdapterQuery>params);
        return this.sqlQueryBuilder.queryTransformToAdapterQuery(tableConfig, method, <AdapterQuery>params, <AdapterOpts>opts);
    }
}

