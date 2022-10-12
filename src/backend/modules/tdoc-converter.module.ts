import {Mapper} from 'js-data';
import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocAdapterResponseMapper} from '../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import * as fs from 'fs';
import {ServerLogUtils} from '@dps/mycms-server-commons/dist/server-commons/serverlog.utils';
import {Feature, FeatureCollection} from 'geojson';

export class TourDocConverterModule {
    private dataService: TourDocDataService;
    private backendConfig: {};
    private keywordSrcLst = ['natural', 'tourism', 'surface', 'condition', 'man_made', 'amenity', 'sport', 'climbing'];

    constructor(backendConfig, dataService: TourDocDataService) {
        this.dataService = dataService;
        this.backendConfig = backendConfig;
    }

    public convertGeoJSONOTourDoc(srcFile: string): Promise<TourDocRecord[]> {
        const mapper: Mapper = this.dataService.getMapper('tdoc');
        const responseMapper = new TourDocAdapterResponseMapper(this.backendConfig);
        const records: TourDocRecord[] = [];
        const geoJsonObj: FeatureCollection = JSON.parse(fs.readFileSync(srcFile, {encoding: 'utf8'}));
        return new Promise<TourDocRecord[]>((resolve, reject) => {
            const rootType = geoJsonObj.type;
            const flgOsmImport = this.isOsm(geoJsonObj);
            const osmBaseUrl = flgOsmImport
                ? 'https://www.openstreetmap.org/'
                : undefined;
            const sourceKeyword = flgOsmImport
                ? 'SOURCE_openstreetmap/'
                : 'SOURCE_GeoJson';

            if (rootType !== 'FeatureCollection') {
                return reject('no valid geojson - type of FeatureCollection required - current:' + ServerLogUtils.sanitizeLogMsg(rootType));
            }

            const features: Feature[] = geoJsonObj.features;
            if (features === undefined || features.length <= 0) {
                return resolve([]);
            }

            const typeMap = {};

            for (let i = 0; i < features.length; i++) {
                const feature: Feature = features[i];
                if (feature.type !== 'Feature') {
                    return reject('no valid geojson - type of Feature required - current '
                        + i + ':' + ServerLogUtils.sanitizeLogMsg(feature));
                }

                const name = this.parseName(feature);
                if (name === undefined || name.length <= 0) {
                    continue;
                }

                let keywords = [sourceKeyword].concat(
                    this.parseKeywords(feature));
                const guides = this.parseGuides(feature);
                const coordinate = this.parseCoordinate(feature);
                const climbing = this.parseClimbing(feature);
                const source = this.parseSource(feature);

                if (climbing && climbing['types']) {
                    keywords = keywords.concat(
                        climbing['types'].map(type => 'climbing_' + type));
                }

                const linkedInfos = []
                const osmUrl = osmBaseUrl
                    ? osmBaseUrl + feature.id
                    : undefined;

                const urls = [osmUrl].concat(guides);
                for (let url of urls) {
                    if (!url || !url.includes('.')) {
                        continue;
                    }

                    if (! (url.startsWith('http://') || url.startsWith('https://'))) {
                        url = 'https://' + url;
                    }

                    const baseUrl = url.split( '/' )[2];
                    if (!typeMap['INFO']) {
                        typeMap['INFO'] = {};
                    }
                    if (!typeMap['INFO'][baseUrl]) {
                        const infoDbId = records.length + 1;
                        const infoValues = {
                            type_s: 'INFO',
                            subtype_s: '1',
                            subtype_ss: '1',
                            info_id_i: infoDbId + '',
                            id: 'INFO_' + infoDbId,
                            keywords_txt: [sourceKeyword].join(', '),
                            info_name_s: baseUrl,
                            info_type_s: '1',
                            info_reference_s: 'https://' + baseUrl,
                            info_publisher_s: osmBaseUrl
                                ? osmBaseUrl
                                : baseUrl,
                            name_s: baseUrl
                        };
                        const infoRecord =
                            <TourDocRecord>responseMapper.mapResponseDocument(mapper, infoValues, {});
                        records.push(infoRecord);
                        typeMap['INFO'][baseUrl] = infoRecord;
                    }

                    const info: TourDocRecord = typeMap['INFO'][baseUrl];
                    const linkedinfo = ['type=', 1,
                        ':::name=', url,
                        ':::refId=', info.infoId,
                        ':::linkedDetails=', url].join('');
                    linkedInfos.push(linkedinfo);
                }

                let desc = undefined;
                if (false && guides.length > 0) {
                    desc = desc
                        ? desc + '\n'
                        : '';
                    desc += 'Guides:\n  - ' + guides.join('  - ')  + '\n';
                }

                if (climbing) {
                    desc = desc
                        ? desc + '\n'
                        : '';
                    desc += 'Climbing:'
                        + (climbing['types']
                            ? ' ' + climbing['types'].join(', ')
                            : '')
                        + (climbing['grades']
                            ? ' ' + climbing['grades'].join(', ')
                            : '')
                        + (climbing['length']
                            ? ' ' +  climbing['length']
                            : '')
                        + (climbing['rock']
                            ? ' ' +  climbing['rock']
                            : '')
                        + (climbing['orientation']
                            ? ' ' +  climbing['orientation']
                            : '')
                        + '\n';
                }

                if (source) {
                    desc = desc
                        ? desc + '\n'
                        : '';
                    desc += 'SOURCE: ' + source;
                }

                const dbId = records.length + 1;
                const values = {
                    type_s: 'POI',
                    poi_id_i: dbId + '',
                    id: 'POI_' + dbId,
                    geo_lat_s: coordinate['lat'],
                    geo_lon_s: coordinate['lon'],
                    geo_loc_p: coordinate['loc'],
                    data_info_guides_s: osmUrl
                        ? osmUrl
                        : feature.id,
                    desc_txt: desc,
                    linkedinfos_txt: linkedInfos.join(';;'),
                    data_tech_alt_max_i: coordinate['ele'],
                    keywords_txt: keywords.join(', '),
                    name_s: name
                };

                const poiObj = <TourDocRecord>responseMapper.mapResponseDocument(mapper, values, {});
                records.push(poiObj);
            }

            return resolve(records);
        });
    }

    public parseKeywords(feature: Feature): string[] {
        const keywords = [];
        for (let k = 0; k < this.keywordSrcLst.length; k++) {
            const keywordsSrc = this.keywordSrcLst[k];
            if (feature.properties[keywordsSrc] !== undefined) {
                keywords.push(keywordsSrc + '_' + feature.properties[keywordsSrc]);
            }
        }

        return keywords;
    }

    public parseGuides(feature: Feature): string[] {
        const guides = [];
        if (feature.properties['wikidata']) {
            guides.push('https://www.wikidata.org/wiki/' + feature.properties['wikidata']);
        }

        if (feature.properties['wikipedia']) {
            guides.push('https://www.wikipedia.org/wiki/' + feature.properties['wikipedia']);
        }

        if (feature.properties['website']) {
            guides.push(feature.properties['website']);
        }

        if (feature.properties['url']) {
            guides.push(feature.properties['url']);
        }

        return guides;
    }

    public parseCoordinate(feature: Feature): {} {
        if (feature.geometry === undefined) {
            return;
        }

        let geoLat = undefined;
        let geoLon = undefined;
        let geoLoc = undefined;
        const ele = feature.properties['ele'];

        if (feature.geometry.type === 'Point') {
            geoLon = feature.geometry.coordinates[0];
            geoLat = feature.geometry.coordinates[1];
        } else if (feature.geometry.type === 'Polygon') {
            geoLon = feature.geometry.coordinates[0][0][0];
            geoLat = feature.geometry.coordinates[0][0][1];
        }

        if (geoLat !== undefined && geoLon !== undefined) {
            geoLoc = geoLat + ',' + geoLon;
        }

        return  {
            lat: geoLat,
            lon: geoLon,
            loc: geoLoc,
            ele: ele
        }
    }

    public parseClimbing(feature: Feature): {} {
        const grades = [];
        for (const type of ['UIAA', 'french', 'saxon']) {
            const gradeMin = feature.properties['climbing:grade:' + type + ':min'];
            const gradeMax = feature.properties['climbing:grade:' + type + ':max'];
            if (gradeMin && gradeMax) {
                grades.push(type + ' ' + gradeMin + '-' + gradeMax);
                continue;
            }
            if (gradeMin) {
                grades.push(type + ' ' + gradeMin + '-?');
                continue;
            }

            if (gradeMax) {
                grades.push(type + ' ?-' + gradeMax);
                continue;
            }
        }

        const lengthMin = feature.properties['climbing:length:min'];
        const lengthMax = feature.properties['climbing:length:max'];
        const length = lengthMin && lengthMax
            ? lengthMin + '-' + lengthMax + 'm'
            : lengthMin
                ? lengthMin + '-?m'
                : lengthMax
                    ? '?-' + lengthMax + 'm'
                    : undefined;

        const types =  []
        if (feature.properties['climbing:sport']) {
            types.push('sport_climbing')
        }
        if (feature.properties['climbing:trad']) {
            types.push('trad_climbing')
        }

        const rock = feature.properties['climbing:rock']
            ? feature.properties['climbing:rock']
            : undefined;

        const orientation = feature.properties['climbing:orientation']
            ? feature.properties['climbing:orientation']
            : undefined;

        return grades.length > 0 || types.length > 0 || length || rock || orientation
            ? {
                grades: grades,
                types: types,
                length: length,
                rock: rock,
                orientation: orientation
            }
            : undefined;
    }

    public parseName(feature: Feature): string {
        return feature.properties['name:de'] !== undefined
            ? feature.properties['name:de']
            + (feature.properties['name:it']
                ? ' - ' + feature.properties['name:it']
                : feature.properties['name:en']
                    ? ' - ' + feature.properties['name:en']
                    : '')
            : feature.properties['name']
    }

    public parseSource(feature: Feature): string {
        return feature.properties['source'] !== undefined
            ? feature.properties['source']
            : feature.properties['source:ele']
    }

    public isOsm(geoJson: FeatureCollection): boolean {
        if (!geoJson) {
            return false;
        }

        if (geoJson['generator'] && geoJson['generator'].indexOf('overpass') === 0) {
            return true;
        }

        if (geoJson['copyright'] && geoJson['copyright'].indexOf('openstreetmap') >= 0) {
            return true;
        }

        return false;
    }
}
