import {HttpAdapter, IDict} from 'js-data-http';
import {Mapper, Record, utils} from 'js-data';
import {Headers, Jsonp, RequestOptionsArgs} from '@angular/http';
import {Facet, Facets} from '../model/container/facets';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

function Response (data, meta, op) {
    meta = meta || {};
    this.data = data;
    utils.fillIn(this, meta);
    this.op = op;
}

export abstract class GenericSolrAdapter <R extends Record, F extends GenericSearchForm,
    S extends GenericSearchResult<R, F>> extends HttpAdapter {
    static configureSolrHttpProvider(jsonP: Jsonp): any {
        return function makeHttpRequest(httpConfig) {
            const headers: Headers = new Headers();
            headers.append('Content-Type', (httpConfig.contentType ? httpConfig.contentType : 'application/x-www-form-urlencoded'));

            const requestConfig: RequestOptionsArgs = {
                method: httpConfig.method.toLowerCase(),
                url: httpConfig.url,
                body: httpConfig.data,
                headers: headers
            };

            console.log('makeHttpRequest:', httpConfig);
            let result, request;
            request = jsonP.get(httpConfig.url, requestConfig);
            result = request.map((res) => {
                    console.log('response makeHttpRequest:' + httpConfig.url, res);
                    const json = res.json();
                    return {
                        headers: res.headers,
                        method: httpConfig.method,
                        data: json,
                        status: res.status,
                        statusMsg: res.statusText
                    };
                },
                (error) => {
                    console.error('error makeHttpRequest:' + httpConfig.url, error);
                    return {
                        headers: [],
                        method: httpConfig.method,
                        data: {},
                        status: 300,
                        statusMsg: error
                    };
            });

            return result.toPromise();
        };
    }

    constructor(config: any, jsonP: Jsonp) {
        if (jsonP !== undefined) {
            config.http = GenericSolrAdapter.configureSolrHttpProvider(jsonP);
        }
        super(config);
    }

    count(mapper: Mapper, query: any, opts?: any): Promise<number> {
        query = query || {};
        opts = opts || {};

        opts.endpoint = this.getSolrEndpoint('count');
        opts.solrQuery = true;
        opts.solrCount = true;
        const me = this;
        opts['queryTransform'] = function(...args) { return me.queryTransformToSolrQuery.apply(me, args); };

        return super.count(mapper, query, opts);
    }

    create<T extends Record>(mapper: Mapper, props: any, opts?: any): Promise<T> {
        opts = opts || {};

        opts.endpoint = this.getSolrEndpoint('create');
        opts.solrQuery = true;
        opts.params = this.getParams(opts);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        opts.suffix = this.getSuffix(mapper, opts);
        const query = {
            add: {
                doc: this.mapToSolrDocument(props)
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

        opts.endpoint = this.getSolrEndpoint('destroy');
        opts.solrQuery = true;
        opts.params = this.getParams(opts);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        opts.suffix = this.getSuffix(mapper, opts);
        const query = {
            delete: {
                id: id
            },
            commit: {}
        };
        opts.solrDeletequery = query;
        return super.destroy(mapper, id, opts);
    }

    destroyAll(mapper: Mapper, query: any, opts: any): Promise<any> {
        throw new Error('destroyAll not implemented');
    }

    find<T extends Record>(mapper: Mapper, id: string | number, opts: any): Promise<T> {
        opts = opts || {};

        opts.endpoint = this.getSolrEndpoint('find');
        opts.solrQuery = true;
        const me = this;
        opts.params = opts.params || {};
        opts.params.where = opts.params.where || {};
        opts.params.where.id = { '==': id};
        opts.offset = 0;
        opts.limit = 10;
        opts['queryTransform'] = function(...args) { return me.queryTransformToSolrQuery.apply(me, args); };

        return super.find(mapper, id, opts);
    }

    findAll<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<T[]> {
        query = query || {};
        opts = opts || {};

        opts.endpoint = this.getSolrEndpoint('findAll');
        opts.solrQuery = true;
        const me = this;
        opts['queryTransform'] = function(...args) { return me.queryTransformToSolrQuery.apply(me, args); };

        return super.findAll(mapper, query, opts);
    }

    facets<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<Facets> {
        let op;
        query = query || {};
        opts = opts || {};

        opts.endpoint = this.getSolrEndpoint('findAll');
        opts.solrQuery = true;
        opts.solrFacet = true;
        const me = this;
        opts['queryTransform'] = function(...args) { return me.queryTransformToSolrQuery.apply(me, args); };

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

        opts.endpoint = this.getSolrEndpoint('findAll');
        opts.solrQuery = true;
        opts.solrFacet = true;
        const me = this;
        opts['queryTransform'] = function(...args) { return me.queryTransformToSolrQuery.apply(me, args); };

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

        opts.endpoint = this.getSolrEndpoint('update');
        opts.solrQuery = true;
        opts.params = this.getParams(opts);
        opts.params = this.queryTransform(mapper, opts.params, opts);
        opts.suffix = this.getSuffix(mapper, opts);
        const query = {
            add: {
                doc: this.mapToSolrDocument(props)
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

    afterFacets(mapper: Mapper, props: IDict, opts: any, result: any): Promise<Facets> {
        return utils.Promise.resolve(this.extractFacetsFromSolrResult(mapper, result));
    }

    afterSearch(mapper: Mapper, props: IDict, opts: any, result: any): Promise<S> {
        const count: number = this.extractCountFromSolrResult(mapper, result);
        const records: R[] = this.extractRecordsFromSolrResult(mapper, result);
        const facets: Facets = this.extractFacetsFromSolrResult(mapper, result);
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
        if (! (result instanceof Array)) {
            return utils.Promise.reject('no array as result');
        }
        if (result.length !== 1) {
            return utils.Promise.reject('result is not unique');
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
        url = url + '&stream.body=' + encodeURIComponent(JSON.stringify(opts.solrDeletequery));
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
        if (opts.solrQuery) {
            return this.deserializeSolr(mapper, response, opts);
        }

        // do default behavior
        return super.deserialize(mapper, response, opts);
    }

    getPath(method: string, mapper: Mapper, id: string | number, opts: any) {
        let path: string;
        if (opts.solrQuery) {
            path = this.getSolrPath(method, mapper, id, opts);
        } else {
            path = super.getPath(method, mapper, id, opts);
        }
        return path;
    }

    deserializeSolr(mapper: Mapper, response: any, opts: any) {
        // solr-result
        // console.log('deserializeSolr:', response);

        // check response
        if (response === undefined) {
            return super.deserialize(mapper, response, opts);
        }
        if (response.data === undefined) {
            return super.deserialize(mapper, response, opts);
        }

        // check for solr
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
        if (opts.solrCount) {
            return this.extractCountFromSolrResult(mapper, response.data);
        }

        // facet
        if (opts.solrFacet) {
            if (response.data.facet_counts === undefined) {
                return undefined;
            }
            if (response.data.facet_counts.facet_queries === undefined) {
                return undefined;
            }
            if (response.data.facet_counts.facet_queries.facet_fields === undefined) {
                return undefined;
            }

            return this.extractFacetsFromSolrResult(mapper, response.data);
        }

        // search records
        if (response.data.response.docs === undefined) {
            return undefined;
        }

        return this.extractRecordsFromSolrResult(mapper, response.data);

    }

    extractCountFromSolrResult(mapper: Mapper, result: any): number {
        return result.response.numFound;
    }

    extractRecordsFromSolrResult(mapper: Mapper, result: any): R[] {
        // got documents
        const docs = result.response.docs;
        const records = [];
        for (const doc of docs) {
            records.push(this.mapSolrDocument(mapper, doc));
        }
        // console.log('deserializeSolr:', records);

        return records;
    }

    extractFacetsFromSolrResult(mapper: Mapper, result: any): Facets {
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


    mapSolrDocument(mapper: Mapper, doc: any): Record {
        const values = {};
        values['id'] = Number(this.getSolrValue(doc, 'id', undefined));
        // console.log('mapSolrDocument values:', values);
        return mapper.createRecord(values);
    }

    getSolrPath(method: string, mapper: Mapper, id: string | number, opts: any) {
        let path = [
            opts.basePath === undefined ? (mapper['basePath'] === undefined ? this['basePath'] : mapper['basePath']) : opts.basePath,
            this.getEndpoint(mapper, null, opts)
        ].join('/').replace(/([^:\/]|^)\/{2,}/g, '$1/');
        path = this.buildUrl(path, opts.params);
        return path;
    }

    mapToSolrFieldName(fieldName: string): string {
        switch (fieldName) {
            default:
                break;
        }

        return fieldName;
    }

    abstract mapToSolrDocument(props: any): any;

    abstract getSolrEndpoint(method: string): string;

    abstract getSolrFields(mapper: Mapper, params: any, opts: any): string[];

    abstract getFacetParams(mapper: Mapper, params: any, opts: any, query: any): Map<string, any>;

    abstract getSpatialParams(mapper: Mapper, params: any, opts: any, query: any): Map<string, any>;

    getSolrValue(solrDocument: any, solrFieldName: string, defaultValue: any): string {
        let value = defaultValue;
        if (solrDocument[solrFieldName] !== undefined) {
            if (solrDocument[solrFieldName] instanceof Array) {
                value = solrDocument[solrFieldName][0];
            } else {
                value = solrDocument[solrFieldName];
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
                if (window.toString.call(v) === '[object Date]') {
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

    private queryTransformToSolrQuery(mapper: Mapper, params: any, opts: any): any {
        const query = this.createSolrQuery(mapper, params, opts);

        const fields = this.getSolrFields(mapper, params, opts);
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

        return query;
    }

    private createSolrQuery(mapper: Mapper, params: any, opts: any): any {
        // console.log('queryTransformToSolrQuery params:', params);
        // console.log('queryTransformToSolrQuery opts:', opts);
        if (params.where === undefined) {
            const query = {'q': '*:*', 'start': opts.offset, 'rows': opts.limit};
            // console.log('queryTransformToSolrQuery result:', query);
            return query;
        }

        const newParams = [];
        for (const fieldName of Object.getOwnPropertyNames(params.where)) {
            const filter = params.where[fieldName];
            const action = Object.getOwnPropertyNames(filter)[0];
            const value = params.where[fieldName][action];
            newParams.push(this.mapFilterToSolrQuery(mapper, fieldName, action, value));
        }

        const query = {'q': newParams.join(' AND '), 'start': opts.offset * opts.limit, 'rows': opts.limit};
        // console.log('queryTransformToSolrQuery result:', query);
        return query;
    }

    private mapFilterToSolrQuery(mapper: Mapper, fieldName: string, action: string, value: any): string {
        let query = '';

        if (action === 'likei' || action === 'like') {
            value = value.toString().replace(/%/g, '');
            query = this.mapToSolrFieldName(fieldName) + ':' + this.escapeSolrValue(value);
        } else if (action === '==' || action === 'eq') {
            value = value.toString().replace(/%/g, '');
            query = this.mapToSolrFieldName(fieldName) + ':' + this.escapeSolrValue(value);
        } else if (action === '>') {
            value = value.toString().replace(/%/g, '');
            query = this.mapToSolrFieldName(fieldName) + ': {' + this.escapeSolrValue(value) + ' TO * }';
        } else if (action === '>=') {
            value = value.toString().replace(/%/g, '');
            query = this.mapToSolrFieldName(fieldName) + ': [' + this.escapeSolrValue(value) + ' TO *]';
        } else if (action === '<') {
            value = value.toString().replace(/%/g, '');
            query = this.mapToSolrFieldName(fieldName) + ': { * TO ' + this.escapeSolrValue(value) + ' }';
        } else if (action === '<=') {
            value = value.toString().replace(/%/g, '');
            query = this.mapToSolrFieldName(fieldName) + ': [ * TO ' + this.escapeSolrValue(value) + ' ]';
        } else if (action === 'in') {
            query = this.mapToSolrFieldName(fieldName) + ': (' + value.map(
                    inValue => this.escapeSolrValue(inValue.toString().replace(/%/g, ''))
                ).join(' OR ') + ' )';
        } else if (action === 'notin') {
            query = this.mapToSolrFieldName(fieldName) + ': (-' + value.map(
                    inValue => this.escapeSolrValue(inValue.toString().replace(/%/g, ''))
                ).join(' AND -') + ' )';
        }
        return query;
    }

    private escapeSolrValue(value: any): string {
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

