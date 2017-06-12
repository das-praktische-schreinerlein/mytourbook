import {Injectable} from '@angular/core';
import {AppState} from '../app/services/app.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Subject';

@Injectable()

export class AppServiceStub {
    appStateObservable = new ReplaySubject<AppState>();

    initApp(): void {
    }

    getAppState(): Subject<AppState> {
        this.appStateObservable.next(AppState.Ready);
        return this.appStateObservable;
    }
}
