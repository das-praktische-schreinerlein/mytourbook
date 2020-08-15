import {TableConfig, TableConfigs} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {SqlMytbExportDbTrackConfig} from '../model/repository/sql-mytbexportdb-track.config';
import {SqlMytbExportDbImageConfig} from '../model/repository/sql-mytbexportdb-image.config';
import {SqlMytbExportDbVideoConfig} from '../model/repository/sql-mytbexportdb-video.config';
import {SqlMytbExportDbRouteConfig} from '../model/repository/sql-mytbexportdb-route.config';
import {SqlMytbExportDbDestinationConfig} from '../model/repository/sql-mytbexportdb-destination.config';
import {SqlMytbExportDbLocationConfig} from '../model/repository/sql-mytbexportdb-location.config';
import {SqlMytbExportDbTripConfig} from '../model/repository/sql-mytbexportdb-trip.config';
import {SqlMytbExportDbNewsConfig} from '../model/repository/sql-mytbexportdb-news.config';

export class TourDocSqlMytbExportDbConfig {
    public static readonly tableConfigs: TableConfigs = {
        'track': SqlMytbExportDbTrackConfig.tableConfig,
        'image': SqlMytbExportDbImageConfig.tableConfig,
        'video': SqlMytbExportDbVideoConfig.tableConfig,
        'route': SqlMytbExportDbRouteConfig.tableConfig,
        'destination': SqlMytbExportDbDestinationConfig.tableConfig,
        'location': SqlMytbExportDbLocationConfig.tableConfig,
        'trip': SqlMytbExportDbTripConfig.tableConfig,
        'news': SqlMytbExportDbNewsConfig.tableConfig
    };

    public getTableConfigForTableKey(table: string): TableConfig {
        return TourDocSqlMytbExportDbConfig.tableConfigs[table];
    }
}

