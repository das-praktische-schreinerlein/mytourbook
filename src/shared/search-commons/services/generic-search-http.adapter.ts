import {HttpAdapter, IDict} from 'js-data-http';
import {Mapper, Record, utils} from 'js-data';
import {Facet, Facets} from '../model/container/facets';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {GenericActionTagAdapter, GenericFacetAdapter, GenericSearchAdapter} from './generic-search.adapter';
import {ActionTagForm} from '../../commons/utils/actiontag.utils';

export function Response (data, meta, op) {
    meta = meta || {};
    this.data = data;
    utils.fillIn(this, meta);
    this.op = op;
}

export abstract class GenericSearchHttpAdapter <R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>>
    extends HttpAdapter implements GenericSearchAdapter<R, F, S>, GenericFacetAdapter<R, F, S>, GenericActionTagAdapter<R, F, S> {

    constructor(config: any) {
        super(config);
    }

    create(mapper: Mapper, props: any, opts?: any): Promise<R> {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('create');

        return super.create(mapper, props, opts);
    }

    update(mapper: Mapper, id: string | number, props: any, opts?: any): Promise<R> {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('update');

        return super.update(mapper, id, props, opts);
    }

    doActionTag(mapper: Mapper, record: R, actionTagForm: ActionTagForm, opts: any): Promise<R> {
        const me = this;
        const result = new Promise<R>((resolve, reject) => {
            me._doActionTag(mapper, record, actionTagForm, opts).then(resultRecord => {
                if (resultRecord === undefined) {
                    reject('record not found');
                } else {
                    resolve(resultRecord);
                }
            }).catch(reason => {
                console.error('doActionTag failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

    facets(mapper: Mapper, query: any, opts: any): Promise<Facets> {
        let op;
        query = query || {};
        opts = opts || {};

        opts.endpoint = this.getHttpEndpoint('search');

        const me = this;
        opts['queryTransform'] = function(...args) { return me.queryTransformToHttpQuery.apply(me, args); };

        opts.params = this.getParams(opts);
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

    search(mapper: Mapper, query: any, opts: any): Promise<S> {
        let op;
        query = query || {};
        opts = opts || {};

        opts.endpoint = this.getHttpEndpoint('search');

        const me = this;
        opts['queryTransform'] = function(...args) { return me.queryTransformToHttpQuery.apply(me, args); };

        opts.params = this.getParams(opts);
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

    beforeFacets(mapper: Mapper, query: IDict, opts: IDict): any {
        return utils.Promise.resolve(true);
    }

    beforeSearch(mapper: Mapper, query: IDict, opts: IDict): any {
        return utils.Promise.resolve(true);
    }

    afterFacets(mapper: Mapper, props: IDict, opts: any, result: any): Promise<Facets> {
        return utils.Promise.resolve(this.extractFacetsFromRequestResult(mapper, result));
    }

    afterSearch(mapper: Mapper, props: IDict, opts: any, result: any): Promise<S> {
        const count: number = this.extractCountFromRequestResult(mapper, result);
        const records: R[] = this.extractRecordsFromRequestResult(mapper, result);
        const facets: Facets = this.extractFacetsFromRequestResult(mapper, result);
        const searchForm  = result.searchForm;
        const searchResult = new GenericSearchResult(searchForm, count, records, facets);
        return utils.Promise.resolve(<S>searchResult);
    }

    afterCreate(mapper: Mapper, props: IDict, opts: any, result: any): Promise<R> {
        const record: R = <R>mapper.createRecord(result);
        opts.realResult = result;
        return utils.Promise.resolve(record);
    }

    afterUpdate(mapper: Mapper, id: number | string, opts: any, result: any): Promise<R> {
        opts.realResult = result;
        return this.find(mapper, id, opts);
    }

    afterFind(mapper: Mapper, id: number | string, opts: any, result: any): Promise<R> {
        return utils.Promise.resolve(result);
    }

    afterDestroy(mapper: Mapper, id: number | string, opts: any, result: any): Promise<R> {
        return utils.Promise.resolve(<R>undefined);
    }

    deserialize(mapper: Mapper, response: any, opts: any) {
        if (response && (typeof response.data === 'string') && response.data.startsWith('JSONP_CALLBACK(')) {
            const json = response.data.substring('JSONP_CALLBACK('.length, response.data.length - 2);
            response.data = JSON.parse(json);
        }

        // do default behavior
        return super.deserialize(mapper, response, opts);
    }

    extractCountFromRequestResult(mapper: Mapper, result: any): number {
        return result.recordCount;
    }

    extractRecordsFromRequestResult(mapper: Mapper, result: any): R[] {
        return result.currentRecords;
    }

    extractFacetsFromRequestResult(mapper: Mapper, result: any): Facets {
        const facets: Facets = new Facets();
        const facetsValues =  result.facets.facets;
        const selectLimits =  result.facets.selectLimits;
        for (const key in facetsValues) {
            if (facetsValues.hasOwnProperty(key)) {
                const facet = new Facet();
                facet.facet = facetsValues[key];
                if (selectLimits.hasOwnProperty(key)) {
                    facet.selectLimit = selectLimits[key];
                }
                facets.facets.set(key, facet);
            }
        }
        return facets;
    }

    protected _doActionTag(mapper: Mapper, record: R, actionTagForm: ActionTagForm, opts: any): Promise<R> {
        const me = this;
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('doActionTag');

        return super.PUT(this.getPath('doActionTag', mapper, undefined, opts), actionTagForm, undefined)
            .then(response => {
                if (response && (typeof response.data === 'string')) {
                    const json = response.data.substring('JSONP_CALLBACK('.length, response.data.length - 2);
                    const data = JSON.parse(json);
                    return utils.resolve(data);
                } else if (response && response.data) {
                    return utils.resolve(response.data);
                } else {
                    return utils.reject('doActionTag no valid response');
                }
            }).catch(reason => {
                return utils.reject('doActionTag something went wrong' + reason);
            });
    }

    abstract getHttpEndpoint(method: string): string;

    private queryTransformToHttpQuery(mapper: Mapper, params: any, opts: any): any {
        const ret = {};
        for (const i in opts.originalSearchForm) {
            if (opts.originalSearchForm.hasOwnProperty(i)) {
                ret[i] = opts.originalSearchForm[i];
            }
        }
        ret['showForm'] = opts.showForm;
        ret['showFacets'] = opts.showFacets;
        ret['loadTrack'] = opts.loadTrack;
        return ret;
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
}

