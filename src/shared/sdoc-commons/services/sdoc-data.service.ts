import {SDocRecord, SDocRecordRelation} from '../model/records/sdoc-record';
import {SDocDataStore} from './sdoc-data.store';
import {SDocSearchService} from './sdoc-search.service';
import {SDocImageRecord, SDocImageRecordRelation} from '../model/records/sdocimage-record';
import {SDocImageRecordSchema} from '../model/schemas/sdocimage-record-schema';
import {SDocRecordSchema} from '../model/schemas/sdoc-record-schema';

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
    add(sdoc: SDocRecord, opts?: any): Promise<SDocRecord> {
        return this.dataStore.create('sdoc', sdoc, opts);
    }

    // Simulate POST /sdocs
    addMany(sdocs: SDocRecord[], opts?: any): Promise<SDocRecord[]> {
        return this.dataStore.createMany('sdoc', sdocs, opts);
    }

    // Simulate DELETE /sdocs/:id
    deleteById(id: string, opts?: any): Promise<SDocRecord> {
        return this.dataStore.destroy('sdoc', id, opts);
    }

    // Simulate PUT /sdocs/:id
    updateById(id: string, values: Object = {}, opts?: any): Promise<SDocRecord> {
        return this.dataStore.update('sdoc', id, values, opts);
    }
}
