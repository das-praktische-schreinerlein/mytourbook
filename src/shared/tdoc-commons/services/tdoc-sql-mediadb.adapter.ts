import {TourDocRecord} from '../model/records/tdoc-record';
import {TourDocSearchForm} from '../model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../model/container/tdoc-searchresult';
import {GenericSqlAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-sql.adapter';
import {TourDocAdapterResponseMapper} from './tdoc-adapter-response.mapper';
import {TableConfig, WriteQueryData} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterQuery} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {Facet, Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {Mapper, utils} from 'js-data';
import {TourDocImageRecord} from '../model/records/tdocimage-record';
import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {TourDocSqlMediadbActionTagAdapter} from './tdoc-sql-mediadb-actiontag.adapter';
import {TourDocSqlMediadbKeywordAdapter} from './tdoc-sql-mediadb-keyword.adapter';
import {TourDocSqlMediadbConfig} from './tdoc-sql-mediadb.config';

export class TourDocSqlMediadbAdapter extends GenericSqlAdapter<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {
    private actionTagAdapter: TourDocSqlMediadbActionTagAdapter;
    private keywordsAdapter: TourDocSqlMediadbKeywordAdapter;
    private tableConfig: TourDocSqlMediadbConfig = new TourDocSqlMediadbConfig();

    constructor(config: any) {
        super(config, new TourDocAdapterResponseMapper(config));
        this.actionTagAdapter = new TourDocSqlMediadbActionTagAdapter(config, this.knex, this.sqlQueryBuilder);
        this.keywordsAdapter = new TourDocSqlMediadbKeywordAdapter(config, this.knex, this.sqlQueryBuilder);
    }

    protected getTableConfig(params: AdapterQuery): TableConfig {
        return this.getTableConfigForTableKey(this.extractTable(params));
    }

    protected getTableConfigForTableKey(table: string): TableConfig {
        return this.tableConfig.getTableConfigForTableKey(table);
    }

    protected getDefaultFacets(): Facets {
        const facets = new Facets();
        let facet = new Facet();
        facet.facet = ['trip', 'location', 'track', 'route', 'image', 'video', 'news', 'odimgobject'].map(value => {return [value, 0]; });
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
            if (this.tableConfig.getTableConfigForTableKey(tabKey) !== undefined) {
                return tabKey;
            }
            return undefined;
        }

        const ids = params.where['id'];
        if (ids !== undefined && ids.in_number !== undefined && ids.in_number.length === 1) {
            const tabKey = ids.in_number[0].replace(/_.*/g, '').toLowerCase();
            if (this.tableConfig.getTableConfigForTableKey(tabKey) !== undefined) {
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
            // dirty workaround because sqlite has no functions as mysql
            sql = sql.replace(/GetTechName\(GetLocationNameAncestry\(location.l_id, location.l_name, " -> "\)\)/g,
                'GetTechName(location.l_name)');
            sql = sql.replace(/GetLocationNameAncestry\(location.l_id, location.l_name, " -> "\)/g,
                '"T" || location.l_typ || "L" || location.l_parent_id || " -> " || location.l_name');
            sql = sql.replace(/GetLocationIdAncestry\(location.l_id, ","\)/g,
                'CAST(location.l_parent_id AS CHAR(50)) || "," || CAST(location.l_id AS CHAR(50))');
            sql = sql.replace('CONCAT(CAST(location.l_parent_id AS CHAR(50)), ",", CAST(location.l_id AS CHAR(50)))',
                'CAST(location.l_parent_id AS CHAR(50)) || "," || CAST(location.l_id AS CHAR(50))');
            sql = sql.replace(/GetTechName\(([a-zA-Z0-9_.]+)\)/g,
                'REPLACE(REPLACE(LOWER($1), " ", "_"), "/", "_")');
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
            return  new Promise<boolean>((allResolve, allReject) => {
                const promises = [];
                promises.push(this.keywordsAdapter.setTrackKeywords(dbId, props.keywords, opts));

                return Promise.all(promises).then(dbresults => {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('_facets failed:', reason);
                    return allReject(reason);
                });
            });
        } else if (tabKey === 'image') {
            return new Promise<boolean>((allResolve, allReject) => {
                const promises = [];
                promises.push(this.keywordsAdapter.setImageKeywords(dbId, props.keywords, opts));

                return Promise.all(promises).then(dbresults => {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('_facets failed:', reason);
                    return allReject(reason);
                });
            });
        } else if (tabKey === 'video') {
            return new Promise<boolean>((allResolve, allReject) => {
                const promises = [];
                promises.push(this.keywordsAdapter.setVideoKeywords(dbId, props.keywords, opts));

                return Promise.all(promises).then(dbresults => {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('_facets failed:', reason);
                    return allReject(reason);
                });
            });
        } else if (tabKey === 'route') {
            return new Promise<boolean>((allResolve, allReject) => {
                const promises = [];
                promises.push(this.keywordsAdapter.setRouteKeywords(dbId, props.keywords, opts));

                return Promise.all(promises).then(dbresults => {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('_facets failed:', reason);
                    return allReject(reason);
                });
            });
        } else if (tabKey === 'location') {
            return new Promise<boolean>((allResolve, allReject) => {
                const promises = [];
                promises.push(this.keywordsAdapter.setLocationKeywords(dbId, props.keywords, opts));

                return Promise.all(promises).then(dbresults => {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('_facets failed:', reason);
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
        if ((table === 'image' || table === 'video') && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('playlists_')) {
            return this.actionTagAdapter.executeActionTagPlaylist(table, id, actionTagForm, opts);
        } else if ((table === 'image' || table === 'video') && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('objects_')) {
            return this.actionTagAdapter.executeActionTagObjects(table, id, actionTagForm, opts);
        } else if ((table === 'odimgobject') && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('odobjectstate_')) {
            return this.actionTagAdapter.executeActionTagObjectsState(table, id, actionTagForm, opts);
        } else if ((table === 'image' || table === 'video') && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('persRate_')) {
            return this.actionTagAdapter.executeActionTagPersRate(table, id, actionTagForm, opts);
        } else if (actionTagForm.type === 'tag' && actionTagForm.key.startsWith('blocked')) {
            return this.actionTagAdapter.executeActionTagBlock(table, id, actionTagForm, opts);
        }

        return super._doActionTag(mapper, record, actionTagForm, opts);
    }

}

