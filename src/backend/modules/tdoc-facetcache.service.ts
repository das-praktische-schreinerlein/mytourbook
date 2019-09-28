import {TourDocSqlUtils} from '../shared/tdoc-commons/services/tdoc-sql.utils';
import {FacetCacheService} from '@dps/mycms-commons/dist/facetcache-commons/service/facetcache.service';

export class TourDocFacetCacheService extends FacetCacheService {
    protected transformToSqlDialect(sql: string): string {
        const client = this.knex.client['config']['client'];
        if (client === 'sqlite3') {
            sql = TourDocSqlUtils.transformToSqliteDialect(sql);
        }

        return this.sqlQueryBuilder.transformToSqlDialect(sql, client);
    }
}
