import {Injectable} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SDocImageRecord} from '../../../shared/sdoc-commons/model/records/sdocimage-record';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {MapElement} from '../../../shared/angular-maps/services/leaflet-geo.plugin';
import {SDocRoutingService} from './sdoc-routing.service';
import * as L from 'leaflet';
import {FilterUtils, SimpleFilter} from '../../../shared/commons/utils/filter.utils';
import {BeanUtils} from '../../../shared/commons/utils/bean.utils';
import {SDocVideoRecord} from '../../../shared/sdoc-commons/model/records/sdocvideo-record';
import LatLng = L.LatLng;

export enum KeywordsState {
    SET, NOTSET, SUGGESTED
}

export interface StructuredKeyword {
    name: string;
    keywords: string[];
}

export interface StructuredKeywordState {
    name: string;
    keywords: { keyword: string; state: KeywordsState}[];
}

export interface KeywordSuggestion {
    name: string;
    filters: SimpleFilter[];
    keywords: string[];
}

export interface ItemData {
    currentRecord: SDocRecord;
    styleClassFor: string[];
    urlShow: SafeUrl;
    image: SDocImageRecord;
    video: SDocVideoRecord;
    thumbnailUrl: SafeUrl;
    previewUrl: SafeUrl;
    fullUrl: SafeUrl;
    tracks?: SDocRecord[];
    flgShowMap?: boolean;
    flgShowProfileMap?: boolean;
    flgMapAvailable?: boolean;
    flgProfileMapAvailable?: boolean;
}

@Injectable()
export class SDocContentUtils {

    constructor(private sanitizer: DomSanitizer, private sdocRoutingService: SDocRoutingService, private appService: GenericAppService) {
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

    getThumbnails(record: SDocRecord): SDocImageRecord[] {
        return record['sdocimages'].filter((item, index) => index < 10);
    }

    getThumbnail(image: SDocImageRecord): string {
        return this.getImageUrl(image, 'x100');
    }

    getVideoThumbnail(image: SDocVideoRecord): string {
        return this.getVideoUrl(image, 'screenshot', '.jpg');
    }

    getThumbnailUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getThumbnail(image));
    }

    getVideoThumbnailUrl(image: SDocVideoRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoThumbnail(image));
    }

    getPreview(image: SDocImageRecord): string {
        return this.getImageUrl(image, 'x600');
    }

    getVideoPreview(image: SDocVideoRecord): string {
        return this.getVideoUrl(image, 'thumbnail', '.gif.mp4');
    }

    getPreviewUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getPreview(image));
    }

    getVideoPreviewUrl(image: SDocVideoRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoPreview(image));
    }

    getFullUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getImageUrl(image, 'x600'));
    }

    getFullVideoUrl(video: SDocVideoRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoUrl(video, 'x600'));
    }

    getImageUrl(image: SDocImageRecord, resolution: string): string {
        if (image === undefined) {
            return 'not found';
        }

        if (this.appService.getAppConfig()['useAssetStoreUrls'] === true) {
            return this.appService.getAppConfig()['picsBaseUrl'] + resolution + '/' + image.sdoc_id;
        } else {
            return this.appService.getAppConfig()['picsBaseUrl'] + 'pics_' + resolution + '/' + image.fileName;
        }
    }
    getVideoUrl(video: SDocVideoRecord, resolution: string, suffix?: string): string {
        if (video === undefined) {
            return 'not found';
        }

        if (this.appService.getAppConfig()['useVideoAssetStoreUrls'] === true) {
            return this.appService.getAppConfig()['videoBaseUrl'] + resolution + '/' + video.sdoc_id;
        } else {
            return this.appService.getAppConfig()['videoBaseUrl'] + 'video_' + resolution + '/' + video.fileName + (suffix ? suffix : '');
        }
    }

    getStyleClassForRecord(record: SDocRecord, layout: string): string[] {
        const value = record['sdocratepers'] || {gesamt: 0};
        const rate = Math.round(((value['gesamt'] || 0) / 3) + 0.5);
        return ['list-item-persrate-' + rate, 'list-item-' + layout + '-persrate-' + rate];
    }

    getSuggestedKeywords(suggestionConfigs: KeywordSuggestion[], prefix: string, values: any): string[] {
        let suggestions = [];
        for (const suggestionConfig of suggestionConfigs) {
            if (FilterUtils.checkFilters(suggestionConfig.filters, values)) {
                suggestions = suggestions.concat(suggestionConfig.keywords);
            }
        }

        if (prefix !== undefined && prefix.length > 0) {
            for (let i = 0; i < suggestions.length; i++) {
                suggestions[i] = prefix + suggestions[i];
            }
        }

        return suggestions;
    }

    getStructuredKeywords(config: StructuredKeyword[], keywords: string[], blacklist: string[], possiblePrefixes: string[]):
        StructuredKeyword[] {
        const keywordKats: StructuredKeyword[] = [];
        if (keywords === undefined || keywords.length < 1) {
            return keywordKats;
        }
        for (const keyword of blacklist) {
            if (keywords.indexOf(keyword) > -1) {
                // TODO remove
            }
        }

        for (const keywordKat of config) {
            const keywordFound = [];
            for (const keyword of keywordKat.keywords) {
                for (const prefix of (possiblePrefixes || [])) {
                    const searchPrefix = prefix + keyword;
                    if (keywords.indexOf(searchPrefix) > -1) {
                        keywordFound.push(keyword);
                        break;
                    }
                }
            }
            if (keywordFound.length > 0) {
                keywordKats.push({ name: keywordKat.name, keywords: keywordFound});
            }
        }

        return keywordKats;
    }

    getStructuredKeywordsState(config: StructuredKeyword[], keywords: string[], suggested: string[], possiblePrefixes: string[]):
        StructuredKeywordState[] {
        const keywordKats: StructuredKeywordState[] = [];
        if (keywords === undefined || keywords.length < 1) {
            keywords = [];
        }

        for (const keywordKat of config) {
            const keywordFound = [];
            for (const keyword of keywordKat.keywords) {
                let found = false;
                for (const prefix of (possiblePrefixes || [])) {
                    const searchPrefix = prefix + keyword;
                    if (keywords.indexOf(searchPrefix) > -1) {
                        keywordFound.push({keyword: keyword, state: KeywordsState.SET});
                        found = true;
                        break;
                    } else if (suggested.indexOf(searchPrefix) > -1) {
                        found = true;
                        keywordFound.push({keyword: keyword, state: KeywordsState.SUGGESTED});
                        break;
                    }
                }

                if (!found) {
                    keywordFound.push({keyword: keyword, state: KeywordsState.NOTSET});
                }

            }
            keywordKats.push({ name: keywordKat.name, keywords: keywordFound});
        }

        return keywordKats;
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

    calcRate(rate: number, max: number): number {
        return Math.round((rate / 15 * max) + 0.5);
    }

    getShowUrl(record: SDocRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.sdocRoutingService.getShowUrl(record, ''));
    }

    updateItemData(itemData: ItemData, record: SDocRecord, layout: string): boolean {
        if (record === undefined) {
            itemData.currentRecord = undefined;
            itemData.styleClassFor = undefined;
            itemData.urlShow = undefined;
            itemData.image = undefined;
            itemData.video = undefined;
            itemData.thumbnailUrl = undefined;
            itemData.previewUrl = undefined;
            itemData.fullUrl = undefined;
            itemData.flgShowMap = false;
            itemData.flgShowProfileMap = false;
            itemData.tracks = [];
            return false;
        }

        itemData.currentRecord = record;
        itemData.styleClassFor = this.getStyleClassForRecord(itemData.currentRecord, layout);
        itemData.urlShow = this.getShowUrl(itemData.currentRecord);
        itemData.image = undefined;
        itemData.video = undefined;
        itemData.thumbnailUrl = undefined;
        itemData.previewUrl = undefined;
        itemData.fullUrl = undefined;

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
