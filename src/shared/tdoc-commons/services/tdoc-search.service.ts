import {TourDocRecord} from '../model/records/tdoc-record';
import {TourDocSearchResult} from '../model/container/tdoc-searchresult';
import {TourDocSearchForm, TourDocSearchFormFactory} from '../model/forms/tdoc-searchform';
import {TourDocDataStore} from './tdoc-data.store';
import {CommonDocSearchService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-search.service';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import * as Promise_serial from 'promise-serial';
import {GenericSearchOptions} from '@dps/mycms-commons/src/search-commons/services/generic-search.service';

export class TourDocSearchService extends CommonDocSearchService<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {
    constructor(dataStore: TourDocDataStore) {
        super(dataStore, 'tdoc');
    }

    createDefaultSearchForm(): TourDocSearchForm {
        return new TourDocSearchForm({ pageNum: 1, perPage: 10});
    }

    public getBaseMapperName(): string {
        return 'tdoc';
    }

    public isRecordInstanceOf(record: any): boolean {
        return record instanceof TourDocRecord;
    }

    public createRecord(props, opts): TourDocRecord {
        return <TourDocRecord>this.dataStore.createRecord(this.getBaseMapperName(), props, opts);
    }

    public newRecord(values: {}): TourDocRecord {
        return new TourDocRecord(values);
    }

    public newSearchForm(values: {}): TourDocSearchForm {
        return new TourDocSearchForm(values);
    }

    public newSearchResult(tdocSearchForm: TourDocSearchForm, recordCount: number,
                           currentRecords: TourDocRecord[], facets: Facets): TourDocSearchResult {
        return new TourDocSearchResult(tdocSearchForm, recordCount, currentRecords, facets);
    }

    public cloneSanitizedSearchForm(src: TourDocSearchForm): TourDocSearchForm {
        return TourDocSearchFormFactory.cloneSanitized(src);
    }

    public createSanitizedSearchForm(values: {}): TourDocSearchForm {
        return TourDocSearchFormFactory.createSanitized(values);
    }

    public doMultiPlaylistSearch(searchForm: TourDocSearchForm, playlist: string, playlistEntryCountPerType: {}, opts: GenericSearchOptions)
        : Promise<TourDocSearchResult> {
        if (searchForm.type === undefined) {
            return Promise.reject('types-filter required');
        }

        const types = searchForm.type.split(',')
            .map(value => value.length > 0 ? value : undefined)
            .filter(value => value !== undefined && value.length > 0);
        if (types.length < 1) {
            return Promise.reject('types-filter required');
        }

        const idTypeMap = {};

        console.log('do search for types with entries', types, searchForm.perPage, searchForm.pageNum, playlistEntryCountPerType);

        const promises = [];
        const me = this;
        let recordCount = 0;
        for (const type of types) {
            if (playlistEntryCountPerType[type] <= 0) {
                continue;
            }

            recordCount += playlistEntryCountPerType[type];

            const maxNumber = Math.min(playlistEntryCountPerType[type], searchForm.perPage * searchForm.pageNum);
            const pages = Math.ceil(maxNumber / this.maxPerRun);
            for (let page = 1; page <= pages; page ++) {
                const typeSearchForm = this.newSearchForm({});
                typeSearchForm.type = type;
                typeSearchForm.perPage = Math.min(this.maxPerRun, maxNumber);
                typeSearchForm.pageNum = page;
                typeSearchForm.sort = searchForm.sort;
                typeSearchForm.playlists = playlist;
                idTypeMap[type] = {};
                console.log('do search for type with page/maxEntries/form',
                    type, typeSearchForm.pageNum, maxNumber, playlistEntryCountPerType[type], typeSearchForm);

                promises.push(function () {
                    return me.search(typeSearchForm, opts);
                });

            }
        }

        return new Promise<TourDocSearchResult>((resolve, reject) => {
            return Promise_serial(promises, {parallelize: me.maxParallelMultiSearches}).then((docSearchResults: TourDocSearchResult[]) => {
                const records: TourDocRecord[] = [];
                docSearchResults.forEach(result => {
                    for (const doc of result.currentRecords) {
                        let [type] = doc.id.split('_');
                        type = type.toUpperCase();
                        if (idTypeMap[type] && idTypeMap[type][doc.id + ''] === undefined) {
                            idTypeMap[type][doc.id + ''] = doc;
                            records.push(doc);
                        } else {
                            console.warn('doc type not initialised and found', type, doc.id);
                        }
                    }
                });

                this.sortRecords(records, searchForm.sort);
                const docSearchResult = me.newSearchResult(searchForm, recordCount, records, undefined);
                return resolve(docSearchResult);
            }).catch((reason) => {
                return reject(reason);
            });
        });
    }

}
