import {Injectable} from '@angular/core';
import {SDocDataService} from '../../sdoc/services/sdoc-data.service';
import {SDocSolrAdapter} from '../../sdoc/services/sdoc-solr.adapter';
import {Http, Jsonp} from '@angular/http';
import {SDocDataStore} from '../../sdoc/services/sdoc-data.store';
import {environment} from '../../../environments/environment';
import {SDocRecord} from '../../sdoc/model/records/sdoc-record';
import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';

export enum AppState {
    Starting = 1,
    Ready = 5,
    Failed = 10
}

@Injectable()
export class AppService {
    appState: AppState = AppState.Starting;
    appStateObservable = new ReplaySubject<AppState>();
    lastSearchurl = '';

    constructor(private sdocDataService: SDocDataService, private sdocDataStore: SDocDataStore,
                private http: Http, private jsonp: Jsonp) {
        this.appStateObservable.next(this.appState);
    }

    initApp() {
        this.initSolrData();
    }

    initSolrData() {
        const options = {
            basePath: environment.solrBasePath,
            suffix: '&wt=json&indent=on&datatype=jsonp&json.wrf=JSONP_CALLBACK&callback=JSONP_CALLBACK&',
        };
        const httpAdapter = new SDocSolrAdapter(options, this.jsonp);
        this.sdocDataStore.setAdapter('http', httpAdapter, '', {});
        this.setAppState(AppState.Ready);
    }

    initStaticData() {
        const me = this;
        this.http.request('./assets/sdocs.json').subscribe(
            res => {
                const sdocs: any[] = res.json().sdocs;
                this.sdocDataService.addMany(sdocs).then(function doneAddMany(sdocsRecords: SDocRecord[]) {
                        console.log('loaded sdocs from assets', sdocsRecords);
                        me.setAppState(AppState.Ready);
                    },
                    function errorCreate(reason: any) {
                        console.error('loading appdata failed:' + reason);
                        me.setAppState(AppState.Failed);
                    }
                );
            },
            error => {
                console.error('loading appdata failed:' + error);
                this.setAppState(AppState.Failed);
            });
    }

    getAppState(): Subject<AppState> {
        return this.appStateObservable;
    }

    private setAppState(appState: AppState): void {
        this.appState = appState;
        this.appStateObservable.next(appState);
    }
}
