/* tslint:disable:no-unused-variable */
import {TourDocRecord, TourDocRecordRelation} from '../model/records/tdoc-record';
import {TourDocAdapterResponseMapper} from './tdoc-adapter-response.mapper';
import {TourDocDataTechRecord, TourDocDataTechRecordRelation} from '../model/records/tdocdatatech-record';
import {TourDocRatePersonalRecord, TourDocRatePersonalRecordRelation} from '../model/records/tdocratepers-record';
import {Mapper} from 'js-data';
import {TourDocDataStore} from './tdoc-data.store';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {TourDocRecordSchema} from '../model/schemas/tdoc-record-schema';
import {TourDocDataTechRecordSchema} from '../model/schemas/tdocdatatech-record-schema';
import {TourDocDataInfoRecord, TourDocDataInfoRecordRelation} from '../model/records/tdocdatainfo-record';
import {TourDocDataInfoRecordSchema} from '../model/schemas/tdocdatainfo-record-schema';
import {TourDocImageRecord, TourDocImageRecordRelation} from '../model/records/tdocimage-record';
import {TourDocImageRecordSchema} from '../model/schemas/tdocimage-record-schema';
import {TourDocVideoRecord, TourDocVideoRecordRelation} from '../model/records/tdocvideo-record';
import {TourDocVideoRecordSchema} from '../model/schemas/tdocvideo-record-schema';
import {TourDocRatePersonalRecordSchema} from '../model/schemas/tdocratepers-record-schema';
import {TourDocRateTechRecord, TourDocRateTechRecordRelation} from '../model/records/tdocratetech-record';
import {TourDocRateTechRecordSchema} from '../model/schemas/tdocratetech-record-schema';
import {
    TourDocObjectDetectionImageObjectRecord,
    TourDocObjectDetectionImageObjectRecordRelation
} from '../model/records/tdocobjectdetectectionimageobject-record';
import {TourDocObjectDetectionImageObjectRecordSchema} from '../model/schemas/tdocobjectdetectionimageobject-record-schema';
import {TourDocNavigationObjectRecord, TourDocNavigationObjectRecordRelation} from '../model/records/tdocnavigationobject-record';
import {TourDocNavigationObjectRecordSchema} from '../model/schemas/tdocnavigationobject-record-schema';
import {TourDocSqlMytbDbConfig} from './tdoc-sql-mytbdb.config';
import {
    TourDocExtendedObjectPropertyRecord,
    TourDocExtendedObjectPropertyRecordRelation
} from '../model/records/tdocextendedobjectproperty-record';
import {TourDocExtendedObjectPropertyRecordSchema} from '../model/schemas/tdocextendedobjectproperty-record-schema';
import {TourDocLinkedRouteRecord, TourDocLinkedRouteRecordRelation} from '../model/records/tdoclinkedroute-record';
import {TourDocLinkedRouteRecordSchema} from '../model/schemas/tdoclinkedroute-record-schema';
import {TourDocInfoRecord, TourDocInfoRecordRelation} from '../model/records/tdocinfo-record';
import {TourDocInfoRecordSchema} from '../model/schemas/tdocinfo-record-schema';
import {TourDocLinkedInfoRecordSchema} from '../model/schemas/tdoclinkedinfo-record-schema';
import {TourDocLinkedInfoRecord, TourDocLinkedInfoRecordRelation} from '../model/records/tdoclinkedinfo-record';
import {TourDocLinkedPlaylistRecord, TourDocLinkedPlaylistRecordRelation} from '../model/records/tdoclinkedplaylist-record';
import {TourDocLinkedPlaylistRecordSchema} from '../model/schemas/tdoclinkedplaylist-record-schema';

describe('TourDocAdapterResponseMapper', () => {
    let datastore: TourDocDataStore;
    let mapper: Mapper;
    let service: TourDocAdapterResponseMapper;
    const config =  {
        mapperConfig: {
            allowedKeywordPatterns: [],
            replaceKeywordPatterns: []
        }
    };

    beforeEach(() => {
        datastore = new TourDocDataStore(new SearchParameterUtils(), null);
        service = new TourDocAdapterResponseMapper(config);
        datastore.defineMapper('tdoc', TourDocRecord, TourDocRecordSchema, TourDocRecordRelation);
        datastore.defineMapper('tdocdatatech', TourDocDataTechRecord, TourDocDataTechRecordSchema, TourDocDataTechRecordRelation);
        datastore.defineMapper('tdocdatainfo', TourDocDataInfoRecord, TourDocDataInfoRecordSchema, TourDocDataInfoRecordRelation);
        datastore.defineMapper('tdocinfo', TourDocInfoRecord, TourDocInfoRecordSchema, TourDocInfoRecordRelation);
        datastore.defineMapper('tdocimage', TourDocImageRecord, TourDocImageRecordSchema, TourDocImageRecordRelation);
        datastore.defineMapper('tdocvideo', TourDocVideoRecord, TourDocVideoRecordSchema, TourDocVideoRecordRelation);
        datastore.defineMapper('tdocratepers', TourDocRatePersonalRecord, TourDocRatePersonalRecordSchema,
            TourDocRatePersonalRecordRelation);
        datastore.defineMapper('tdocratetech', TourDocRateTechRecord, TourDocRateTechRecordSchema,
            TourDocRateTechRecordRelation);
        datastore.defineMapper('tdocodimageobject', TourDocObjectDetectionImageObjectRecord,
            TourDocObjectDetectionImageObjectRecordSchema, TourDocObjectDetectionImageObjectRecordRelation);
        datastore.defineMapper('tdocnavigationobject', TourDocNavigationObjectRecord,
            TourDocNavigationObjectRecordSchema, TourDocNavigationObjectRecordRelation);
        datastore.defineMapper('tdocextendedobjectproperty', TourDocExtendedObjectPropertyRecord,
            TourDocExtendedObjectPropertyRecordSchema, TourDocExtendedObjectPropertyRecordRelation);
        datastore.defineMapper('tdoclinkedroute', TourDocLinkedRouteRecord,
            TourDocLinkedRouteRecordSchema, TourDocLinkedRouteRecordRelation);
        datastore.defineMapper('tdoclinkedinfo', TourDocLinkedInfoRecord,
            TourDocLinkedInfoRecordSchema, TourDocLinkedInfoRecordRelation);
        datastore.defineMapper('tdoclinkedplaylist', TourDocLinkedPlaylistRecord,
            TourDocLinkedPlaylistRecordSchema, TourDocLinkedPlaylistRecordRelation);
        mapper = datastore.getMapper('tdoc');
    });

    it('should ...', done => {
        // WHEN/THEN
        expect(service).toBeTruthy();
        done();
    });

    describe('#mapValuesToRecord()', () => {
        it('mapValuesToRecord database kategorie', done => {
            // WHEN http://localhost:4100/api/v1/de/tdoc/TRACK_9 with TourDocSqlMytbDbAdapter
            const sqlSrcValues = {
                'type': 'TRACK',
                'k_type': 4,
                'id': 'TRACK_9',
                'k_id': 9,
                'k_name': 'Ausflug Liepnitzsee 01.01.2000',
                'html': 'Ausflug Liepnitzsee 01.01.2000 Jetzt ist wirklich Frühling.',
                'k_dateshow': '2000-01-01T22:00:00.000Z',
                'k_datevon': '2000-01-01T22:00:00.000Z',
                'k_meta_shortdesc': 'Jetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.',
                'k_meta_shortdesc_md': 'Jetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.',
                'k_meta_shortdesc_html': 'Jetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.',
                'k_keywords': 'Ausflug, KW_Bootfahren, KW_Frühling'
            };
            const expected  = {
                'dateshow': '2000-01-01T23:00:00',
                'datestart': '2000-01-01T23:00:00',
                'techName': 'ausflug_liepnitzsee_01_01_2000',
                'trackId': 9,
                'descTxt': 'Jetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.',
                'descMd': 'Jetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.',
                'descHtml': 'Jetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.',
                'keywords': 'Ausflug, KW_Bootfahren, KW_Frühling',
                'name': 'Ausflug Liepnitzsee 01.01.2000',
                'type': 'TRACK',
                'id': 'TRACK_9',
                'tdocimages': [],
                'tdocvideos': [],
                'tdocodimageobjects': [],
                'tdocnavigationobjects': [],
                'tdocextendedobjectproperties': [],
                'tdoclinkedroutes': [],
                'tdoclinkedinfos': [],
                'tdoclinkedplaylists': []
            };
            const res = <TourDocRecord>service.mapResponseDocument(mapper, sqlSrcValues,
                TourDocSqlMytbDbConfig.tableConfigs.track.fieldMapping);

            // THEN
            expect(JSON.stringify(res.toSerializableJsonObj(false), null, 2)).toEqual(JSON.stringify(expected, null, 2));

            done();
        });

        it('mapValuesToRecord solr-data track', done => {
            // WHEN http://localhost:4100/api/v1/de/tdoc/TRACK_9 with TourDocSolrAdapter
            const sqlSrcValues = {
                'desc_md_txt': [
                    'Jetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.'
                ],
                'type_s': 'TRACK',
                'id': 'TRACK_9',
                'keywords_txt': [
                    'KW_Bootfahren,,KW_Frühling,,KW_Kurztour'
                ],
                'desc_html_txt': [
                    '<p>Jetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.</p>'
                ],
                'persons_txt': [
                    'Micha'
                ],
                'name_s': 'Ausflug Liepnitzsee 01.01.2000',
                'track_id_i': 9,
                'desc_txt': [
                    '\nJetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.\n'
                ],
                'dateshow_dt': '2000-01-01T00:00:00Z',
                'navigation_objects_txt': [
                    'navid=TRACK_8:::name=Dienstreise 01.01.2000:::navtype=PREDECESSOR',
                    'navid=TRACK_10:::name=Ausflug Schlaubetal 01.01.2000:::navtype=SUCCESSOR'
                ],
                'linkedroutes_txt': [
                    'type=subroute:::name=Dienstreise 01.01.2000:::refId=1200:::full=1',
                    'type=subroute:::name=Dienstreise:::refId=1201:::full=true',
                    'type=subroute:::name=Ausflug Schlaubetal 01.01.2000:::refId=1202:::full=false',
                    'type=subroute:::name=Ausflug Schlaubetal:::refId=1203:::full=0'
                ],
                'i_fav_url_txt': [
                    'd__micha_bilder_digifotos_20000101-Liepnitzsee/IMAG0020.JPG'
                ]
            };
            const expected  = {
                'dateshow': '2000-01-01T01:00:00',
                'techName': 'ausflug_liepnitzsee_01_01_2000',
                'trackId': 9,
                'descTxt': '\nJetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.\n',
                'descMd': 'Jetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.',
                'descHtml': '<p>Jetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.</p>',
                'keywords': 'KW_Bootfahren, KW_Frühling, KW_Kurztour',
                'name': 'Ausflug Liepnitzsee 01.01.2000',
                'persons': 'Micha',
                'type': 'TRACK',
                'id': 'TRACK_9',
                'tdocimages': [
                    {
                        'fileName': 'd__micha_bilder_digifotos_20000101-Liepnitzsee/IMAG0020.JPG',
                        'name': 'Ausflug Liepnitzsee 01.01.2000',
                        'tdoc_id': 'TRACK_9',
                        'id': '9000000TRACK_9'
                    }
                ],
                'tdocvideos': [],
                'tdocodimageobjects': [],
                'tdocnavigationobjects': [
                    {
                        'name': 'Dienstreise 01.01.2000',
                        'navid': 'TRACK_8',
                        'navtype': 'PREDECESSOR',
                        'tdoc_id': 'TRACK_9',
                        'id': '9000000TRACK_9'
                    },
                    {
                        'name': 'Ausflug Schlaubetal 01.01.2000',
                        'navid': 'TRACK_10',
                        'navtype': 'SUCCESSOR',
                        'tdoc_id': 'TRACK_9',
                        'id': '9000001TRACK_9'
                    }
                ],
                'tdocextendedobjectproperties': [],
                'tdoclinkedroutes': [
                    {
                        'type': 'subroute',
                        'name': 'Dienstreise 01.01.2000',
                        'full': true,
                        'refId': '1200',
                        'tdoc_id': 'TRACK_9',
                        'id': '9000000TRACK_9'
                    },
                    {
                        'type': 'subroute',
                        'name': 'Dienstreise',
                        'full': true,
                        'refId': '1201',
                        'tdoc_id': 'TRACK_9',
                        'id': '9000001TRACK_9'
                    },
                    {
                        'type': 'subroute',
                        'name': 'Ausflug Schlaubetal 01.01.2000',
                        'full': false,
                        'refId': '1202',
                        'tdoc_id': 'TRACK_9',
                        'id': '9000002TRACK_9'
                    },
                    {
                        'type': 'subroute',
                        'name': 'Ausflug Schlaubetal',
                        'full': false,
                        'refId': '1203',
                        'tdoc_id': 'TRACK_9',
                        'id': '9000003TRACK_9'
                    }
                ],
                'tdoclinkedinfos': [],
                'tdoclinkedplaylists': []
            };
            const res = <TourDocRecord>service.mapResponseDocument(mapper, sqlSrcValues, {});

            // THEN
            expect(JSON.stringify(res.toSerializableJsonObj(false), null, 2)).toEqual(JSON.stringify(expected, null, 2));

            done();
        });
    });
});
