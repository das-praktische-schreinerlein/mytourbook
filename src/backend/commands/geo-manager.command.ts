import * as fs from 'fs';
import {
    CommonAdminCommand,
    SimpleConfigFilePathValidationRule
} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {
    KeywordValidationRule,
    NumberValidationRule,
    ValidationRule,
    WhiteListValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {BackendGeoService} from '@dps/mycms-commons/dist/geo-commons/backend/backend-geo.service';
import {TourGeoManagerModule} from '../modules/tdoc-geo-manager-module';

export class GeoManagerCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            action: new KeywordValidationRule(true),
            force: new KeywordValidationRule(false),
            backend: new SimpleConfigFilePathValidationRule(true),
            profile: new WhiteListValidationRule(true, ['track', 'route'], undefined),
            parallel: new NumberValidationRule(false, 1, 99, 10)
        };
    }

    protected definePossibleActions(): string[] {
        return ['convertGarminTxtToGpx', 'saveGpxPointsToDatabase', 'exportGpxToFile', 'exportJsonToFile'];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const backendConfig = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));
        const geoService: BackendGeoService =
            TourDocDataServiceModule.getGeoService('tdocSolr', backendConfig);
        const tdocGeoManagerModule = new TourGeoManagerModule(geoService);

        const action = argv['action'];
        const defaultPerPage = 50;
        const perPage = argv['perPage']
            ? parseInt(argv['perPage'], 10)
            : defaultPerPage;
        const profile = argv['profile'];
        const force = argv['force'] !== undefined;

        let promise: Promise<any>;
        switch (action) {
            case 'convertTxtLogsToGpx':
                promise = tdocGeoManagerModule.processConvertTxtLogsToGpx(profile, perPage, force);

                break;
            case 'saveGpxPointsToDatabase':
                promise = tdocGeoManagerModule.processSaveGpxPointsToDatabase(profile, perPage, force);

                break;
            case 'exportGpxToFile':
                promise = tdocGeoManagerModule.processExportGpxToFile(profile, perPage, force);

                break;
            case 'exportJsonToFile':
                promise = tdocGeoManagerModule.processExportJsonToFile(profile, perPage, force);

                break;
            default:
                console.error('unknown action:', argv);
                promise = Promise.reject('unknown action');
        }

        return promise;
    }


}
