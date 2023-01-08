import {TourDocRecord} from '../model/records/tdoc-record';
import {Circular, HierarchyConfig, HierarchyUtils} from '@dps/mycms-commons/dist/commons/utils/hierarchy.utils';

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
