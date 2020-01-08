import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {
    CommonQueuedObjectDetectionService,
    ObjectDetectionManagerBackendConfig,
    RedisQueueConfig
} from '../shared/tdoc-commons/services/common-queued-object-detection.service';
import {ObjectDetectionDataStore} from '../shared/tdoc-commons/services/common-object-detection-datastore';

export class TourDocObjectDetectionManagerModule extends CommonQueuedObjectDetectionService {
    private backendConfig: ObjectDetectionManagerBackendConfig;

    constructor(backendConfig: ObjectDetectionManagerBackendConfig, dataStore: ObjectDetectionDataStore) {
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
