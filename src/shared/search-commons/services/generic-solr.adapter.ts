import {IDict} from 'js-data-http';
import {Mapper, Record, utils} from 'js-data';
import {Facet, Facets} from '../model/container/facets';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import {GenericSearchHttpAdapter, Response} from './generic-search-http.adapter';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {AdapterOpts, AdapterQuery, MapperUtils} from './mapper.utils';
import {GenericFacetAdapter, GenericSearchAdapter} from './generic-search.adapter';
import {GenericAdapterResponseMapper} from './generic-adapter-response.mapper';
import {SolrConfig, SolrQueryBuilder} from './solr-query.builder';
import {ActionTagForm} from '../../commons/utils/actiontag.utils';

export abstract class GenericSolrAdapter <R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>>
    extends GenericSearchHttpAdapter<R, F, S>
    implements GenericSearchAdapter<R, F, S>, GenericFacetAdapter<R, F, S> {
    protected mapperUtils = new MapperUtils();
    protected solrQueryBuilder: SolrQueryBuilder = new SolrQueryBuilder();
    protected mapper: GenericAdapterResponseMapper;

    constructor(config: any, mapper: GenericAdapterResponseMapper) {
        super(config);
        this.mapper = mapper;
    }

    count(mapper: Mapper, query: any, opts?: any): Promise<number> {
        query = query || {};
        opts = opts || {};

        opts.endpoint = this.getHttpEndpoint('count');
        opts.adapterQuery = true;
        opts.adapterCount = true;
        const me = this;
        opts['queryTransform'] = function(...args) { return me.queryTransformToAdapterSelectQuery.apply(me, args); };

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
        opts['queryTransform'] = function(...args) { return me.queryTransformToAdapterSelectQuery.apply(me, args); };

        return super.find(mapper, id, opts);
    }

    findAll<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<T[]> {
        query = query || {};
        opts = opts || {};

        opts.endpoint = this.getHttpEndpoint('findAll');
        opts.adapterQuery = true;
        const me = this;
        opts['queryTransform'] = function(...args) { return me.queryTransformToAdapterSelectQuery.apply(me, args); };

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
        opts['queryTransform'] = function(...args) { return me.queryTransformToAdapterSelectQuery.apply(me, args); };

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
        opts['queryTransform'] = function(...args) { return me.queryTransformToAdapterSelectQuery.apply(me, args); };

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

    _create (mapper: Mapper, props: any, opts: any) {
        let url = this.getPath('create', mapper, props, opts);
        url = url + '&stream.body=' + encodeURIComponent(JSON.stringify(props));
        opts.contentType = 'application/json';
        return this.GET(
            url,
            opts
        ).then((response) => this._end(mapper, opts, response));
    }

    _doActionTag<T extends Record>(mapper: Mapper, Record: R, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        return utils.reject('not supported');
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
            const values = this.mapperUtils.splitPairs(result.facet_counts.facet_fields[field]);
            const facet = new Facet();
            facet.facet = values;
            facets.facets.set(field, facet);
        }

        const sortFacet = new Facet();
        sortFacet.facet = [];
        for (const sortKey in this.getSolrConfig().sortMapping) {
            sortFacet.facet.push([sortKey, 0]);
        }
        facets.facets.set('sorts', sortFacet);

        return facets;
    }


    mapResponseDocument(mapper: Mapper, doc: any): Record {
        return this.mapper.mapResponseDocument(mapper, doc, {});
    }

    getAdapterPath(method: string, mapper: Mapper, id: string | number, opts: any) {
        let path = [
            opts.basePath === undefined ? (mapper['basePath'] === undefined ? this['basePath'] : mapper['basePath']) : opts.basePath,
            this.getEndpoint(mapper, null, opts)
        ].join('/').replace(/([^:\/]|^)\/{2,}/g, '$1/');
        path = this.buildUrl(path, opts.params);
        // console.log('solrurl:', path);
        return path;
    }

    buildUrl(url, params) {
        return this.solrQueryBuilder.buildUrl(url, params);
    }

    abstract mapToAdapterDocument(props: any): any;

    abstract getSolrConfig(): SolrConfig;

    protected queryTransformToAdapterSelectQuery(mapper: Mapper, params: any, opts: any): any {
        return this.queryTransformToAdapterSelectQueryWithMethod(undefined, mapper, params, opts);
    }

    protected queryTransformToAdapterSelectQueryWithMethod(method: string, mapper: Mapper, params: any, opts: any): any {
        return this.solrQueryBuilder.queryTransformToAdapterSelectQuery(this.getSolrConfig(), method, <AdapterQuery>params,
            <AdapterOpts>opts);
    }

}

