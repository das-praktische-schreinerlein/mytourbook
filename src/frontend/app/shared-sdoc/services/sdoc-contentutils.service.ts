import {Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {MapElement} from '../../../shared/angular-maps/services/leaflet-geo.plugin';
import {CommonDocRoutingService} from '../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import * as L from 'leaflet';
import {BeanUtils} from '../../../shared/commons/utils/bean.utils';
import {CommonDocContentUtils, CommonItemData} from '../../../shared/frontend-cdoc-commons/services/cdoc-contentutils.service';
import LatLng = L.LatLng;

export interface SDocItemData extends CommonItemData {
    tracks?: SDocRecord[];
    flgShowMap?: boolean;
    flgShowProfileMap?: boolean;
    flgMapAvailable?: boolean;
    flgProfileMapAvailable?: boolean;
}

@Injectable()
export class SDocContentUtils extends CommonDocContentUtils {

    constructor(sanitizer: DomSanitizer, cdocRoutingService: CommonDocRoutingService, appService: GenericAppService) {
        super(sanitizer, cdocRoutingService, appService);
    }

    getLocationHierarchy(record: SDocRecord, lastOnly: boolean): any[] {
        if (record.locHirarchie === undefined || record.locHirarchieIds === undefined) {
            return [];
        }

        const hierarchyTexts = record.locHirarchie.split(' -> ');
        const hierarchyIds = record.locHirarchieIds.split(',');
        if (hierarchyIds.length !== hierarchyTexts.length) {
            return [];
        }

        const hierarchy = [];
        let lastIndex = hierarchyTexts.length - 1;
        if (record.type === 'LOCATION' && hierarchy.length > 1) {
            lastIndex--;
        }

        for (let i = lastOnly ? lastIndex : 0; i < hierarchyTexts.length; i++) {
            if (hierarchyIds[i] !== undefined && hierarchyTexts[i] !== undefined && hierarchyTexts[i].length > 0) {
                hierarchy.push(['LOCATION_' + hierarchyIds[i], hierarchyTexts[i]]);
            }
        }

        return hierarchy;
    }

    getStyleClassForRecord(record: SDocRecord, layout: string): string[] {
        const value = record['sdocratepers'] || {gesamt: 0};
        const rate = Math.round(((value['gesamt'] || 0) / 3) + 0.5);
        return ['list-item-persrate-' + rate, 'list-item-' + layout + '-persrate-' + rate];
    }

    getSDocSubItemFiltersForType(record: SDocRecord, type: string, theme: string, minPerPage?: number): any {
        const filters = {
            type: type
        };

        // filter theme only for locations
        if (record.type === 'LOCATION' && theme !== undefined) {
            filters['theme'] = theme;
        }
        filters['sort'] = 'ratePers';

        if (record.type === 'TRACK') {
            if ((type === 'IMAGE' || type === 'TOPIMAGE') && record.trackId) {
                filters['moreFilter'] = 'track_id_i:' + record.trackId;
                filters['sort'] = 'dateAsc';
                filters['perPage'] = 100;
            } else if ((type === 'VIDEO' || type === 'TOPVIDEO') && record.trackId) {
                filters['moreFilter'] = 'track_id_i:' + record.trackId;
                filters['sort'] = 'dateAsc';
                filters['perPage'] = 100;
            }else if (type === 'ROUTE') {
                filters['moreFilter'] = 'track_id_is:' + record.trackId;
            } else if (type === 'TRIP' && record.tripId) {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
            } else if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else if (type === 'NEWS' && record.newsId) {
                filters['moreFilter'] = 'news_id_i:' + record.newsId;
            } else {
                filters['moreFilter'] = 'track_id_i:' + record.trackId;
            }
        } else if (record.type === 'ROUTE') {
            if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else if (type === 'IMAGE' || type === 'TOPIMAGE') {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
                filters['perPage'] = 12;
            } else if (type === 'VIDEO' || type === 'TOPVIDEO') {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
                filters['perPage'] = 12;
            } else if (type === 'TRACK') {
                filters['moreFilter'] = 'route_id_is:' + record.routeId;
            } else if (type === 'TRIP') {
                filters['moreFilter'] = 'route_id_is:' + record.routeId;
            } else {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
            }
        } else if (record.type === 'LOCATION') {
            if (type === 'LOCATION') {
                filters['moreFilter'] = 'loc_parent_id_i:' + record.locId;
                filters['sort'] = 'location';
            } else {
                filters['moreFilter'] = 'loc_lochirarchie_ids_txt:' + record.locId;
                if (type === 'IMAGE') {
                    filters['perPage'] = 12;
                }
            }
        } else if (record.type === 'IMAGE') {
            if (type === 'TRACK' && record.trackId) {
                filters['moreFilter'] = 'track_id_i:' + record.trackId;
            } else if (type === 'TOPIMAGE') {
                filters['moreFilter'] = 'track_id_i:' + -1;
            } else if (type === 'ROUTE' && record.trackId) {
                filters['moreFilter'] = 'track_id_is:' + record.trackId;
            } else if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else if (type === 'TRIP' && record.tripId) {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
            } else if (type === 'NEWS' && record.newsId) {
                filters['moreFilter'] = 'news_id_i:' + record.newsId;
            } else {
                filters['moreFilter'] = 'image_id_i:' + record.imageId;
            }
        } else if (record.type === 'VIDEO') {
            if (type === 'TRACK' && record.trackId) {
                filters['moreFilter'] = 'track_id_i:' + record.trackId;
            } else if (type === 'TOPVIDEO') {
                filters['moreFilter'] = 'track_id_i:' + -1;
            } else if (type === 'ROUTE' && record.trackId) {
                filters['moreFilter'] = 'track_id_is:' + record.trackId;
            } else if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else if (type === 'TRIP' && record.tripId) {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
            } else if (type === 'NEWS' && record.newsId) {
                filters['moreFilter'] = 'news_id_i:' + record.newsId;
            } else {
                filters['moreFilter'] = 'video_id_i:' + record.videoId;
            }
        } else if (record.type === 'TRIP') {
            if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else if (type === 'IMAGE' || type === 'TOPIMAGE') {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
                filters['perPage'] = 12;
            } else if (type === 'VIDEO' || type === 'TOPVIDEO') {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
                filters['perPage'] = 12;
            } else if (type === 'TRACK') {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
                filters['perPage'] = 99;
                filters['sort'] = 'dateAsc';
            } else if (type === 'NEWS' && record.newsId) {
                filters['moreFilter'] = 'news_id_i:' + record.newsId;
            } else {
                filters['moreFilter'] = 'trip_id_is:' + record.tripId;
            }
        } else if (record.type === 'NEWS') {
            filters['moreFilter'] = 'news_id_is:' + record.newsId;
            if (type === 'IMAGE' || type === 'TOPIMAGE') {
                filters['perPage'] = 12;
            } else if (type === 'VIDEO' || type === 'TOPVIDEO') {
                filters['perPage'] = 12;
            } else if (type === 'TRACK') {
                filters['perPage'] = 20;
                filters['sort'] = 'dateAsc';
            } else if (type === 'TRIP') {
                filters['perPage'] = 20;
                filters['sort'] = 'dateAsc';
            }
        }

        if (type === 'TOPIMAGE') {
            if (!filters['moreFilter']) {
                filters['moreFilter'] = '';
            }
            filters['moreFilter'] += '_,_personalRateOverall:8,9,10,11,12,13,14,15';
            filters['type'] = 'IMAGE';
            filters['sort'] = 'ratePers';
            filters['perPage'] = 4;
        } else if (type === 'TOPVIDEO') {
            if (!filters['moreFilter']) {
                filters['moreFilter'] = '';
            }
            filters['moreFilter'] += '_,_personalRateOverall:8,9,10,11,12,13,14,15';
            filters['type'] = 'VIDEO';
            filters['sort'] = 'ratePers';
            filters['perPage'] = 4;
        }

        if (minPerPage && minPerPage > 0 && minPerPage > filters['perPage']) {
            filters['perPage'] = minPerPage;
        }

        return filters;
    }

    createMapElementForSDoc(record: SDocRecord, showImageTrackAndGeoPos: boolean): MapElement[] {
        const trackUrl = record.gpsTrackBasefile;

        const isImage = (record.type === 'IMAGE' || record.type === 'VIDEO');
        const showTrack = (trackUrl !== undefined && trackUrl.length > 0 && (!isImage || showImageTrackAndGeoPos))
            || (record.gpsTrackSrc !== undefined && record.gpsTrackSrc !== null && record.gpsTrackSrc.length > 0);
        const showGeoPos = (!showTrack || isImage) && record.geoLat && record.geoLon &&
            record.geoLat !== '0.0' && record.geoLon !== '0.0';
        const mapElements: MapElement[] = [];

        if (showTrack) {
            let storeUrl;
            if (this.appService.getAppConfig()['useAssetStoreUrls'] === true) {
                storeUrl = this.appService.getAppConfig()['tracksBaseUrl'] + 'json/' + record.id;
            } else {
                storeUrl = this.appService.getAppConfig()['tracksBaseUrl'] + trackUrl + '.json';
            }
            const mapElement: MapElement = {
                id: record.id,
                name: record.name,
                trackUrl: storeUrl,
                trackSrc: record.gpsTrackSrc,
                popupContent: '<b>' + record.type + ': ' + record.name + '</b>',
                type: record.type
            };
            mapElements.push(mapElement);
        }
        if (showGeoPos) {
            const ele = BeanUtils.getValue(record, 'sdocdatatech.altMax');
            const point = ele !== undefined ? new LatLng(+record.geoLat, +record.geoLon, +ele) : new LatLng(+record.geoLat, +record.geoLon);
            const mapElement: MapElement = {
                id: record.id,
                name: record.type + ': ' + record.name,
                point: point,
                popupContent: '<b>' + record.type + ': ' + record.name + '</b>',
                type: record.type
            };
            mapElements.push(mapElement);
        }

        return mapElements;
    }

    updateItemData(itemData: SDocItemData, record: SDocRecord, layout: string): boolean {
        super.updateItemData(itemData, record, layout);
        if (record === undefined) {
            itemData.flgShowMap = false;
            itemData.flgShowProfileMap = false;
            itemData.tracks = [];
            return false;
        }

        itemData.styleClassFor = this.getStyleClassForRecord(<SDocRecord>itemData.currentRecord, layout);

        if (itemData.currentRecord['sdocimages'] !== undefined && itemData.currentRecord['sdocimages'].length > 0) {
            itemData.image = itemData.currentRecord['sdocimages'][0];
            itemData.thumbnailUrl = this.getThumbnailUrl(itemData.image);
            itemData.previewUrl = this.getPreviewUrl(itemData.image);
            itemData.fullUrl = this.getFullUrl(itemData.image);
        } else if (itemData.currentRecord['sdocvideos'] !== undefined && itemData.currentRecord['sdocvideos'].length > 0) {
            itemData.video = itemData.currentRecord['sdocvideos'][0];
            itemData.thumbnailUrl = this.getVideoThumbnailUrl(itemData.video);
            itemData.previewUrl = this.getVideoPreviewUrl(itemData.video);
            itemData.fullUrl = this.getFullVideoUrl(itemData.video);
        }

        if (record !== undefined && (record.gpsTrackBasefile || record.geoLoc !== undefined
                || (record.gpsTrackSrc !== undefined && record.gpsTrackSrc.length > 20))) {
            itemData.tracks = [record];
            itemData.flgMapAvailable = true;
            itemData.flgProfileMapAvailable = (record.gpsTrackBasefile !== undefined
                || (record.gpsTrackSrc !== undefined && record.gpsTrackSrc.length > 20));
        } else {
            itemData.tracks = [];
            itemData.flgMapAvailable = false;
            itemData.flgProfileMapAvailable = false;
        }

        itemData.flgShowMap = itemData.flgMapAvailable;
        itemData.flgShowProfileMap = itemData.flgProfileMapAvailable;
    }

}
