import {IDict} from 'js-data-http';
import {Mapper, Record, utils} from 'js-data';
import {Facet, Facets} from '../model/container/facets';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {Adapter} from 'js-data-adapter';
import knex from 'knex';
import toString from 'lodash.tostring';
import {GenericSearchAdapter} from './generic-search.adapter';
import {isArray} from 'util';
import {MapperUtils} from './mapper.utils';

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
    static NOTIN = 'notin';
}

export function Response (data, meta, op) {
    meta = meta || {};
    this.data = data;
    utils.fillIn(this, meta);
    this.op = op;
}

export abstract class GenericSqlAdapter <R extends Record, F extends GenericSearchForm,
    S extends GenericSearchResult<R, F>> extends Adapter {
    protected knex: any;
    protected mapperUtils = new MapperUtils();

    constructor(config: any) {
        super(config);
        this.knex = knex(config.knexOpts);
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

        opts.adapterQuery = true;
        opts.adapterFacet = true;
        const me = this;
        query = this.queryTransform(mapper, query, opts);

        opts.params = this.getParams(opts);
        opts.params.count = true;
        utils.deepMixIn(opts.params, query);
        opts.params = this.queryTransform(mapper, opts.params, opts);

        // beforeCount lifecycle hook
        op = opts.op = 'beforeFacets';
        return utils.resolve(this[op](mapper, query, opts))
            .then(() => {
                // Allow for re-assignment from lifecycle hook
                op = opts.op = 'count';
                this.dbg(op, mapper, query, opts);
                return utils.resolve(this._facets(mapper, query, opts));
            })
            .then((results) => {
                let [data, result] = results;
                result = result || {};
                let response = new Response(data, result, op);
                response = this.respond(response, opts);

                // afterCount lifecycle hook
                op = opts.op = 'afterFacets';
                return utils.resolve(this[op](mapper, query, opts, response))
                    .then((_response) => _response === undefined ? response : _response);
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

    afterDestroy<T extends Record>(mapper: Mapper, id: number | string, opts: any, result: any): Promise<T> {
        return utils.Promise.resolve(<T>undefined);
    }

    _count(mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.query = opts.query || query;

        opts.adapterQuery = true;
        const me = this;
        query = me.queryTransformToAdapterQuery('count', mapper, query, opts);
        if (query === undefined) {
            return utils.resolve([0]);
        }
        opts.query = query;

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const raw = sqlBuilder.raw(this.queryTransformToSql(query));
        const result = new Promise((resolve, reject) => {
            raw.then(function doneSearch(dbresults: any) {
                    let [dbdata, dbresult] = dbresults;
                    dbresult = dbresult || {};
                    let response = new Response(dbdata, dbresult, 'count');
                    response = me.respond(response, opts);
                    const count = me.extractCountFromRequestResult(mapper, response, opts);
                    return resolve(count);
                },
                function errorSearch(reason) {
                    console.error('_count failed:' + reason);
                    return reject(reason);
                });
        });

        return result;
    };

    _find(mapper: Mapper, id: string | number, opts: any) {
        opts = opts || {};

        opts.adapterQuery = true;
        const me = this;
        opts.params = opts.params || {};
        opts.params.where = opts.params.where || {};
        opts.params.where.id = { '==': id};
        opts.offset = 0;
        opts.limit = 10;

        const query = me.queryTransformToAdapterQuery('find', mapper, {}, opts);
        if (query === undefined) {
            return utils.resolve([]);
        }

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        return sqlBuilder.raw(this.queryTransformToSql(query));
    };

    _findAll(mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.query = opts.query || query;

        opts.adapterQuery = true;
        const me = this;
        query = me.queryTransformToAdapterQuery('findAll', mapper, query, opts);
        if (query === undefined) {
            return utils.resolve([[]]);
        }
        opts.query = query;

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const raw = sqlBuilder.raw(this.queryTransformToSql(query));
        const result = new Promise((resolve, reject) => {
            raw.then(function doneSearch(dbresults: any) {
                    let [dbdata, dbresult] = dbresults;
                    dbresult = dbresult || {};
                    let response = new Response(dbdata, dbresult, 'count');
                    response = me.respond(response, opts);

                    const records: R[] = me.extractRecordsFromRequestResult(mapper, response, opts);
                    return resolve([records]);
                },
                function errorSearch(reason) {
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
        return utils.resolve({});

//        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
//        return sqlBuilder.raw(this.queryTransformToSql(opts.query));
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

    getPath(method: string, mapper: Mapper, id: string | number, opts: any, query: any) {
        let path = '';
        if (opts.adapterQuery) {
            path = this.getAdapterPath(method, mapper, id, opts, query);
        }
        return path;
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

        // check for adapter-response
        if (response.data.responseHeader === undefined) {
            return this.deserializeCommon(mapper, response, opts);
        }
        if (response.data.responseHeader.status !== 0) {
            return undefined;
        }
        if (response.data.response === undefined) {
            return undefined;
        }

        // count
        if (opts.adapterCount) {
            return this.extractCountFromRequestResult(mapper, response.data, opts);
        }

        // facet
        if (opts.adapterFacet) {
            if (response.data.facet_counts === undefined) {
                return undefined;
            }
            if (response.data.facet_counts.facet_queries === undefined) {
                return undefined;
            }
            if (response.data.facet_counts.facet_queries.facet_fields === undefined) {
                return undefined;
            }

            return this.extractFacetsFromRequestResult(mapper, response.data, opts);
        }

        // search records
        if (response.data.response.docs === undefined) {
            return undefined;
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

    extractFacetsFromRequestResult(mapper: Mapper, result: any, opts: any): Facets {
        return new Facets();
    }


    mapResponseDocument(mapper: Mapper, doc: any, table: string, opts: any): Record {
        const values = {};
        values['id'] = Number(this.mapperUtils.getAdapterValue(doc, 'id', undefined));
        // console.log('mapResponseDocument values:', values);
        return mapper.createRecord(values);
    }

    protected abstract mapToAdapterDocument(table: string, props: any): any;

    protected abstract extractTable(method: string, mapper: Mapper, params: any, opts: any): string;

    protected abstract getAdapterFields(method: string, mapper: Mapper, params: any, opts: any, query: any): string[];

    protected abstract getAdapterFrom(method: string, mapper: Mapper, params: any, opts: any, query: any): string[];

    protected abstract getFacetParams(method: string, mapper: Mapper, params: any, opts: any, query: any): Map<string, any>;

    protected abstract getSpatialParams(method: string, mapper: Mapper, params: any, opts: any, query: any): Map<string, any>;

    protected abstract getSortParams(method: string, mapper: Mapper, params: any, opts: any, query: any): Map<string, any>;

    protected abstract getAdapterPath(method: string, mapper: Mapper, id: string | number, opts: any, query: any): string

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

    protected queryTransformToSql(query: any): string {
        /**
        return this.filterQuery(this.selectTable(mapper, opts), query, opts).then((rows) => [rows || [], {}]);
        return 'select ' + query.from + ' ' + query.where + ''
 **/
    return 'select ' +
        (query.fields ? query.fields : '') + ' ' +
        'from ' + query.from + ' ' +
        (query.where && query.where.length > 0 ? 'where ' + query.where.join(' AND ') : '') + ' ' +
        (query.limit ? 'limit ' + (query.offset || 0) + ', ' + query.limit : '');
    }

    protected queryTransformToAdapterQuery(method: string, mapper: Mapper, params: any, opts: any): any {
        const query = this.createAdapterQuery(method, mapper, params, opts);
        if (query === undefined) {
            return undefined;
        }

        const fields = this.getAdapterFields(method, mapper, params, opts, query);
        if (fields !== undefined && fields.length > 0) {
            query['fields'] = fields.join(', ');
        }

        const facetParams = this.getFacetParams(method, mapper, params, opts, query);
        if (facetParams !== undefined && facetParams.size > 0) {
            facetParams.forEach(function (value, key) {
                // TODO query[key] = value;
            });
        }

        const spatialParams = this.getSpatialParams(method, mapper, params, opts, query);
        if (spatialParams !== undefined && spatialParams.size > 0) {
            spatialParams.forEach(function (value, key) {
                // TODO query[key] = value;
            });
        }

        const sortParams = this.getSortParams(method, mapper, params, opts, query);
        if (sortParams !== undefined && sortParams.size > 0) {
            sortParams.forEach(function (value, key) {
                query['sort'] += ' ' + key + ' ' + value;
            });
        }

        query['from'] = this.getAdapterFrom(method, mapper, params, opts, query);

        console.error('sqlQuery:', query);

        return query;
    }

    protected createAdapterQuery(method: string, mapper: Mapper, params: any, opts: any): any {
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
            const query = {
                'where': '',
                'offset': undefined,
                'limit': undefined,
                'sort': '',
                'table': table,
                'from': 'dual',
                'fields': ''};
            if (method === 'findAll') {
                query.offset = opts.offset * opts.limit;
                query.limit = opts.limit;
            }
            console.error('createAdapterQuery result:', query);
            return query;
        }

        const query = {
            'where': newParams,
            'offset': undefined,
            'limit': undefined,
            'from': 'dual',
            'table': table,
            'sort': '',
            'fields': ''};
        if (method === 'findAll') {
            query.offset = opts.offset * opts.limit;
            query.limit = opts.limit;
        }
        console.log('createAdapterQuery result:', query);
        return query;
    }

    protected mapFilterToAdapterQuery(mapper: Mapper, fieldName: string, action: string, value: any, table: string): string {
        let query = '';

        if (action === AdapterFilterActions.LIKEI || action === AdapterFilterActions.LIKE) {
            query = this.mapToAdapterFieldName(table, fieldName) + ' like "%'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '%", "%') + '%" ';
        } else if (action === AdapterFilterActions.EQ1 || action === AdapterFilterActions.EQ2) {
            query = this.mapToAdapterFieldName(table, fieldName) + ' = "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '", "') + '" ';
        } else if (action === AdapterFilterActions.GT) {
            query = this.mapToAdapterFieldName(table, fieldName) + ' > "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '"';
        } else if (action === AdapterFilterActions.GE) {
            query = this.mapToAdapterFieldName(table, fieldName) + ' >= "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '"';
        } else if (action === AdapterFilterActions.LT) {
            query = this.mapToAdapterFieldName(table, fieldName) + ' < "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '"';
        } else if (action === AdapterFilterActions.LE) {
            query = this.mapToAdapterFieldName(table, fieldName) + ' <= "'
                + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '"';
        } else if (action === AdapterFilterActions.IN) {
            query = this.mapToAdapterFieldName(table, fieldName) + ' in ("' + value.map(
                    inValue => this.mapperUtils.escapeAdapterValue(inValue.toString())
                ).join('", "') + '")';
        } else if (action === AdapterFilterActions.NOTIN) {
            query = this.mapToAdapterFieldName(table, fieldName) + ' not in ("' + value.map(
                    inValue => this.mapperUtils.escapeAdapterValue(inValue.toString())
                ).join('", W"') + '")';
        }
        return query;
    }
}

