import * as L from 'leaflet';
import {GeoElement, GeoElementType, GeoParser, LatLngTime} from './geo.parser';
import {DateUtils} from '../../commons/utils/date.utils';

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
            if (record.length > 2) {
                coords.push(new LatLngTime(record[0], record[1], record[2], DateUtils.parseDate(record[3])));
            } else {
                coords.push(new L.LatLng(record[0], record[1], record[2]));
            }
        }

        return [new GeoElement(GeoElementType.TRACK, coords, obj['track']['tName'])];
    }

}
