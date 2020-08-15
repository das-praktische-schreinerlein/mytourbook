import {Mapper, Record} from 'js-data';
import {TourDocRecord, TourDocRecordFactory, TourDocRecordRelation} from '../model/records/tdoc-record';
import {TourDocImageRecord, TourDocImageRecordFactory} from '../model/records/tdocimage-record';
import {MapperUtils} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {GenericAdapterResponseMapper} from '@dps/mycms-commons/dist/search-commons/services/generic-adapter-response.mapper';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {TourDocVideoRecord, TourDocVideoRecordFactory} from '../model/records/tdocvideo-record';
import {TourDocDataTechRecordFactory} from '../model/records/tdocdatatech-record';
import {TourDocRateTechRecordFactory} from '../model/records/tdocratetech-record';
import {TourDocRatePersonalRecordFactory} from '../model/records/tdocratepers-record';
import {TourDocDataInfoRecordFactory} from '../model/records/tdocdatainfo-record';
import {ObjectUtils} from '@dps/mycms-commons/dist/commons/utils/object.utils';
import {TourDocLinkedRouteRecord} from '../model/records/tdoclinkedroute-record';
import {TourDocInfoRecordFactory} from '../model/records/tdocinfo-record';
import {TourDocLinkedInfoRecord} from '../model/records/tdoclinkedinfo-record';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {
    BaseEntityRecord,
    BaseEntityRecordRelationsType,
    BaseEntityRecordRelationType
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';

export class TourDocAdapterResponseMapper implements GenericAdapterResponseMapper {
    protected mapperUtils = new MapperUtils();
    protected config: {} = {};

    private readonly _objectSeparator = ';;';
    private readonly _fieldSeparator = ':::';
    private readonly _valueSeparator = '=';

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
        values['info_id_i'] = props.infoId;
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
        if (props.get('tdoclinkedroutes') && props.get('tdoclinkedroutes').length > 0) {
            this.mapDetailDataToAdapterDocument({}, 'linkedroutes', props, values);
        }
        if (props.get('tdoclinkedinfos') && props.get('tdoclinkedinfos').length > 0) {
            this.mapDetailDataToAdapterDocument({}, 'linkedinfos', props, values);
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

        values['info_name_s'] = BeanUtils.getValue(props, 'tdocinfo.name');
        values['info_desc_txt'] = BeanUtils.getValue(props, 'tdocinfo.desc');
        values['info_shortdesc_txt'] = BeanUtils.getValue(props, 'tdocinfo.shortDesc');
        values['info_publisher_s'] = BeanUtils.getValue(props, 'tdocinfo.publisher');
        values['info_reference_s'] = BeanUtils.getValue(props, 'tdocinfo.reference');
        values['info_tif_linked_details_s'] = BeanUtils.getValue(props, 'tdocinfo.linkedDetails');
        values['info_lif_linked_details_s'] = BeanUtils.getValue(props, 'tdocinfo.linkedDetails');
        values['info_type_s'] = BeanUtils.getValue(props, 'tdocinfo.type');

        return values;
    }

    mapDetailDataToAdapterDocument(mapping: {}, profile: string, props: any, result: {}): void {
        switch (profile) {
            case 'linkedroutes':
                if (props.get('tdoclinkedroutes') && props.get('tdoclinkedroutes').length > 0) {
                    const routes: TourDocLinkedRouteRecord[] = props.get('tdoclinkedroutes');
                    const routesSrc: string [] = [];
                    for (let idx = 0; idx < routes.length; idx++) {
                        routesSrc.push('type=subroute' + this._fieldSeparator +
                            'name=' + routes[idx].name + this._fieldSeparator +
                            'refId=' + routes[idx].refId + this._fieldSeparator +
                            'full=' + routes[idx].full);
                    }

                    result['linkedroutes_txt'] = routesSrc.join(this._objectSeparator);
                }
                break;
            case 'linkedinfos':
                if (props.get('tdoclinkedinfos') && props.get('tdoclinkedinfos').length > 0) {
                    const infos: TourDocLinkedInfoRecord[] = props.get('tdoclinkedinfos');
                    const infosSrc: string [] = [];
                    for (let idx = 0; idx < infos.length; idx++) {
                        infosSrc.push('type=subinfo' + this._fieldSeparator +
                            'name=' + infos[idx].name + this._fieldSeparator +
                            'refId=' + infos[idx].refId + this._fieldSeparator +
                            'linkedDetails=' + infos[idx].linkedDetails);
                    }

                    result['linkedinfos_txt'] = infosSrc.join(this._objectSeparator);
                }
                break;
        }
    }

    mapValuesToRecord(mapper: Mapper, values: {}): TourDocRecord {
        const record = TourDocRecordFactory.createSanitized(values);
        this.mapValuesToSubRecords(mapper, values, record, TourDocRecordRelation);

        return record;
    }

    mapResponseDocument(mapper: Mapper, doc: any, mapping: {}): Record {
        const dataTechMapper = mapper['datastore']._mappers['tdocdatatech'];
        const dataInfoMapper = mapper['datastore']._mappers['tdocdatainfo'];
        const infoMapper = mapper['datastore']._mappers['tdocinfo'];
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
        values['infoId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'info_id_i', undefined);

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

        this.mapDetailResponseDocuments(mapper, 'image', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'i_fav_url_txt')],
                'i_fav_url_txt'));
        this.mapDetailResponseDocuments(mapper, 'video', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'v_fav_url_txt')],
                'v_fav_url_txt'));
        this.mapDetailResponseDocuments(mapper, 'navigation_objects', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'navigation_objects_txt')],
                'navigation_objects_txt'));
        this.mapDetailResponseDocuments(mapper, 'extended_object_properties', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'extended_object_properties_txt')],
                'extended_object_properties_txt'));
        this.mapDetailResponseDocuments(mapper, 'linkedroutes', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'linkedroutes_txt')],
                'linkedroutes_txt'));
        this.mapDetailResponseDocuments(mapper, 'linkedinfos', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'linkedinfos_txt')],
                'linkedinfos_txt'));

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

        const infoValues = {};
        infoValues['name'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'info_name_s', undefined);
        infoValues['desc'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'info_desc_txt', undefined);
        infoValues['shortDesc'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'info_shortdesc_txt', undefined);
        infoValues['publisher'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'info_publisher_s', undefined);
        infoValues['reference'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'info_reference_s', undefined);
        infoValues['type'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'info_type_s', undefined);
        infoValues['linkedDetails'] = undefined;
        for (const refDetail of [this.mapperUtils.getMappedAdapterValue(mapping, doc, 'info_tif_linked_details_s', undefined),
            this.mapperUtils.getMappedAdapterValue(mapping, doc, 'info_lif_linked_details_s', undefined)]) {
            if (refDetail === undefined) {
                continue;
            }
            infoValues['linkedDetails'] = infoValues['linkedDetails'] || '';
            infoValues['linkedDetails'] += refDetail;
        }


        let infoSet = false;
        for (const field in infoValues) {
            if (infoValues[field] !== undefined && (infoValues[field] + '').length > 0) {
                infoSet = true;
                break;
            }
        }

        if (infoSet) {
            record.set('tdocinfo', infoMapper.createRecord(
                TourDocInfoRecordFactory.instance.getSanitizedValues(infoValues, {})));
        } else {
            record.set('tdocinfo', undefined);
        }
        // console.log('mapResponseDocument record full:', record);

        return record;
    }

    mapDetailResponseDocuments(mapper: Mapper, profile: string, src: Record, docs: any[]): void {
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
                record.set('tdocimages',
                    this.mapperUtils.mapDetailDocsToDetailRecords(mapper['datastore']._mappers['tdocimage'],
                        TourDocImageRecordFactory.instance, record, imageDocs));
                break;
            case 'image_playlist':
                record.playlists = ObjectUtils.mergePropertyValues(docs, 'i_playlists', ', ');
                break;
            case 'image_persons':
                record.persons = ObjectUtils.mergePropertyValues(docs, 'i_persons', ', ');
                break;
            case 'image_objects':
                record.objects = ObjectUtils.mergePropertyValues(docs, 'i_objects', ', ');
                break;
            case 'image_objectdetections':
                this.explodeAndMapDetailResponseDocuments(mapper, TourDocRecordRelation.hasMany['tdocodimageobject'],
                    ['i_objectdetections', 'i_objectdetections_txt'], record, docs);
                break;
            case 'navigation_objects':
                this.explodeAndMapDetailResponseDocuments(mapper, TourDocRecordRelation.hasMany['tdocnavigationobject'],
                    ['navigation_objects', 'navigation_objects_txt'], record, docs);
                break;
            case 'extended_object_properties':
                this.explodeAndMapDetailResponseDocuments(mapper, TourDocRecordRelation.hasMany['tdocextendedobjectproperty'],
                    ['extended_object_properties', 'extended_object_properties_txt'], record, docs);
                break;
            case 'linkedroutes':
                this.explodeAndMapDetailResponseDocuments(mapper, TourDocRecordRelation.hasMany['tdoclinkedroute'],
                    ['linkedroutes', 'linkedroutes_txt'], record, docs);
                break;
            case 'linkedinfos':
                this.explodeAndMapDetailResponseDocuments(mapper, TourDocRecordRelation.hasMany['tdoclinkedinfo'],
                    ['linkedinfos', 'linkedinfos_txt'], record, docs);
                break;
            case 'video':
                const videoDocs = [];
                docs.forEach(doc => {
                    const videoDoc = {};
                    videoDoc['name'] = record.name;
                    videoDoc['fileName'] = doc['v_fav_url_txt'];
                    videoDocs.push(videoDoc);
                });
                record.set('tdocvideos', this.mapperUtils.mapDetailDocsToDetailRecords(mapper['datastore']._mappers['tdocvideo'],
                    TourDocVideoRecordFactory.instance, record, videoDocs));
                break;
            case 'video_playlist':
                record.playlists = ObjectUtils.mergePropertyValues(docs, 'v_playlists', ', ');
                break;
            case 'video_persons':
                record.persons = ObjectUtils.mergePropertyValues(docs, 'v_persons', ', ');
                break;
            case 'video_objects':
                record.objects = ObjectUtils.mergePropertyValues(docs, 'v_objects', ', ');
                break;
            case 'keywords':
                record.keywords = ObjectUtils.mergePropertyValues(docs, 'keywords', ', ');
                break;
        }
    }

    explodeAndMapDetailResponseDocuments(mapper: Mapper, relation: BaseEntityRecordRelationType, srcFields: string[],
                                         record: BaseEntityRecord, docs: any[]): void {
        if (docs === undefined) {
            return;
        }

        let subDocs = [];
        docs.forEach(doc => {
            let fieldName;
            for (const srcField of srcFields) {
                if (doc[srcField] !== undefined && doc[srcField] !== null) {
                    fieldName = srcField;
                    break;
                }
            }
            if (fieldName !== undefined && doc[fieldName] !== undefined && doc[fieldName] !== null) {
                const objects = ObjectUtils.explodeValueToObjects(doc[fieldName], this._objectSeparator,
                    this._fieldSeparator, this._valueSeparator);
                subDocs = subDocs.concat(objects);
            }
        });

        record.set(relation.localField,
            this.mapperUtils.mapDetailDocsToDetailRecords(mapper['datastore']._mappers[relation.mapperKey],
                relation.factory, record, subDocs));
    }

    mapValuesToSubRecords(mapper: Mapper, values: {}, record: CommonDocRecord, relations: BaseEntityRecordRelationsType) {
        if (relations.hasOne) {
            for (const relationKey in relations.hasOne) {
                const relation: BaseEntityRecordRelationType = relations.hasOne[relationKey];
                const subMapper = mapper['datastore']._mappers[relation.mapperKey];
                let subValues = undefined;
                for (const key in values) {
                    if (key.startsWith(relation.localField + '.')) {
                        const subKey = key.replace(relation.localField + '.', '');
                        subValues = subValues || {};
                        subValues[subKey] = values[key];
                    }
                }

                if (subValues) {
                    record.set(relation.localField, subMapper.createRecord(
                        relation.factory.getSanitizedValues(subValues, {}))
                    );
                } else {
                    record.set(relation.localField, undefined);
                }
            }
        }

        if (relations.hasMany) {
            for (const relationKey in relations.hasMany) {
                const relation: BaseEntityRecordRelationType = relations.hasMany[relationKey];
                const joinMapper = mapper['datastore']._mappers[relation.mapperKey];
                if (values[relation.localField]) {
                    const joinValues = values[relation.localField];
                    const joinRecords: Record[] = [];
                    for (const joinRecordProps of joinValues) {
                        joinRecords.push(
                            joinMapper.createRecord(
                                relation.factory.getSanitizedValues(joinRecordProps, {}))
                        );
                    }

                    if (joinRecords.length > 0) {
                        record.set(relation.localField, joinRecords);
                    } else {
                        record.set(relation.localField, undefined);
                    }
                }
            }
        }
    }

}

