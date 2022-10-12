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
import {TourDocNavigationObjectRecord, TourDocNavigationObjectRecordRelation} from '../model/records/tdocnavigationobject-record';
import {TourDocNavigationObjectRecordSchema} from '../model/schemas/tdocnavigationobject-record-schema';
import {
    TourDocExtendedObjectPropertyRecord,
    TourDocExtendedObjectPropertyRecordRelation
} from '../model/records/tdocextendedobjectproperty-record';
import {TourDocExtendedObjectPropertyRecordSchema} from '../model/schemas/tdocextendedobjectproperty-record-schema';
import {TourDocLinkedRouteRecord, TourDocLinkedRouteRecordRelation} from '../model/records/tdoclinkedroute-record';
import {TourDocLinkedRouteRecordSchema} from '../model/schemas/tdoclinkedroute-record-schema';
import {TourDocInfoRecord, TourDocInfoRecordRelation} from '../model/records/tdocinfo-record';
import {TourDocInfoRecordSchema} from '../model/schemas/tdocinfo-record-schema';
import {TourDocLinkedInfoRecord, TourDocLinkedInfoRecordRelation} from '../model/records/tdoclinkedinfo-record';
import {TourDocLinkedInfoRecordSchema} from '../model/schemas/tdoclinkedinfo-record-schema';
import {TourDocLinkedPlaylistRecord, TourDocLinkedPlaylistRecordRelation} from '../model/records/tdoclinkedplaylist-record';
import {TourDocLinkedPlaylistRecordSchema} from '../model/schemas/tdoclinkedplaylist-record-schema';
import {BaseJoinRecord} from '@dps/mycms-commons/dist/search-commons/model/records/basejoin-record';

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
        for (let object of (origTdocRecord.objects ? origTdocRecord.objects.split(',') : [])) {
            object = object.trim();
            const actionTagForm: ActionTagForm =  {
                type: 'tag',
                recordId: newTdocRecord.id,
                key: 'objects_' + object,
                payload: {
                    objectkey: object,
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
        this.dataStore.defineMapper('tdocinfo', TourDocInfoRecord, TourDocInfoRecordSchema, TourDocInfoRecordRelation);
        this.dataStore.defineMapper('tdocimage', TourDocImageRecord, TourDocImageRecordSchema, TourDocImageRecordRelation);
        this.dataStore.defineMapper('tdocvideo', TourDocVideoRecord, TourDocVideoRecordSchema, TourDocVideoRecordRelation);
        this.dataStore.defineMapper('tdocratepers', TourDocRatePersonalRecord, TourDocRatePersonalRecordSchema,
            TourDocRatePersonalRecordRelation);
        this.dataStore.defineMapper('tdocratetech', TourDocRateTechRecord, TourDocRateTechRecordSchema,
            TourDocRateTechRecordRelation);
        this.dataStore.defineMapper('tdocodimageobject', TourDocObjectDetectionImageObjectRecord,
            TourDocObjectDetectionImageObjectRecordSchema, TourDocObjectDetectionImageObjectRecordRelation);
        this.dataStore.defineMapper('tdocnavigationobject', TourDocNavigationObjectRecord,
            TourDocNavigationObjectRecordSchema, TourDocNavigationObjectRecordRelation);
        this.dataStore.defineMapper('tdocextendedobjectproperty', TourDocExtendedObjectPropertyRecord,
            TourDocExtendedObjectPropertyRecordSchema, TourDocExtendedObjectPropertyRecordRelation);
        this.dataStore.defineMapper('tdoclinkedroute', TourDocLinkedRouteRecord,
            TourDocLinkedRouteRecordSchema, TourDocLinkedRouteRecordRelation);
        this.dataStore.defineMapper('tdoclinkedinfo', TourDocLinkedInfoRecord,
            TourDocLinkedInfoRecordSchema, TourDocLinkedInfoRecordRelation);
        this.dataStore.defineMapper('tdoclinkedplaylist', TourDocLinkedPlaylistRecord,
            TourDocLinkedPlaylistRecordSchema, TourDocLinkedPlaylistRecordRelation);
    }

    protected defineIdMappingAlliases(): {} {
        return {
            'locIdParent': 'locId'
        };
    }

    protected defineIdMappings(): string[] {
        return ['locId', 'locIdParent', 'routeId', 'trackId', 'tripId', 'newsId', 'imageId', 'videoId', 'infoId', 'playlistId'];
    }

    protected defineTypeMappings(): {} {
        return {
            image: 'imageId',
            info: 'infoId',
            video: 'videoId',
            track: 'trackId',
            location: 'locId',
            playlist: 'playlistId',
            route: 'routeId',
            trip: 'tripId',
            news: 'newsId'
        };
    }

    protected onImportRecordNewRecordProcessDefaults(record: TourDocRecord, recordIdMapping?: {}, recordRecoverIdMapping?: {}): void {
        record.subtype = record.subtype ? record.subtype.replace(/[-a-zA-Z_]+/g, '') : '';
        if (record.type.toLowerCase() === 'location' && record.locIdParent === undefined
            && record.locId !== this.defaultLocIdParent) {
            record.locIdParent = this.defaultLocIdParent;
        }

        this.remapBaseJoins(<TourDocLinkedInfoRecord[]> record['tdoclinkedinfos'], 'infoId',
            recordIdMapping, recordRecoverIdMapping);
        this.remapBaseJoins(<TourDocLinkedInfoRecord[]> record['tdoclinkedroutes'], 'routeId',
            recordIdMapping, recordRecoverIdMapping);
        this.remapBaseJoins(<TourDocLinkedInfoRecord[]> record['tdoclinkedplaylists'], 'playlistId',
            recordIdMapping, recordRecoverIdMapping);
    }

    protected remapBaseJoins(baseJoins: BaseJoinRecord[], refIdFieldName: any, recordIdMapping?: {}, recordRecoverIdMapping?: {}): void {
        if (baseJoins) {
            for (const join of baseJoins) {
                const refIdMapping = recordIdMapping[refIdFieldName];
                const refId = join.refId;
                if (refIdMapping && refIdMapping[refId]) {
                    console.log('orig join: ' + join.id + ' map join ref ' + refIdFieldName + ' ' + refId
                        + '->' + refIdMapping[refId]);
                    join.refId = refIdMapping[refId] + '';
                } else {
                    console.warn('WARNING NO Id-Mapping orig join: ' + join.id + ' map baseJoin ref ' + refIdFieldName + ' ' + refId
                        + '->' + refIdMapping[refId]);
                }
            }
        }
    }

    protected generateImportRecordQuery(record: TourDocRecord): {} {
        if ('poi' === record.type.toLowerCase() && record['tdocdatainfo'] && (<TourDocDataInfoRecord>record['tdocdatainfo']).guides) {
            return {
                where: {
                    name_s: {
                        'in': [record.name]
                    },
                    data_info_guides_s: {
                        'in': [(<TourDocDataInfoRecord>record['tdocdatainfo']).guides],
                    },
                    type_txt: {
                        'in': [record.type.toLowerCase()]
                    }
                }
            }
        }

        return {
            where: {
                name_s: {
                    'in': [record.name]
                },
                type_txt: {
                    'in': [record.type.toLowerCase()]
                }
            }
        };
    }

}
