import * as fs from 'fs';
import {AbstractCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract.command';
import {ObjectDetectionManagerModule} from '../modules/objectdetection-manager.module';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {utils} from 'js-data';

export class ObjectDetectionManagerCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const backendConfig = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));

        const tdocDataService: TourDocDataService =
            TourDocDataServiceModule.getDataService('tdocSolr', backendConfig);
        const objectDetectionManager = new ObjectDetectionManagerModule(backendConfig, tdocDataService);
        const action = argv['action'];
        const defaultMaxPerRun = 50;

        let promise: Promise<any>;
        switch (action) {
            case 'sendQueueRequests':
                const detector = argv['detector'];
                const maxPerRun = argv['maxPerRun'] ? parseInt(argv['maxPerRun'], 10) : defaultMaxPerRun;

                try {
                    objectDetectionManager.configureModule(true, false, false);
                } catch (err) {
                    return utils.reject(err);
                }
                promise = objectDetectionManager.sendObjectDetectionRequestsToQueue(detector, maxPerRun || defaultMaxPerRun);

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
