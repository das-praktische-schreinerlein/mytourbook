import {Mapper, Record} from 'js-data';
import {SDocRecord} from '../model/records/sdoc-record';
import {SDocImageRecord} from '../model/records/sdocimage-record';
import {MapperUtils} from '../../search-commons/services/mapper.utils';
import {GenericAdapterResponseMapper} from '../../search-commons/services/generic-adapter-response.mapper';
import {BeanUtils} from '../../commons/utils/bean.utils';

export class SDocAdapterResponseMapper implements GenericAdapterResponseMapper {
    protected mapperUtils = new MapperUtils();

    mapToAdapterDocument(mapping: {}, props: SDocRecord): any {
        const values = {};
        values['id'] = props.id;
        values['image_id_i'] = props.imageId;
        values['loc_id_i'] = props.locId;
        values['route_id_i'] = props.routeId;
        values['track_id_i'] = props.trackId;
        values['trip_id_i'] = props.tripId;
        values['news_id_i'] = props.newsId;
        values['dateshow_dt'] = props.dateshow;
        values['desc_txt'] = props.descTxt;
        values['desc_md_txt'] = props.descMd;
        values['desc_html_txt'] = props.descHtml;
        values['geo_lon_s'] = props.geoLon;
        values['geo_lat_s'] = props.geoLat;
        values['geo_loc_p'] = props.geoLoc;
        values['gpstrack_s'] = props.gpsTrack;
        values['gpstracks_basefile_s'] = props.gpsTrackBasefile;
        values['keywords_txt'] =
            (props.keywords ? props.keywords.split(', ').join(',,KW_') : '');
        values['loc_lochirarchie_s'] = (props.locHirarchie ? props.locHirarchie
            .toLowerCase()
            .replace(/[ ]*->[ ]*/g, ',,')
            .replace(/ /g, '_') : '');
        values['loc_lochirarchie_ids_s'] = (props.locHirarchieIds ? props.locHirarchieIds
            .toLowerCase()
            .replace(/,/g, ',,')
            .replace(/ /g, '_') : '');
        values['name_s'] = props.name;
        values['persons_txt'] =
            (props.persons ? props.persons.split(', ').join(',,') : '');
        values['playlists_txt'] =
            (props.playlists ? props.playlists.split(', ').join(',,') : '');
        values['type_s'] = props.type;

        values['html_txt'] = [
            values['desc_txt'],
            values['name_s'],
            values['keywords_txt'],
            values['type_s']].join(' ');

        if (props.get('sdocimages') && props.get('sdocimages').length > 0) {
            const image: SDocImageRecord = props.get('sdocimages')[0];
            values['i_fav_url_txt'] = image.fileName;
        }

        values['data_tech_alt_asc_i'] = BeanUtils.getValue(props, 'sdocdatatech.altAsc');
        values['data_tech_alt_desc_i'] = BeanUtils.getValue(props, 'sdocdatatech.altDesc');
        values['data_tech_alt_min_i'] = BeanUtils.getValue(props, 'sdocdatatech.altMin');
        values['data_tech_alt_max_i'] = BeanUtils.getValue(props, 'sdocdatatech.altMax');
        values['data_tech_dist_f'] = BeanUtils.getValue(props, 'sdocdatatech.dist');
        values['data_tech_dur_f'] = BeanUtils.getValue(props, 'sdocdatatech.dur');

        values['rate_tech_overall_s'] = BeanUtils.getValue(props, 'sdocratetech.overall');
        values['rate_tech_ks_s'] = BeanUtils.getValue(props, 'sdocratetech.ks');
        values['rate_tech_firn_s'] = BeanUtils.getValue(props, 'sdocratetech.firn');
        values['rate_tech_gletscher_s'] = BeanUtils.getValue(props, 'sdocratetech.gletscher');
        values['rate_tech_klettern_s'] = BeanUtils.getValue(props, 'sdocratetech.klettern');
        values['rate_tech_bergtour_s'] = BeanUtils.getValue(props, 'sdocratetech.bergtour');
        values['rate_tech_schneeschuh_s'] = BeanUtils.getValue(props, 'sdocratetech.schneeschuh');
        values['rate_pers_ausdauer_i'] = BeanUtils.getValue(props, 'sdocratepers.ausdauer');
        values['rate_pers_bildung_i'] = BeanUtils.getValue(props, 'sdocratepers.bildung');
        values['rate_pers_gesamt_i'] = BeanUtils.getValue(props, 'sdocratepers.gesamt');
        values['rate_pers_kraft_i'] = BeanUtils.getValue(props, 'sdocratepers.kraft');
        values['rate_pers_mental_i'] = BeanUtils.getValue(props, 'sdocratepers.mental');
        values['rate_pers_motive_i'] = BeanUtils.getValue(props, 'sdocratepers.motive');
        values['rate_pers_schwierigkeit_i'] = BeanUtils.getValue(props, 'sdocratepers.schwierigkeit');
        values['rate_pers_wichtigkeit_i'] = BeanUtils.getValue(props, 'sdocratepers.wichtigkeit');
        values['data_info_guides_s'] = BeanUtils.getValue(props, 'sdocdatainfo.guides');
        values['data_info_region_s'] = BeanUtils.getValue(props, 'sdocdatainfo.region');
        values['data_info_baseloc_s'] = BeanUtils.getValue(props, 'sdocdatainfo.baseloc');
        values['data_info_destloc_s'] = BeanUtils.getValue(props, 'sdocdatainfo.destloc');

        return values;
    }

    mapResponseDocument(mapper: Mapper, doc: any, mapping: {}): Record {
        const dataTechMapper = mapper['datastore']._mappers['sdocdatatech'];
        const dataInfoMapper = mapper['datastore']._mappers['sdocdatainfo'];
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
        const record: SDocRecord = <SDocRecord>mapper.createRecord(values);

        const imageField = doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'i_fav_url_txt')];
        let imageDocs = [];
        if (imageField !== undefined) {
            if (Array.isArray(imageField)) {
                imageDocs = imageField;
            } else {
                imageDocs.push(imageField);
            }
            this.mapImageDocsToAdapterDocument(mapper, record, imageDocs);
        } else {
            record.set('sdocimages', []);
        }
        // console.log('mapResponseDocument record full:', record);


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

    mapDetailDataToAdapterDocument(mapper: Mapper, profile: string, record: Record, docs: any[]): void {
        switch (profile) {
            case 'image':
                const imageUrls = [];
                docs.forEach(doc => {
                    imageUrls.push(doc['i_fav_url_txt']);
                });
                this.mapImageDocsToAdapterDocument(mapper, <SDocRecord>record, imageUrls);
                break;
        }
    }

    private mapImageDocsToAdapterDocument(mapper: Mapper, record: SDocRecord, imageDocs: any[]) {
        const imageMapper = mapper['datastore']._mappers['sdocimage'];
        const images: SDocImageRecord[] = [];
        if (imageDocs !== undefined) {
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

            for (const imageDoc of imageDocs) {
                if (imageDoc === undefined || imageDoc === null) {
                    continue;
                }
                const imageValues = {};
                imageValues['name'] = record.name;
                imageValues['id'] = (id++).toString();
                imageValues['fileName'] = imageDoc;
                const imageRecord = imageMapper.createRecord(imageValues);
                images.push(imageRecord);
            }
        }
        record.set('sdocimages', images);
    }

}

