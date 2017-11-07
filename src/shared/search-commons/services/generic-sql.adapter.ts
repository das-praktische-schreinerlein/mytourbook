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

    constructor(config: any) {
        super(config);
        this.knex = knex(config.knexOpts);
    }

    count(mapper: Mapper, query: any, opts?: any): Promise<number> {
        query = query || {};
        opts = opts || {};

        opts.adapterQuery = true;
        opts.adapterCount = true;
        const me = this;
        query = me.queryTransformToAdapterQuery('count', mapper, query, opts);

        return super.count(mapper, query, opts);
    }

    create<T extends Record>(mapper: Mapper, props: any, opts?: any): Promise<T> {
        opts = opts || {};

        opts.adapterQuery = true;
        opts.params = this.getParams(opts);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        const query = {
            add: {
                doc: this.mapToAdapterDocument(props)
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

        opts.adapterQuery = true;
        const me = this;
        opts.params = opts.params || {};
        opts.params.where = opts.params.where || {};
        opts.params.where.id = { '==': id};
        opts.offset = 0;
        opts.limit = 10;

        return super.find(mapper, id, opts);
    }

    findAll<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<T[]> {
        query = query || {};
        opts = opts || {};

        opts.adapterQuery = true;
        const me = this;
        query = me.queryTransformToAdapterQuery('findAll', mapper, query, opts);

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

    search<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<S> {
        let op;
        query = query || {};
        opts = opts || {};

        opts.adapterQuery = true;
        opts.adapterFacet = true;
        const me = this;
        query = me.queryTransformToAdapterQuery('search', mapper, query, opts);

        opts.params = this.getParams(opts);
        opts.params.count = true;
        utils.deepMixIn(opts.params, query);
        opts.params = this.queryTransform(mapper, opts.params, opts);

        // beforeCount lifecycle hook
        op = opts.op = 'beforeSearch';
        console.error("xxxx");
        return utils.resolve(this[op](mapper, query, opts))
            .then(() => {
                // Allow for re-assignment from lifecycle hook
                op = opts.op = 'count';
                this.dbg(op, mapper, query, opts);
                return utils.resolve(this._search(mapper, query, opts));
            })
            .then((results) => {
                let [data, result] = results;
                result = result || {};
                let response = new Response(data, result, op);
                response = this.respond(response, opts);

                // afterCount lifecycle hook
                op = opts.op = 'afterSearch';
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
                doc: this.mapToAdapterDocument(props)
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

    beforeSearch(mapper: Mapper, query: IDict, opts: IDict): any {
        return utils.Promise.resolve(true);
    }

    afterSearch(mapper: Mapper, props: IDict, opts: any, result: any): Promise<S> {
        const count: number = this.extractCountFromRequestResult(mapper, result, opts);
        const records: R[] = this.extractRecordsFromRequestResult(mapper, result, opts);
        const facets: Facets = this.extractFacetsFromRequestResult(mapper, result, opts);
        const searchResult = new GenericSearchResult(undefined, count, records, facets);
        return utils.Promise.resolve(<S>searchResult);
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


    _find(mapper: Mapper, id: string | number, opts: any) {
        opts = opts || {};

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        return sqlBuilder.raw(this.queryTransformToSql(opts.query));
    };

    _findAll(mapper, query, opts) {
        query = query || {};
        opts = opts || {};

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        return sqlBuilder.raw(this.queryTransformToSql(opts.query));
    };

    _facets(mapper, query, opts) {
        query = query || {};
        opts = opts || {};

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        return sqlBuilder.raw(this.queryTransformToSql(opts.query));
    };

    _search(mapper, query, opts) {
        query = query || {};
        opts = opts || {};

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const raw = sqlBuilder.raw(this.queryTransformToSql(opts.query));
        console.error("raw:", raw);
        return raw;
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

    getPath(method: string, mapper: Mapper, id: string | number, opts: any) {
        let path = '';
        if (opts.adapterQuery) {
            path = this.getAdapterPath(method, mapper, id, opts);
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

    extractCountFromRequestResult(mapper: Mapper, result: any, opts: any): number {
        return isArray(result) ? result.length : 0;
    }

    extractRecordsFromRequestResult(mapper: Mapper, result: any, opts: any): R[] {
        if (!isArray(result)) {
            return [];
        }

        // got documents
        const docs = result;
        const records = [];
        for (const doc of docs) {
            records.push(this.mapResponseDocument(mapper, doc, opts));
        }
        console.log('extractRecordsFromRequestResult:', records);

        return records;
    }

    extractFacetsFromRequestResult(mapper: Mapper, result: any, opts: any): Facets {
        return new Facets();
    }


    mapResponseDocument(mapper: Mapper, doc: any, opts: any): Record {
        const values = {};
        values['id'] = Number(this.getAdapterValue(doc, 'id', undefined));
        // console.log('mapResponseDocument values:', values);
        return mapper.createRecord(values);
    }

    // TODO
    getAdapterPath(method: string, mapper: Mapper, id: string | number, opts: any) {
        const path = '';
        console.log('solrurl:', path);
        return path;
    }

    mapToAdapterFieldName(fieldName: string): string {
        switch (fieldName) {
            default:
                break;
        }

        return fieldName;
    }

    abstract mapToAdapterDocument(props: any): any;

    abstract getAdapterFields(method: string, mapper: Mapper, params: any, opts: any): string[];

    abstract getFacetParams(method: string, mapper: Mapper, params: any, opts: any, query: any): Map<string, any>;

    abstract getSpatialParams(method: string, mapper: Mapper, params: any, opts: any, query: any): Map<string, any>;

    abstract getSortParams(method: string, mapper: Mapper, params: any, opts: any, query: any): Map<string, any>;

    getAdapterValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): string {
        let value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            } else {
                value = adapterDocument[adapterFieldName];
            }
        }

        return value;
    }

    getAdapterCoorValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): string {
        let value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            } else if (adapterDocument[adapterFieldName] !== '0' && adapterDocument[adapterFieldName] !== '0,0') {
                value = adapterDocument[adapterFieldName];
            }
        }

        return value;
    }

    buildUrl(url, params) {
        if (!params) {
            return url;
        }

        const parts = [];

        utils.forOwn(params, function (val, key) {
            if (val === null || typeof val === 'undefined') {
                return;
            }
            if (!utils.isArray(val)) {
                val = [val];
            }

            val.forEach(function (v) {
                if (typeof window !== 'undefined' && window.toString.call(v) === '[object Date]') {
                    v = v.toISOString().trim();
                } else if (utils.isObject(v)) {
                    v = utils.toJson(v).trim();
                }
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(v));
            });
        });

        if (parts.length > 0) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + parts.join('&');
        }

        return url;
    }

    queryTransform(mapper, params, opts) {
        opts = opts || {};
        if (utils.isFunction(opts.queryTransform)) {
            return opts.queryTransform(mapper, params, opts);
        }
        if (utils.isFunction(mapper.queryTransform)) {
            return mapper.queryTransform(mapper, params, opts);
        }
        return params;
    }

    private queryTransformToSql(query: any): string {
        console.error("query:", query);
/**
        const table = this.getPath(query);
        const fields = this.getAdapterFields('find', mapper, id, opts);
        return this.filterQuery(this.selectTable(mapper, opts), query, opts).then((rows) => [rows || [], {}]);
        return 'select ' + query.from + ' ' + query.where + ''
 **/
    return 'select * from image limit 10';
    }

    private queryTransformToAdapterQuery(method: string, mapper: Mapper, params: any, opts: any): any {
        console.error("nmethod:" + method, params);
        const query = this.createAdapterQuery(method, mapper, params, opts);


        const fields = this.getAdapterFields(method, mapper, params, opts);
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

        console.log('sqlQuery:', query);

        return query;
    }

    private createAdapterQuery(method: string, mapper: Mapper, params: any, opts: any): any {
        // console.log('createAdapterQuery params:', params);
        // console.log('createAdapterQuery opts:', opts);

        const newParams = [];
        if (params.where) {
            for (const fieldName of Object.getOwnPropertyNames(params.where)) {
                const filter = params.where[fieldName];
                const action = Object.getOwnPropertyNames(filter)[0];
                const value = params.where[fieldName][action];
                newParams.push(this.mapFilterToAdapterQuery(mapper, fieldName, action, value));
            }
        }
        if (params.additionalWhere) {
            for (const fieldName of Object.getOwnPropertyNames(params.additionalWhere)) {
                const filter = params.additionalWhere[fieldName];
                const action = Object.getOwnPropertyNames(filter)[0];
                const value = params.additionalWhere[fieldName][action];
                newParams.push(this.mapFilterToAdapterQuery(mapper, fieldName, action, value));
            }
        }

        if (newParams.length <= 0) {
            const query = {
                'where': '',
                'offset': opts.offset * opts.limit,
                'limit': opts.limit,
                'sort': '',
                'fields': ''};
            console.log('createAdapterQuery result:', query);
            return query;
        }

        const query = {
            'where': newParams,
            'offset': opts.offset * opts.limit,
            'limit': opts.limit,
            'sort': '',
            'fields': ''};
        console.log('createAdapterQuery result:', query);
        return query;
    }

    private mapFilterToAdapterQuery(mapper: Mapper, fieldName: string, action: string, value: any): string {
        let query = '';

        if (action === AdapterFilterActions.LIKEI || action === AdapterFilterActions.LIKE) {
            query = this.mapToAdapterFieldName(fieldName) + ':("' + this.prepareEscapedSingleValue(value, ' ', '" AND "') + '")';
        } else if (action === AdapterFilterActions.EQ1 || action === AdapterFilterActions.EQ2) {
            query = this.mapToAdapterFieldName(fieldName) + ':("' + this.prepareEscapedSingleValue(value, ' ', '') + '")';
        } else if (action === AdapterFilterActions.GT) {
            query = this.mapToAdapterFieldName(fieldName) + ':{"' + this.prepareEscapedSingleValue(value, ' ', '') + '" TO *}';
        } else if (action === AdapterFilterActions.GE) {
            query = this.mapToAdapterFieldName(fieldName) + ':["' + this.prepareEscapedSingleValue(value, ' ', '') + '" TO *]';
        } else if (action === AdapterFilterActions.LT) {
            query = this.mapToAdapterFieldName(fieldName) + ':{ * TO "' + this.prepareEscapedSingleValue(value, ' ', '') + '"}';
        } else if (action === AdapterFilterActions.LE) {
            query = this.mapToAdapterFieldName(fieldName) + ':[ * TO "' + this.prepareEscapedSingleValue(value, ' ', '') + '"]';
        } else if (action === AdapterFilterActions.IN) {
            query = this.mapToAdapterFieldName(fieldName) + ':("' + value.map(
                    inValue => this.escapeAdapterValue(inValue.toString())
                ).join('" OR "') + '")';
        } else if (action === AdapterFilterActions.NOTIN) {
            query = this.mapToAdapterFieldName(fieldName) + ':(-"' + value.map(
                    inValue => this.escapeAdapterValue(inValue.toString())
                ).join('" AND -"') + '")';
        }
        return query;
    }

    prepareEscapedSingleValue(value: any, splitter: string, joiner: string): string {
        value = this.prepareSingleValue(value, ' ');
        value = this.escapeAdapterValue(value);
        const values = this.prepareValueToArray(value, splitter);
        value = values.map(inValue => this.escapeAdapterValue(inValue)).join(joiner);
        return value;
    }

    private prepareSingleValue(value: any, joiner: string): string {
        switch (typeof value) {
            case 'string':
                return value.toString();
            case 'number':
                return '' + value;
            default:
        }
        if (Array.isArray(value)) {
            return value.join(joiner);
        }

        return value.toString();
    }

    private prepareValueToArray(value: any, splitter: string): string[] {
        return value.toString().split(splitter);
    }

    private escapeAdapterValue(value: any): string {
        value = value.toString().replace(/[%]/g, ' ').replace(/[:\()\[\]\\]/g, ' ').replace(/[ ]+/, ' ').trim();
        return value;
    }

    private splitPairs(arr: Array<any>): Array<Array<any>> {
        const pairs = [];
        for (let i = 0; i < arr.length; i += 2) {
            if (arr[i + 1] !== undefined) {
                pairs.push([arr[i], arr[i + 1]]);
            } else {
                pairs.push([arr[i]]);
            }
        }
        return pairs;
    }
}

