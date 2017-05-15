// DataStore is mostly recommended for use in the browser
import {DataStore, Schema, utils, Record} from 'js-data';
import {Adapter} from 'js-data-adapter';
import {TrackRecord} from '../model/records/track-record';
import {TrackRecordSchema} from '../model/schemas/track-record-schema';
import {Injectable} from '@angular/core';

@Injectable()
export class TrackDataStore {
    private adapter: Adapter;
    private store: DataStore;

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
                    if (Array.isArray(result)) {
                        result.forEach(this.convertToDate);
                    } else if (this.is(result)) {
                        TrackDataStore.convertToDate(result);
                    }
                    return result;
                }
            }
        });
        this.store.defineMapper('track', {
            recordClass: TrackRecord,
            applySchema: true,
            schema: TrackRecordSchema
        });
    }

    public createRecord(mapperName: string, props, opts): any {
        return this.store.createRecord(mapperName, props, opts);
    }

    public create(mapperName: string, record: any, opts?: any): Promise<any> {
        if (this.adapter === undefined) {
            return utils.Promise.resolve(this.store.add(mapperName, record, opts));
        } else {
            return this.store.create(mapperName, record, opts);
        }
    }

    public createMany(mapperName: string, records: any[], opts?: any): Promise<any[]> {
        if (this.adapter === undefined) {
            return utils.Promise.resolve(this.store.add(mapperName, records, opts));
        } else {
            return this.store.createMany(mapperName, records, opts);
        }
    }

    public update(mapperName: string, id: any, record: any, opts?: any): Promise<any> {
        if (this.adapter === undefined) {
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

    public updateMany(mapperName: string, records: any[], opts?: any): Promise<any[]> {
        if (this.adapter === undefined) {
            return utils.Promise.reject('cant do update many without adapter');
        } else {
            return this.store.updateMany(mapperName, records, opts);
        }
    }

    public updateAll(mapperName: string, props: any, query?: any, opts?: any): Promise<any[]> {
        if (this.adapter === undefined) {
            return utils.Promise.reject('cant do update all without adapter');
        } else {
            return this.store.updateAll(mapperName, props, query, opts);
        }
    }

    public find(mapperName: string, id: any, opts?: any): Promise<any> {
        if (this.adapter === undefined) {
            return utils.Promise.resolve(this.store.get(mapperName, id));
        } else {
            return this.store.find(mapperName, id, opts);
        }
    }

    public findAll(mapperName: string, query?: any, opts?: any): Promise<any[]> {
        if (this.adapter === undefined) {
            return utils.Promise.resolve(this.store.filter(mapperName, query));
        } else {
            return this.store.findAll(mapperName, query, opts);
        }
    }

    public destroy(mapperName: string, id: any, opts?: any): Promise<any> {
        if (this.adapter === undefined) {
            return utils.Promise.resolve(this.store.remove(mapperName, id, opts));
        } else {
            return this.store.destroy(mapperName, id, opts);
        }
    }

}
