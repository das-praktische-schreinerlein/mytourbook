import {Mapper, Record} from 'js-data';
import {SDocRecord} from '../model/records/sdoc-record';
import {SDocImageRecord} from '../model/records/sdocimage-record';
import {MapperUtils} from '../../search-commons/services/mapper.utils';
import {GenericAdapterResponseMapper} from '../../search-commons/services/generic-adapter-response.mapper';

export class SDocAdapterResponseMapper implements GenericAdapterResponseMapper {
    protected mapperUtils = new MapperUtils();

    mapToAdapterDocument(mapping: {}, props: any): any {
        const values = {};
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'id')] = props.id;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'image_id_i')] = props.imageId;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'loc_id_i')] = props.locId;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'route_id_i')] = props.routeId;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'track_id_i')] = props.trackId;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'trip_id_i')] = props.tripId;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'news_id_i')] = props.newsId;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'dateshow_dt')] = props.dateshow;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'desc_txt')] = props.descTxt;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'desc_md_txt')] = props.descMd;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'desc_html_txt')] = props.descHtml;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'geo_lon_s')] = props.geoLon;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'geo_lat_s')] = props.geoLat;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'geo_loc_p')] = props.geoLoc;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'gpstrack_s')] = props.gpsTrack;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'gpstracks_basefile_s')] = props.gpsTrackBasefile;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'keywords_txt')] =
            (props.keywords ? props.keywords.split(', ').join(',,KW_') : '');
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'loc_lochirarchie_s')] = (props.locHirarchie ? props.locHirarchie
            .toLowerCase()
            .replace(/[ ]*->[ ]*/g, ',,')
            .replace(/ /g, '_') : '');
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'loc_lochirarchie_ids_s')] = (props.locHirarchieIds ? props.locHirarchieIds
            .toLowerCase()
            .replace(/,/g, ',,')
            .replace(/ /g, '_') : '');
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'name_s')] = props.name;
        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'type_s')] = props.type;

        values[this.mapperUtils.mapToAdapterFieldName(mapping, 'html_txt')] = [
            values[this.mapperUtils.mapToAdapterFieldName(mapping, 'desc_txt')],
            values[this.mapperUtils.mapToAdapterFieldName(mapping, 'name_s')],
            values[this.mapperUtils.mapToAdapterFieldName(mapping, 'keywords_txt')],
            values[this.mapperUtils.mapToAdapterFieldName(mapping, 'type_s')]].join(' ');

        return values;
    }

    mapResponseDocument(mapper: Mapper, doc: any, mapping: {}, opts: any): Record {
        const dataTechMapper = mapper['datastore']._mappers['sdocdatatech'];
        const dataInfoMapper = mapper['datastore']._mappers['sdocdatainfo'];
        const imageMapper = mapper['datastore']._mappers['sdocimage'];
        const ratePersMapper = mapper['datastore']._mappers['sdocratepers'];
        const rateTechMapper = mapper['datastore']._mappers['sdocratetech'];

        const values = {};
        values['id'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'id', undefined);
        values['imageId'] = Number(this.mapperUtils.getMappedAdapterValue(mapping, doc, 'image_id_i', undefined));
        values['locId'] = Number(this.mapperUtils.getMappedAdapterValue(mapping, doc, 'loc_id_i', undefined));
        values['routeId'] = Number(this.mapperUtils.getMappedAdapterValue(mapping, doc, 'route_id_i', undefined));
        values['trackId'] = Number(this.mapperUtils.getMappedAdapterValue(mapping, doc, 'track_id_i', undefined));
        values['tripId'] = Number(this.mapperUtils.getMappedAdapterValue(mapping, doc, 'trip_id_i', undefined));
        values['newsId'] = Number(this.mapperUtils.getMappedAdapterValue(mapping, doc, 'news_id_i', undefined));

        const subtypeField = doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'subtypes_ss')];
        if (subtypeField !== undefined && Array.isArray(subtypeField)) {
           values['subtypes'] = subtypeField.join(',');
        }
        values['dateshow'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'dateshow_dt', undefined);
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
        values['gpsTrack'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'gpstrack_s', undefined);
        values['gpsTrackBasefile'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'gpstracks_basefile_s', undefined);
        values['keywords'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'keywords_txt', '')
            .split(',,').join(', ').replace(/KW_/g, '');
        values['name'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'name_s', undefined);
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
        const record: SDocRecord = <SDocRecord>mapper.createRecord(values);

        const images: SDocImageRecord[] = [];
        const imageField = doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'i_fav_url_txt')];
        if (imageField !== undefined) {
            let id = 1;
            if (record.type === 'TRACK') {
                id = Number(record.trackId);
            } else if (record.type === 'ROUTE') {
                id = Number(record.routeId);
            } else if (record.type === 'LOCATION') {
                id = Number(record.locId);
            } else if (record.type === 'IMAGE') {
                id = Number(record.imageId);
            } else if (record.type === 'TRIP') {
                id = Number(record.tripId);
            } else if (record.type === 'NEWS') {
                id = Number(record.newsId);
            }
            id = id * 1000000;

            let imageDocs = [];
            if (Array.isArray(imageField)) {
                imageDocs = imageField;
            } else {
                imageDocs.push(imageField);
            }

            for (const imageDoc of imageDocs) {
                if (imageDoc === undefined || imageDoc === null) {
                    continue;
                }
                const imageValues = {};
                imageValues['name'] = values['name'];
                imageValues['id'] = (id++).toString();
                imageValues['fileName'] = imageDoc;
                const imageRecord = imageMapper.createRecord(imageValues);
                images.push(imageRecord);
            }
        }
        record.set('sdocimages', images);
        // console.log('mapResponseDocument record full:', record);


        const dataTechValues = {};
        dataTechValues['altAsc'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'data_tech_alt_asc_i', undefined);
        dataTechValues['altDesc'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'data_tech_alt_desc_i', undefined);
        dataTechValues['altMin'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'data_tech_alt_min_i', undefined);
        dataTechValues['altMax'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'data_tech_alt_max_i', undefined);
        dataTechValues['dist'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'data_tech_dist_f', undefined);
        dataTechValues['dur'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'data_tech_dur_f', undefined);
        let dataTechSet = false;
        for (const field in dataTechValues) {
            if (dataTechValues[field] !== undefined && dataTechValues[field] !== 0) {
                dataTechSet = true;
                break;
            }
        }

        if (dataTechSet) {
            record.set('sdocdatatech', dataTechMapper.createRecord(dataTechValues));
        } else {
            record.set('sdocdatatech', undefined);
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
            record.set('sdocratetech', rateTechMapper.createRecord(rateTechValues));
        } else {
            record.set('sdocratetech', undefined);
        }

        const ratePersValues = {};
        ratePersValues['ausdauer'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_pers_ausdauer_i', undefined);
        ratePersValues['bildung'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_pers_bildung_i', undefined);
        ratePersValues['gesamt'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_pers_gesamt_i', undefined);
        ratePersValues['kraft'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_pers_kraft_i', undefined);
        ratePersValues['mental'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_pers_mental_i', undefined);
        ratePersValues['motive'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_pers_motive_i', undefined);
        ratePersValues['schwierigkeit'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_pers_schwierigkeit_i', undefined);
        ratePersValues['wichtigkeit'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'rate_pers_wichtigkeit_i', undefined);
        let ratePersSet = false;
        for (const field in ratePersValues) {
            if (ratePersValues[field] !== undefined && (ratePersValues[field] + '').length > 0 && ratePersValues[field] > 0) {
                ratePersSet = true;
                break;
            }
        }

        if (ratePersSet) {
            record.set('sdocratepers', ratePersMapper.createRecord(ratePersValues));
        } else {
            record.set('sdocratepers', undefined);
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
            record.set('sdocdatainfo', dataInfoMapper.createRecord(dataInfoValues));
        } else {
            record.set('sdocdatainfo', undefined);
        }

        // console.log('mapResponseDocument record full:', record);

        return record;
    }
}

