import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TourDocRecord} from '../tdoc-commons/model/records/tdoc-record';
import {TourDocSearchForm} from '../tdoc-commons/model/forms/tdoc-searchform';
import {PDocRecord} from '../pdoc-commons/model/records/pdoc-record';

@Injectable()
export class ActivatedRouteStub {
    params = Observable.of({
        id: 1
    });
    data = Observable.of({
        record: {
            data: new TourDocRecord({id: '1', name: 'Test'})
        },
        pdoc: {
            data: new PDocRecord({id: '1', name: 'Test'})
        },
        searchForm: {
            data: new TourDocSearchForm({})
        },
        flgDoSearch: false,
        baseSearchUrl: {
            data: '/sections'
        }
    });

    public queryParamMap: {} = {
        subscribe: function () {}
    };

    public fragment: {} = {
        subscribe: function () {}
    };
}
