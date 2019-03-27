import * as fs from 'fs';
import {AbstractCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract.command';
import {TourDocObjectDetectionManagerModule} from '../modules/tdoc-objectdetection-manager.module';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {utils} from 'js-data';
import {ObjectDetectionDataStore} from '../shared/tdoc-commons/services/common-queued-object-detection.service';

export class ObjectDetectionManagerCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const backendConfig = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));

        const detectionDataStore: ObjectDetectionDataStore =
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
                    objectDetectionManager.configureModule(false, true, false);
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
