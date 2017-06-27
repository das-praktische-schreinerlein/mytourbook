import {PDocRecord, PDocRecordRelation} from '../model/records/pdoc-record';
import {PDocDataStore} from './pdoc-data.store';
import {PDocSearchService} from './pdoc-search.service';
import {PDocRecordSchema} from '../model/schemas/pdoc-record-schema';

export class PDocDataService extends PDocSearchService {

    constructor(dataStore: PDocDataStore) {
        super(dataStore);
        this.dataStore.defineMapper('pdoc', PDocRecord, PDocRecordSchema, PDocRecordRelation);
    }

    generateNewId(): string {
        return (new Date()).getTime().toString();
    }

    createRecord(props, opts): PDocRecord {
        return <PDocRecord>this.dataStore.createRecord(this.searchMapperName, props, opts);
    }

    // Simulate POST /pdocs
    add(pdoc: PDocRecord): Promise<PDocRecord> {
        return this.dataStore.create('pdoc', pdoc);
    }

    // Simulate POST /pdocs
    addMany(pdocs: PDocRecord[]): Promise<PDocRecord[]> {
        return this.dataStore.createMany('pdoc', pdocs);
    }

    // Simulate DELETE /pdocs/:id
    deleteById(id: string): Promise<PDocRecord> {
        return this.dataStore.destroy('pdoc', id);
    }

    // Simulate PUT /pdocs/:id
    updateById(id: string, values: Object = {}): Promise<PDocRecord> {
        return this.dataStore.update('pdoc', id, values);
    }
}
