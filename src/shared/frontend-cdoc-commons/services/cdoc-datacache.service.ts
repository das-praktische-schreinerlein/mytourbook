import {CommonDocRecord} from '../../search-commons/model/records/cdoc-entity-record';
import {CommonDocDataService} from '../../search-commons/services/cdoc-data.service';
import {CommonDocSearchForm} from '../../search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '../../search-commons/model/container/cdoc-searchresult';

export class CommonDocDataCacheService<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> {
    protected recordCache = new Map<string, R>();
    protected nameCache = new Map<string, string>();

    constructor(private cdocDataService: D) {
    }

    resolveNamesForIds(ids: string[]): Promise<Map<string, string>> {
        const resolveableSearchForm = this.cdocDataService.newSearchForm({});
        resolveableSearchForm.moreFilter = '';
        resolveableSearchForm.perPage = 99;
        ids.forEach((key) => {
            if (!this.nameCache.has(key)) {
                resolveableSearchForm.moreFilter += key + ',';
            }
        });

        if (resolveableSearchForm.moreFilter === '') {
            return Promise.resolve(this.nameCache);
        }

        const me = this;
        resolveableSearchForm.moreFilter = 'id:' + resolveableSearchForm.moreFilter;
        const result = new Promise<Map<string, string>>((resolve, reject) => {
            this.cdocDataService.search(resolveableSearchForm, {showFacets: false, loadTrack: false, showForm: false})
                .then(function doneSearch(resolveableSearchResult) {
                    if (resolveableSearchResult !== undefined) {
                        for (const record of resolveableSearchResult.currentRecords) {
                            me.nameCache.set(record.id.toString(), record.name);
                            me.recordCache.set(record.id.toString(), record);
                        }
                    }
                    return resolve(me.nameCache);
                }).catch(function errorSearch(reason) {
                console.error('resolve resolveNamesForIds failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }
}
