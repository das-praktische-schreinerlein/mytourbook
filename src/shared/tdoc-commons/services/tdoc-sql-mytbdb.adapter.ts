import {TourDocRecord} from '../model/records/tdoc-record';
import {TourDocSearchForm} from '../model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../model/container/tdoc-searchresult';
import {GenericSqlAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-sql.adapter';
import {TourDocAdapterResponseMapper} from './tdoc-adapter-response.mapper';
import {
    FacetCacheUsageConfigurations,
    LoadDetailDataConfig,
    TableConfig,
    WriteQueryData
} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterQuery} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {Facet, Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {Mapper, utils} from 'js-data';
import {TourDocImageRecord} from '../model/records/tdocimage-record';
import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {
    CommonSqlActionTagObjectDetectionAdapter,
    ObjectsActionTagForm,
    ObjectsKeyActionTagForm,
    ObjectsStateActionTagForm
} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-object-detection.adapter';
import {TourDocSqlMytbDbKeywordAdapter} from './tdoc-sql-mytbdb-keyword.adapter';
import {TourDocSqlMytbDbConfig} from './tdoc-sql-mytbdb.config';
import {TourDocSqlUtils} from './tdoc-sql.utils';
import {
    AssignActionTagForm,
    CommonSqlActionTagAssignAdapter
} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {
    CommonSqlActionTagReplaceAdapter,
    ReplaceActionTagForm
} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {CommonSqlActionTagBlockAdapter} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {CommonSqlKeywordAdapter} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';
import {
    CommonSqlActionTagKeywordAdapter,
    KeywordActionTagForm
} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-keyword.adapter';
import {CommonSqlPlaylistAdapter} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-playlist.adapter';
import {
    CommonSqlActionTagPlaylistAdapter,
    PlaylistActionTagForm
} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-playlist.adapter';
import {
    CommonSqlActionTagRateAdapter,
    RateActionTagForm
} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-rate.adapter';
import {CommonSqlRateAdapter} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-rate.adapter';
import {CommonSqlObjectDetectionAdapter} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-object-detection.adapter';
import {TourDocSqlMytbDbObjectDetectionAdapter} from './tdoc-sql-mytbdb-objectdetection.adapter';
import {TourDocLinkedRouteRecord} from '../model/records/tdoclinkedroute-record';
import {CommonSqlJoinAdapter} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-join.adapter';
import {TourDocLinkedInfoRecord} from '../model/records/tdoclinkedinfo-record';
import {
    AssignJoinActionTagForm,
    CommonSqlActionTagAssignJoinAdapter
} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assignjoin.adapter';

export class TourDocSqlMytbDbAdapter extends GenericSqlAdapter<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {
    private readonly actionTagODAdapter: CommonSqlActionTagObjectDetectionAdapter;
    private readonly actionTagAssignAdapter: CommonSqlActionTagAssignAdapter;
    private readonly actionTagAssignJoinAdapter: CommonSqlActionTagAssignJoinAdapter;
    private readonly actionTagBlockAdapter: CommonSqlActionTagBlockAdapter;
    private readonly actionTagReplaceAdapter: CommonSqlActionTagReplaceAdapter;
    private readonly actionTagKeywordAdapter: CommonSqlActionTagKeywordAdapter;
    private readonly actionTagPlaylistAdapter: CommonSqlActionTagPlaylistAdapter;
    private readonly actionTagRateAdapter: CommonSqlActionTagRateAdapter;
    private readonly keywordsAdapter: TourDocSqlMytbDbKeywordAdapter;
    private readonly commonKeywordAdapter: CommonSqlKeywordAdapter;
    private readonly commonPlaylistAdapter: CommonSqlPlaylistAdapter;
    private readonly commonRateAdapter: CommonSqlRateAdapter;
    private readonly commonJoinAdapter: CommonSqlJoinAdapter;
    private readonly commonObjectDetectionAdapter: CommonSqlObjectDetectionAdapter;
    private readonly dbModelConfig: TourDocSqlMytbDbConfig = new TourDocSqlMytbDbConfig();

    constructor(config: any, facetCacheUsageConfigurations: FacetCacheUsageConfigurations) {
        super(config, new TourDocAdapterResponseMapper(config), facetCacheUsageConfigurations);
        this.extendTableConfigs();
        this.commonObjectDetectionAdapter = new TourDocSqlMytbDbObjectDetectionAdapter(config, this.knex, this.sqlQueryBuilder);
        this.commonKeywordAdapter = new CommonSqlKeywordAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getKeywordModelConfigFor());
        this.commonPlaylistAdapter = new CommonSqlPlaylistAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getPlaylistModelConfigFor());
        this.commonRateAdapter = new CommonSqlRateAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getRateModelConfigFor());
        this.commonJoinAdapter = new CommonSqlJoinAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getJoinModelConfigFor());
        this.keywordsAdapter = new TourDocSqlMytbDbKeywordAdapter(config, this.knex, this.commonKeywordAdapter);
        this.actionTagAssignAdapter = new CommonSqlActionTagAssignAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getActionTagAssignConfig());
        this.actionTagAssignJoinAdapter = new CommonSqlActionTagAssignJoinAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getActionTagAssignJoinConfig());
        this.actionTagBlockAdapter = new CommonSqlActionTagBlockAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getActionTagBlockConfig());
        this.actionTagReplaceAdapter = new CommonSqlActionTagReplaceAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getActionTagReplaceConfig());
        this.actionTagKeywordAdapter = new CommonSqlActionTagKeywordAdapter(this.commonKeywordAdapter);
        this.actionTagPlaylistAdapter = new CommonSqlActionTagPlaylistAdapter(this.commonPlaylistAdapter);
        this.actionTagRateAdapter = new CommonSqlActionTagRateAdapter(this.commonRateAdapter);
        this.actionTagODAdapter = new CommonSqlActionTagObjectDetectionAdapter(this.commonObjectDetectionAdapter);
    }

    protected isActiveLoadDetailsMode(tableConfig: TableConfig, loadDetailDataConfig: LoadDetailDataConfig,
                                      loadDetailsMode: string): boolean {
        if (loadDetailDataConfig && loadDetailDataConfig.modes) {
            if (!loadDetailsMode) {
                // mode required but no mode set on options
                return false;
            }
            if (loadDetailDataConfig.modes.indexOf(loadDetailsMode) < 0) {
                // mode not set on options
                return false;
            }
        }

        return true;
    }

    protected extendTableConfigs() {
        this.sqlQueryBuilder.extendTableConfigs(TourDocSqlMytbDbConfig.tableConfigs);
    }

    protected getTableConfig(params: AdapterQuery): TableConfig {
        return this.getTableConfigForTableKey(this.extractTable(params));
    }

    protected getTableConfigForTableKey(table: string): TableConfig {
        return this.dbModelConfig.getTableConfigForTableKey(table);
    }

    protected getDefaultFacets(): Facets {
        const facets = new Facets();
        let facet = new Facet();
        facet.facet = ['trip', 'location', 'track', 'destination', 'route', 'image', 'video', 'news', 'odimgobject', 'info']
            .map(value => {return [value, 0]; });
        facet.selectLimit = 1;
        facets.facets.set('type_txt', facet);
        facet = new Facet();
        facet.facet = ['relevance'].map(value => {return [value, 0]; });
        facets.facets.set('sorts', facet);

        return facets;
    }

    protected extractTable(params: AdapterQuery): string {
        if (params.where === undefined) {
            return undefined;
        }

        const types = params.where['type_txt'];
        if (types !== undefined && types.in !== undefined && types.in.length === 1) {
            const tabKey = types.in[0].toLowerCase();
            if (this.dbModelConfig.getTableConfigForTableKey(tabKey) !== undefined) {
                return tabKey;
            }
            return undefined;
        }

        const ids = params.where['id'];
        if (ids !== undefined && ids.in_number !== undefined && ids.in_number.length === 1) {
            const tabKey = ids.in_number[0].replace(/_.*/g, '').toLowerCase();
            if (this.dbModelConfig.getTableConfigForTableKey(tabKey) !== undefined) {
                return tabKey;
            }

            return undefined;
        }

        if (ids !== undefined && ids.in !== undefined && ids.in.length === 1) {
            const tabKey = ids.in[0].replace(/_.*/g, '').toLowerCase();
            if (this.dbModelConfig.getTableConfigForTableKey(tabKey) !== undefined) {
                return tabKey;
            }

            return undefined;
        }

        return undefined;
    }

    protected queryTransformToAdapterWriteQuery(method: string, mapper: Mapper, props: any, opts: any): WriteQueryData {
        const query = super.queryTransformToAdapterWriteQuery(method, mapper, props, opts);
        if (query.tableConfig.key === 'image') {
            let file = null;
            let dir = null;
            if (props.get('tdocimages') && props.get('tdocimages').length > 0) {
                const image: TourDocImageRecord = props.get('tdocimages')[0];
                file = image.fileName.replace(/^.*\/(.*?)$/, '$1');
                dir = image.fileName.replace(/^(.*)\/(.*?)$/, '$1').replace(/\\/g, '/');
            }
            query.fields['i_dir'] = dir;
            query.fields['i_file'] = file;
        } else if (query.tableConfig.key === 'video') {
            let file = null;
            let dir = null;
            if (props.get('tdocvideos') && props.get('tdocvideos').length > 0) {
                const video: TourDocImageRecord = props.get('tdocvideos')[0];
                file = video.fileName.replace(/^.*\/(.*?)$/, '$1');
                dir = video.fileName.replace(/^(.*)\/(.*?)$/, '$1').replace(/\\/g, '/');
            }
            query.fields['v_dir'] = dir;
            query.fields['v_file'] = file;
        }

        return query;
    }

    protected transformToSqlDialect(sql: string): string {
        if (this.config.knexOpts.client !== 'mysql') {
            sql = TourDocSqlUtils.transformToSqliteDialect(sql);
        }

        return super.transformToSqlDialect(sql);
    }

    protected saveDetailData(method: string, mapper: Mapper, id: string | number, props: any, opts?: any): Promise<boolean> {
        if (props.type === undefined) {
            return utils.resolve(false);
        }
        const dbId = parseInt(id + '', 10);
        if (!utils.isInteger(dbId)) {
            return utils.reject('saveDetailData ' + props.type + ' id not an integer');
        }

        const tabKey = props.type.toLowerCase();
        if (tabKey === 'track') {
            return new Promise<boolean>((allResolve, allReject) => {
                const promises = [];
                promises.push(this.keywordsAdapter.setTrackKeywords(dbId, props.keywords, opts));
                if (props.get('tdoclinkedroutes')) {
                    const routes: TourDocLinkedRouteRecord[] = props.get('tdoclinkedroutes');
                    promises.push(this.commonJoinAdapter.saveJoins('linkedroutes', tabKey, dbId, routes, opts));
                }

                return Promise.all(promises).then(() => {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('setTrackDetails failed:', reason);
                    return allReject(reason);
                });
            });
        } else if (tabKey === 'image') {
            return new Promise<boolean>((allResolve, allReject) => {
                const promises = [];
                promises.push(this.keywordsAdapter.setImageKeywords(dbId, props.keywords, opts));

                return Promise.all(promises).then(() => {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('setImageDetails failed:', reason);
                    return allReject(reason);
                });
            });
        } else if (tabKey === 'info') {
            return new Promise<boolean>((allResolve, allReject) => {
                const promises = [];
                promises.push(this.keywordsAdapter.setInfoKeywords(dbId, props.keywords, opts));

                return Promise.all(promises).then(() => {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('setInfoDetails failed:', reason);
                    return allReject(reason);
                });
            });
        } else if (tabKey === 'video') {
            return new Promise<boolean>((allResolve, allReject) => {
                const promises = [];
                promises.push(this.keywordsAdapter.setVideoKeywords(dbId, props.keywords, opts));

                return Promise.all(promises).then(() => {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('setVideoDetails failed:', reason);
                    return allReject(reason);
                });
            });
        } else if (tabKey === 'route') {
            return new Promise<boolean>((allResolve, allReject) => {
                const promises = [];
                promises.push(this.keywordsAdapter.setRouteKeywords(dbId, props.keywords, opts));
                if (props.get('tdoclinkedinfos')) {
                    const infos: TourDocLinkedInfoRecord[] = props.get('tdoclinkedinfos');
                    promises.push(this.commonJoinAdapter.saveJoins('linkedinfos', tabKey, dbId, infos, opts));
                }

                return Promise.all(promises).then(() => {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('setRouteDetails failed:', reason);
                    return allReject(reason);
                });
            });
        } else if (tabKey === 'location') {
            return new Promise<boolean>((allResolve, allReject) => {
                const promises = [];
                promises.push(this.keywordsAdapter.setLocationKeywords(dbId, props.keywords, opts));
                if (props.get('tdoclinkedinfos')) {
                    const infos: TourDocLinkedInfoRecord[] = props.get('tdoclinkedinfos');
                    promises.push(this.commonJoinAdapter.saveJoins('linkedinfos', tabKey, dbId, infos, opts));
                }

                return Promise.all(promises).then(() => {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('setLocationDetails failed:', reason);
                    return allReject(reason);
                });
            });
        }


        return utils.resolve(true);
    }

    protected _doActionTag(mapper: Mapper, record: TourDocRecord, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        opts = opts || {};
        const id = parseInt(record.id.replace(/.*_/g, ''), 10);
        if (!utils.isInteger(id)) {
            return utils.reject(false);
        }

        const table = (record['type'] + '').toLowerCase();
        actionTagForm.deletes = false;
        if ((table === 'image' || table === 'video') && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('playlists_')) {
            return this.actionTagPlaylistAdapter.executeActionTagPlaylist(table, id, <PlaylistActionTagForm> actionTagForm, opts).then(
                () => {
                    if (actionTagForm.payload.set) {
                        const rates = {
                            'gesamt': actionTagForm.payload['tdocratepers.gesamt'] || 0,
                            'motive': actionTagForm.payload['tdocratepers.motive'] || 0,
                            'wichtigkeit': actionTagForm.payload['tdocratepers.wichtigkeit'] || 0
                        };
                        return this.commonRateAdapter.setRates(table, id, rates, true, opts);
                    } else {
                        return utils.resolve(true);
                    }
                });
        } else if ((table === 'image' || table === 'video') && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('objects_')) {
            return this.actionTagODAdapter.executeActionTagObjects(table, id, <ObjectsActionTagForm> actionTagForm, opts);
        } else if ((table === 'odimgobject') && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('odobjectstate_')) {
            return this.actionTagODAdapter.executeActionTagObjectsState(table, id, <ObjectsStateActionTagForm> actionTagForm, opts);
        } else if ((table === 'odimgobject') && actionTagForm.type === 'objectkeyedit' && actionTagForm.key.startsWith('objectkeyedit')) {
            return this.actionTagODAdapter.executeActionTagObjectsKey(table, id, <ObjectsKeyActionTagForm> actionTagForm, opts);
        } else if ((table === 'image' || table === 'video') && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('persRate_')) {
            return this.actionTagRateAdapter.executeActionTagRate(table, id, <RateActionTagForm> actionTagForm, opts);
        } else if ((table === 'track') && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('trackmedia_persRate')) {
            return this.actionTagRateAdapter.executeActionTagRate('trackimages', id, <RateActionTagForm> actionTagForm, opts).then(
                () => {
                    return this.actionTagRateAdapter.executeActionTagRate('trackvideos', id, <RateActionTagForm> actionTagForm, opts);
                }
            );
        } else if (actionTagForm.type === 'tag' && actionTagForm.key.startsWith('blocked')) {
            return this.actionTagBlockAdapter.executeActionTagBlock(table, id, actionTagForm, opts);
        } else if (actionTagForm.type === 'assign' && actionTagForm.key.startsWith('assign')) {
            return this.actionTagAssignAdapter.executeActionTagAssign(table, id, <AssignActionTagForm> actionTagForm, opts);
        } else if (actionTagForm.type === 'assignjoin' && actionTagForm.key.startsWith('assignjoin')) {
            return this.actionTagAssignJoinAdapter.executeActionTagAssignJoin(table, id, <AssignJoinActionTagForm> actionTagForm, opts);
        } else if (actionTagForm.type === 'keyword' && actionTagForm.key.startsWith('keyword')) {
            return this.actionTagKeywordAdapter.executeActionTagKeyword(table, id, <KeywordActionTagForm> actionTagForm, opts);
        } else if (actionTagForm.type === 'replace' && actionTagForm.key.startsWith('replace')) {
            actionTagForm.deletes = true;
            return this.actionTagReplaceAdapter.executeActionTagReplace(table, id, <ReplaceActionTagForm> actionTagForm, opts);
        }

        return super._doActionTag(mapper, record, actionTagForm, opts);
    }

}

