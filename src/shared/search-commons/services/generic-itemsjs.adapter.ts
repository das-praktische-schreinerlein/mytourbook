import {Mapper, Record, utils} from 'js-data';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {GenericInMemoryAdapter} from './generic-inmemory.adapter';
import {Facet, Facets} from '../model/container/facets';
import {AdapterFilterActions} from './generic-solr.adapter';

export interface ItemJsResultPagionation {
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
    aggregations: ItemJsResultAggregation[];
}
export interface ItemJsResult {
    pagination: ItemJsResultPagionation;
    data: ItemJsResultData;
}

export abstract class GenericItemsJsAdapter <R extends Record, F extends GenericSearchForm,
    S extends GenericSearchResult<R, F>> extends GenericInMemoryAdapter<R, F, S> {
    protected itemJs;

    constructor(config: any, data: any[], itemJsConfig: {}) {
        super(config);
        //this.itemJs = require('itemsjs')(data, itemJsConfig);
    }

    _doQuery(query: any, opts: any): ItemJsResult {
        const itemJsQuery = {};
        const result: ItemJsResult = this.itemJs.search(itemJsQuery);
        return result;
    };

    _count(mapper: Mapper, query: any, opts?: any): Promise<any> {
        const result = this._doQuery(query, opts);
        return Promise.resolve(this.extractCountFromRequestResult(mapper, result));
    }
    _create(mapper: any, props: any, opts?: any): Promise<any> {
        return Promise.reject('create not implemented');
    }
    _createMany(mapper: any, props: any, opts?: any): Promise<any> {
        return Promise.reject('createMany not implemented');
    }
    _destroy(mapper: any, id: string | number, opts?: any): Promise<any> {
        return Promise.reject('destroy not implemented');
    }
    _destroyAll(mapper: any, query: any, opts?: any): Promise<any> {
        return Promise.reject('destroyAll not implemented');
    }
    _find(mapper: any, id: string | number, opts?: any): Promise<any> {
        opts.params.where.id = { '==': id};
        const result = this._doQuery({}, opts);
        const records = this.extractRecordsFromRequestResult(mapper, result);
        if (! (Array.isArray(result))) {
            return utils.Promise.reject('generic-solr-adapter.afterFind: no array as result');
        }
        if (result.length !== 1) {
            return utils.Promise.reject('generic-solr-adapter.afterFind: result is not unique');
        }

        return utils.Promise.resolve(result[0]);
    }
    _findAll(mapper: any, query: any, opts?: any): Promise<any> {
        const result = this._doQuery({}, opts);
        const records = this.extractRecordsFromRequestResult(mapper, result);
        if (! (Array.isArray(result))) {
            return utils.Promise.reject('generic-solr-adapter.afterFind: no array as result');
        }

        return utils.Promise.resolve(result);
    }
    _sum(mapper: any, field: any, query: any, opts?: any): Promise<any> {
        return Promise.reject('sum not implemented');
    }
    _update(mapper: any, id: any, props: any, opts?: any): Promise<any> {
        return Promise.reject('update not implemented');
    }
    _updateAll(mapper: any, props: any, query: any, opts?: any): Promise<any> {
        return Promise.reject('updateAll not implemented');
    }
    _updateMany(mapper: any, records: any, opts?: any): Promise<any> {
        return Promise.reject('updateMany not implemented');
    }

    facets<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<Facets> {
        const result = this._doQuery({}, opts);
        const facets: Facets = this.extractFacetsFromRequestResult(mapper, result);
        return utils.Promise.resolve(facets);
    }

    search<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<S> {
        const result = this._doQuery({}, opts);
        const count: number = this.extractCountFromRequestResult(mapper, result);
        const records: R[] = this.extractRecordsFromRequestResult(mapper, result);
        const facets: Facets = this.extractFacetsFromRequestResult(mapper, result);
        const searchResult = new GenericSearchResult(undefined, count, records, facets);
        return utils.Promise.resolve(<S>searchResult);
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
            records.push(this.mapResponseDocument(mapper, doc));
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
        for (let i = 0; i <= result.data.aggregations.length; i++) {
            const aggregation = result.data.aggregations.length[i];
            const buckets = aggregation.buckets;
            const facet = new Facet();
            facet.facet = [];
            for (let j = 0; j <= buckets.length; j++) {
                facet.facet.push([buckets[j].key, buckets[j].doc_count]);
            }
            facets.facets.set(aggregation.name, facet);
        }

        return facets;
    }


    mapResponseDocument(mapper: Mapper, doc: any): Record {
        const values = {};
        values['id'] = Number(this.getAdapterValue(doc, 'id', undefined));
        // console.log('mapResponseDocument values:', values);
        return mapper.createRecord(values);
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

    private queryTransformToAdapterQuery(mapper: Mapper, params: any, opts: any): any {
        return this.queryTransformToAdapterQueryWithMethod('', mapper, params, opts);
    }

    private queryTransformToAdapterQueryWithMethod(method: string, mapper: Mapper, params: any, opts: any): any {
        const query = this.createAdapterQuery(method, mapper, params, opts);

        const fields = this.getAdapterFields(method, mapper, params, opts);
        if (fields !== undefined && fields.length > 0) {
            query.fl = fields.join(' ');
        }

        const facetParams = this.getFacetParams(method, mapper, params, opts, query);
        if (facetParams !== undefined && facetParams.size > 0) {
            facetParams.forEach(function (value, key) {
                query[key] = value;
            });
        }

        const spatialParams = this.getSpatialParams(method, mapper, params, opts, query);
        if (spatialParams !== undefined && spatialParams.size > 0) {
            spatialParams.forEach(function (value, key) {
                query[key] = value;
            });
        }

        const sortParams = this.getSortParams(method, mapper, params, opts, query);
        if (sortParams !== undefined && sortParams.size > 0) {
            sortParams.forEach(function (value, key) {
                query[key] = value;
            });
        }

        console.log('solQuery:', query);

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
            const query = {'query': '', 'page': opts.offset, 'per_page': opts.limit, filters: []};
            // console.log('createAdapterQuery result:', query);
            return query;
        }

        const query = {'query': '(' + newParams.join(' AND ') + ')', 'page': opts.offset, 'per_page': opts.limit, filters: []};
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
        value = value.toString().replace(/[%]/g, ' ').replace(/[-+:\()\[\]\\]/g, ' ').replace(/[ ]+/, ' ').trim();
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

