import {TourDocRecord, TourDocRecordRelation} from '../model/records/tdoc-record';
import {TourDocDataStore} from './tdoc-data.store';
import {TourDocSearchService} from './tdoc-search.service';
import {TourDocImageRecord, TourDocImageRecordRelation} from '../model/records/tdocimage-record';
import {TourDocImageRecordSchema} from '../model/schemas/tdocimage-record-schema';
import {TourDocRecordSchema} from '../model/schemas/tdoc-record-schema';
import {TourDocRateTechRecord, TourDocRateTechRecordRelation} from '../model/records/tdocratetech-record';
import {TourDocDataTechRecordSchema} from '../model/schemas/tdocdatatech-record-schema';
import {TourDocDataTechRecord, TourDocDataTechRecordRelation} from '../model/records/tdocdatatech-record';
import {TourDocRateTechRecordSchema} from '../model/schemas/tdocratetech-record-schema';
import {TourDocRatePersonalRecordSchema} from '../model/schemas/tdocratepers-record-schema';
import {TourDocRatePersonalRecord, TourDocRatePersonalRecordRelation} from '../model/records/tdocratepers-record';
import {TourDocDataInfoRecord, TourDocDataInfoRecordRelation} from '../model/records/tdocdatainfo-record';
import {TourDocDataInfoRecordSchema} from '../model/schemas/tdocdatainfo-record-schema';
import {TourDocAdapterResponseMapper} from './tdoc-adapter-response.mapper';
import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {TourDocVideoRecord, TourDocVideoRecordRelation} from '../model/records/tdocvideo-record';
import {TourDocVideoRecordSchema} from '../model/schemas/tdocvideo-record-schema';
import {TourDocSearchForm} from '../model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../model/container/tdoc-searchresult';
import {CommonDocDataService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-data.service';
import {
    TourDocObjectDetectionImageObjectRecord,
    TourDocObjectDetectionImageObjectRecordRelation
} from '../model/records/tdocobjectdetectectionimageobject-record';
import {TourDocObjectDetectionImageObjectRecordSchema} from '../model/schemas/tdocobjectdetectionimageobject-record-schema';

export class TourDocDataService extends CommonDocDataService<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {
    public defaultLocIdParent = 1;

    constructor(dataStore: TourDocDataStore) {
        super(dataStore, new TourDocSearchService(dataStore), new TourDocAdapterResponseMapper({}));
    }

    public createRecord(props, opts): TourDocRecord {
        return <TourDocRecord>this.dataStore.createRecord(this.getBaseMapperName(), props, opts);
    }

    protected addAdditionalActionTagForms(origTdocRecord: TourDocRecord, newTdocRecord: TourDocRecord,
                                          actionTagForms: ActionTagForm[]) {
        for (let person of (origTdocRecord.persons ? origTdocRecord.persons.split(',') : [])) {
            person = person.trim();
            const actionTagForm: ActionTagForm =  {
                type: 'tag',
                recordId: newTdocRecord.id,
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
        this.dataStore.defineMapper('tdoc', TourDocRecord, TourDocRecordSchema, TourDocRecordRelation);
        this.dataStore.defineMapper('tdocdatatech', TourDocDataTechRecord, TourDocDataTechRecordSchema, TourDocDataTechRecordRelation);
        this.dataStore.defineMapper('tdocdatainfo', TourDocDataInfoRecord, TourDocDataInfoRecordSchema, TourDocDataInfoRecordRelation);
        this.dataStore.defineMapper('tdocimage', TourDocImageRecord, TourDocImageRecordSchema, TourDocImageRecordRelation);
        this.dataStore.defineMapper('tdocvideo', TourDocVideoRecord, TourDocVideoRecordSchema, TourDocVideoRecordRelation);
        this.dataStore.defineMapper('tdocratepers', TourDocRatePersonalRecord, TourDocRatePersonalRecordSchema, TourDocRatePersonalRecordRelation);
        this.dataStore.defineMapper('tdocratetech', TourDocRateTechRecord, TourDocRateTechRecordSchema, TourDocRateTechRecordRelation);
        this.dataStore.defineMapper('tdocodimageobject', TourDocObjectDetectionImageObjectRecord, TourDocObjectDetectionImageObjectRecordSchema, TourDocObjectDetectionImageObjectRecordRelation);
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

    protected onImportRecordNewRecordProcessDefaults(record: TourDocRecord): void {
        record.subtype = record.subtype ? record.subtype.replace(/[-a-zA-Z_]+/g, '') : '';
        if (record.type.toLowerCase() === 'location' && record.locIdParent === undefined
            && record.locId !== this.defaultLocIdParent) {
            record.locIdParent = this.defaultLocIdParent;
        }
    }
}
