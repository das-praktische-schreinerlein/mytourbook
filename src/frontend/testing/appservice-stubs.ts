import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Subject';
import {AppState, GenericAppService} from '../shared/search-commons/services/generic-app.service';

@Injectable()
export class AppServiceStub extends GenericAppService {
    mockedAppStateObservable = new ReplaySubject<AppState>();

    initApp(): void {
    }

    getAppState(): Subject<AppState> {
        this.mockedAppStateObservable.next(AppState.Ready);
        return this.mockedAppStateObservable;
    }
    getAppConfig(): {} {
        return {};
    }
}
