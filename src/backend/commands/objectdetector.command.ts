import * as fs from 'fs';
import {TourDocObjectDetectionManagerModule} from '../modules/tdoc-objectdetection-manager.module';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {utils} from 'js-data';
import {CommonObjectDetectionProcessingDatastore} from '@dps/mycms-commons/dist/commons/model/common-object-detection-processing-datastore';
import {CommonAdminCommand, SimpleConfigFilePathValidationRule} from './common-admin.command';
import {
    KeywordValidationRule,
    NumberValidationRule,
    ValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export class ObjectDetectionManagerCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            action: new KeywordValidationRule(true),
            backend: new SimpleConfigFilePathValidationRule(true),
            maxPerRun: new NumberValidationRule(false, 1, 999999999, 1),
            detector: new KeywordValidationRule(false)
        };
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const backendConfig = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));

        const detectionDataStore: CommonObjectDetectionProcessingDatastore =
            TourDocDataServiceModule.getObjectDetectionDataStore('tdocSolr', backendConfig);
        const objectDetectionManager = new TourDocObjectDetectionManagerModule(backendConfig, detectionDataStore);
        const action = argv['action'];
        const defaultMaxPerRun = 50;
        const detector = argv['detector'];
        const maxPerRun = argv['maxPerRun'] ? parseInt(argv['maxPerRun'], 10) : defaultMaxPerRun;

        let promise: Promise<any>;
        switch (action) {
            case 'sendQueueRequests':
            case 'sendImageQueueRequests':
                try {
                    objectDetectionManager.configureModule(true, false, false);
                } catch (err) {
                    return utils.reject(err);
                }
                promise = objectDetectionManager.sendObjectDetectionRequestsToQueue('IMAGE', detector, maxPerRun || defaultMaxPerRun);

                break;
            case 'sendVideoQueueRequests':
                try {
                    objectDetectionManager.configureModule(true, false, false);
                } catch (err) {
                    return utils.reject(err);
                }
                promise = objectDetectionManager.sendObjectDetectionRequestsToQueue('VIDEO', detector, maxPerRun || defaultMaxPerRun);

                break;
            case 'receiveQueueResponses':
                try {
                    objectDetectionManager.configureModule(false, true, true);
                } catch (err) {
                    return utils.reject(err);
                }
                promise = objectDetectionManager.receiveObjectDetectionsFromQueue();

                break;
            default:
                console.error('unknown action:', argv);
                promise = utils.reject('unknown action');
        }

        return promise;
    }
}
