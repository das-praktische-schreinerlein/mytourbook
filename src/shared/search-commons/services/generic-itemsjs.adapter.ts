import {Mapper, Record, utils} from 'js-data';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {Adapter} from 'js-data-adapter';
import {Facet, Facets} from '../model/container/facets';
import {GenericFacetAdapter, GenericSearchAdapter} from './generic-search.adapter';
import {AdapterOpts, AdapterQuery} from './mapper.utils';
import {ItemsJsConfig, ItemsJsQueryBuilder, ItemsJsSelectQueryData} from './itemsjs-query.builder';
import {GenericAdapterResponseMapper} from './generic-adapter-response.mapper';
import * as itemsjs from 'itemsjs';

export interface ItemJsResultPagination {
    per_page: number;
    page: number;
    total: number;
}
export interface ItemJsResultAggregation {
    name: string;
    title: string;
    position: number;
    buckets: [{
        key: string;
        doc_count: string;
    }];
}
export interface ItemJsResultData {
    items: any[];
    aggregations: {};
}
export interface ItemJsResult {
    pagination: ItemJsResultPagination;
    data: ItemJsResultData;
}

export abstract class GenericItemsJsAdapter <R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>>
    extends Adapter implements GenericSearchAdapter<R, F, S>, GenericFacetAdapter<R, F, S> {
    protected itemJs;
    protected itemsJsQueryBuilder = new ItemsJsQueryBuilder();
    protected mapper: GenericAdapterResponseMapper;

    constructor(config: any, mapper: GenericAdapterResponseMapper, data: any[], itemJsConfig: ItemsJsConfig) {
        super(config);
        this.mapper = mapper;
        this.itemJs = itemsjs(data, itemJsConfig);
    }

    create(mapper: Mapper, props: any, opts?: any): Promise<R> {
        throw new Error('create not implemented');
    }

    createMany(mapper: Mapper, props: any, opts: any): Promise<R> {
        throw new Error('createMany not implemented');
    }

    destroy(mapper: Mapper, id: string | number, opts?: any): Promise<any> {
        throw new Error('destroy not implemented');
    }

    destroyAll(mapper: Mapper, query: any, opts: any): Promise<any> {
        throw new Error('destroyAll not implemented');
    }

    find(mapper: Mapper, id: string | number, opts: any): Promise<R> {
        throw new Error('find not implemented');
    }

    sum (mapper: Mapper, field: string, query: any, opts?: any): Promise<any> {
        throw new Error('sum not implemented');
    }

    update(mapper: Mapper, id: string | number, props: any, opts: any): Promise<R> {
        throw new Error('update not implemented');
    }

    updateAll(mapper: Mapper, props: any, query: any, opts?: any): Promise<any> {
        throw new Error('updateAll not implemented');
    }

    updateMany(mapper: Mapper, records: R[], opts?: any): Promise<any> {
        throw new Error('updateMany not implemented');
    }

    count(mapper: Mapper, query: any, opts?: any): Promise<number> {
        query = query || {};
        opts = opts || {};

        return super.count(mapper, query, opts);
    }

    findAll(mapper: Mapper, query: any, opts: any): Promise<R[]> {
        query = query || {};
        opts = opts || {};

        return super.findAll(mapper, query, opts);
    }

    facets(mapper: Mapper, query: any, opts: any): Promise<Facets> {
        query = query || {};
        opts = opts || {};

        opts.adapterFacet = true;

        return this._facets(mapper, query, opts);
    }

    search(mapper: Mapper, query: any, opts: any): Promise<S> {
        query = query || {};
        opts = opts || {};

        opts.adapterFacet = true;

        return this._search(mapper, query, opts);
    }

    afterCount(mapper: Mapper, props: any, opts: any, result: any): Promise<number> {
        return utils.Promise.resolve(result);
    }

    protected _facets(mapper: Mapper, query: any, opts: any): Promise<Facets> {
        opts.adapterQuery = true;
        const me = this;
        const queryData = me.queryTransformToAdapterQuery( mapper, query, opts);
        if (queryData === undefined) {
            return utils.resolve([0]);
        }
        opts.queryData = queryData;

        const result = this.doQuery(queryData);
        const facets: Facets = this.extractFacetsFromRequestResult(mapper, result);
        return utils.Promise.resolve(facets);
    }

    protected _search(mapper: Mapper, query: any, opts: any): Promise<S> {
        opts.adapterQuery = true;
        const me = this;
        const queryData = me.queryTransformToAdapterQuery(mapper, query, opts);
        if (queryData === undefined) {
            return utils.resolve([0]);
        }
        opts.queryData = queryData;
        const result = this.doQuery(queryData);
        const count: number = this.extractCountFromRequestResult(mapper, result);
        const records: R[] = this.extractRecordsFromRequestResult(mapper, result);
        const facets: Facets = this.extractFacetsFromRequestResult(mapper, result);
        const searchResult = new GenericSearchResult(undefined, count, records, facets);
        return utils.Promise.resolve(<S>searchResult);
    }

    protected _count(mapper: Mapper, query: any, opts?: any): Promise<any> {
        opts.adapterQuery = true;
        const me = this;
        const queryData = me.queryTransformToAdapterQuery(mapper, query, opts);
        if (queryData === undefined) {
            return utils.resolve([0]);
        }
        opts.queryData = queryData;

        const result = this.doQuery(query);
        return Promise.resolve(this.extractCountFromRequestResult(mapper, result));
    }

    protected _findAll(mapper: any, query: any, opts?: any): Promise<any> {
        opts.adapterQuery = true;
        const me = this;
        const queryData = me.queryTransformToAdapterQuery(mapper, query, opts);
        if (queryData === undefined) {
            return utils.resolve([[]]);
        }
        opts.queryData = queryData;

        const result = this.doQuery(queryData);
        const records = this.extractRecordsFromRequestResult(mapper, result);
        if (! (Array.isArray(result))) {
            return utils.Promise.reject('generic-solr-adapter.afterFind: no array as result');
        }

        return utils.Promise.resolve(result);
    }

    deserializeResponse(mapper: Mapper, response: ItemJsResult, opts: any) {
        // console.log('deserializeResponse:', response);

        // check response
        if (response === undefined) {
            return undefined;
        }
        if (response.data === undefined) {
            return undefined;
        }
        if (response.pagination === undefined) {
            return undefined;
        }

        // count
        if (opts.itemsJsCount) {
            return this.extractCountFromRequestResult(mapper, response);
        }

        // facet
        if (opts.itemsJsFacet) {
            if (response.data.aggregations === undefined) {
                return undefined;
            }

            return this.extractFacetsFromRequestResult(mapper, response);
        }

        // search records
        if (response.data.items === undefined) {
            return undefined;
        }

        return this.extractRecordsFromRequestResult(mapper, response);

    }

    extractCountFromRequestResult(mapper: Mapper, result: ItemJsResult): number {
        return result.pagination.total;
    }

    extractRecordsFromRequestResult(mapper: Mapper, result: ItemJsResult): R[] {
        // got documents
        const docs = result.data.items;
        const records = [];
        for (const doc of docs) {
            records.push(this.mapResponseDocument(mapper, doc, this.getItemsJsConfig()));
        }
        // console.log('extractRecordsFromRequestResult:', records);

        return records;
    }

    extractFacetsFromRequestResult(mapper: Mapper, result: ItemJsResult): Facets {
        if (result.data === undefined ||
            result.data.aggregations === undefined) {
            return new Facets();
        }

        const facets = new Facets();
        for (const name in result.data.aggregations) {
            const aggregation: ItemJsResultAggregation = <ItemJsResultAggregation>result.data.aggregations[name];
            const buckets = aggregation.buckets;
            const facet = new Facet();
            facet.facet = [];
            for (let j = 0; j < buckets.length; j++) {
                facet.facet.push([buckets[j].key, buckets[j].doc_count]);
            }
            facets.facets.set(aggregation.name, facet);
        }

        return facets;
    }


    mapResponseDocument(mapper: Mapper, doc: any, itemsJsConfig: ItemsJsConfig): Record {
        return this.mapper.mapResponseDocument(mapper, doc, itemsJsConfig.fieldMapping);
    }

    abstract mapToAdapterDocument(props: any): any;

    abstract getItemsJsConfig(): ItemsJsConfig;

    protected doQuery(query: ItemsJsSelectQueryData): ItemJsResult {
        const result: ItemJsResult = this.itemJs.search(query);
        return result;
    };

    protected queryTransformToAdapterQuery(mapper: Mapper, params: any, opts: any): ItemsJsSelectQueryData {
        return this.queryTransformToAdapterQueryWithMethod(undefined, mapper, params, opts);
    }

    protected queryTransformToAdapterQueryWithMethod(method: string, mapper: Mapper, params: any, opts: any): ItemsJsSelectQueryData {
        return this.itemsJsQueryBuilder.queryTransformToAdapterSelectQuery(this.getItemsJsConfig(), method, <AdapterQuery>params,
            <AdapterOpts>opts);
    }
}

