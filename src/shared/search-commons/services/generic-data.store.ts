// DataStore is mostly recommended for use in the browser
import {DataStore, Mapper, Record, Schema, utils} from 'js-data';
import {Adapter} from 'js-data-adapter';
import {Facets} from '../model/container/facets';
import {GenericSolrAdapter} from './generic-solr.adapter';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import {GenericSearchHttpAdapter} from './generic-search-http.adapter';

export abstract class GenericDataStore <R extends Record, F extends GenericSearchForm,
    S extends GenericSearchResult<R, F>> {

    private store: DataStore;
    private mappers = new Map<string, Mapper>();
    private mapperAdapters = new Map<string, Adapter>();

    public static convertToDate(record) {
        if (typeof record.created_at === 'string') {
            record.created_at = new Date(record.created_at);
        }
        if (typeof record.updated_at === 'string') {
            record.updated_at = new Date(record.updated_at);
        }
    }

    constructor() {
        this.store = new DataStore({
            mapperDefaults: {
                // Override the original to make sure the date properties are actually Date
                // objects
                createRecord (props, opts) {
                    let result = undefined;
                    for (const key in props) {
                        if (props.hasOwnProperty(key) && props[key] === null) {
                            props[key] = undefined;
                        }
                    }

                    try {
                        result = this.constructor.prototype.createRecord.call(this, props, opts);
                    } catch (err) {
                        console.error('validation failed for', props);
                        console.error('validation errors', err.errors);
                        throw err;
                    }
                    /**                    if (Array.isArray(result)) {
                        result.forEach(this.convertToDate);
                    } else if (this.is(result)) {
                        GenericDataStore.convertToDate(result);
                    }
                     **/
                    return result;
                }
            }
        });
    }

    public defineMapper(mapperName: string, recordClass: any, schema: Schema, relations: any): Mapper {
        this.mappers.set(mapperName, this.store.defineMapper(mapperName, {
            recordClass: recordClass,
            applySchema: true,
            schema: schema,
            relations: relations
        }));
        return this.mappers.get(mapperName);
    }

    public setAdapter(adapterName: string, adapter: Adapter, mapperName: string, options: any) {
        if (mapperName === undefined || mapperName === '') {
            this.store.registerAdapter(adapterName, adapter, { 'default': true });
            this.mapperAdapters.set('', adapter);
        } else {
            this.mappers.get(mapperName).registerAdapter(adapterName, adapter, { 'default': true });
            this.mapperAdapters.set(mapperName, adapter);
        }
    }

    public count(mapperName: string, query?: any, opts?: any): Promise<number> {
        if (this.getAdapterForMapper(mapperName) === undefined) {
            return utils.Promise.resolve(this.store.filter(mapperName, query).length);
        } else {
            return this.getAdapterForMapper(mapperName).count(this.store.getMapper(mapperName), query, opts);
        }
    }

    public createRecord<T extends Record>(mapperName: string, props, opts): T {
        return <T>this.store.createRecord(mapperName, props, opts);
    }

    public create<T extends Record>(mapperName: string, record: any, opts?: any): Promise<T> {
        if (this.getAdapterForMapper(mapperName) === undefined) {
            return utils.Promise.resolve(this.store.add(mapperName, record, opts));
        } else {
            return this.store.create(mapperName, record, opts);
        }
    }

    public createMany<T extends Record>(mapperName: string, records: any[], opts?: any): Promise<T[]> {
        if (this.getAdapterForMapper(mapperName) === undefined) {
            return utils.Promise.resolve(this.store.add(mapperName, records, opts));
        } else {
            return this.store.createMany(mapperName, records, opts);
        }
    }

    public destroy<T extends Record>(mapperName: string, id: any, opts?: any): Promise<T> {
        if (this.getAdapterForMapper(mapperName) === undefined) {
            return utils.Promise.resolve(this.store.remove(mapperName, id, opts));
        } else {
            return this.store.destroy(mapperName, id, opts);
        }
    }

    public facets(mapperName: string, query?: any, opts?: any): Promise<Facets> {
        if (this.getAdapterForMapper(mapperName) === undefined ||
            (! (this.getAdapterForMapper(mapperName) instanceof GenericSolrAdapter))) {
            return utils.Promise.resolve(undefined);
        } else {
            opts = opts || {};

            // bypass cache
            opts.force = true;

            const mapper = this.store.getMapper(mapperName);
            return (<GenericSolrAdapter<R, F, S>>this.getAdapterForMapper(mapperName)).facets(mapper, query, opts);
        }
    }

    public find<T extends Record>(mapperName: string, id: any, opts?: any): Promise<T> {
        if (this.getAdapterForMapper(mapperName) === undefined) {
            return utils.Promise.resolve(this.store.get(mapperName, id));
        } else {
            return this.store.find(mapperName, id, opts);
        }
    }

    public findAll<T extends Record>(mapperName: string, query?: any, opts?: any): Promise<T[]> {
        if (this.getAdapterForMapper(mapperName) === undefined) {
            return utils.Promise.resolve(this.store.filter(mapperName, query));
        } else {
            opts = opts || {};

            // bypass cache
            opts.force = true;
            return this.store.findAll(mapperName, query, opts);
        }
    }

    public search(mapperName: string, searchForm: F, opts?: any): Promise<S> {
        const query = this.createQueryFromForm(searchForm);

        console.log('findCurList for form', searchForm);
        const searchResult = this.createSearchResult(searchForm, 0, [], new Facets());

        const me = this;
        const result = new Promise<S>((resolve, reject) => {
            const options = {
                originalSearchForm: searchForm,
                force: false,
                limit: searchForm.perPage,
                offset: searchForm.pageNum - 1,
                // We want the newest posts first
                orderBy: [['created_at', 'desc']]
            };
            if (this.getAdapterForMapper(mapperName) === undefined ||
                (! (this.getAdapterForMapper(mapperName) instanceof GenericSearchHttpAdapter))) {
                // the resolve / reject functions control the fate of the promise
                me.findAll(mapperName, query, options).then(function doneFindAll(documents: R[]) {
                    searchResult.currentRecords = documents;
                    return me.count(mapperName, query, options);
                }).then(function doneCount(count: number) {
                    searchResult.recordCount = count;
                    return me.facets(mapperName, query, options);
                }).then(function doneFacets(facets: Facets) {
                    searchResult.facets = facets;
                    resolve(searchResult);
                }).catch(function errorHandling(reason) {
                    console.error('findCurList failed:' + reason);
                    reject(reason);
                });
            } else {
                opts = opts || {};
                options.force = true;

                const mapper = this.store.getMapper(mapperName);
                (<GenericSolrAdapter<R, F, S>>me.getAdapterForMapper(mapperName)).search(mapper, query, options)
                    .then(function doneSearch(genericSearchResult: S) {
                    searchResult.facets = genericSearchResult.facets;
                    searchResult.currentRecords = genericSearchResult.currentRecords;
                    searchResult.recordCount = genericSearchResult.recordCount;
                    resolve(searchResult);
                }).catch(function errorHandling(reason) {
                    console.error('findCurList failed:' + reason);
                    reject(reason);
                });
            }
        });

        return result;
    }


    public update<T extends Record>(mapperName: string, id: any, record: any, opts?: any): Promise<T> {
        if (this.getAdapterForMapper(mapperName) === undefined) {
            if (id === undefined || id === null) {
                return utils.Promise.reject('cant update records without id');
            }
            const readRecord: any = this.store.get(mapperName, id);
            if (readRecord === undefined || readRecord === null) {
                return utils.Promise.resolve(null);
            }

            record.id = id;
            return utils.Promise.resolve(this.store.add(mapperName, record, opts));
        } else {
            return this.store.update(mapperName, id, record, opts);
        }
    }


    public updateAll<T extends Record>(mapperName: string, props: any, query?: any, opts?: any): Promise<T[]> {
        if (this.getAdapterForMapper(mapperName) === undefined) {
            return utils.Promise.reject('cant do update all without adapter');
        } else {
            return this.store.updateAll(mapperName, props, query, opts);
        }
    }

    public updateMany<T extends Record>(mapperName: string, records: any[], opts?: any): Promise<T[]> {
        if (this.getAdapterForMapper(mapperName) === undefined) {
            return utils.Promise.reject('cant do update many without adapter');
        } else {
            return this.store.updateMany(mapperName, records, opts);
        }
    }

    abstract createQueryFromForm(searchForm: F): Object;

    abstract createSearchResult(searchForm: F, recordCount: number, records: R[], facets: Facets): S;

    public getMapper(mapperName: string): Mapper {
        return this.mappers.get(mapperName);
    }

    public getAdapterForMapper(mapperName: string): Adapter {
        if (this.mapperAdapters.get(mapperName) !== undefined) {
            return this.mapperAdapters.get(mapperName);
        }

        return this.mapperAdapters.get('');
    }
}
