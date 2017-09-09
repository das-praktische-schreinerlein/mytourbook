import {IDict} from 'js-data-http';
import {Mapper, Record, utils} from 'js-data';
import {Facet, Facets} from '../model/container/facets';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import {GenericSearchHttpAdapter, Response} from './generic-search-http.adapter';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

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

export abstract class GenericSolrAdapter <R extends Record, F extends GenericSearchForm,
    S extends GenericSearchResult<R, F>> extends GenericSearchHttpAdapter<R, F, S> {

    constructor(config: any) {
        super(config);
    }

    count(mapper: Mapper, query: any, opts?: any): Promise<number> {
        query = query || {};
        opts = opts || {};

        opts.endpoint = this.getHttpEndpoint('count');
        opts.adapterQuery = true;
        opts.adapterCount = true;
        const me = this;
        opts['queryTransform'] = function(...args) { return me.queryTransformToAdapterQuery.apply(me, args); };

        return super.count(mapper, query, opts);
    }

    create<T extends Record>(mapper: Mapper, props: any, opts?: any): Promise<T> {
        opts = opts || {};

        opts.endpoint = this.getHttpEndpoint('create');
        opts.adapterQuery = true;
        opts.params = this.getParams(opts);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        opts.suffix = this.getSuffix(mapper, opts);
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

        opts.endpoint = this.getHttpEndpoint('destroy');
        opts.adapterQuery = true;
        opts.params = this.getParams(opts);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        opts.suffix = this.getSuffix(mapper, opts);
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

        opts.endpoint = this.getHttpEndpoint('find');
        opts.adapterQuery = true;
        const me = this;
        opts.params = opts.params || {};
        opts.params.where = opts.params.where || {};
        opts.params.where.id = { '==': id};
        opts.offset = 0;
        opts.limit = 10;
        opts['queryTransform'] = function(...args) { return me.queryTransformToAdapterQuery.apply(me, args); };

        return super.find(mapper, id, opts);
    }

    findAll<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<T[]> {
        query = query || {};
        opts = opts || {};

        opts.endpoint = this.getHttpEndpoint('findAll');
        opts.adapterQuery = true;
        const me = this;
        opts['queryTransform'] = function(...args) { return me.queryTransformToAdapterQuery.apply(me, args); };

        return super.findAll(mapper, query, opts);
    }

    facets<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<Facets> {
        let op;
        query = query || {};
        opts = opts || {};

        opts.endpoint = this.getHttpEndpoint('findAll');
        opts.adapterQuery = true;
        opts.adapterFacet = true;
        const me = this;
        opts['queryTransform'] = function(...args) { return me.queryTransformToAdapterQuery.apply(me, args); };

        opts.params = this.getParams(opts);
        opts.params.count = true;
        opts.suffix = this.getSuffix(mapper, opts);
        utils.deepMixIn(opts.params, query);
        opts.params = this.queryTransform(mapper, opts.params, opts);

        // beforeCount lifecycle hook
        op = opts.op = 'beforeFacets';
        return utils.resolve(this[op](mapper, query, opts))
            .then(() => {
                // Allow for re-assignment from lifecycle hook
                op = opts.op = 'count';
                this.dbg(op, mapper, query, opts);
                return utils.resolve(this._count(mapper, query, opts));
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

        opts.endpoint = this.getHttpEndpoint('findAll');
        opts.adapterQuery = true;
        opts.adapterFacet = true;
        const me = this;
        opts['queryTransform'] = function(...args) { return me.queryTransformToAdapterQuery.apply(me, args); };

        opts.params = this.getParams(opts);
        opts.params.count = true;
        opts.suffix = this.getSuffix(mapper, opts);
        utils.deepMixIn(opts.params, query);
        opts.params = this.queryTransform(mapper, opts.params, opts);

        // beforeCount lifecycle hook
        op = opts.op = 'beforeSearch';
        return utils.resolve(this[op](mapper, query, opts))
            .then(() => {
                // Allow for re-assignment from lifecycle hook
                op = opts.op = 'count';
                this.dbg(op, mapper, query, opts);
                return utils.resolve(this._count(mapper, query, opts));
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

        opts.endpoint = this.getHttpEndpoint('update');
        opts.adapterQuery = true;
        opts.params = this.getParams(opts);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        opts.suffix = this.getSuffix(mapper, opts);
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

    afterSearch(mapper: Mapper, props: IDict, opts: any, result: any): Promise<S> {
        const count: number = this.extractCountFromRequestResult(mapper, result);
        const records: R[] = this.extractRecordsFromRequestResult(mapper, result);
        const facets: Facets = this.extractFacetsFromRequestResult(mapper, result);
        const searchResult = new GenericSearchResult(undefined, count, records, facets);
        return utils.Promise.resolve(searchResult);
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
        return utils.Promise.resolve(<Record>undefined);
    }

    _create (mapper: Mapper, props: any, opts: any) {
        let url = this.getPath('create', mapper, props, opts);
        url = url + '&stream.body=' + encodeURIComponent(JSON.stringify(props));
        opts.contentType = 'application/json';
        return this.GET(
            url,
            opts
        ).then((response) => this._end(mapper, opts, response));
    }

    _destroy (mapper: Mapper, id: string | number, opts: any) {
        let url = this.getPath('delete', mapper, id, opts);
        url = url + '&stream.body=' + encodeURIComponent(JSON.stringify(opts.adapterDeletequery));
        opts.contentType = 'application/json';
        return this.GET(
            url,
            opts
        ).then((response) => this._end(mapper, opts, response));
    }

    _update (mapper: Mapper, id: string | number, props: any, opts: any) {
        let url = this.getPath('update', mapper, id, opts);
        url = url + '&stream.body=' + encodeURIComponent(JSON.stringify(props));
        opts.contentType = 'application/json';
        return this.GET(
            url,
            opts
        ).then((response) => this._end(mapper, opts, response));
    }

    deserialize(mapper: Mapper, response: any, opts: any) {
        if (opts.adapterQuery) {
            if (response && (typeof response.data === 'string') && response.data.startsWith('JSONP_CALLBACK(')) {
                const json = response.data.substring('JSONP_CALLBACK('.length, response.data.length - 2);
                response.data = JSON.parse(json);
            }

            return this.deserializeResponse(mapper, response, opts);
        }

        // do default behavior
        return super.deserialize(mapper, response, opts);
    }

    getPath(method: string, mapper: Mapper, id: string | number, opts: any) {
        let path: string;
        if (opts.adapterQuery) {
            path = this.getAdapterPath(method, mapper, id, opts);
        } else {
            path = super.getPath(method, mapper, id, opts);
        }
        return path;
    }

    deserializeResponse(mapper: Mapper, response: any, opts: any) {
        // console.log('deserializeResponse:', response);

        // check response
        if (response === undefined) {
            return super.deserialize(mapper, response, opts);
        }
        if (response.data === undefined) {
            return super.deserialize(mapper, response, opts);
        }

        // check for adapter-response
        if (response.data.responseHeader === undefined) {
            return super.deserialize(mapper, response, opts);
        }
        if (response.data.responseHeader.status !== 0) {
            return undefined;
        }
        if (response.data.response === undefined) {
            return undefined;
        }

        // count
        if (opts.adapterCount) {
            return this.extractCountFromRequestResult(mapper, response.data);
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

            return this.extractFacetsFromRequestResult(mapper, response.data);
        }

        // search records
        if (response.data.response.docs === undefined) {
            return undefined;
        }

        return this.extractRecordsFromRequestResult(mapper, response.data);

    }

    extractCountFromRequestResult(mapper: Mapper, result: any): number {
        return result.response.numFound;
    }

    extractRecordsFromRequestResult(mapper: Mapper, result: any): R[] {
        // got documents
        const docs = result.response.docs;
        const records = [];
        for (const doc of docs) {
            records.push(this.mapResponseDocument(mapper, doc));
        }
        // console.log('extractRecordsFromRequestResult:', records);

        return records;
    }

    extractFacetsFromRequestResult(mapper: Mapper, result: any): Facets {
        if (result.facet_counts === undefined ||
            result.facet_counts.facet_fields === undefined) {
            return new Facets();
        }

        const facets = new Facets();
        for (const field in result.facet_counts.facet_fields) {
            const values = this.splitPairs(result.facet_counts.facet_fields[field]);
            const facet = new Facet();
            facet.facet = values;
            facets.facets.set(field, facet);
        }

        return facets;
    }


    mapResponseDocument(mapper: Mapper, doc: any): Record {
        const values = {};
        values['id'] = Number(this.getAdapterValue(doc, 'id', undefined));
        // console.log('mapResponseDocument values:', values);
        return mapper.createRecord(values);
    }

    getAdapterPath(method: string, mapper: Mapper, id: string | number, opts: any) {
        let path = [
            opts.basePath === undefined ? (mapper['basePath'] === undefined ? this['basePath'] : mapper['basePath']) : opts.basePath,
            this.getEndpoint(mapper, null, opts)
        ].join('/').replace(/([^:\/]|^)\/{2,}/g, '$1/');
        path = this.buildUrl(path, opts.params);
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

    abstract getAdapterFields(mapper: Mapper, params: any, opts: any): string[];

    abstract getFacetParams(mapper: Mapper, params: any, opts: any, query: any): Map<string, any>;

    abstract getSpatialParams(mapper: Mapper, params: any, opts: any, query: any): Map<string, any>;

    abstract getSortParams(mapper: Mapper, params: any, opts: any, query: any): Map<string, any>;

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

    private queryTransformToAdapterQuery(mapper: Mapper, params: any, opts: any): any {
        const query = this.createAdapterQuery(mapper, params, opts);

        const fields = this.getAdapterFields(mapper, params, opts);
        if (fields !== undefined && fields.length > 0) {
            query.fl = fields.join(' ');
        }

        const facetParams = this.getFacetParams(mapper, params, opts, query);
        if (facetParams !== undefined && facetParams.size > 0) {
            facetParams.forEach(function (value, key) {
                query[key] = value;
            });
        }

        const spatialParams = this.getSpatialParams(mapper, params, opts, query);
        if (spatialParams !== undefined && spatialParams.size > 0) {
            spatialParams.forEach(function (value, key) {
                query[key] = value;
            });
        }

        const sortParams = this.getSortParams(mapper, params, opts, query);
        if (sortParams !== undefined && sortParams.size > 0) {
            sortParams.forEach(function (value, key) {
                query[key] = value;
            });
        }

        console.log('solQuery:', query);

        return query;
    }

    private createAdapterQuery(mapper: Mapper, params: any, opts: any): any {
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
            const query = {'q': '*:*', 'start': opts.offset * opts.limit, 'rows': opts.limit};
            // console.log('createAdapterQuery result:', query);
            return query;
        }

        const query = {'q': '(' + newParams.join(' AND ') + ')', 'start': opts.offset * opts.limit, 'rows': opts.limit};
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

