import {LatLng, latLngBounds} from 'leaflet';
import {MathUtils} from '../../commons/utils/math.utils';
import {GeoElement} from './geo.parser';

export interface TrackStatistic {
    altAsc?: number;
    altDesc?: number;
    dist: number;
    altMin?: number;
    altMax?: number;
    altAvg?: number;
    altStart?: number;
    altEnd?: number;
    bounds: L.LatLngBounds;
    posStart: L.LatLng;
    posEnd: L.LatLng;
    dateStart: Date;
    dateEnd: Date;
    duration: number;
}

export class TrackStatisticService  {
    public emptyStatistic(): TrackStatistic {
        return {
            altAsc: undefined,
            altDesc: undefined,
            dist: undefined,
            altMin: undefined,
            altMax: undefined,
            altAvg: undefined,
            altStart: undefined,
            altEnd: undefined,
            bounds: undefined,
            posStart: undefined,
            posEnd: undefined,
            dateStart: undefined,
            dateEnd: undefined,
            duration: undefined
        };
    }

    public trackStatisticsForGeoElement(geoElement: GeoElement): TrackStatistic {
        if (geoElement === undefined || geoElement.points === undefined) {
            return this.emptyStatistic();
        }

        return this.trackStatistics(geoElement.points);
    }

    public trackStatistics(ll: LatLng[]): TrackStatistic {
        const t: TrackStatistic = {
            altAsc: undefined,
            altDesc: undefined,
            dist: (ll.length > 0 ? 0 : undefined),
            altMin: undefined,
            altMax: undefined,
            altAvg: undefined,
            altStart: undefined,
            altEnd: undefined,
            bounds: latLngBounds(ll),
            posStart: (ll.length > 0 ? ll[0] : undefined),
            posEnd: (ll.length > 0 ? ll[ll.length - 1] : undefined),
            dateStart: (ll.length > 0 ? ll[0]['time'] : undefined),
            dateEnd: (ll.length > 0 ? ll[ll.length - 1]['time'] : undefined),
            duration: undefined
        };

        let l = null, altSum, altCount = 0;
        for (let i = 0; i < ll.length; i++) {
            const p = ll[i];
            if (p && l) {
                t.dist += l.distanceTo(p);
            }
            if (p.alt !== undefined) {
                if (t.altEnd !== undefined) {
                    const diff = MathUtils.sub(p.alt, t.altEnd);
                    if (diff > 0) {
                        t.altAsc = (t.altAsc !== undefined ? t.altAsc + diff : diff);
                    } else {
                        t.altDesc = (t.altDesc !== undefined ? t.altDesc - diff : -diff);
                    }
                }

                t.altMin = MathUtils.min(t.altMin, p.alt);
                t.altMax = MathUtils.max(t.altMax, p.alt);

                if (t.altStart === undefined) {
                    t.altStart = p.alt;
                }
                t.altEnd = p.alt;

                altSum = MathUtils.sum(altSum, p.alt);
                altCount++;
            }
            l = p;
        }
        if (altSum > 0) {
            t.altAvg = altSum / altCount;
        }
        if (t.dateEnd !== undefined && t.dateStart !== undefined) {
            t.duration = this.formatMillisToHH24(t.dateEnd.getTime() - t.dateStart.getTime());
        }

        t.altAsc = this.formatM(t.altAsc);
        t.altDesc = this.formatM(t.altDesc);
        t.altAvg = this.formatM(t.altAvg);
        t.altMax = this.formatM(t.altMax);
        t.altMin = this.formatM(t.altMin);
        t.altStart = this.formatM(t.altStart);
        t.altEnd = this.formatM(t.altEnd);
        t.dist = this.formatMToKm(t.dist);

        return t;
    }

    public formatMToKm(l: number): number {
        if (l !== undefined) {
            return parseFloat((l / 1000).toFixed(1));
        }

        return undefined;
    }

    public formatM(l: number): number {
        if (l !== undefined) {
            return parseInt(l.toFixed(0), 10);
        }

        return undefined;
    }

    public formatMillisToHH24(l: number): number {
        if (l !== undefined) {
            return parseInt((l / 1000 / 60 / 60).toFixed(1), 10);
        }

        return undefined;
    }
}
