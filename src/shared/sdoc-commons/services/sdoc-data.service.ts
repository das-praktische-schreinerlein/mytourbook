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
import {SDocVideoRecord, SDocVideoRecordRelation} from '../model/records/sdocvideo-record';
import {SDocVideoRecordSchema} from '../model/schemas/sdocvideo-record-schema';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {CommonDocDataService} from '../../search-commons/services/cdoc-data.service';

export class SDocDataService extends CommonDocDataService<SDocRecord, SDocSearchForm, SDocSearchResult> {
    public defaultLocIdParent = 1;

    constructor(dataStore: SDocDataStore) {
        super(dataStore, new SDocSearchService(dataStore), new SDocAdapterResponseMapper({}));
    }

    public createRecord(props, opts): SDocRecord {
        return <SDocRecord>this.dataStore.createRecord(this.getBaseMapperName(), props, opts);
    }

    protected addAdditionalActionTagForms(origSdocRecord: SDocRecord, newSdocRecord: SDocRecord,
                                          actionTagForms: ActionTagForm[]) {
        for (let person of (origSdocRecord.persons ? origSdocRecord.persons.split(',') : [])) {
            person = person.trim();
            const actionTagForm: ActionTagForm =  {
                type: 'tag',
                recordId: newSdocRecord.id,
                key: 'objects_' + person,
                payload: {
                    objectkey: person,
                    set: true
                }
            };
            actionTagForms.push(actionTagForm);
        }
    }

    protected defineDatastoreMapper(): void {
        this.dataStore.defineMapper('sdoc', SDocRecord, SDocRecordSchema, SDocRecordRelation);
        this.dataStore.defineMapper('sdocdatatech', SDocDataTechRecord, SDocDataTechRecordSchema, SDocDataTechRecordRelation);
        this.dataStore.defineMapper('sdocdatainfo', SDocDataInfoRecord, SDocDataInfoRecordSchema, SDocDataInfoRecordRelation);
        this.dataStore.defineMapper('sdocimage', SDocImageRecord, SDocImageRecordSchema, SDocImageRecordRelation);
        this.dataStore.defineMapper('sdocvideo', SDocVideoRecord, SDocVideoRecordSchema, SDocVideoRecordRelation);
        this.dataStore.defineMapper('sdocratepers', SDocRatePersonalRecord, SDocRatePersonalRecordSchema, SDocRatePersonalRecordRelation);
        this.dataStore.defineMapper('sdocratetech', SDocRateTechRecord, SDocRateTechRecordSchema, SDocRateTechRecordRelation);
    }

    protected defineIdMappingAlliases(): {} {
        return {
            'locIdParent': 'locId'
        };
    }

    protected defineIdMappings(): string[] {
        return ['locId', 'locIdParent', 'routeId', 'trackId', 'tripId', 'newsId', 'imageId', 'videoId'];
    }

    protected defineTypeMappings(): {} {
        return {
            image: 'imageId',
            video: 'videoId',
            track: 'trackId',
            location: 'locId',
            route: 'routeId',
            trip: 'tripId',
            news: 'newsId'
        };
    }

    protected onImportRecordNewRecordProcessDefaults(record: SDocRecord): void {
        record.subtype = record.subtype ? record.subtype.replace(/[-a-zA-Z_]+/g, '') : '';
        if (record.type.toLowerCase() === 'location' && record.locIdParent === undefined
            && record.locId !== this.defaultLocIdParent) {
            record.locIdParent = this.defaultLocIdParent;
        }
    }
}
