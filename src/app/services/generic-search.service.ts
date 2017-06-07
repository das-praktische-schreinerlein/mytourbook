import {GenericDataStore} from './generic-data.store';
import {Observable} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {Record} from 'js-data';

export abstract class GenericSearchService <R extends Record, F extends GenericSearchForm,
    S extends GenericSearchResult<R, F>> {
    curList: BehaviorSubject<S>;
    dataStore: GenericDataStore;
    searchMapperName: string;

    constructor(dataStore: GenericDataStore, mapperName: string) {
        this.dataStore = dataStore;
        this.curList = <BehaviorSubject<S>>new BehaviorSubject(undefined);
        this.searchMapperName = mapperName;
    }

    getAll(): Observable<R[]> {
        const allForm = this.createDefaultSearchForm();
        allForm.perPage = -1;
        return this.findCurList(allForm);
    }

    findCurList(searchForm: F): Observable<R[]> {
        const query = this.createQueryFromForm(searchForm);

        console.log('findCurList for form', searchForm);
        const searchResult = this.createSearchResult(searchForm, 0, []);

        const result: Observable<R[]> = Observable.fromPromise(this.dataStore.findAll(this.searchMapperName, query, {
            limit: searchForm.perPage,
            offset: searchForm.pageNum - 1,
            // We want the newest posts first
            orderBy: [['created_at', 'desc']]
        }));
        result.subscribe(documents => {
                console.log('findCurList documents', documents);
                searchResult.currentRecords = <R[]>documents;
                this.curList.next(searchResult);
            },
            error => {
                console.error('findCurList documents failed:' + error);
            },
            () => {
            });

        const countResult = Observable.fromPromise(this.dataStore.count(this.searchMapperName, query, {
            limit: searchForm.perPage,
            offset: searchForm.pageNum - 1,
            // We want the newest posts first
            orderBy: [['created_at', 'desc']]
        }));
        countResult.subscribe(count => {
                console.log('findCurList count', count);
                searchResult.recordCount = count;
                this.curList.next(searchResult);
            },
            error => {
                console.error('findCurList count failed:' + error);
            },
            () => {
            }
        );

        return result;
    }

    getById(id: number): Observable<R> {
        return Observable.fromPromise(this.dataStore.find(this.searchMapperName, id));
    }

    getCurList(): Observable<S> {
        return this.curList.asObservable();
    }

    abstract createQueryFromForm(searchForm: F): Object;

    abstract createDefaultSearchForm(): F;

    abstract createSearchResult(searchForm: F, recordCount: number, records: R[]): S;
}
