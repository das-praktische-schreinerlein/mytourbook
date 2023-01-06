import {utils} from 'js-data';
import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {AbstractBackendGeoService} from './abstract-backend-geo.service';

export interface GpxSavePointsActionTagForm extends ActionTagForm {
    payload: {
    };
}

export class CommonActiontagGpxSavePointsAdapter {

    private readonly backendGeoService: AbstractBackendGeoService;

    constructor(backendGeoService: AbstractBackendGeoService) {
        this.backendGeoService = backendGeoService;
    }

    public executeActionTagGpxPointToDatabase(table: string, id: number, actionTagForm: GpxSavePointsActionTagForm): Promise<any> {
        if (!utils.isInteger(id)) {
            return Promise.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }

        return this.backendGeoService.readGeoEntityForId(table, id).then(entity => {
            if (entity === undefined) {
                return Promise.reject('no valid entity for id:' + id);
            }

            return this.backendGeoService.saveGpxPointsToDatabase(entity, true);
        }).then(() => {
            return Promise.resolve(true);
        }).catch(function errorPlaylist(reason) {
            console.error('_doActionTag GpxPointToDatabase ' + table + ' failed:', reason);
            return Promise.reject(reason);
        });
    }
}
