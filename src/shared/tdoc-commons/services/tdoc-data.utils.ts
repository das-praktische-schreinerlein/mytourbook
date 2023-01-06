import {TourDocRecord} from '../model/records/tdoc-record';
import {GeoEntity} from '../model/backend-geo.types';

export class Circular {
    protected arr: any[];
    protected currentIndex: number;

    constructor(arr: any[], startIndex?: number) {
        this.arr = arr;
        this.currentIndex = startIndex || 0;
    }

    public next(): any {
        const i = this.currentIndex, arr = this.arr;
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

export class TourDocDataUtils {
    public static getLocationHierarchy(record: TourDocRecord, lastOnly: boolean, truncate: boolean, maxWordLength: number): any[] {
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
            if (record.type !== 'LOCATION' &&
                i === 0 && hierarchyTexts.length > 1 &&
                hierarchyTexts[i] === 'OFFEN' || hierarchyTexts[i] === 'OPEN') {
                continue;
            }

            if (hierarchyIds[i] !== undefined && hierarchyTexts[i] !== undefined && hierarchyTexts[i].length > 0) {
                hierarchy.push(['LOCATION_' + hierarchyIds[i],
                    TourDocDataUtils.getLocationName(hierarchyTexts[i], truncate && (i < hierarchyTexts.length - 1), maxWordLength)]);
            }
        }

        return hierarchy;
    }

    public static generateTxtLocationHierarchy(record: GeoEntity, lastOnly: boolean, truncate: boolean, maxWordLength: number): any[] {
        if (record.locHirarchie === undefined) {
            return [];
        }

        const hierarchyTexts = record.locHirarchie.split(' -> ');
        const hierarchy = [];
        let lastIndex = hierarchyTexts.length - 1;
        if (record.type === 'LOCATION' && hierarchy.length > 1) {
            lastIndex--;
        }

        for (let i = lastOnly ? lastIndex : 0; i < hierarchyTexts.length; i++) {
            if (record.type !== 'LOCATION' &&
                i === 0 && hierarchyTexts.length > 1 &&
                hierarchyTexts[i] === 'OFFEN' || hierarchyTexts[i] === 'OPEN') {
                continue;
            }

            if (hierarchyTexts[i] !== undefined && hierarchyTexts[i].length > 0) {
                hierarchy.push(TourDocDataUtils.getLocationName(hierarchyTexts[i], truncate && (i < hierarchyTexts.length - 1), maxWordLength));
            }
        }

        return hierarchy;
    }

    public static getLocationName(name: string, truncate: boolean, maxWordLength: number): string {
        if (!truncate) {
            return name;
        }

        const names = name.split(' ');
        return names.map(value => {
            value = value.trim();
            if (maxWordLength > 0 && value.length > maxWordLength) {
                return value.slice(0, maxWordLength);
            }

            return value;
        }).join(' ');
    }
}
