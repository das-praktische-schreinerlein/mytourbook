import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';

export enum AppState {
    Starting = 1,
    Ready = 5,
    Failed = 10
}

export abstract class GenericAppService {
    private appState: AppState = AppState.Starting;
    private appStateObservable = new ReplaySubject<AppState>();

    constructor() {
        this.appStateObservable.next(this.appState);
    }

    abstract initApp(): void;

    getAppState(): Subject<AppState> {
        return this.appStateObservable;
    }

    abstract getAppConfig(): {}

    protected setAppState(appState: AppState): void {
        this.appState = appState;
        this.appStateObservable.next(appState);
    }
}
