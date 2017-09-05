import LatLng = L.LatLng;
import {GeoParser, GeoElement, GeoElementType} from './geo.parser';

export class GeoJsonParser extends GeoParser {
    parse(json: string, options): GeoElement[] {
        const obj = JSON.parse(json);

        const elements = this._parseJsonObj(obj, options);
        if (!elements) {
            return;
        }

        return elements;
    }

    _parseJsonObj(obj, options): GeoElement[] {
        let j;
        const coords = [];

        for (j = 0; j < obj['track']['records'].length; j++) {
            const record = obj['track']['records'][j];
            const ll = new L.LatLng(record[0], record[1], record[2]);
            coords.push(ll);
        }

        return [new GeoElement(GeoElementType.TRACK, coords, obj['track']['tName'])];
    }

}
