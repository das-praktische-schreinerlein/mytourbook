import * as L from 'leaflet';
import LatLng = L.LatLng;

export enum GeoElementType {
    TRACK,
    ROUTE,
    WAYPOINT
}

export class LatLngTime extends LatLng {
    time: Date;
    constructor(latitude: number, longitude: number, altitude: number, time: Date) {
        super(latitude, longitude, altitude);
        this.time = time;
    }
}

export class GeoElement {
    type: GeoElementType;
    points: LatLng[] = [];
    name: string;

    constructor(type: GeoElementType, points: L.LatLng[], name: string) {
        this.type = type;
        this.points = points;
        this.name = name;
    }
}

export abstract class GeoParser  {
    abstract parse(src: string, options): GeoElement[];

    _humanLen(l) {
        if (l < 2000) {
            return l.toFixed(0) + ' m';
        } else {
            return (l / 1000).toFixed(1) + ' km';
        }
    }

    _polylineLen(ll: LatLng[]) {
        let d = 0, p = null;
        for (let i = 0; i < ll.length; i++) {
            if (i && p) {
                d += p.distanceTo(ll[i]);
            }
            p = ll[i];
        }
        return d;
    }
}
