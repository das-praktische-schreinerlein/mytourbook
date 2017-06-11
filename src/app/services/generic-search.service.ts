import {GenericDataStore} from './generic-data.store';
import {Observable} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {Record} from 'js-data';

export abstract class GenericSearchService <R extends Record, F extends GenericSearchForm,
    S extends GenericSearchResult<R, F>> {
    curList: BehaviorSubject<S>;
    dataStore: GenericDataStore<R, F, S>;
    searchMapperName: string;

    constructor(dataStore: GenericDataStore<R, F, S>, mapperName: string) {
        this.dataStore = dataStore;
        this.curList = <BehaviorSubject<S>>new BehaviorSubject(undefined);
        this.searchMapperName = mapperName;
    }

    getAll(): Promise<R[]> {
        const allForm = this.createDefaultSearchForm();
        allForm.perPage = -1;
        return this.findCurList(allForm);
    }

    findCurList(searchForm: F): Promise<R[]> {
        console.log('findCurList for form', searchForm);
        const searchResultObs = this.dataStore.search(this.searchMapperName, searchForm, {});

        const me = this;
        const result = new Promise<R[]>((resolve, reject) => {
            searchResultObs.then(function doneSearch(searchResultData: S) {
                    console.log('findCurList searchResultData', searchResultData);
                    resolve(<R[]>searchResultData.currentRecords);
                    me.curList.next(searchResultData);
                },
                function errorSearch(reason) {
                    console.error('findCurList failed:' + reason);
                    reject(reason);
                });
        });

        return result;
    }

    getById(id: number): Promise<R> {
        return this.dataStore.find(this.searchMapperName, id);
    }

    getCurList(): Observable<S> {
        return this.curList.asObservable();
    }

    abstract createDefaultSearchForm(): F;
}
