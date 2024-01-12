import {GeoEntityTableDbMapping} from '@dps/mycms-commons/dist/geo-commons/backend/backend-geo.types';
import {
    BackendGeoGpxParser,
    BackendGeoJsonParser,
    BackendGeoTxtParser
} from '@dps/mycms-commons/dist/geo-commons/backend/backend-geo.parser';
import {GeoGpxUtils} from '@dps/mycms-commons/dist/geo-commons/services/geogpx.utils';
import {HierarchyConfig} from '@dps/mycms-commons/dist/commons/utils/hierarchy.utils';
import {BackendGeoService} from '@dps/mycms-commons/dist/geo-commons/backend/backend-geo.service';
import {BackendConfigType} from './backend.commons';

export class TourDocBackendGeoService extends BackendGeoService {
    public static readonly hierarchyConfig: HierarchyConfig = {
        typeField: 'type',
        removeRootElementNames: ['OFFEN', 'offen', 'OPEN', 'open'],
        removeOwnElementOfType: 'LOCATION',
        hierarchyIdsPrefix: 'LOCATION_',
        hierarchyField: 'locHirarchie'
    }

    constructor(backendConfig: BackendConfigType,
                knex,
                gpxParser: BackendGeoGpxParser,
                txtParser: BackendGeoTxtParser,
                jsonParser: BackendGeoJsonParser,
                gpxUtils: GeoGpxUtils,
                geoEntityDbMapping: GeoEntityTableDbMapping) {
        super({
            hierarchyConfig: TourDocBackendGeoService.hierarchyConfig,
            apiRouteTracksStaticDir: backendConfig.apiRouteTracksStaticDir
        }, knex,  gpxParser, txtParser, jsonParser, gpxUtils, geoEntityDbMapping);
    }

}
