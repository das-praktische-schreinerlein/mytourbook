import {HttpAdapter, IDict} from 'js-data-http';
import {Injectable} from '@angular/core';
import {Mapper, Record, utils} from 'js-data';
import {Headers, Jsonp, RequestOptionsArgs} from '@angular/http';

@Injectable()
export class GenericSolrAdapter extends HttpAdapter {
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
                console.log('result makeHttpRequest:' + httpConfig.url, res);
                const json = res.json();
                return {
                    headers: res.headers,
                    method: httpConfig.method,
                    data: json,
                    status: res.status,
                    statusMsg: res.statusText
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

        opts.solrQuery = true;
        opts.solrCount = true;
        const me = this;
        opts['queryTransform'] = function(...args) { return me.queryTransformToSolrQuery.apply(me, args); };

        return super.count(mapper, query, opts);
    }

    create<T extends Record>(mapper: Mapper, props: any, opts?: any): Promise<T> {
        opts = opts || {};

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

        opts.solrQuery = true;
        const me = this;
        opts.params = opts.params || {};
        opts.params.where = opts.params.where || {};
        opts.params.where.id = { '==': id};
        opts['queryTransform'] = function(...args) { return me.queryTransformToSolrQuery.apply(me, args); };

        return super.find(mapper, id, opts);
    }

    findAll<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<T[]> {
        query = query || {};
        opts = opts || {};

        opts.solrQuery = true;
        const me = this;
        opts['queryTransform'] = function(...args) { return me.queryTransformToSolrQuery.apply(me, args); };

        return super.findAll(mapper, query, opts);
    }

    sum (mapper: Mapper, field: string, query: any, opts?: any): Promise<any> {
        throw new Error('sum not implemented');
    }

    update<T extends Record>(mapper: Mapper, id: string | number, props: any, opts: any): Promise<T> {
        opts = opts || {};

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

    afterCreate<T extends Record>(mapper: Mapper, props: IDict, opts: any, result: any): Promise<T> {
        return this.find(mapper, props['add']['doc']['id'], opts);
    }

    afterUpdate<T extends Record>(mapper: Mapper, id: number | string, opts: any, result: any): Promise<T> {
        return this.find(mapper, id, opts);
    }

    afterDestroy<T extends Record>(mapper: Mapper, id: number | string, opts: any, result: any): Promise<T> {
        console.log('destroyd', id);
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
        console.log('deserializeSolr:', response);

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
        if (response.data.response.docs === undefined) {
            return undefined;
        }

        // got documents
        const docs = response.data.response.docs;
        const records = [];
        for (const doc of docs) {
            records.push(this.mapSolrDocument(mapper, doc));
        }
        console.log('deserializeSolr:', records);

        return records;

    }

    mapSolrDocument(mapper: Mapper, doc: any): Record {
        const values = {};
        values['id'] = Number(this.getSolrValue(doc, 'id', undefined));
        console.log('mapSolrDocument values:', values);
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

    mapToSolrDocument(props: any): any {
        return undefined;
    }

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

    private queryTransformToSolrQuery(mapper: Mapper, params: any, opts: Object): any {
        console.log('queryTransformToSolrQuery params:', params);
        if (params.where === undefined) {
            const query = {'q': '*:*'};
            console.log('queryTransformToSolrQuery result:', query);
            return query;
        }

        const newParams = [];
        for (const fieldName of Object.getOwnPropertyNames(params.where)) {
            const filter = params.where[fieldName];
            const action = Object.getOwnPropertyNames(filter)[0];
            const value = params.where[fieldName][action];
            newParams.push(this.mapFilterToSolrQuery(mapper, fieldName, action, value));
        }

        const query = {'q': newParams.join(' ')};
        console.log('queryTransformToSolrQuery result:', query);
        return query;
    }

    private mapFilterToSolrQuery(mapper: Mapper, fieldName: string, action: string, value: any): string {
        let query = '';

        value = value.toString().replace(/%/g, '');
        if (action === 'likei' || action === 'like') {
            query = this.mapToSolrFieldName(fieldName) + ':' + this.escapeSolrValue(value);
        } else if (action === '==' || action === 'eq') {
            query = this.mapToSolrFieldName(fieldName) + ':' + this.escapeSolrValue(value);
        } else if (action === '>') {
            query = this.mapToSolrFieldName(fieldName) + ': {' + this.escapeSolrValue(value) + ' TO * }';
        } else if (action === '>=') {
            query = this.mapToSolrFieldName(fieldName) + ': [' + this.escapeSolrValue(value) + ' TO *]';
        } else if (action === '<') {
            query = this.mapToSolrFieldName(fieldName) + ': { * TO ' + this.escapeSolrValue(value) + ' }';
        } else if (action === '<=') {
            query = this.mapToSolrFieldName(fieldName) + ': [ * TO ' + this.escapeSolrValue(value) + ' ]';
        } else if (action === 'in') {
            query = this.mapToSolrFieldName(fieldName) + ': (' + value.map(
                inValue => this.escapeSolrValue(value)
                ).join(' OR ') + ' )';
        } else if (action === 'notin') {
            query = this.mapToSolrFieldName(fieldName) + ': (-' + value.map(
                    inValue => this.escapeSolrValue(value)
                ).join(' AND -') + ' )';
        }
        return query;
    }

    private escapeSolrValue(value: any): string {
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
}

