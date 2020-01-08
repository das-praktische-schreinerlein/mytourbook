import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {CommonSqlObjectDetectionAdapter} from './common-sql-object-detection.adapter';
import {TourDocSqlMytbDbConfig} from './tdoc-sql-mytbdb.config';

export class TourDocSqlMytbDbObjectDetectionAdapter extends CommonSqlObjectDetectionAdapter {

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder) {
        super(config, knex, sqlQueryBuilder, TourDocSqlMytbDbConfig.objectDetectionModelConfigType);
    }
}
