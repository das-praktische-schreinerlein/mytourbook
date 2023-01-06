import {GeoElementBase, GeoElementType, LatLngBase, LatLngTimeBase} from '@dps/mycms-commons/dist/geo-commons/model/geoElementTypes';

export class BackendLatLng implements LatLngBase {
    alt: number;
    lat: number;
    lng: number;
}

export class BackendLatLngTime extends BackendLatLng implements LatLngTimeBase {
    time: Date;
}

export class BackendGeoElement implements GeoElementBase<BackendLatLng> {
    type: GeoElementType;
    points: BackendLatLng[] = [];
    name: string;

    constructor(type: GeoElementType, points: BackendLatLng[], name: string) {
        this.type = type;
        this.points = points;
        this.name = name;
    }
}

export interface GeoEntity {
    type: string,
    id: any,
    name: string
    locHirarchie?: string;
    gpsTrackTxt?: string,
    gpsTrackSrc: string,
    gpsTrackBasefile: string
}

export interface GeoEntityDbMapping {
    table: string,
    selectFrom: string,
    fields: GeoEntity
}

export interface GeoEntityTablesDbMapping {
    [key: string]: GeoEntityDbMapping;
}


export interface GeoEntityTableDbMapping {
    tables: GeoEntityTablesDbMapping
}

