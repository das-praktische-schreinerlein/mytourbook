import {Injectable} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SDocImageRecord} from '../../../shared/sdoc-commons/model/records/sdocimage-record';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {MapElement} from '../../../shared/angular-maps/services/leaflet-geo.plugin';
import 'leaflet';
import LatLng = L.LatLng;

export interface StructuredKeyword {
    name: string;
    keywords: string[];
}

@Injectable()
export class SDocContentUtils {

    constructor(private sanitizer: DomSanitizer, private appService: GenericAppService) {
    }

    getLastElementLocationHierarchy(record: SDocRecord): string {
        if (record.locHirarchie === undefined) {
            return '';
        }

        const hierarchy = record.locHirarchie.split(' -> ');
        if (record.type === 'LOCATION' && hierarchy.length > 1) {
            return hierarchy[hierarchy.length - 2];
        }

        return hierarchy[hierarchy.length - 1];
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
            if (hierarchyIds[i] !== undefined && hierarchyTexts[i] != undefined && hierarchyTexts[i].length > 0) {
                hierarchy.push(['LOCATION_' + hierarchyIds[i], hierarchyTexts[i]]);
            }
        }

        return hierarchy;
    }

    getThumbnails(record: SDocRecord): SDocImageRecord[] {
        return record['sdocimages'].filter((item, index) => index < 10);
    }

    getThumbnail(image: SDocImageRecord): string {
        return this.appService.getAppConfig()['picsBaseUrl'] + '/pics_x100/' + image.fileName;
    }

    getThumbnailUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getThumbnail(image));
    }

    getPreview(image: SDocImageRecord): string {
        return this.appService.getAppConfig()['picsBaseUrl'] + '/pics_x600/' + image.fileName;
    }

    getPreviewUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getPreview(image));
    }

    getFullUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            this.appService.getAppConfig()['picsBaseUrl'] + '/pics_x600/' + image.fileName);
    }

    getStyleClassForRecord(record: SDocRecord, layout: string): string[] {
        const value = record['sdocratepers'] || {gesamt: 0};
        const rate = Math.round(((value['gesamt'] || 0) / 3) + 0.5);
        return ['list-item-persrate-' + rate, 'list-item-' + layout + '-persrate-' + rate];
    }

    getStructuredKeywords(config: StructuredKeyword[], keywords: string[], blacklist: string[]): StructuredKeyword[] {
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
                if (keywords.indexOf(keyword) > -1) {
                    // TODO remove
                    keywordFound.push(keyword);
                }
            }
            if (keywordFound.length > 0) {
                keywordKats.push({ name: keywordKat.name, keywords: keywordFound});
            }
        }

        return keywordKats;
    }

    getSDocSubItemFiltersForType(record: SDocRecord, type: string, theme: string): any {
        const filters = {
            type: type
        };

        // filter theme only for locations
        if (record.type === 'LOCATION' && theme !== undefined) {
            filters['theme'] = theme;
        }
        filters['sort'] = 'ratePers';

        if (record.type === 'TRACK') {
            if (type === 'IMAGE' && record.trackId) {
                filters['moreFilter'] = 'track_id_i:' + record.trackId;
                filters['sort'] = 'dateAsc';
                filters['perPage'] = 100;
            } else if (type === 'ROUTE' && record.routeId) {
                filters['moreFilter'] = 'route_id_is:' + record.routeId;
            } else if (type === 'TRIP' && record.tripId) {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
            } else if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else {
                filters['moreFilter'] = 'track_id_i:' + record.trackId;
            }
        } else if (record.type === 'ROUTE') {
            if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else if (type === 'IMAGE') {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
                filters['perPage'] = 12;
            } else if (type === 'TRACK') {
                filters['moreFilter'] = 'route_id_is:' + record.routeId;
            } else if (type === 'TRIP' && record.routeId) {
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
            } else if (type === 'ROUTE' && record.routeId) {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
            } else if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else if (type === 'TRIP' && record.tripId) {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
            } else {
                filters['moreFilter'] = 'image_id_i:' + record.imageId;
            }
        } else if (record.type === 'TRIP') {
            if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else if (type === 'IMAGE') {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
                filters['perPage'] = 12;
            } else if (type === 'TRACK') {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
                filters['perPage'] = 99;
                filters['sort'] = 'dateAsc';
            } else {
                filters['moreFilter'] = 'trip_id_is:' + record.tripId;
            }
        }

        return filters;
    }

    createMapElementForSDoc(record: SDocRecord, showImageTrackAndGeoPos: boolean): MapElement[] {
        const trackUrl = record.gpsTrackBasefile;

        const isImage = record.type === 'IMAGE';
        const showTrack = trackUrl !== undefined && trackUrl.length > 0 && (!isImage || showImageTrackAndGeoPos);
        const showGeoPos = (!showTrack || isImage) && record.geoLat && record.geoLon &&
            record.geoLat !== '0.0' && record.geoLon !== '0.0';
        const mapElements: MapElement[] = [];

        if (showTrack) {
            const mapElement: MapElement = {
                id: record.id,
                name: record.name,
                trackUrl: this.appService.getAppConfig()['tracksBaseUrl'] + trackUrl + '.json',
                trackSrc: record.gpsTrack,
                popupContent: '<b>' + record.type + ': ' + record.name + '</b>',
                type: record.type
            };
            mapElements.push(mapElement,)
        }
        if (showGeoPos) {
            const mapElement: MapElement = {
                id: record.id,
                name: record.type + ': ' + record.name,
                point: new LatLng(+record.geoLat, +record.geoLon),
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
}
