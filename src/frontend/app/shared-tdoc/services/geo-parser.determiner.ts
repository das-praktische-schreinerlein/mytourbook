import {LatLng} from 'leaflet';
import {GeoGpxParser} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geogpx.parser';
import {GeoJsonParser} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geojson.parser';
import {GeoTxtParser} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geotxt.parser';
import {Injectable} from '@angular/core';
import {AbstractGeoParserDeterminer} from '@dps/mycms-commons/dist/geo-commons/services/geo-parser.determiner';

@Injectable()
export class GeoParserDeterminer extends AbstractGeoParserDeterminer<LatLng> {

    constructor(protected gpxParser: GeoGpxParser,
                protected jsonParser: GeoJsonParser,
                protected txtParser: GeoTxtParser) {
        super(gpxParser, jsonParser, txtParser);
    }
}
