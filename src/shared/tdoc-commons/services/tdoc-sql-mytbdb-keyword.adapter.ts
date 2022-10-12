import {CommonSqlKeywordAdapter} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';

export class TourDocSqlMytbDbKeywordAdapter {

    private readonly commonSqlKeywordAdapter: CommonSqlKeywordAdapter;

    constructor(config: any, knex: any, commonSqlKeywordAdapter: CommonSqlKeywordAdapter) {
        this.commonSqlKeywordAdapter = commonSqlKeywordAdapter;
    }

    public setTrackKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('track', dbId, keywords, opts);
    }

    public setImageKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('image', dbId, keywords, opts);
    }

    public setInfoKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('info', dbId, keywords, opts);
    }

    public setVideoKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('video', dbId, keywords, opts);
    }

    public setLocationKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('location', dbId, keywords, opts);
    }

    public setRouteKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('route', dbId, keywords, opts);
    }

    public setPoiKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('poi', dbId, keywords, opts);
    }

    protected setGenericKeywords(table: string, dbId: number, keywords: string, opts: any): Promise<any> {
        return this.commonSqlKeywordAdapter.setGenericKeywords(table, dbId, keywords, opts, true);
    }
}
