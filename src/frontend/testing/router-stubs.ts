import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';
import {SDocSearchForm} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {PDocRecord} from '../shared/pdoc-commons/model/records/pdoc-record';

@Injectable()
export class ActivatedRouteStub {
    params = Observable.of({
        id: 1
    });
    data = Observable.of({
        record: {
            data: new SDocRecord({id: '1', name: 'Test'})
        },
        pdoc: {
            data: new PDocRecord({id: '1', name: 'Test'})
        },
        searchForm: {
            data: new SDocSearchForm({})
        },
        flgDoSearch: false,
        baseSearchUrl: {
            data: '/sections'
        }
    });
}
