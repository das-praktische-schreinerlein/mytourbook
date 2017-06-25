import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Subject';
import {AppState, GenericAppService} from '../commons/services/generic-app.service';

@Injectable()
export class AppServiceStub extends GenericAppService {
    appStateObservable = new ReplaySubject<AppState>();

    initApp(): void {
    }

    getAppState(): Subject<AppState> {
        this.appStateObservable.next(AppState.Ready);
        return this.appStateObservable;
    }
}
