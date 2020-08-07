import {Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import * as L from 'leaflet';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {
    CommonDocContentUtils,
    CommonDocContentUtilsConfig,
    CommonItemData
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {BaseObjectDetectionImageObjectRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseobjectdetectionimageobject-record';
import LatLng = L.LatLng;
import {ChartElement} from '../components/visjs-profilechart/visjs-profilechart.component';

export interface TourDocItemData extends CommonItemData {
    tracks?: TourDocRecord[];
    objectdetections?: BaseObjectDetectionImageObjectRecord[];
    flgShowMap?: boolean;
    flgShowProfileMap?: boolean;
    flgMapAvailable?: boolean;
    flgProfileMapAvailable?: boolean;
}

export class Circular {
    protected arr: any[];
    protected currentIndex: number;

    constructor(arr: any[], startIndex?: number) {
        this.arr = arr;
        this.currentIndex = startIndex || 0;
    }

    public next(): any {
        const  i = this.currentIndex, arr = this.arr;
        this.currentIndex = i < arr.length - 1 ? i + 1 : 0;

        return this.current();
    }

    public prev(): any {
        const i = this.currentIndex, arr = this.arr;
        this.currentIndex = i > 0 ? i - 1 : arr.length - 1;

        return this.current();
    }

    public current(): any {
        return this.arr[this.currentIndex];
    }

    public setCurrent(idx: number): void {
        this.currentIndex = idx;
    }
}

export class TrackColors extends Circular {
    constructor(arr: string[], startIndex?: number) {
        super(arr, startIndex);
    }
}

export class DefaultTrackColors extends TrackColors {
    protected static colors = ['blue', 'green', 'red', 'yellow', 'darkgreen'];
    constructor(startIndex?: number) {
        super(DefaultTrackColors.colors, startIndex);
    }
}

@Injectable()
export class TourDocContentUtils extends CommonDocContentUtils {
    constructor(sanitizer: DomSanitizer, cdocRoutingService: CommonDocRoutingService, appService: GenericAppService) {
        super(sanitizer, cdocRoutingService, appService);
    }

    getLocationHierarchy(record: TourDocRecord, lastOnly: boolean): any[] {
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

    getStyleClassForRecord(record: TourDocRecord, layout: string): string[] {
        const value = record['tdocratepers'] || {gesamt: 0};
        const rate = Math.round(((value['gesamt'] || 0) / 3) + 0.5);
        return ['list-item-persrate-' + rate, 'list-item-' + layout + '-persrate-' + rate];
    }

    getTourDocSubItemFiltersForType(record: TourDocRecord, type: string, theme: string, minPerPage?: number): any {
        const filters = {
            type: type
        };

        // filter theme only for locations
        if (record.type === 'LOCATION' && theme !== undefined) {
            filters['theme'] = theme;
        }
        filters['sort'] = 'ratePers';

        if (record.type === 'TRACK') {
            if ((type === 'IMAGE' || type === 'TOPIMAGE') && record.trackId
                || (type === 'VIDEO' || type === 'TOPVIDEO') && record.trackId) {
                filters['moreFilter'] = 'track_id_i:' + record.trackId;
                filters['sort'] = 'dateAsc';
                filters['perPage'] = 100;
            } else if (type === 'ROUTE') {
                filters['moreFilter'] = 'track_id_is:' + record.trackId;
            } else if (type === 'TRIP' && record.tripId) {
                filters['moreFilter'] = 'trip_id_is:' + record.tripId;
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
            } else if (type === 'IMAGE' || type === 'TOPIMAGE' || type === 'VIDEO' || type === 'TOPVIDEO') {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
                filters['perPage'] = 12;
            } else if (type === 'NEWS') {
                filters['moreFilter'] = 'route_id_is:' + record.routeId;
            } else if (type === 'INFO') {
                filters['moreFilter'] = 'route_id_is:' + record.routeId;
            } else if (type === 'DESTINATION') {
                filters['moreFilter'] = 'route_id_is:' + record.routeId;
            } else if (type === 'TRACK') {
                filters['moreFilter'] = 'route_id_is:' + record.routeId;
            } else if (type === 'TRIP') {
                filters['moreFilter'] = 'route_id_is:' + record.routeId;
            } else {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
            }
        } else if (record.type === 'DESTINATION') {
            const id = record.id.replace(/.*?_/, '');
            if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else if (type === 'IMAGE' || type === 'TOPIMAGE' || type === 'VIDEO' || type === 'TOPVIDEO') {
                filters['moreFilter'] = 'destination_id_s:' + id;
                filters['perPage'] = 12;
            } else if (type === 'TRACK') {
                filters['moreFilter'] = 'destination_id_ss:' + id;
            } else if (type === 'TRIP') {
                filters['moreFilter'] = 'destination_id_ss:' + id;
            } else {
                filters['moreFilter'] = 'destination_id_s:' + id;
            }
        } else if (record.type === 'LOCATION') {
            if (type === 'LOCATION') {
                filters['moreFilter'] = 'loc_parent_id_i:' + record.locId;
                filters['sort'] = 'location';
            } else {
                filters['where'] = record.techName;
                if (type === 'IMAGE') {
                    filters['perPage'] = 12;
                }
            }
        } else if (record.type === 'IMAGE' || record.type === 'ODIMGOBJECT') {
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
            } else if (type === 'IMAGE' || type === 'TOPIMAGE' || type === 'VIDEO' || type === 'TOPVIDEO') {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
                filters['perPage'] = 12;
            } else if (type === 'TRACK') {
                filters['moreFilter'] = 'trip_id_is:' + record.tripId;
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
            } else if (type === 'TRACK' || type === 'TRIP') {
                filters['perPage'] = 20;
                filters['sort'] = 'dateAsc';
            }
        } else if (record.type === 'INFO') {
            filters['moreFilter'] = 'info_id_is:' + record.infoId;
            if (type === 'IMAGE' || type === 'TOPIMAGE') {
                filters['perPage'] = 12;
            } else if (type === 'VIDEO' || type === 'TOPVIDEO') {
                filters['perPage'] = 12;
            } else if (type === 'TRACK' || type === 'TRIP') {
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

    createMapElementForTourDoc(record: TourDocRecord, code: string, showImageTrackAndGeoPos: boolean,
                               trackColors?: TrackColors): MapElement[] {
        return this.createChartElementForTourDoc(record, code, showImageTrackAndGeoPos, trackColors);
    }

    createChartElementForTourDoc(record: TourDocRecord, code: string, showImageTrackAndGeoPos: boolean,
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

    updateItemData(itemData: TourDocItemData, record: TourDocRecord, layout: string): boolean {
        super.updateItemData(itemData, record, layout);
        if (record === undefined) {
            itemData.flgShowMap = false;
            itemData.flgShowProfileMap = false;
            itemData.tracks = [];
            itemData.objectdetections = [];
            return false;
        }

        itemData.styleClassFor = this.getStyleClassForRecord(<TourDocRecord>itemData.currentRecord, layout);

        // TODO: check
        if (itemData.currentRecord['tdocodimageobjects'] !== undefined && itemData.currentRecord['tdocodimageobjects'].length > 0) {
            itemData.objectdetections = itemData.currentRecord['tdocodimageobjects'];
        }

        if (itemData.currentRecord['tdocimages'] !== undefined && itemData.currentRecord['tdocimages'].length > 0) {
            itemData.image = itemData.currentRecord['tdocimages'][0];
            itemData.thumbnailUrl = this.getThumbnailUrl(itemData.image);
            itemData.previewUrl = this.getPreviewUrl(itemData.image);
            itemData.fullUrl = this.getFullUrl(itemData.image);
        } else if (itemData.currentRecord['tdocvideos'] !== undefined && itemData.currentRecord['tdocvideos'].length > 0) {
            itemData.video = itemData.currentRecord['tdocvideos'][0];
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

    protected getServiceConfig(): CommonDocContentUtilsConfig {
        return {
            cdocRecordRefIdField: 'tdoc_id',
            cdocAudiosKey: 'tdocaudios',
            cdocImagesKey: 'tdocimages',
            cdocVideosKey: 'tdocvideos'
        };
    }
}
