import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SDocRecord} from '../app/sdocshared/model/records/sdoc-record';

@Injectable()
export class ActivatedRouteStub {
    params = Observable.of({
        id: 1
    });
    data = Observable.of({
        record: new SDocRecord({id: '1', name: 'Test'})
    });
}
