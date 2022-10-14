import {Injectable} from '@angular/core';
import * as L from 'leaflet';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';

export interface MapState {
    mapCenterPos: L.LatLng;
    mapZoom: number;
    mapElements: MapElement[];
    currentMapTDocId: string;
    profileMapElements: MapElement[];
    flgMapEnabled: boolean;
    flgShowMap: boolean;
    flgShowProfileMap: boolean;
    flgMapAvailable: boolean;
    flgProfileMapAvailable: boolean;
}

@Injectable()
export class TourDocMapStateService {
    onMapElementsFound(mapState: MapState, mapElements: MapElement[]) {
        mapState.mapElements = mapElements;
        mapState.flgMapAvailable = mapState.flgMapEnabled && mapState.mapElements.length > 0;
        mapState.flgProfileMapAvailable = mapState.flgMapEnabled && mapState.flgProfileMapAvailable && mapState.flgMapAvailable;
        mapState.flgShowMap = mapState.flgMapEnabled && mapState.flgMapAvailable && mapState.flgShowMap;
        this.calcShowMaps(mapState);
    }

    onProfileMapElementsFound(mapState: MapState, mapElements: MapElement[]) {
        mapState.profileMapElements = mapElements;
        mapState.flgProfileMapAvailable = mapState.profileMapElements.length > 0;
        mapState.flgShowProfileMap = mapState.flgMapEnabled && mapState.flgProfileMapAvailable && mapState.flgShowProfileMap;
        this.calcShowMaps(mapState);

        return false;
    }

    public doCheckSearchResultAfterSearch(mapState: MapState, searchResult: TourDocSearchResult): void {
        if (searchResult === undefined) {
            // console.log('empty searchResult', tdocSearchResult);
            mapState.flgMapAvailable = false;
            mapState.flgProfileMapAvailable = false;
            mapState.flgShowProfileMap = mapState.flgProfileMapAvailable;
        } else {
            // console.log('update searchResult', tdocSearchResult);
            mapState.flgMapAvailable = mapState.flgMapEnabled && mapState.mapCenterPos !== undefined || searchResult.recordCount > 0;
            mapState.flgProfileMapAvailable = mapState.flgMapAvailable;
        }

        mapState.flgShowMap = mapState.flgMapAvailable;
        mapState.flgShowProfileMap = mapState.flgShowProfileMap && mapState.flgProfileMapAvailable;

        this.calcShowMaps(mapState);
    }

    public calcShowMaps(mapState: MapState, ) {
       if (!mapState.flgProfileMapAvailable) {
            mapState.flgShowProfileMap = false;
            return;
        }
        if (mapState.profileMapElements && mapState.profileMapElements.length > 10) {
            mapState.flgShowProfileMap = false;
            return;
        }
    }

}
