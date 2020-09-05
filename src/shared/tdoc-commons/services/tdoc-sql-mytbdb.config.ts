import {TableConfig, TableConfigs} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ActionTagReplaceConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {ActionTagBlockConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagAssignConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {KeywordModelConfigType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';
import {PlaylistModelConfigType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-playlist.adapter';
import {RateModelConfigType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-rate.adapter';
import {ObjectDetectionModelConfigType} from '@dps/mycms-commons/dist/commons/model/common-sql-object-detection.model';
import {JoinModelConfigsType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-join.adapter';
import {ActionTagAssignJoinConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assignjoin.adapter';
import {SqlMytbDbTrackConfig} from '../model/repository/sql-mytbdb-track.config';
import {SqlMytbDbImageConfig} from '../model/repository/sql-mytbdb-image.config';
import {SqlMytbDbOdImageObjectConfig} from '../model/repository/sql-mytbdb-odimageobject.config';
import {SqlMytbDbVideoConfig} from '../model/repository/sql-mytbdb-video.config';
import {SqlMytbDbRouteConfig} from '../model/repository/sql-mytbdb-route.config';
import {SqlMytbDbLocationConfig} from '../model/repository/sql-mytbdb-location.config';
import {SqlMytbDbDestinationConfig} from '../model/repository/sql-mytbdb-destination.config';
import {SqlMytbDbTripConfig} from '../model/repository/sql-mytbdb-trip.config';
import {SqlMytbDbNewsConfig} from '../model/repository/sql-mytbdb-news.config';
import {SqlMytbDbInfoConfig} from '../model/repository/sql-mytbdb-info.config';

export class TourDocSqlMytbDbConfig {
    public static readonly tableConfigs: TableConfigs = {
        'track': SqlMytbDbTrackConfig.tableConfig,
        'image': SqlMytbDbImageConfig.tableConfig,
        'odimgobject': SqlMytbDbOdImageObjectConfig.tableConfig,
        'video': SqlMytbDbVideoConfig.tableConfig,
        'route': SqlMytbDbRouteConfig.tableConfig,
        'destination': SqlMytbDbDestinationConfig.tableConfig,
        'location': SqlMytbDbLocationConfig.tableConfig,
        'trip': SqlMytbDbTripConfig.tableConfig,
        'info': SqlMytbDbInfoConfig.tableConfig,
        'news': SqlMytbDbNewsConfig.tableConfig
    };

    public static readonly keywordModelConfigType: KeywordModelConfigType = {
        table: 'keyword',
        fieldId: 'kw_id',
        fieldName: 'kw_name',
        joins: {
            'image': SqlMytbDbImageConfig.keywordModelConfigType,
            'video': SqlMytbDbVideoConfig.keywordModelConfigType,
            'track': SqlMytbDbTrackConfig.keywordModelConfigType,
            'route': SqlMytbDbRouteConfig.keywordModelConfigType,
            'info': SqlMytbDbInfoConfig.keywordModelConfigType,
            'location': SqlMytbDbLocationConfig.keywordModelConfigType
        }
    };

    public static readonly playlistModelConfigType: PlaylistModelConfigType = {
        table: 'playlist',
        fieldId: 'p_id',
        fieldName: 'p_name',
        joins: {
            'image': SqlMytbDbImageConfig.playlistModelConfigType,
            'video': SqlMytbDbVideoConfig.playlistModelConfigType
        }
    };

    public static readonly rateModelConfigType: RateModelConfigType = {
        tables: {
            'image': SqlMytbDbImageConfig.rateModelConfigTypeImage,
            'trackimages': SqlMytbDbImageConfig.rateModelConfigTypeTrackImage,
            'video': SqlMytbDbVideoConfig.rateModelConfigTypeVideo,
            'trackvideos': SqlMytbDbVideoConfig.rateModelConfigTypeTrackVideo
        }
    };

    public static readonly joinModelConfigType: JoinModelConfigsType = {
        'linkedroutes': {
            name: 'linkedroutes',
            tables: {
                'track': SqlMytbDbTrackConfig.joinModelConfigTypeLinkedRoutes
            }
        },
        'linkedinfos': {
            name: 'linkedinfos',
            tables: {
                'location': SqlMytbDbLocationConfig.joinModelConfigTypeLinkedInfos,
                'route': SqlMytbDbRouteConfig.joinModelConfigTypeLinkedInfos
            }
        }
    };

    public static readonly objectDetectionModelConfigType: ObjectDetectionModelConfigType = {
        objectTable: {
            fieldCategory: 'o_category',
            fieldId: 'o_id',
            fieldKey: 'o_key',
            fieldName: 'o_name',
            fieldPicasaKey: 'o_picasa_key',
            table: 'objects'
        },
        objectKeyTable: {
            fieldDetector: 'ok_detector',
            fieldId: 'o_id',
            fieldKey: 'ok_key',
            table: 'objects_key'
        },
        detectionTables: {
            'image': {
                entityType: 'image',
                table: 'image',
                id: undefined,
                baseTable: 'image',
                baseFieldId: 'i_id',
                baseFieldFileDir: 'i_dir',
                baseFieldFileName: 'i_file',
                baseFieldFilePath: 'CONCAT(i_dir, "/", i_file)',
                detectedTable: 'image_object',
                detectedFieldDetector: 'io_detector',
                detectedFieldPrecision: 'io_precision',
                detectedFieldState: 'io_state',
                detectedFieldKey: 'io_obj_type',
                detailFieldNames: ['io_obj_type', 'io_img_width', 'io_img_height',
                    'io_obj_x1', 'io_obj_y1', 'io_obj_width', 'io_obj_height',
                    'io_precision']
            },
            'video': {
                entityType: 'video',
                table: 'video',
                id: undefined,
                baseTable: 'video',
                baseFieldId: 'v_id',
                baseFieldFileDir: 'v_dir',
                baseFieldFileName: 'v_file',
                baseFieldFilePath: 'CONCAT(v_dir, "/", v_file)',
                detectedTable: 'video_object',
                detectedFieldDetector: 'vo_detector',
                detectedFieldPrecision: 'vo_precision',
                detectedFieldState: 'vo_state',
                detectedFieldKey: 'vo_obj_type',
                detailFieldNames: ['vo_obj_type', 'vo_img_width', 'vo_img_height',
                    'vo_obj_x1', 'vo_obj_y1', 'vo_obj_width', 'vo_obj_height',
                    'vo_precision']
            }
        },
        detectedObjectsTables: {
            'odimgobject': {
                fieldDetector: 'io_detector',
                fieldId: 'io_id',
                fieldPrecision: 'io_precision',
                fieldState: 'io_state',
                table: 'image_object',
                fieldKey: 'io_obj_type'
            }
        }
    };

    public static readonly actionTagAssignConfig: ActionTagAssignConfigType = {
        tables: {
            'location': SqlMytbDbLocationConfig.actionTagAssignConfig,
            'image': SqlMytbDbImageConfig.actionTagAssignConfig,
            'video': SqlMytbDbVideoConfig.actionTagAssignConfig,
            'track': SqlMytbDbTrackConfig.actionTagAssignConfig,
            'route': SqlMytbDbRouteConfig.actionTagAssignConfig,
            'news': SqlMytbDbNewsConfig.actionTagAssignConfig,
            'trip': SqlMytbDbTripConfig.actionTagAssignConfig,
            'info': SqlMytbDbInfoConfig.actionTagAssignConfig
        }
    };

    public static readonly actionTagAssignJoinConfig: ActionTagAssignJoinConfigType = {
        tables: {
            'location': SqlMytbDbLocationConfig.actionTagAssignJoinConfig,
            'route': SqlMytbDbRouteConfig.actionTagAssignJoinConfig
        }
    };

    public static readonly actionTagBlockConfig: ActionTagBlockConfigType = {
        tables: {
            'image': SqlMytbDbImageConfig.actionTagBlockConfig,
            'video': SqlMytbDbVideoConfig.actionTagBlockConfig,
            'track': SqlMytbDbTrackConfig.actionTagBlockConfig,
            'route': SqlMytbDbRouteConfig.actionTagBlockConfig,
            'location': SqlMytbDbLocationConfig.actionTagBlockConfig,
            'trip': SqlMytbDbTripConfig.actionTagBlockConfig,
            'info': SqlMytbDbInfoConfig.actionTagBlockConfig,
            'news': SqlMytbDbNewsConfig.actionTagBlockConfig
        }
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceConfigType = {
        tables: {
            'image': SqlMytbDbImageConfig.actionTagReplaceConfig,
            'video': SqlMytbDbVideoConfig.actionTagReplaceConfig,
            'track': SqlMytbDbTrackConfig.actionTagReplaceConfig,
            'route': SqlMytbDbRouteConfig.actionTagReplaceConfig,
            'location': SqlMytbDbLocationConfig.actionTagReplaceConfig,
            'news': SqlMytbDbNewsConfig.actionTagReplaceConfig,
            'info': SqlMytbDbInfoConfig.actionTagReplaceConfig,
            'trip': SqlMytbDbTripConfig.actionTagReplaceConfig
        }
    };

    public getTableConfigForTableKey(table: string): TableConfig {
        return TourDocSqlMytbDbConfig.tableConfigs[table];
    }

    public getKeywordModelConfigFor(): KeywordModelConfigType {
        return TourDocSqlMytbDbConfig.keywordModelConfigType;
    }

    public getObjectDetectionModelConfigFor(): ObjectDetectionModelConfigType {
        return TourDocSqlMytbDbConfig.objectDetectionModelConfigType;
    }

    public getPlaylistModelConfigFor(): PlaylistModelConfigType {
        return TourDocSqlMytbDbConfig.playlistModelConfigType;
    }

    public getRateModelConfigFor(): RateModelConfigType {
        return TourDocSqlMytbDbConfig.rateModelConfigType;
    }

    public getJoinModelConfigFor(): JoinModelConfigsType {
        return TourDocSqlMytbDbConfig.joinModelConfigType;
    }

    public getActionTagAssignConfig(): ActionTagAssignConfigType {
        return TourDocSqlMytbDbConfig.actionTagAssignConfig;
    }

    public getActionTagAssignJoinConfig(): ActionTagAssignJoinConfigType {
        return TourDocSqlMytbDbConfig.actionTagAssignJoinConfig;
    }

    public getActionTagBlockConfig(): ActionTagBlockConfigType {
        return TourDocSqlMytbDbConfig.actionTagBlockConfig;
    }

    public getActionTagReplaceConfig(): ActionTagReplaceConfigType {
        return TourDocSqlMytbDbConfig.actionTagReplaceConfig;
    }
}

