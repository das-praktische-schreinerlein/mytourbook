import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {
    CommonQueuedObjectDetectionProcessingService,
    ObjectDetectionManagerBackendConfig,
    RedisQueueConfig
} from '../shared/tdoc-commons/services/common-queued-object-detection-processing.service';
import {CommonObjectDetectionProcessingDatastore} from '@dps/mycms-commons/dist/commons/model/common-object-detection-processing-datastore';

export class TourDocObjectDetectionManagerModule extends CommonQueuedObjectDetectionProcessingService {
    private backendConfig: ObjectDetectionManagerBackendConfig;

    constructor(backendConfig: ObjectDetectionManagerBackendConfig, dataStore: CommonObjectDetectionProcessingDatastore) {
        super(dataStore);
        this.backendConfig = backendConfig;
    }

    public configureModule(flgRequest: boolean, flgResponse: boolean, flgError: boolean) {
        super.configureModule(flgRequest, flgResponse, flgError);
    }

    protected getRedisQueueConfiguration(): RedisQueueConfig {
        return BeanUtils.getValue(this.backendConfig, 'objectDetectionConfig.redisQueue');
    }

    protected getBasePathForImages(): string {
        return this.backendConfig['apiRoutePicturesStaticDir'] + '/pics_full';
    }

    protected getConfiguredAvailableDetectors(): string[] {
        return BeanUtils.getValue(this.backendConfig, 'objectDetectionConfig.availableDetectors');
    }

    protected getConfiguredDefaultDetectors(): string[] {
        return BeanUtils.getValue(this.backendConfig, 'objectDetectionConfig.defaultDetectors');
    }

}
