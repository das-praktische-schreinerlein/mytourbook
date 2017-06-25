import {Injectable} from '@angular/core';
import {SDocRecord, SDocRecordRelation} from '../model/records/sdoc-record';
import {SDocDataStore} from '../../sdocbackend/services/sdoc-data.store';
import {SDocSearchService} from './sdoc-search.service';
import {SDocImageRecord, SDocImageRecordRelation} from '../model/records/sdocimage-record';
import {SDocImageRecordSchema} from '../model/schemas/sdocimage-record-schema';
import {SDocRecordSchema} from '../model/schemas/sdoc-record-schema';

@Injectable()
export class SDocDataService extends SDocSearchService {

    constructor(dataStore: SDocDataStore) {
        super(dataStore);
        this.dataStore.defineMapper('sdoc', SDocRecord, SDocRecordSchema, SDocRecordRelation);
        this.dataStore.defineMapper('sdocimage', SDocImageRecord, SDocImageRecordSchema, SDocImageRecordRelation);
    }

    generateNewId(): string {
        return (new Date()).getTime().toString();
    }

    createRecord(props, opts): SDocRecord {
        return <SDocRecord>this.dataStore.createRecord(this.searchMapperName, props, opts);
    }

    // Simulate POST /sdocs
    add(sdoc: SDocRecord): Promise<SDocRecord> {
        return this.dataStore.create('sdoc', sdoc);
    }

    // Simulate POST /sdocs
    addMany(sdocs: SDocRecord[]): Promise<SDocRecord[]> {
        return this.dataStore.createMany('sdoc', sdocs);
    }

    // Simulate DELETE /sdocs/:id
    deleteById(id: string): Promise<SDocRecord> {
        return this.dataStore.destroy('sdoc', id);
    }

    // Simulate PUT /sdocs/:id
    updateById(id: string, values: Object = {}): Promise<SDocRecord> {
        return this.dataStore.update('sdoc', id, values);
    }
}
