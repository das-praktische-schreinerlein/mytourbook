// DataStore is mostly recommended for use in the browser
import {DataStore, Mapper, Record, Schema, utils} from 'js-data';
import {Adapter} from 'js-data-adapter';
import {Injectable} from '@angular/core';

@Injectable()
export class GenericDataStore {

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
                    const result = this.constructor.prototype.createRecord.call(this, props, opts);
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

    public updateMany<T extends Record>(mapperName: string, records: any[], opts?: any): Promise<T[]> {
        if (this.getAdapterForMapper(mapperName) === undefined) {
            return utils.Promise.reject('cant do update many without adapter');
        } else {
            return this.store.updateMany(mapperName, records, opts);
        }
    }

    public updateAll<T extends Record>(mapperName: string, props: any, query?: any, opts?: any): Promise<T[]> {
        if (this.getAdapterForMapper(mapperName) === undefined) {
            return utils.Promise.reject('cant do update all without adapter');
        } else {
            return this.store.updateAll(mapperName, props, query, opts);
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
            return this.store.findAll(mapperName, query, opts);
        }
    }

    public destroy<T extends Record>(mapperName: string, id: any, opts?: any): Promise<T> {
        if (this.getAdapterForMapper(mapperName) === undefined) {
            return utils.Promise.resolve(this.store.remove(mapperName, id, opts));
        } else {
            return this.store.destroy(mapperName, id, opts);
        }
    }

    private getAdapterForMapper(mapperName: string): Adapter {
        if (this.mapperAdapters.get(mapperName) !== undefined) {
            return this.mapperAdapters.get(mapperName);
        }

        return this.mapperAdapters.get('');
    }
}
