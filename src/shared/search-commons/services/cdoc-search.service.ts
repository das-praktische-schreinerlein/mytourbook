import {GenericSearchService} from './generic-search.service';
import {DateUtils} from '../../commons/utils/date.utils';
import {utils} from 'js-data';
import {CommonDocRecord} from '../model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '../model/container/cdoc-searchresult';
import {GenericDataStore} from './generic-data.store';

export abstract class CommonDocSearchService<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>> extends GenericSearchService <R, F, S> {

    protected constructor(dataStore: GenericDataStore<R, F, S>, mapperName: string) {
        super(dataStore, mapperName);
    }

    doMultiSearch(searchForm: F, ids: string[]): Promise<S> {
        const me = this;
        if (ids.length <= 0 || ids[0] === '') {
            return utils.resolve(this.newSearchResult(searchForm, 0, [], undefined));
        }

        const idTypeMap = {};
        for (const id of ids) {
            let [type] = id.split('_');
            type = type.toLowerCase();
            if (idTypeMap[type] === undefined) {
                idTypeMap[type] = { ids: [], records: {}};
            }
            idTypeMap[type]['ids'].push(id);
        }

        const promises: Promise<S>[] = [];
        for (const type in idTypeMap) {
            for (let page = 1; page <= (idTypeMap[type]['ids'].length / this.maxPerRun) + 1; page ++) {
                const typeSearchForm = this.newSearchForm({});
                const start = (page - 1) * this.maxPerRun;
                const end = Math.min(start + this.maxPerRun, idTypeMap[type]['ids'].length);
                const idTranche = idTypeMap[type]['ids'].slice(start, end);
                typeSearchForm.moreFilter = 'id:' + idTranche.join(',');
                typeSearchForm.type = type;
                typeSearchForm.perPage = this.maxPerRun;
                typeSearchForm.pageNum = 1;
                typeSearchForm.sort = 'dateAsc';
                promises.push(me.search(typeSearchForm, {
                    showFacets: false,
                    loadTrack: true,
                    showForm: false
                }));
            }
        }

        return new Promise<S>((resolve, reject) => {
            Promise.all(promises).then(function doneSearch(docSearchResults: S[]) {
                const records: R[] = [];
                docSearchResults.forEach(docSearchResult => {
                    for (const doc of docSearchResult.currentRecords) {
                        let [type] = doc.id.split('_');
                        type = type.toLowerCase();
                        idTypeMap[type]['records'][doc.id] = doc;
                    }
                });
                for (const id of ids) {
                    let [type] = id.split('_');
                    type = type.toLowerCase();
                    if (idTypeMap[type]['records'][id] !== undefined) {
                        records.push(idTypeMap[type]['records'][id]);
                    }
                }

                if (searchForm.sort === 'dateAsc') {
                    records.sort((a, b) => {
                        const dateA = DateUtils.parseDate(a['dateshow']);
                        const dateB = DateUtils.parseDate(b['dateshow']);
                        const nameA = (dateA !== undefined ? dateA.getTime() : 0);
                        const nameB = (dateB !== undefined ? dateB.getTime() : 0);

                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        return 0;
                    });
                }

                const docSearchResult = me.newSearchResult(searchForm, records.length, records, undefined);
                resolve(docSearchResult);
            }).catch(function errorSearch(reason) {
                reject(reason);
            });
        });
    }
}
