import {TourDocRecord} from '../model/records/tdoc-record';
import {HierarchyConfig, HierarchyUtils} from '@dps/mycms-commons/dist/commons/utils/hierarchy.utils';

export interface MapDocRecord {
    gpsTrackBasefile: string;
    gpsTrackSrc: string;
    type: string;
    geoLat: string;
    geoLon: string;
    name: string,
    id: string;
}

export class TourDocDataUtils {
    private static CONST_HIERARCHYCONFIG: HierarchyConfig = {
        typeField: 'type',
        removeRootElementNames: ['OFFEN', 'offen', 'OPEN', 'open'],
        removeOwnElementOfType: 'LOCATION',
        hierarchyIdsPrefix: 'LOCATION_',
        hierarchyField: 'locHirarchie',
        hierarchyIdsField: 'locHirarchieIds'
    }

    public static getLocationHierarchy(record: TourDocRecord, lastOnly: boolean, truncate: boolean, maxWordLength: number): any[] {
        return HierarchyUtils.getHierarchy(TourDocDataUtils.CONST_HIERARCHYCONFIG, record, lastOnly, truncate, maxWordLength);
    }

    public static getLocationName(name: string, truncate: boolean, maxWordLength: number): string {
        return HierarchyUtils.getHierarchyElementName(name, truncate, maxWordLength);
    }
}
