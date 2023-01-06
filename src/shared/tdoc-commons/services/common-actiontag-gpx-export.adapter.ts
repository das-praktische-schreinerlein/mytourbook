import {utils} from 'js-data';
import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {AbstractBackendGeoService} from './abstract-backend-geo.service';

export interface GpxExportActionTagForm extends ActionTagForm {
    payload: {
    };
}

export class CommonActiontagGpxExportAdapter {

    private readonly backendGeoService: AbstractBackendGeoService;

    constructor(backendGeoService: AbstractBackendGeoService) {
        this.backendGeoService = backendGeoService;
    }

    public executeActionTagExportGpx(table: string, id: number, actionTagForm: GpxExportActionTagForm): Promise<any> {
        if (!utils.isInteger(id)) {
            return Promise.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }

        return this.backendGeoService.readGeoEntityForId(table, id).then(entity => {
            if (entity === undefined) {
                return Promise.reject('no valid entity for id:' + id);
            }

            return this.backendGeoService.exportGpxToFile(entity, true);
        }).then(() => {
            return Promise.resolve(true);
        }).catch(function errorPlaylist(reason) {
            console.error('_doActionTag ExportGpx ' + table + ' failed:', reason);
            return Promise.reject(reason);
        });
    }
}
