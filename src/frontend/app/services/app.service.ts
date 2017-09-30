import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {SDocDataService} from '../../shared/sdoc-commons/services/sdoc-data.service';
import {Http} from '@angular/http';
import {SDocDataStore} from '../../shared/sdoc-commons/services/sdoc-data.store';
import {environment} from '../../environments/environment';
import {AppState, GenericAppService} from '../../shared/commons/services/generic-app.service';
import {SDocHttpAdapter} from '../../shared/sdoc-commons/services/sdoc-http.adapter';
import {PDocDataService} from '../../shared/pdoc-commons/services/pdoc-data.service';
import {BaseEntityRecord} from '../../shared/search-commons/model/records/base-entity-record';
import {Router} from '@angular/router';
import {MinimalHttpBackendClient} from '../../shared/commons/services/minimal-http-backend-client';

@Injectable()
export class AppService extends GenericAppService {
    private appConfig = {
        backendApiBaseUrl: environment.backendApiBaseUrl,
        tracksBaseUrl: environment.tracksBaseUrl,
        picsBaseUrl: environment.picsBaseUrl,
        components: {},
        services: {}
    };

    constructor(private sdocDataService: SDocDataService, private sdocDataStore: SDocDataStore,
                private pdocDataService: PDocDataService, @Inject(LOCALE_ID) private locale: string,
                private http: Http, private router: Router, private backendHttpClient: MinimalHttpBackendClient) {
        super();
    }

    initApp(): void {
        const me = this;
        this.initAppConfig().then(function onConfigLoaded() {
            return me.initBackendData();
        }).then(function onBackendLoaded() {
            console.log('app ready');
            me.setAppState(AppState.Ready);
        }).catch(function onError(reason: any) {
            console.error('loading app failed:' + reason);
            me.setAppState(AppState.Failed);
        });
    }

    getAppConfig(): {}  {
        return this.appConfig;
    }

    doSwitchToOfflineVersion(): void {
        const me = this;
        this.initStaticData().then(function onFullfiled() {
            me.router.navigateByUrl('/');
        }).catch(function onError(reason: any) {
            console.error('loading app failed:' + reason);
            me.setAppState(AppState.Failed);
        });
    }

    doSwitchToOnlineVersion(): void {
        const me = this;
        this.initBackendData().then(function onFullfiled() {
            me.router.navigateByUrl('/');
        }).catch(function onError(reason: any) {
            console.error('loading app failed:' + reason);
            me.setAppState(AppState.Failed);
        });
    }

    initAppConfig(): Promise<any> {
        const me = this;
        return new Promise<boolean>((resolve, reject) => {
            me.http.request('./assets/config.json').toPromise()
                .then(function onConfigLoaded(res: any) {
                    const config: {} = res.json();
                    console.log('initially loaded config from assets', config);
                    me.appConfig.components = config['components'];
                    me.appConfig.services = config['services'];
                    resolve(true);
                }).catch(function onError(reason: any) {
                    console.error('loading appdata failed:' + reason);
                    reject(false);
            });
        });
    }

    initBackendData(): Promise<boolean> {
        const me = this;
        const options = {
            basePath: this.appConfig.backendApiBaseUrl + this.locale + '/',
            http: function (httpConfig) {
                return me.backendHttpClient.makeHttpRequest(httpConfig);
            }
        };
        const sdocAdapter = new SDocHttpAdapter(options);

        this.sdocDataStore.setAdapter('http', undefined, '', {});
        this.pdocDataService.clearLocalStore();
        this.sdocDataService.clearLocalStore();
        this.sdocDataStore.setAdapter('http', sdocAdapter, '', {});

        return new Promise<boolean>((resolve, reject) => {
            me.backendHttpClient.makeHttpRequest({ method: 'get', url: options.basePath + 'pdoc/', withCredentials: true })
                .then(function onDocsLoaded(res: any) {
                    const docs: any[] = (res['data'] || res.json());
                    return me.pdocDataService.addMany(docs);
                }).then(function onDocsAdded(records: BaseEntityRecord[]) {
                    console.log('initially loaded pdocs from server', records);
                    resolve(true);
                }).catch(function onError(reason: any) {
                    console.error('loading appdata failed:' + reason);
                    reject(false);
                });
            });
    }

    initStaticData(): Promise<any> {
        const me = this;
        this.sdocDataStore.setAdapter('http', undefined, '', {});
        this.pdocDataService.clearLocalStore();
        this.sdocDataService.clearLocalStore();
        return new Promise<boolean>((resolve, reject) => {
            me.http.request('./assets/pdocs.json').toPromise()
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
                    resolve(true);
                }).catch(function onError(reason: any) {
                    console.error('loading appdata failed:' + reason);
                    reject(false);
                });
            });
    }
}
