import {Injectable} from '@angular/core';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocSearchForm} from '../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocDataService} from '../../../shared/sdoc-commons/services/sdoc-data.service';

@Injectable()
export class SDocDataCacheService {
    private recordCache = new Map<string, SDocRecord>();
    private nameCache = new Map<string, string>();

    constructor(private sdocDataService: SDocDataService) {
    }

    resolveNamesForIds(ids: string[]): Promise<Map<string, string>> {
        const resolveableSearchForm = new SDocSearchForm({});
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
            this.sdocDataService.search(resolveableSearchForm, {showFacets: false, loadTrack: false, showForm: false})
                .then(function doneSearch(resolveableSearchResult) {
                    if (resolveableSearchResult !== undefined) {
                        for (const record of resolveableSearchResult.currentRecords) {
                            me.nameCache.set(record.id.toString(), record.name);
                            me.recordCache.set(record.id.toString(), record);
                        }
                    }
                    return resolve(me.nameCache);
                }).catch(function errorSearch(reason) {
                    console.error('resolve resolveNamesForIds failed:' + reason);
                    return reject(reason);
            });
        });

        return result;
    }
}
