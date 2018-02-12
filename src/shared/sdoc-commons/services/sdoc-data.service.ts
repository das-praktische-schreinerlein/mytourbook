import {SDocRecord, SDocRecordRelation} from '../model/records/sdoc-record';
import {SDocDataStore} from './sdoc-data.store';
import {SDocSearchService} from './sdoc-search.service';
import {SDocImageRecord, SDocImageRecordRelation} from '../model/records/sdocimage-record';
import {SDocImageRecordSchema} from '../model/schemas/sdocimage-record-schema';
import {SDocRecordSchema} from '../model/schemas/sdoc-record-schema';
import {SDocRateTechRecord, SDocRateTechRecordRelation} from '../model/records/sdocratetech-record';
import {SDocDataTechRecordSchema} from '../model/schemas/sdocdatatech-record-schema';
import {SDocDataTechRecord, SDocDataTechRecordRelation} from '../model/records/sdocdatatech-record';
import {SDocRateTechRecordSchema} from '../model/schemas/sdocratetech-record-schema';
import {SDocRatePersonalRecordSchema} from '../model/schemas/sdocratepers-record-schema';
import {SDocRatePersonalRecord, SDocRatePersonalRecordRelation} from '../model/records/sdocratepers-record';
import {SDocDataInfoRecord, SDocDataInfoRecordRelation} from '../model/records/sdocdatainfo-record';
import {SDocDataInfoRecordSchema} from '../model/schemas/sdocdatainfo-record-schema';
import {SDocAdapterResponseMapper} from './sdoc-adapter-response.mapper';
import {ActionTagForm} from '../../commons/utils/actiontag.utils';
import {utils} from 'js-data';

export class SDocDataService extends SDocSearchService {
    private responseMapper = new SDocAdapterResponseMapper();
    private writable = false;

    constructor(dataStore: SDocDataStore) {
        super(dataStore);
        this.dataStore.defineMapper('sdoc', SDocRecord, SDocRecordSchema, SDocRecordRelation);
        this.dataStore.defineMapper('sdocdatatech', SDocDataTechRecord, SDocDataTechRecordSchema, SDocDataTechRecordRelation);
        this.dataStore.defineMapper('sdocdatainfo', SDocDataInfoRecord, SDocDataInfoRecordSchema, SDocDataInfoRecordRelation);
        this.dataStore.defineMapper('sdocimage', SDocImageRecord, SDocImageRecordSchema, SDocImageRecordRelation);
        this.dataStore.defineMapper('sdocratepers', SDocRatePersonalRecord, SDocRatePersonalRecordSchema, SDocRatePersonalRecordRelation);
        this.dataStore.defineMapper('sdocratetech', SDocRateTechRecord, SDocRateTechRecordSchema, SDocRateTechRecordRelation);
    }

    generateNewId(): string {
        return (new Date()).getTime().toString();
    }

    createRecord(props, opts): SDocRecord {
        return <SDocRecord>this.dataStore.createRecord(this.searchMapperName, props, opts);
    }

    add(values: {}, opts?: any): Promise<SDocRecord> {
        if (!this.isWritable()) {
            throw new Error('SDocDataService configured: not writable');
        }

        let record: SDocRecord;
        if (! (values instanceof SDocRecord)) {
            record = this.responseMapper.mapValuesToRecord(this.dataStore.getMapper('sdoc'), values);
        } else {
            record = values;
        }

        if (record === undefined || !record.isValid()) {
            utils.reject('sdo-values not valid');
        }

        return this.dataStore.create('sdoc', record, opts);
    }

    addMany(sdocs: SDocRecord[], opts?: any): Promise<SDocRecord[]> {
        if (!this.isWritable()) {
            throw new Error('SDocDataService configured: not writable');
        }
        return this.dataStore.createMany('sdoc', sdocs, opts);
    }

    deleteById(id: string, opts?: any): Promise<SDocRecord> {
        if (!this.isWritable()) {
            throw new Error('SDocDataService configured: not writable');
        }
        return this.dataStore.destroy('sdoc', id, opts);
    }

    updateById(id: string, values: {}, opts?: any): Promise<SDocRecord> {
        if (!this.isWritable()) {
            throw new Error('SDocDataService configured: not writable');
        }

        let record: SDocRecord;
        if (! (values instanceof SDocRecord)) {
            record = this.responseMapper.mapValuesToRecord(this.dataStore.getMapper('sdoc'), values);
        } else {
            record = values;
        }

        if (record === undefined || !record.isValid()) {
            utils.reject('sdoc-values not valid');
        }

        return this.dataStore.update('sdoc', id, record, opts);
    }

    doActionTag(sdocRecord: SDocRecord, actionTagForm: ActionTagForm, opts?: any): Promise<SDocRecord> {
        if (!this.isWritable()) {
            throw new Error('SDocDataService configured: not writable');
        }

        return this.dataStore.doActionTag('sdoc', sdocRecord, actionTagForm, opts);
    }

    setWritable(writable: boolean) {
        this.writable = writable;
    }

    isWritable(): boolean {
        return this.writable;
    }
}
