import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export enum AppState {
    Starting = 1,
    Ready = 5,
    Failed = 10
}

export enum AppOnlineState {
    Online = 1,
    Offline = 2
}
export enum BrowserOnlineState {
    Online = 1,
    Offline = 2
}

export abstract class GenericAppService {
    static ERROR_APP_NOT_INITIALIZED = 'ERROR_APP_NOT_INITIALIZED';
    private appState: AppState = AppState.Starting;
    private appStateObservable = new ReplaySubject<AppState>();
    private appOnlineStateObservable = new BehaviorSubject<AppOnlineState>(AppOnlineState.Online);
    private browserOnlineStateObservable = new BehaviorSubject<BrowserOnlineState>(BrowserOnlineState.Online);

    constructor() {
        this.appStateObservable.next(this.appState);
        this.initBrowserOnlineStateLoader();
    }

    abstract initApp(): void;

    abstract doSwitchToOfflineVersion(): void;

    abstract doSwitchToOnlineVersion(): void;

    getAppState(): Subject<AppState> {
        return this.appStateObservable;
    }

    getAppOnlineState(): Subject<AppOnlineState> {
        return this.appOnlineStateObservable;
    }

    getBrowserOnlineState(): Subject<BrowserOnlineState> {
        return this.browserOnlineStateObservable;
    }

    abstract getAppConfig(): {}

    protected setAppState(appState: AppState): void {
        this.appState = appState;
        this.appStateObservable.next(appState);
    }

    protected initBrowserOnlineStateLoader() {
        const me = this;
        window.addEventListener('online', function () {
            me.browserOnlineStateObservable.next(BrowserOnlineState.Online);
        });
        window.addEventListener('offline', function () {
            me.browserOnlineStateObservable.next(BrowserOnlineState.Offline);
        });
        if (navigator.onLine !== undefined && navigator.onLine === false) {
            me.browserOnlineStateObservable.next(BrowserOnlineState.Offline);
        }
    }
}
