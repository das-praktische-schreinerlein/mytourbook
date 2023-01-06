import {BackendGeoService} from './backend-geo.service';
import * as Promise_serial from 'promise-serial';

export class TourGeoManagerModule  {
    constructor(protected backendGeoService: BackendGeoService) {
    }

    public processConvertTxtLogsToGpx(entityType: string, parallel: number, force: boolean): Promise<any> {
        const me = this;

        return this.backendGeoService.readGeoEntitiesWithTxtButNoGpx(entityType, force).then(entities => {
            const promises = [];
            for (const entity of entities) {
                promises.push(function () {
                    return me.backendGeoService.convertTxtLogToGpx(entity, force);
                });
            }

            return Promise_serial(promises, {parallelize: parallel}).then(() => {
                return Promise.resolve('DONE - converted txt-log to gpx');
            }).catch(reason => {
                return Promise.reject(reason);
            });
        });
    }

    public processSaveGpxPointsToDatabase(entityType: string, parallel: number, force: boolean): Promise<any> {
        const me = this;

        return this.backendGeoService.readGeoEntitiesWithGpxButNoPoints(entityType, force).then(entities => {
            const promises = [];
            for (const entity of entities) {
                promises.push(function () {
                    return me.backendGeoService.saveGpxPointsToDatabase(entity, force);
                });
            }

            return Promise_serial(promises, {parallelize: parallel}).then(() => {
                return Promise.resolve('DONE - saved gpx-points to database');
            }).catch(reason => {
                return Promise.reject(reason);
            });
        })
    }

    public processExportGpxToFile(entityType: string, parallel: number, force: boolean): Promise<any> {
        const me = this;

        return this.backendGeoService.readGeoEntitiesWithGpx(entityType).then(entities => {
            const promises = [];
            for (const entity of entities) {
                promises.push(function () {
                    return me.backendGeoService.exportGpxToFile(entity, force);
                });
            }

            return Promise_serial(promises, {parallelize: parallel}).then(() => {
                return Promise.resolve('DONE - exported gpx-files');
            }).catch(reason => {
                return Promise.reject(reason);
            });
        })
    }

}
