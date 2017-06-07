import {Injectable} from '@angular/core';
import {SDocRecord, SDocRecordRelation} from '../model/records/sdoc-record';
import {Observable} from 'rxjs/Rx';
import {SDocDataStore} from './sdoc-data.store';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {SDocSearchService} from './sdoc-search.service';
import {SDocImageRecord, SDocImageRecordRelation} from '../model/records/sdocimage-record';
import {SDocImageRecordSchema} from '../model/schemas/sdocimage-record-schema';
import {SDocRecordSchema} from '../model/schemas/sdoc-record-schema';

@Injectable()
export class SDocDataService extends SDocSearchService {

    constructor(dataStore: SDocDataStore) {
        super(dataStore);
        this.dataStore.defineMapper('sdoc', SDocRecord, SDocRecordSchema, SDocRecordRelation);
        this.dataStore.defineMapper('sdocimage', SDocImageRecord, SDocImageRecordSchema, SDocImageRecordRelation);
    }

    generateNewId(): number {
        return (new Date()).getTime();
    }

    createRecord(props, opts): SDocRecord {
        return <SDocRecord>this.dataStore.createRecord(this.searchMapperName, props, opts);
    }

    // Simulate POST /sdocs
    add(sdoc: SDocRecord): Observable<SDocRecord> {
        return Observable.fromPromise(this.dataStore.create('sdoc', sdoc));
    }

    // Simulate POST /sdocs
    addMany(sdocs: SDocRecord[]): Observable<SDocRecord[]> {
        return Observable.fromPromise(this.dataStore.createMany('sdoc', sdocs));
    }

    // Simulate DELETE /sdocs/:id
    deleteById(id: number): Observable<SDocRecord> {
        return Observable.fromPromise(this.dataStore.destroy('sdoc', id));
    }

    // Simulate PUT /sdocs/:id
    updateById(id: number, values: Object = {}): Observable<SDocRecord> {
        return Observable.fromPromise(this.dataStore.update('sdoc', id, values));
    }
}
