import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {TourDocSqlMytbDbConfig} from './tdoc-sql-mytbdb.config';
import {CommonSqlObjectDetectionProcessingAdapter} from './common-sql-object-detection-processing.adapter';

export class TourDocSqlMytbDbObjectDetectionProcessingAdapter extends CommonSqlObjectDetectionProcessingAdapter {

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder) {
        super(config, knex, sqlQueryBuilder, TourDocSqlMytbDbConfig.objectDetectionModelConfigType);
    }
}
