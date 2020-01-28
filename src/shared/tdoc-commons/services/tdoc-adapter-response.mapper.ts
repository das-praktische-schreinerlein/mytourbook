import {Mapper, Record} from 'js-data';
import {TourDocRecord, TourDocRecordFactory} from '../model/records/tdoc-record';
import {TourDocImageRecord, TourDocImageRecordFactory} from '../model/records/tdocimage-record';
import {MapperUtils} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {GenericAdapterResponseMapper} from '@dps/mycms-commons/dist/search-commons/services/generic-adapter-response.mapper';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {TourDocVideoRecord, TourDocVideoRecordFactory} from '../model/records/tdocvideo-record';
import {TourDocDataTechRecordFactory} from '../model/records/tdocdatatech-record';
import {TourDocRateTechRecordFactory} from '../model/records/tdocratetech-record';
import {TourDocRatePersonalRecordFactory} from '../model/records/tdocratepers-record';
import {TourDocDataInfoRecordFactory} from '../model/records/tdocdatainfo-record';
import {TourDocObjectDetectionImageObjectRecordFactory} from '../model/records/tdocobjectdetectectionimageobject-record';
import {TourDocNavigationObjectRecordFactory} from '../model/records/tdocnavigationobject-record';
import {BaseEntityRecordFactory} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';

export class TourDocAdapterResponseMapper implements GenericAdapterResponseMapper {
    protected mapperUtils = new MapperUtils();
    protected config: {} = {};

    public static generateDoubletteValue(value: string): string {
        return value === undefined ? value :
            value.toLowerCase()
                .replace(/ß/g, 'ss')
                .replace(/ö/g, 'oe')
                .replace(/ü/g, 'ue')
                .replace(/ä/g, 'ae')
                .replace(/[^a-z0-9]/g, '');
    }

    constructor(config: any) {
        this.config = config;
    }

    mapToAdapterDocument(mapping: {}, props: TourDocRecord): any {
        const values = {};
        values['id'] = props.id;
        values['image_id_i'] = props.imageId;
        values['video_id_i'] = props.videoId;
        values['loc_id_i'] = props.locId;
        values['loc_id_parent_i'] = props.locIdParent;
        values['route_id_i'] = props.routeId;
        values['track_id_i'] = props.trackId;
        values['trip_id_i'] = props.tripId;
        values['news_id_i'] = props.newsId;
        values['blocked_i'] = props.blocked;
        values['dateshow_dt'] = props.dateshow;
        values['datestart_dt'] = props.datestart;
        values['dateend_dt'] = props.dateend;
        values['desc_txt'] = props.descTxt;
        values['desc_md_txt'] = props.descMd;
        values['desc_html_txt'] = props.descHtml;
        values['geo_lon_s'] = props.geoLon;
        values['geo_lat_s'] = props.geoLat;
        values['geo_loc_p'] = props.geoLoc;
        values['gpstrack_src_s'] = props.gpsTrackSrc;
        values['gpstracks_basefile_s'] = props.gpsTrackBasefile;
        values['keywords_txt'] =
            (props.keywords ? props.keywords.split(', ').join(',') : '');
        values['loc_lochirarchie_s'] = (props.locHirarchie ? props.locHirarchie
            .toLowerCase()
            .replace(/[ ]*->[ ]*/g, ',,')
            .replace(/ /g, '_') : '');
        values['loc_lochirarchie_ids_s'] = (props.locHirarchieIds ? props.locHirarchieIds
            .toLowerCase()
            .replace(/,/g, ',,')
            .replace(/ /g, '_') : '');
        values['name_s'] = props.name;
        values['key_s'] = TourDocAdapterResponseMapper.generateDoubletteValue(props.name);
        values['techname_s'] = props.techName;
        values['objects_txt'] =
            (props.objects ? props.objects.split(', ').join(',,') : '');
        values['persons_txt'] =
            (props.persons ? props.persons.split(', ').join(',,') : '');
        values['playlists_txt'] =
            (props.playlists ? props.playlists.split(', ').join(',,') : '');
        values['type_s'] = props.type;
        values['subtype_s'] = props.subtype;

        values['html_txt'] = [
            values['desc_txt'],
            values['name_s'],
            values['keywords_txt'],
            values['type_s']].join(' ');

        if (props.get('tdocimages') && props.get('tdocimages').length > 0) {
            const image: TourDocImageRecord = props.get('tdocimages')[0];
            values['i_fav_url_txt'] = image.fileName;
        }
        if (props.get('tdocvideos') && props.get('tdocvideos').length > 0) {
            const video: TourDocVideoRecord = props.get('tdocvideos')[0];
            values['v_fav_url_txt'] = video.fileName;
        }

        values['data_tech_alt_asc_i'] = BeanUtils.getValue(props, 'tdocdatatech.altAsc');
        values['data_tech_alt_desc_i'] = BeanUtils.getValue(props, 'tdocdatatech.altDesc');
        values['data_tech_alt_min_i'] = BeanUtils.getValue(props, 'tdocdatatech.altMin');
        values['data_tech_alt_max_i'] = BeanUtils.getValue(props, 'tdocdatatech.altMax');
        values['data_tech_dist_f'] = BeanUtils.getValue(props, 'tdocdatatech.dist');
        values['data_tech_dur_f'] = BeanUtils.getValue(props, 'tdocdatatech.dur');

        values['rate_tech_overall_s'] = BeanUtils.getValue(props, 'tdocratetech.overall');
        values['rate_tech_ks_s'] = BeanUtils.getValue(props, 'tdocratetech.ks');
        values['rate_tech_firn_s'] = BeanUtils.getValue(props, 'tdocratetech.firn');
        values['rate_tech_gletscher_s'] = BeanUtils.getValue(props, 'tdocratetech.gletscher');
        values['rate_tech_klettern_s'] = BeanUtils.getValue(props, 'tdocratetech.klettern');
        values['rate_tech_bergtour_s'] = BeanUtils.getValue(props, 'tdocratetech.bergtour');
        values['rate_tech_schneeschuh_s'] = BeanUtils.getValue(props, 'tdocratetech.schneeschuh');
        values['rate_pers_ausdauer_i'] = BeanUtils.getValue(props, 'tdocratepers.ausdauer');
        values['rate_pers_bildung_i'] = BeanUtils.getValue(props, 'tdocratepers.bildung');
        values['rate_pers_gesamt_i'] = BeanUtils.getValue(props, 'tdocratepers.gesamt');
        values['rate_pers_kraft_i'] = BeanUtils.getValue(props, 'tdocratepers.kraft');
        values['rate_pers_mental_i'] = BeanUtils.getValue(props, 'tdocratepers.mental');
        values['rate_pers_motive_i'] = BeanUtils.getValue(props, 'tdocratepers.motive');
        values['rate_pers_schwierigkeit_i'] = BeanUtils.getValue(props, 'tdocratepers.schwierigkeit');
        values['rate_pers_wichtigkeit_i'] = BeanUtils.getValue(props, 'tdocratepers.wichtigkeit');
        values['data_info_guides_s'] = BeanUtils.getValue(props, 'tdocdatainfo.guides');
        values['data_info_region_s'] = BeanUtils.getValue(props, 'tdocdatainfo.region');
        values['data_info_baseloc_s'] = BeanUtils.getValue(props, 'tdocdatainfo.baseloc');
        values['data_info_destloc_s'] = BeanUtils.getValue(props, 'tdocdatainfo.destloc');

        return values;
    }

    mapValuesToRecord(mapper: Mapper, values: {}): TourDocRecord {
        const record = TourDocRecordFactory.createSanitized(values);

        for (const mapperKey of ['tdocdatatech', 'tdocdatainfo', 'tdocratepers', 'tdocratetech']) {
            const subMapper = mapper['datastore']._mappers[mapperKey];
            let subValues = undefined;
            for (const key in values) {
                if (key.startsWith(mapperKey + '.')) {
                    const subKey = key.replace(mapperKey + '.', '');
                    subValues = subValues || {};
                    subValues[subKey] = values[key];
                }
            }

            if (subValues) {
                record.set(mapperKey, subMapper.createRecord(subValues));
            } else {
                record.set(mapperKey, undefined);
            }
        }

        return record;
    }

    mapResponseDocument(mapper: Mapper, doc: any, mapping: {}): Record {
        const dataTechMapper = mapper['datastore']._mappers['tdocdatatech'];
        const dataInfoMapper = mapper['datastore']._mappers['tdocdatainfo'];
        const ratePersMapper = mapper['datastore']._mappers['tdocratepers'];
        const rateTechMapper = mapper['datastore']._mappers['tdocratetech'];

        const values = {};
        values['id'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'id', undefined);
        values['imageId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'image_id_i', undefined);
        values['videoId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'video_id_i', undefined);
        values['locId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'loc_id_i', undefined);
        values['locIdParent'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'loc_id_parent_i', undefined);
        values['routeId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'route_id_i', undefined);
        values['trackId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'track_id_i', undefined);
        values['tripId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'trip_id_i', undefined);
        values['newsId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'news_id_i', undefined);

        const subtypeField = doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'subtypes_ss')];
        if (subtypeField !== undefined && Array.isArray(subtypeField)) {
            values['subtypes'] = subtypeField.join(',');
        }
        values['blocked'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'blocked_i', undefined);
        values['dateshow'] = this.mapperUtils.getMappedAdapterDateTimeValue(mapping, doc, 'dateshow_dt', undefined);
        values['datestart'] = this.mapperUtils.getMappedAdapterDateTimeValue(mapping, doc, 'datestart_dt', undefined);
        values['dateend'] = this.mapperUtils.getMappedAdapterDateTimeValue(mapping, doc, 'dateend_dt', undefined);
        values['descTxt'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_txt', undefined);
        values['descHtml'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_html_txt', undefined);
        values['descMd'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_md_txt', undefined);
        values['geoDistance'] = this.mapperUtils.getAdapterCoorValue(doc,
            this.mapperUtils.mapToAdapterFieldName(mapping, 'distance'), undefined);
        values['geoLon'] = this.mapperUtils.getAdapterCoorValue(doc,
            this.mapperUtils.mapToAdapterFieldName(mapping, 'geo_lon_s'), undefined);
        values['geoLat'] = this.mapperUtils.getAdapterCoorValue(doc,
            this.mapperUtils.mapToAdapterFieldName(mapping, 'geo_lat_s'), undefined);
        values['geoLoc'] = this.mapperUtils.getAdapterCoorValue(doc,
            this.mapperUtils.mapToAdapterFieldName(mapping, 'geo_loc_p'), undefined);
        values['gpsTrackSrc'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'gpstrack_src_s', undefined);
        values['gpsTrackBasefile'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'gpstracks_basefile_s', undefined);

        const origKeywordsArr = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'keywords_txt', '').split(',');
        const newKeywordsArr = [];
        const allowedKeywordPatterns = BeanUtils.getValue(this.config, 'mapperConfig.allowedKeywordPatterns');
        for (let keyword of origKeywordsArr) {
            keyword = keyword.trim();
            if (keyword === '') {
                continue;
            }

            if (allowedKeywordPatterns && allowedKeywordPatterns.length > 0) {
                for (const pattern of allowedKeywordPatterns) {
                    if (keyword.match(new RegExp(pattern))) {
                        newKeywordsArr.push(keyword);
                        break;
                    }
                }
            } else {
                newKeywordsArr.push(keyword);
            }
        }
        const replaceKeywordPatterns = BeanUtils.getValue(this.config, 'mapperConfig.replaceKeywordPatterns');
        if (replaceKeywordPatterns && replaceKeywordPatterns.length > 0) {
            for (let i = 0; i < newKeywordsArr.length; i++) {
                let keyword = newKeywordsArr[i];
                for (const pattern of replaceKeywordPatterns) {
                    keyword = keyword.replace(new RegExp(pattern[0]), pattern[1]);
                }
                newKeywordsArr[i] = keyword;
            }
        }
        values['keywords'] = newKeywordsArr.join(', ');

        values['name'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'name_s', undefined);
        values['techName'] = values['name'] ? values['name'].replace(/[- \/()+;.]+/g, '_').toLowerCase() : '';
        values['objects'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'objects_txt', '')
            .split(',,').join(', ');
        values['persons'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'persons_txt', '')
            .split(',,').join(', ');
        values['playlists'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'playlists_txt', '')
            .split(',,').join(', ');
        values['subtype'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'subtype_s', undefined);
        values['type'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'type_s', undefined);
        values['locHirarchie'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'loc_lochirarchie_s', '')
            .replace(/,,/g, ' -> ')
            .replace(/,/g, ' ')
            .replace(/_/g, ' ')
            .trim();
        values['locHirarchieIds'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'loc_lochirarchie_ids_s', '')
            .replace(/_/g, ' ').trim()
            .replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');

        // console.log('mapResponseDocument values:', values);
        const record: TourDocRecord = <TourDocRecord>mapper.createRecord(
            TourDocRecordFactory.instance.getSanitizedValues(values, {}));

        this.mapAdapterFieldWithDetailDataToAdapterDocument(mapper, mapping, 'image', doc, 'i_fav_url_txt', record);
        this.mapAdapterFieldWithDetailDataToAdapterDocument(mapper, mapping, 'video', doc, 'v_fav_url_txt', record);
        this.mapAdapterFieldWithDetailDataToAdapterDocument(mapper, mapping, 'navigation_objects', doc, 'navigation_objects_txt', record);

        const dataTechValues = {};
        dataTechValues['altAsc'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'data_tech_alt_asc_i', undefined);
        dataTechValues['altDesc'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'data_tech_alt_desc_i', undefined);
        dataTechValues['altMin'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'data_tech_alt_min_i', undefined);
        dataTechValues['altMax'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'data_tech_alt_max_i', undefined);
        dataTechValues['dist'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'data_tech_dist_f', undefined);
        dataTechValues['dur'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'data_tech_dur_f', undefined);
        let dataTechSet = false;
        for (const field in dataTechValues) {
            if (dataTechValues[field] !== undefined && dataTechValues[field] !== 0) {
                dataTechSet = true;
                break;
            }
        }

        if (dataTechSet) {
            record.set('tdocdatatech', dataTechMapper.createRecord(
                TourDocDataTechRecordFactory.instance.getSanitizedValues(dataTechValues, {})));
        } else {
            record.set('tdocdatatech', undefined);
        }

        const rateTechValues = {};
        rateTechValues['overall'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_tech_overall_s', undefined);
        rateTechValues['ks'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_tech_ks_s', undefined);
        rateTechValues['firn'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_tech_firn_s', undefined);
        rateTechValues['gletscher'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_tech_gletscher_s', undefined);
        rateTechValues['klettern'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_tech_klettern_s', undefined);
        rateTechValues['bergtour'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_tech_bergtour_s', undefined);
        rateTechValues['schneeschuh'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_tech_schneeschuh_s', undefined);
        let rateTechSet = false;
        for (const field in rateTechValues) {
            if (rateTechValues[field] !== undefined && (rateTechValues[field] + '').length > 0) {
                rateTechSet = true;
                break;
            }
        }

        if (rateTechSet) {
            record.set('tdocratetech', rateTechMapper.createRecord(
                TourDocRateTechRecordFactory.instance.getSanitizedValues(rateTechValues, {})));
        } else {
            record.set('tdocratetech', undefined);
        }

        const ratePersValues = {};
        ratePersValues['ausdauer'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'rate_pers_ausdauer_i', undefined);
        ratePersValues['bildung'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'rate_pers_bildung_i', undefined);
        ratePersValues['gesamt'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'rate_pers_gesamt_i', undefined);
        ratePersValues['kraft'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'rate_pers_kraft_i', undefined);
        ratePersValues['mental'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'rate_pers_mental_i', undefined);
        ratePersValues['motive'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'rate_pers_motive_i', undefined);
        ratePersValues['schwierigkeit'] =
            this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'rate_pers_schwierigkeit_i', undefined);
        ratePersValues['wichtigkeit'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'rate_pers_wichtigkeit_i', undefined);
        let ratePersSet = false;
        for (const field in ratePersValues) {
            if (ratePersValues[field] !== undefined && (ratePersValues[field] + '').length > 0 &&
                (ratePersValues[field] > 0 || ratePersValues[field] < 0)) {
                ratePersSet = true;
                break;
            }
        }

        if (ratePersSet) {
            record.set('tdocratepers', ratePersMapper.createRecord(
                TourDocRatePersonalRecordFactory.instance.getSanitizedValues(ratePersValues, {})));
        } else {
            record.set('tdocratepers', undefined);
        }

        const dataInfoValues = {};
        dataInfoValues['guides'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'data_info_guides_s', undefined);
        dataInfoValues['region'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'data_info_region_s', undefined);
        dataInfoValues['baseloc'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'data_info_baseloc_s', undefined);
        dataInfoValues['destloc'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'data_info_destloc_s', undefined);
        let dataInfoSet = false;
        for (const field in dataInfoValues) {
            if (dataInfoValues[field] !== undefined && (dataInfoValues[field] + '').length > 0) {
                dataInfoSet = true;
                break;
            }
        }

        if (dataInfoSet) {
            record.set('tdocdatainfo', dataInfoMapper.createRecord(
                TourDocDataInfoRecordFactory.instance.getSanitizedValues(dataInfoValues, {})));
        } else {
            record.set('tdocdatainfo', undefined);
        }

        // console.log('mapResponseDocument record full:', record);

        return record;
    }

    mapAdapterFieldWithDetailDataToAdapterDocument(mapper: Mapper, mapping: {}, profile: string, src: {}, fieldName: string,
                                                   record: Record) {
        const fieldValues = src[this.mapperUtils.mapToAdapterFieldName(mapping, fieldName)];
        const docs = [];
        if (fieldValues !== undefined) {
            if (Array.isArray(fieldValues)) {
                fieldValues.forEach(fieldValue => {
                    const doc = {};
                    doc[fieldName] = fieldValue;
                    docs.push(doc);
                });
            } else {
                const doc = {};
                doc[fieldName] = fieldValues;
                docs.push(doc);
            }
        }

        this.mapDetailDataToAdapterDocument(mapper, profile, record, docs);
    }

    mapDetailDataToAdapterDocument(mapper: Mapper, profile: string, src: Record, docs: any[]): void {
        const record: TourDocRecord = <TourDocRecord>src;
        switch (profile) {
            case 'image':
                const imageDocs = [];
                docs.forEach(doc => {
                    const imageDoc = {};
                    imageDoc['name'] = record.name;
                    imageDoc['fileName'] = doc['i_fav_url_txt'];
                    imageDocs.push(imageDoc);
                });
                this.mapDetailDocsToAdapterDocument(mapper['datastore']._mappers['tdocimage'],
                    'tdocimages', TourDocImageRecordFactory.instance, record, imageDocs);
                break;
            case 'image_playlist':
                this.mergeDetailDocsToAdapterField('playlists', record, docs, 'i_playlists', ', ');
                break;
            case 'image_persons':
                this.mergeDetailDocsToAdapterField('persons', record, docs, 'i_persons', ', ');
                break;
            case 'image_objects':
                this.mergeDetailDocsToAdapterField('objects', record, docs, 'i_objects', ', ');
                break;
            case 'image_objectdetections':
                let odDocs = [];
                docs.forEach(doc => {
                    const fieldName = 'i_objectdetections';
                    if (doc[fieldName] !== undefined && doc[fieldName] !== null) {
                        odDocs = odDocs.concat(this.explodeValueToObjects(doc[fieldName]));
                    }
                });
                this.mapDetailDocsToAdapterDocument(mapper['datastore']._mappers['tdocodimageobject'],
                    'tdocodimageobjects', TourDocObjectDetectionImageObjectRecordFactory.instance, record, odDocs);
                break;
            case 'navigation_objects':
                let navDocs = [];
                docs.forEach(doc => {
                    let fieldName;
                    if (doc['navigation_objects'] !== undefined && doc['navigation_objects'] !== null) {
                        fieldName = 'navigation_objects';
                    } else if (doc['navigation_objects_txt'] !== undefined && doc['navigation_objects_txt'] !== null) {
                        fieldName = 'navigation_objects_txt';
                    }
                    if (fieldName !== undefined && doc[fieldName] !== undefined && doc[fieldName] !== null) {
                        navDocs = navDocs.concat(this.explodeValueToObjects(doc[fieldName]));
                    }
                });
                this.mapDetailDocsToAdapterDocument(mapper['datastore']._mappers['tdocnavigationobject'],
                    'tdocnavigationobjects', TourDocNavigationObjectRecordFactory.instance, record, navDocs);
                break;
            case 'video':
                const videoDocs = [];
                docs.forEach(doc => {
                    const videoDoc = {};
                    videoDoc['name'] = record.name;
                    videoDoc['fileName'] = doc['v_fav_url_txt'];
                    videoDocs.push(videoDoc);
                });
                this.mapDetailDocsToAdapterDocument(mapper['datastore']._mappers['tdocvideo'],
                    'tdocvideos', TourDocVideoRecordFactory.instance, record, videoDocs);
                break;
            case 'video_playlist':
                this.mergeDetailDocsToAdapterField('playlists', record, docs, 'v_playlists', ', ');
                break;
            case 'video_persons':
                this.mergeDetailDocsToAdapterField('persons', record, docs, 'v_persons', ', ');
                break;
            case 'video_objects':
                this.mergeDetailDocsToAdapterField('objects', record, docs, 'v_objects', ', ');
                break;
            case 'keywords':
                this.mergeDetailDocsToAdapterField('keywords', record, docs, 'keywords', ', ');
                break;
        }
    }

    explodeValueToObjects(srcValue: string): {}[] {
        const objectsSrcs = srcValue.split(';;');
        const objects: {}[] = [];
        for (let i = 0; i < objectsSrcs.length; i++) {
            const valuePairs = objectsSrcs[i].split(':::');
            const detailDoc = {};
            for (let j = 0; j < valuePairs.length; j++) {
                const value = valuePairs[j].split('=');
                detailDoc[value[0]] = value[1];
            }
            objects.push(detailDoc);
        }

        return objects;
    }

    mergeDetailDocsToAdapterField(profile: string, record: TourDocRecord, detailDocs: {}[], srcField: string, joiner: string) {
        const merged = [];
        detailDocs.forEach(doc => {
            if (doc[srcField] !== undefined && doc[srcField] !== null) {
                merged.push(doc[srcField]);
            }
        });
        record[profile] = merged.join(joiner);
    }

    mapDetailDocsToAdapterDocument(mapper: Mapper, profile: string, factory: BaseEntityRecordFactory, record: TourDocRecord,
                                   detailDocs: {}[]) {
        const detailRecords: Record[] = [];
        if (detailDocs !== undefined) {
            let id = this.extractUniqueId(record);
            for (const detailDoc of detailDocs) {
                if (detailDoc === undefined || detailDoc === null) {
                    continue;
                }
                const detailValues = {... detailDoc};
                detailValues['id'] = (id++).toString() + record.id;
                const detailRecord = mapper.createRecord(
                    factory.getSanitizedValues(detailValues, {}));
                detailRecords.push(detailRecord);
            }
        }
        record.set(profile, detailRecords);
    }

    protected extractUniqueId(record: TourDocRecord): number {
        let id = 1;
        if (record.type === 'TRACK') {
            id = Number(record.trackId);
        } else if (record.type === 'ROUTE') {
            id = Number(record.routeId);
        } else if (record.type === 'LOCATION') {
            id = Number(record.locId);
        } else if (record.type === 'IMAGE') {
            id = Number(record.imageId);
        } else if (record.type === 'VIDEO') {
            id = Number(record.videoId);
        } else if (record.type === 'TRIP') {
            id = Number(record.tripId);
        } else if (record.type === 'NEWS') {
            id = Number(record.newsId);
        } else if (record.type === 'ODIMGOBJECT') {
            id = Number(record.id.replace(/.*_/, ''));
        }
        id = id * 1000000;

        return id;
    }
}

