import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';

export enum AppState {
    Starting = 1,
    Ready = 5,
    Failed = 10
}

export abstract class GenericAppService {
    appState: AppState = AppState.Starting;
    appStateObservable = new ReplaySubject<AppState>();

    constructor() {
        this.appStateObservable.next(this.appState);
    }

    abstract initApp(): void;

    getAppState(): Subject<AppState> {
        return this.appStateObservable;
    }

    protected setAppState(appState: AppState): void {
        this.appState = appState;
        this.appStateObservable.next(appState);
    }
}
