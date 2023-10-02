import {Injectable} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {LatLng} from 'leaflet';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {ChartElement} from '../components/visjs-profilechart/visjs-profilechart.component';
import {TrackColors} from '@dps/mycms-commons/dist/geo-commons/model/track-colors';
import {MapDocRecord} from '@dps/mycms-commons/dist/geo-commons/model/map-element.types';

@Injectable()
export class MapContentUtils {
    constructor(protected appService: GenericAppService) {
    }

    createMapElementForDocRecord(record: MapDocRecord, code: string, showImageTrackAndGeoPos: boolean,
                                 trackColors?: TrackColors): MapElement[] {
        return this.createChartElementForDocRecord(record, code, showImageTrackAndGeoPos, trackColors);
    }

    createChartElementForDocRecord(record: MapDocRecord, code: string, showImageTrackAndGeoPos: boolean,
                                   trackColors?: TrackColors): ChartElement[] {
        const trackUrl = record.gpsTrackBasefile;

        const isImage = (record.type === 'IMAGE' || record.type === 'VIDEO');
        const showTrack = ((trackUrl !== undefined && trackUrl.length > 0)
            || (record.gpsTrackSrc !== undefined && record.gpsTrackSrc !== null && record.gpsTrackSrc.length > 0))
            && (!isImage || showImageTrackAndGeoPos);
        const showGeoPos = (!showTrack || isImage) && record.geoLat && record.geoLon &&
            record.geoLat !== '0.0' && record.geoLon !== '0.0';
        const mapElements: ChartElement[] = [];

        if (showTrack) {
            let storeUrl;
            // TODO make it configurable json/gpx
            if (this.appService.getAppConfig()['useAssetStoreUrls'] === true) {
                storeUrl = this.appService.getAppConfig()['tracksBaseUrl'] + 'json/' + record.id;
            } else {
                storeUrl = this.appService.getAppConfig()['tracksBaseUrl'] + trackUrl + '.json';
            }
            const mapElement: ChartElement = {
                id: record.id,
                code: code,
                name: record.name,
                color: trackColors !== undefined ? trackColors.next() : undefined,
                trackUrl: storeUrl,
                trackSrc: record.gpsTrackSrc,
                popupContent: '<b>' + '&#128204;' + code + ' ' + record.type + ': ' + record.name + '</b>',
                type: record.type
            };
            mapElements.push(mapElement);
        }
        if (showGeoPos) {
            const ele = BeanUtils.getValue(record, 'tdocdatatech.altMax');
            const point = ele !== undefined ? new LatLng(+record.geoLat, +record.geoLon, +ele) : new LatLng(+record.geoLat, +record.geoLon);
            const mapElement: ChartElement = {
                id: record.id,
                code: code,
                name: record.type + ': ' + record.name,
                point: point,
                popupContent: '<b>' + '&#128204;' + code + ' ' + record.type + ': ' + record.name + '</b>',
                type: record.type
            };
            mapElements.push(mapElement);
        }

        return mapElements;
    }
}
