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
import {TourDocLinkedPlaylistRecord} from '../model/records/tdoclinkedplaylist-record';
import {TourDocLinkedPoiRecord} from '../model/records/tdoclinkedpoi-record';
import {TourDocObjectDetectionImageObjectRecord} from '../model/records/tdocobjectdetectectionimageobject-record';
import {TourDocMediaMetaRecordFactory} from '../model/records/tdocmediameta-record';

export class TourDocAdapterResponseMapper implements GenericAdapterResponseMapper {
    private readonly _objectSeparator = ';;';
    private readonly _fieldSeparator = ':::';
    private readonly _valueSeparator = '=';

    protected mapperUtils = new MapperUtils(this._objectSeparator, this._fieldSeparator, this._valueSeparator);
    protected config: {} = {};

    public static generateDoubletteValue(value: string): string {
        return MapperUtils.generateDoubletteValue(value);
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
        values['destination_id_s'] = props.destinationId;
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
        values['gpstracks_state_i'] = props.gpsTrackState;
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
        values['key_s'] = MapperUtils.generateDoubletteValue(props.name);
        values['techname_s'] = props.techName;
        values['objects_txt'] =
            (props.objects ? props.objects.split(', ').join(',,') : '');
        values['persons_txt'] =
            (props.persons ? props.persons.split(', ').join(',,') : '');
        values['pdffile_s'] = props.pdfFile;
        values['linked_route_attr_s'] = BeanUtils.getValue(props, 'linkedRouteAttr');
        values['playlists_txt'] =
            (props.playlists ? props.playlists.split(', ').join(',,') : '');
        values['type_s'] = props.type;
        values['subtype_s'] = props.subtype;

        const desc = values['desc_txt'] || values['desc_html_txt'] || values['desc_md_txt'];
        values['html_txt'] = [
            values['name_s'],
            values['keywords_txt'],
            values['type_s'],
            desc
        ].join(' ');

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
        if (props.get('tdoclinkedplaylists') && props.get('tdoclinkedplaylists').length > 0) {
            this.mapDetailDataToAdapterDocument({}, 'linkedplaylists', props, values);
        }
        if (props.get('tdoclinkedpois') && props.get('tdoclinkedpois').length > 0) {
            this.mapDetailDataToAdapterDocument({}, 'linkedpois', props, values);
        }
        if (props.get('tdocodimageobjects') && props.get('tdocodimageobjects').length > 0) {
            this.mapDetailDataToAdapterDocument({}, 'odimageobjects', props, values);
        }

        values['data_tech_alt_asc_i'] = BeanUtils.getValue(props, 'tdocdatatech.altAsc');
        values['data_tech_alt_desc_i'] = BeanUtils.getValue(props, 'tdocdatatech.altDesc');
        values['data_tech_alt_min_i'] = BeanUtils.getValue(props, 'tdocdatatech.altMin');
        values['data_tech_alt_max_i'] = BeanUtils.getValue(props, 'tdocdatatech.altMax');
        values['data_tech_dist_f'] = BeanUtils.getValue(props, 'tdocdatatech.dist');
        values['data_tech_dur_f'] = BeanUtils.getValue(props, 'tdocdatatech.dur');
        values['data_tech_sections_s'] = BeanUtils.getValue(props, 'tdocdatatech.sections');

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
        values['data_info_section_details_s'] = BeanUtils.getValue(props, 'tdocdatainfo.sectionDetails');

        values['mediameta_duration_i'] = BeanUtils.getValue(props, 'tdocmediameta.dur');
        values['mediameta_filecreated_dt'] = BeanUtils.getValue(props, 'tdocmediameta.fileCreated');
        values['mediameta_filename_s'] = BeanUtils.getValue(props, 'tdocmediameta.fileName');
        values['mediameta_filesize_i'] = BeanUtils.getValue(props, 'tdocmediameta.fileSize');
        values['mediameta_metadata_txt'] = BeanUtils.getValue(props, 'tdocmediameta.metadata');
        values['mediameta_recordingdate_dt'] = BeanUtils.getValue(props, 'tdocmediameta.recordingDate');
        values['mediameta_resolution_s'] = BeanUtils.getValue(props, 'tdocmediameta.resolution');

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
                    let routesSrc: string [] = [];
                    // TODO check for blacklisted input: _fieldSeparator, _objectSeparator
                    for (let idx = 0; idx < routes.length; idx++) {
                        routesSrc.push('type=' + routes[idx].type + this._fieldSeparator +
                            'name=' + routes[idx].name + this._fieldSeparator +
                            'refId=' + routes[idx].refId + this._fieldSeparator +
                            'full=' + routes[idx].full + this._fieldSeparator +
                            'linkedRouteAttr=' + routes[idx].linkedRouteAttr);
                    }

                    routesSrc = ObjectUtils.uniqueArray(routesSrc);

                    result['linkedroutes_clob'] = routesSrc.join(this._objectSeparator);
                }
                break;
            case 'linkedinfos':
                if (props.get('tdoclinkedinfos') && props.get('tdoclinkedinfos').length > 0) {
                    const infos: TourDocLinkedInfoRecord[] = props.get('tdoclinkedinfos');
                    let infosSrc: string [] = [];
                    for (let idx = 0; idx < infos.length; idx++) {
                        infosSrc.push('type=subinfo' + this._fieldSeparator +
                            'name=' + infos[idx].name + this._fieldSeparator +
                            'refId=' + infos[idx].refId + this._fieldSeparator +
                            'linkedDetails=' + infos[idx].linkedDetails);
                    }

                    infosSrc = ObjectUtils.uniqueArray(infosSrc);

                    result['linkedinfos_clob'] = infosSrc.join(this._objectSeparator);
                }
                break;
            case 'linkedplaylists':
                if (props.get('tdoclinkedplaylists') && props.get('tdoclinkedplaylists').length > 0) {
                    const playlists: TourDocLinkedPlaylistRecord[] = props.get('tdoclinkedplaylists');
                    let playlistsSrc: string [] = [];
                    for (let idx = 0; idx < playlists.length; idx++) {
                        playlistsSrc.push('type=playlist' + this._fieldSeparator +
                            'name=' + playlists[idx].name + this._fieldSeparator +
                            'refId=' + playlists[idx].refId + this._fieldSeparator +
                            'position=' + playlists[idx].position + this._fieldSeparator +
                            'details=' + playlists[idx].details);
                    }

                    playlistsSrc = ObjectUtils.uniqueArray(playlistsSrc);

                    result['linkedplaylists_clob'] = playlistsSrc.join(this._objectSeparator);
                }
                break;
            case 'linkedpois':
                if (props.get('tdoclinkedpois') && props.get('tdoclinkedpois').length > 0) {
                    const pois: TourDocLinkedPoiRecord[] = props.get('tdoclinkedpois');
                    let poisSrc: string [] = [];
                    for (let idx = 0; idx < pois.length; idx++) {
                        poisSrc.push('type=poi' + this._fieldSeparator +
                            'name=' + pois[idx].name + this._fieldSeparator +
                            'refId=' + pois[idx].refId + this._fieldSeparator +
                            'position=' + pois[idx].position + this._fieldSeparator +
                            'geoLoc=' + pois[idx].geoLoc + this._fieldSeparator +
                            'geoEle=' + pois[idx].geoEle + this._fieldSeparator +
                            'poitype=' + pois[idx].poitype);
                    }

                    poisSrc = ObjectUtils.uniqueArray(poisSrc);

                    result['linkedpois_clob'] = poisSrc.join(this._objectSeparator);
                }
                break;
            case 'odimageobjects':
                if (props.get('tdocodimageobjects') && props.get('tdocodimageobjects').length > 0) {
                    const pois: TourDocObjectDetectionImageObjectRecord[] = props.get('tdocodimageobjects');
                    let poisSrc: string [] = [];
                    for (let idx = 0; idx < pois.length; idx++) {
                        poisSrc.push('ioId=' + pois[idx].tdoc_id + this._fieldSeparator +
                        'key=' + pois[idx].key + this._fieldSeparator +
                        'detector=' + pois[idx].detector + this._fieldSeparator +
                        'imgWidth=' + pois[idx].imgWidth + this._fieldSeparator +
                        'imgHeight=' + pois[idx].imgHeight + this._fieldSeparator +
                        'objX=' + pois[idx].objX + this._fieldSeparator +
                        'objY=' + pois[idx].objY + this._fieldSeparator +
                        'objWidth=' + pois[idx].objWidth + this._fieldSeparator +
                        'objHeight=' + pois[idx].objHeight + this._fieldSeparator +
                        'name=' + pois[idx].name + this._fieldSeparator +
                        'fileName=' + pois[idx].fileName + this._fieldSeparator +
                        'category=' + pois[idx].category + this._fieldSeparator +
                        'precision=' + pois[idx].precision + this._fieldSeparator +
                        'state=' + pois[idx].state
                    );
                    }


                    poisSrc = ObjectUtils.uniqueArray(poisSrc);

                    result['i_objectdetections_clob'] = poisSrc.join(this._objectSeparator);
                }
                break;
        }
    }

    mapValuesToRecord(mapper: Mapper, values: {}): TourDocRecord {
        const record = TourDocRecordFactory.createSanitized(values);
        this.mapperUtils.mapValuesToSubRecords(mapper, values, record, TourDocRecordRelation);

        return record;
    }

    mapResponseDocument(mapper: Mapper, doc: any, mapping: {}): Record {
        const dataTechMapper = mapper['datastore']._mappers['tdocdatatech'];
        const dataInfoMapper = mapper['datastore']._mappers['tdocdatainfo'];
        const infoMapper = mapper['datastore']._mappers['tdocinfo'];
        const ratePersMapper = mapper['datastore']._mappers['tdocratepers'];
        const rateTechMapper = mapper['datastore']._mappers['tdocratetech'];
        const mediaMetaMapper = mapper['datastore']._mappers['tdocmediameta'];

        const values = {};
        values['id'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'id', undefined);
        values['imageId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'image_id_i', undefined);
        values['videoId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'video_id_i', undefined);
        values['locId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'loc_id_i', undefined);
        values['locIdParent'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'loc_id_parent_i', undefined);
        values['routeId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'route_id_i', undefined);
        values['destinationId'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'destination_id_s', undefined);
        values['trackId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'track_id_i', undefined);
        values['tripId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'trip_id_i', undefined);
        values['newsId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'news_id_i', undefined);
        values['infoId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'info_id_i', undefined);

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
        values['gpsTrackState'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'gpstracks_state_i', undefined);
        values['pdfFile'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'pdffile_s', undefined);

        const origKeywordsArr = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'keywords_txt', '').split(',');
        const replaceKeywordPatterns = BeanUtils.getValue(this.config, 'mapperConfig.replaceKeywordPatterns');
        let srcKeywordsArr = [];
        if (replaceKeywordPatterns && replaceKeywordPatterns.length > 0) {
            for (let keyword of origKeywordsArr) {
                keyword = keyword.trim();
                if (keyword === '') {
                    continue;
                }

                for (const pattern of replaceKeywordPatterns) {
                    keyword = keyword.replace(new RegExp(pattern[0]), pattern[1]);
                }

                srcKeywordsArr.push(keyword);
            }
        } else {
            srcKeywordsArr = [].concat(origKeywordsArr);
        }

        const allowedKeywordPatterns = BeanUtils.getValue(this.config, 'mapperConfig.allowedKeywordPatterns');
        let newKeywordsArr = [];
        for (let keyword of srcKeywordsArr) {
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

        newKeywordsArr = ObjectUtils.uniqueArray(newKeywordsArr);
        values['keywords'] = newKeywordsArr.join(', ');

        values['name'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'name_s', undefined);
        values['techName'] = values['name'] ? values['name'].replace(/[- \/()+;.]+/g, '_').toLowerCase() : '';
        values['objects'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'objects_txt', '')
            .replace(/[,]+/g, ',').split(',').join(', ');
        values['persons'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'persons_txt', '')
            .replace(/[,]+/g, ',').split(',').join(', ');
        values['playlists'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'playlists_txt', '')
            .replace(/[,]+/g, ',').split(',').join(', ');
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

        let refs = [this.mapperUtils.getMappedAdapterValue(mapping, doc, 'linked_route_attr_s', undefined),
            this.mapperUtils.getMappedAdapterValue(mapping, doc, 'route_attr_s', undefined)
        ];
        refs = ObjectUtils.uniqueArray(refs);
        values['linkedRouteAttr'] = undefined;
        for (const refDetail of refs) {
            if (refDetail === undefined || refDetail === 'null' || refDetail.length === 0) {
                continue;
            }

            values['linkedRouteAttr'] = values['linkedRouteAttr']
                ? values['linkedRouteAttr'] + ';;' + refDetail
                : refDetail;
        }

        values['linkedRouteAttr'] = values['linkedRouteAttr']
            ? ObjectUtils.uniqueArray(values['linkedRouteAttr'].split(';;')).join(';;')
            : undefined

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
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'navigation_objects_clob')],
                'navigation_objects_clob'));
        this.mapDetailResponseDocuments(mapper, 'extended_object_properties', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'extended_object_properties_clob')],
                'extended_object_properties_clob'));
        this.mapDetailResponseDocuments(mapper, 'linkedroutes', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'linkedroutes_clob')],
                'linkedroutes_clob'));
        this.mapDetailResponseDocuments(mapper, 'linkedinfos', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'linkedinfos_clob')],
                'linkedinfos_clob'));
        this.mapDetailResponseDocuments(mapper, 'linkedplaylists', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'linkedplaylists_clob')],
                'linkedplaylists_clob'));
        this.mapDetailResponseDocuments(mapper, 'linkedpois', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'linkedpois_clob')],
                'linkedpois_clob'));
        this.mapDetailResponseDocuments(mapper, 'image_objectdetections', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'i_objectdetections_clob')],
                'i_objectdetections_clob'));

        const dataTechValues = {};
        dataTechValues['altAsc'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'data_tech_alt_asc_i', undefined);
        dataTechValues['altDesc'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'data_tech_alt_desc_i', undefined);
        dataTechValues['altMin'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'data_tech_alt_min_i', undefined);
        dataTechValues['altMax'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'data_tech_alt_max_i', undefined);
        dataTechValues['dist'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'data_tech_dist_f', undefined);
        dataTechValues['dur'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'data_tech_dur_f', undefined);
        dataTechValues['sections'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'data_tech_sections_s', undefined);
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
        dataInfoValues['sectionDetails'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'data_info_section_details_s', undefined);
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

        const mediaMetaValues = {};
        mediaMetaValues['dur'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'mediameta_duration_i', undefined);
        mediaMetaValues['fileSize'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'mediameta_filesize_i', undefined);
        mediaMetaValues['fileCreated'] = this.mapperUtils.getMappedAdapterDateTimeValue(mapping, doc, 'mediameta_filecreated_dt', undefined);
        mediaMetaValues['fileName'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'mediameta_filename_s', undefined);
        mediaMetaValues['metadata'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'mediameta_metadata_txt', undefined);
        mediaMetaValues['recordingDate'] = this.mapperUtils.getMappedAdapterDateTimeValue(mapping, doc, 'mediameta_recordingdate_dt', undefined);
        mediaMetaValues['resolution'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'mediameta_resolution_s', undefined);
        let mediaMetaSet = false;
        for (const field in mediaMetaValues) {
            if (mediaMetaValues[field] !== undefined && mediaMetaValues[field] !== 0) {
                mediaMetaSet = true;
                break;
            }
        }

        if (mediaMetaSet) {
            record.set('tdocmediameta', mediaMetaMapper.createRecord(
                TourDocMediaMetaRecordFactory.instance.getSanitizedValues(mediaMetaValues, {})));
        } else {
            record.set('tdocmediameta', undefined);
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
                    if (doc['i_fav_url_txt'] === undefined || doc['i_fav_url_txt'] === null) {
                        return;
                    }

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
                record.playlists = ObjectUtils.mergePropertyValues(docs, 'i_playlists', ', ', true);
                break;
            case 'image_persons':
                record.persons = ObjectUtils.mergePropertyValues(docs, 'i_persons', ', ', true);
                break;
            case 'image_objects':
                record.objects = ObjectUtils.mergePropertyValues(docs, 'i_objects', ', ', true);
                break;
            case 'image_objectdetections':
                this.mapperUtils.explodeAndMapDetailResponseDocuments(mapper, TourDocRecordRelation.hasMany['tdocodimageobject'],
                    ['i_objectdetections', 'i_objectdetections_clob'], record, docs, true);
                break;
            case 'navigation_objects':
                this.mapperUtils.explodeAndMapDetailResponseDocuments(mapper, TourDocRecordRelation.hasMany['tdocnavigationobject'],
                    ['navigation_objects', 'navigation_objects_clob'], record, docs, true);
                break;
            case 'extended_object_properties':
                this.mapperUtils.explodeAndMapDetailResponseDocuments(mapper, TourDocRecordRelation.hasMany['tdocextendedobjectproperty'],
                    ['extended_object_properties', 'extended_object_properties_clob'], record, docs, true);
                break;
            case 'linkedroutes':
                this.mapperUtils.explodeAndMapDetailResponseDocuments(mapper, TourDocRecordRelation.hasMany['tdoclinkedroute'],
                    ['linkedroutes', 'linkedroutes_clob'], record, docs, true);
                break;
            case 'linkedinfos':
                this.mapperUtils.explodeAndMapDetailResponseDocuments(mapper, TourDocRecordRelation.hasMany['tdoclinkedinfo'],
                    ['linkedinfos', 'linkedinfos_clob'], record, docs, true);
                break;
            case 'linkedplaylists':
                this.mapperUtils.explodeAndMapDetailResponseDocuments(mapper, TourDocRecordRelation.hasMany['tdoclinkedplaylist'],
                    ['linkedplaylists', 'linkedplaylists_clob'], record, docs, true);
                break;
            case 'linkedpois':
                this.mapperUtils.explodeAndMapDetailResponseDocuments(mapper, TourDocRecordRelation.hasMany['tdoclinkedpoi'],
                    ['linkedpois', 'linkedpois_clob'], record, docs, true);
                break;
            case 'video':
                const videoDocs = [];
                docs.forEach(doc => {
                    if (doc['v_fav_url_txt'] === undefined || doc['v_fav_url_txt'] === null) {
                        return;
                    }

                    const videoDoc = {};
                    videoDoc['name'] = record.name;
                    videoDoc['fileName'] = doc['v_fav_url_txt'];
                    videoDocs.push(videoDoc);
                });
                record.set('tdocvideos', this.mapperUtils.mapDetailDocsToDetailRecords(mapper['datastore']._mappers['tdocvideo'],
                    TourDocVideoRecordFactory.instance, record, videoDocs));
                break;
            case 'video_playlist':
                record.playlists = ObjectUtils.mergePropertyValues(docs, 'v_playlists', ', ', true);
                break;
            case 'video_persons':
                record.persons = ObjectUtils.mergePropertyValues(docs, 'v_persons', ', ', true);
                break;
            case 'video_objects':
                record.objects = ObjectUtils.mergePropertyValues(docs, 'v_objects', ', ', true);
                break;
            case 'keywords':
                record.keywords = ObjectUtils.mergePropertyValues(docs, 'keywords', ', ', true);
                break;
        }
    }
}

