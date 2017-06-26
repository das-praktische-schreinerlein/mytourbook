import {GenericDataStore} from './generic-data.store';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {Mapper, Record} from 'js-data';
import {Adapter} from 'js-data-adapter';

export abstract class GenericSearchService <R extends Record, F extends GenericSearchForm,
    S extends GenericSearchResult<R, F>> {
    dataStore: GenericDataStore<R, F, S>;
    searchMapperName: string;

    constructor(dataStore: GenericDataStore<R, F, S>, mapperName: string) {
        this.dataStore = dataStore;
        this.searchMapperName = mapperName;
    }

    public getMapper(mapperName: string): Mapper {
        return this.dataStore.getMapper(mapperName);
    }

    public getAdapterForMapper(mapperName: string): Adapter {
        return this.dataStore.getAdapterForMapper(mapperName);
    }

    getAll(): Promise<R[]> {
        const allForm = this.createDefaultSearchForm();
        allForm.perPage = -1;
        return this.findCurList(allForm);
    }

    findCurList(searchForm: F): Promise<R[]> {
        console.log('findCurList for form', searchForm);

        const result = new Promise<R[]>((resolve, reject) => {
            this.search(searchForm).then(function doneSearch(searchResultData: S) {
                    console.log('findCurList searchResultData', searchResultData);
                    resolve(<R[]>searchResultData.currentRecords);
                },
                function errorSearch(reason) {
                    console.error('findCurList failed:' + reason);
                    reject(reason);
                });
        });

        return result;
    }

    search(searchForm: F): Promise<S> {
        console.log('search for form', searchForm);
        const searchResultObs = this.dataStore.search(this.searchMapperName, searchForm, {});

        const me = this;
        const result = new Promise<S>((resolve, reject) => {
            searchResultObs.then(function doneSearch(searchResultData: S) {
                    console.log('search searchResultData', searchResultData);
                    resolve(searchResultData);
                },
                function errorSearch(reason) {
                    console.error('search failed:' + reason);
                    reject(reason);
                });
        });

        return result;
    }

    getById(id: number): Promise<R> {
        return this.dataStore.find(this.searchMapperName, id);
    }

    abstract createDefaultSearchForm(): F;
}