import {SDocRecord} from '../model/records/sdoc-record';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {GenericSearchService} from '../../search-commons/services/generic-search.service';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocDataStore} from './sdoc-data.store';
import {DateUtils} from '../../commons/utils/date.utils';
import {utils} from 'js-data';

export class SDocSearchService extends GenericSearchService <SDocRecord, SDocSearchForm, SDocSearchResult> {
    private maxPerRun = 99;

    constructor(dataStore: SDocDataStore) {
        super(dataStore, 'sdoc');
    }

    createDefaultSearchForm(): SDocSearchForm {
        return new SDocSearchForm({ pageNum: 1, perPage: 10});
    }

    doMultiSearch(searchForm: SDocSearchForm, ids: string[]): Promise<SDocSearchResult> {
        const me = this;
        if (ids.length <= 0 || ids[0] === '') {
            return utils.resolve(new SDocSearchResult(searchForm, 0, [], undefined));
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

        const promises: Promise<SDocSearchResult>[] = [];
        for (const type in idTypeMap) {
            for (let page = 1; page <= (idTypeMap[type]['ids'].length / this.maxPerRun) + 1; page ++) {
                const typeSearchForm = new SDocSearchForm({});
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

        return new Promise<SDocSearchResult>((resolve, reject) => {
            Promise.all(promises).then(function doneSearch(sdocSearchResults: SDocSearchResult[]) {
                const records: SDocRecord[] = [];
                sdocSearchResults.forEach(sdocSearchResult => {
                    for (const sdoc of sdocSearchResult.currentRecords) {
                        let [type] = sdoc.id.split('_');
                        type = type.toLowerCase();
                        idTypeMap[type]['records'][sdoc.id] = sdoc;
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

                const sdocSearchResult = new SDocSearchResult(searchForm, records.length, records, undefined);
                resolve(sdocSearchResult);
            }).catch(function errorSearch(reason) {
                reject(reason);
            });
        });
    }
}
