import {SDocRecord} from '../model/records/sdoc-record';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {GenericSqlAdapter} from '../../search-commons/services/generic-sql.adapter';
import {SDocAdapterResponseMapper} from './sdoc-adapter-response.mapper';
import {TableConfig, WriteQueryData} from '../../search-commons/services/sql-query.builder';
import {AdapterQuery} from '../../search-commons/services/mapper.utils';
import {Facet, Facets} from '../../search-commons/model/container/facets';
import {Mapper, Record, utils} from 'js-data';
import {SDocImageRecord} from '../model/records/sdocimage-record';
import {ActionTagForm} from '../../commons/utils/actiontag.utils';
import {SDocSqlMediadbActionTagAdapter} from './sdoc-sql-mediadb-actiontag.adapter';
import {SDocSqlMediadbKeywordAdapter} from './sdoc-sql-mediadb-keyword.adapter';
import {SDocSqlMediadbConfig} from './sdoc-sql-mediadb.config';

export class SDocSqlMediadbAdapter extends GenericSqlAdapter<SDocRecord, SDocSearchForm, SDocSearchResult> {
    private actionTagAdapter: SDocSqlMediadbActionTagAdapter;
    private keywordsAdapter: SDocSqlMediadbKeywordAdapter;
    private tableConfig: SDocSqlMediadbConfig = new SDocSqlMediadbConfig();

    constructor(config: any) {
        super(config, new SDocAdapterResponseMapper(config));
        this.actionTagAdapter = new SDocSqlMediadbActionTagAdapter(config, this.knex, this.sqlQueryBuilder);
        this.keywordsAdapter = new SDocSqlMediadbKeywordAdapter(config, this.knex, this.sqlQueryBuilder);
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
        facet.facet = ['trip', 'location', 'track', 'route', 'image', 'news'].map(value => {return [value, 0]; });
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
            if (props.get('sdocimages') && props.get('sdocimages').length > 0) {
                const image: SDocImageRecord = props.get('sdocimages')[0];
                file = image.fileName.replace(/^.*\/(.*?)$/, '$1');
                dir = image.fileName.replace(/^(.*)\/(.*?)$/, '$1').replace(/\\/g, '/');
            }
            query.fields['i_dir'] = dir;
            query.fields['i_file'] = file;
        }

        return query;
    }

    protected transformToSqlDialect(sql: string): string {
        if (this.config.knexOpts.client !== 'mysql') {
            // dirty workaround because sqlite has no functions as mysql
            sql = sql.replace(/GetLocationNameAncestry\(location.l_id, location.l_name, " -> "\)/,
                '"T" || location.l_typ || "L" || location.l_parent_id || " -> " || location.l_name');
            sql = sql.replace(/GetLocationIdAncestry\(location.l_id, ","\)/,
                'CAST(location.l_parent_id AS CHAR(50)) || "," || CAST(location.l_id AS CHAR(50))');
            sql = sql.replace('CONCAT(CAST(location.l_parent_id AS CHAR(50)), ",", CAST(location.l_id AS CHAR(50)))',
                'CAST(location.l_parent_id AS CHAR(50)) || "," || CAST(location.l_id AS CHAR(50))');
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

                Promise.all(promises).then(function doneSearch() {
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

                Promise.all(promises).then(function doneSearch() {
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

                Promise.all(promises).then(function doneSearch() {
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

                Promise.all(promises).then(function doneSearch() {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('_facets failed:', reason);
                    return allReject(reason);
                });
            });
        }


        return utils.resolve(true);
    }

    protected _doActionTag<T extends Record>(mapper: Mapper, record: SDocRecord, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        opts = opts || {};
        const id = parseInt(record.id.replace(/.*_/g, ''), 10);
        if (!utils.isInteger(id)) {
            return utils.reject(false);
        }

        const table = (record['type'] + '').toLowerCase();
        if (table === 'image' && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('playlists_')) {
            return this.actionTagAdapter.executeActionTagImagePlaylist(id, actionTagForm, opts);
        } else if (table === 'image' && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('objects_')) {
            return this.actionTagAdapter.executeActionTagImageObjects(id, actionTagForm, opts);
        } else if (table === 'image' && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('persRate_')) {
            return this.actionTagAdapter.executeActionTagImagePersRate(id, actionTagForm, opts);
        } else if (actionTagForm.type === 'tag' && actionTagForm.key.startsWith('blocked')) {
            return this.actionTagAdapter.executeActionTagBlock(table, id, actionTagForm, opts);
        }

        return super._doActionTag(mapper, record, actionTagForm, opts);
    }

}

