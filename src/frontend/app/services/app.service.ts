import {Injectable} from '@angular/core';
import {SDocDataService} from '../../shared/sdoc-commons/services/sdoc-data.service';
import {Http, Jsonp} from '@angular/http';
import {SDocDataStore} from '../../shared/sdoc-commons/services/sdoc-data.store';
import {environment} from '../../environments/environment';
import {AppState, GenericAppService} from '../../shared/search-commons/services/generic-app.service';
import {SDocHttpAdapter} from '../../shared/sdoc-commons/services/sdoc-http.adapter';
import {PDocDataService} from '../../shared/pdoc-commons/services/pdoc-data.service';
import {BaseEntityRecord} from '../../shared/search-commons/model/records/base-entity-record';
import {Router} from '@angular/router';

@Injectable()
export class AppService extends GenericAppService {
    private appConfig = {
        backendApiBaseUrl: environment.backendApiBaseUrl,
        tracksBaseUrl: environment.tracksBaseUrl,
        picsBaseUrl: environment.picsBaseUrl
    };

    constructor(private sdocDataService: SDocDataService, private sdocDataStore: SDocDataStore,
                private pdocDataService: PDocDataService,
                private http: Http, private jsonp: Jsonp, private router: Router) {
        super();
    }

    initApp(): void {
        this.initBackendData();
    }

    getAppConfig(): {}  {
        return this.appConfig;
    }

    doSwitchToOfflineVersion(): void {
        const me = this;
        this.initStaticData().then(function onFullfiled() {
            me.router.navigateByUrl('/');
        });
    }

    doSwitchToOnlineVersion(): void {
        const me = this;
        this.initBackendData().then(function onFullfiled() {
            me.router.navigateByUrl('/');
        });
    }

    initBackendData(): Promise<any> {
        const me = this;
        const options = {
            basePath: this.appConfig.backendApiBaseUrl
        };
        const sdocAdapter = new SDocHttpAdapter(options);

        this.sdocDataStore.setAdapter('http', undefined, '', {});
        this.pdocDataService.clearLocalStore();
        this.sdocDataService.clearLocalStore();
        this.sdocDataStore.setAdapter('http', sdocAdapter, '', {});

        return this.http.request(options.basePath + 'pdoc/').toPromise()
            .then(function onDocsLoaded(res: any) {
                const docs: any[] = res.json();
                return me.pdocDataService.addMany(docs);
            }).then(function onDocsAdded(records: BaseEntityRecord[]) {
                console.log('initially loaded pdocs from server', records);
                me.setAppState(AppState.Ready);
            }).catch(function onError(reason: any) {
                console.error('loading appdata failed:' + reason);
                me.setAppState(AppState.Failed);
        });
    }

    initStaticData(): Promise<any> {
        const me = this;
        this.sdocDataStore.setAdapter('http', undefined, '', {});
        this.pdocDataService.clearLocalStore();
        this.sdocDataService.clearLocalStore();
        return this.http.request('./assets/pdocs.json').toPromise()
            .then(function onDocsLoaded(res: any) {
                const docs: any[] = res.json().pdocs;

                return me.pdocDataService.addMany(docs);
            }).then(function onDocsAdded(records: BaseEntityRecord[]) {
                console.log('initially loaded pdocs from assets', records);

                return me.http.request('./assets/sdocs.json').toPromise();
            }).then(function onDocsLoaded(res: any) {
                const docs: any[] = res.json().sdocs;

                return me.sdocDataService.addMany(docs);
            }).then(function onDocsAdded(records: BaseEntityRecord[]) {
                console.log('initially loaded sdocs from assets', records);
                me.setAppState(AppState.Ready);
            }).catch(function onError(reason: any) {
                console.error('loading appdata failed:' + reason);
                me.setAppState(AppState.Failed);
        });
    }
}
