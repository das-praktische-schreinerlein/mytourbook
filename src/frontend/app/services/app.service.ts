import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {TourDocDataService} from '../../shared/tdoc-commons/services/tdoc-data.service';
import {Http} from '@angular/http';
import {TourDocDataStore} from '../../shared/tdoc-commons/services/tdoc-data.store';
import {environment} from '../../environments/environment';
import {AppState, GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {TourDocHttpAdapter} from '../../shared/tdoc-commons/services/tdoc-http.adapter';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {BaseEntityRecord} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {MinimalHttpBackendClient} from '@dps/mycms-commons/dist/commons/services/minimal-http-backend-client';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';

@Injectable()
export class AppService extends GenericAppService {
    private appConfig = {
        backendApiBaseUrl: environment.backendApiBaseUrl,
        tracksBaseUrl: environment.tracksBaseUrl,
        picsBaseUrl: environment.picsBaseUrl,
        videoBaseUrl: environment.videoBaseUrl,
        useAssetStoreUrls: environment.useAssetStoreUrls,
        useVideoAssetStoreUrls: environment.useVideoAssetStoreUrls,
        permissions: {
            tdocWritable: environment.tdocWritable,
            tdocActionTagWritable: environment.tdocActionTagWritable,
            allowAutoPlay: environment.allowAutoPlay,
            m3uAvailable: environment.m3uAvailable,
        },
        tdocMaxItemsPerAlbum: environment.tdocMaxItemsPerAlbum,
        components: {},
        services: {}
    };

    constructor(private tdocDataService: TourDocDataService, private tdocDataStore: TourDocDataStore,
                private pdocDataService: PDocDataService, @Inject(LOCALE_ID) private locale: string,
                private http: Http, private commonRoutingService: CommonRoutingService,
                private backendHttpClient: MinimalHttpBackendClient, private platformService: PlatformService) {
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
            console.error('loading app failed:', reason);
            me.setAppState(AppState.Failed);
        });
    }

    getAppConfig(): {}  {
        return this.appConfig;
    }

    doSwitchToOfflineVersion(): void {
        const me = this;
        this.initStaticData().then(function onFullfiled() {
            me.commonRoutingService.navigateByUrl('/');
        }).catch(function onError(reason: any) {
            console.error('loading app failed:', reason);
            me.setAppState(AppState.Failed);
        });
    }

    doSwitchToOnlineVersion(): void {
        const me = this;
        this.initBackendData().then(function onFullfiled() {
            me.commonRoutingService.navigateByUrl('/');
        }).catch(function onError(reason: any) {
            console.error('loading app failed:', reason);
            me.setAppState(AppState.Failed);
        });
    }

    initAppConfig(): Promise<any> {
        const me = this;
        return new Promise<boolean>((resolve, reject) => {
            const url = me.platformService.getAssetsUrl(`./assets/config.json`);
            // console.log('load config:', url);
            me.http.request(url).toPromise()
                .then(function onConfigLoaded(res: any) {
                    const config: {} = res.json();
                    // console.log('initially loaded config from assets', config);
                    me.appConfig.components = config['components'];
                    me.appConfig.services = config['services'];
                    return resolve(true);
                }).catch(function onError(reason: any) {
                    console.error('loading appdata failed:', reason);
                    return reject(false);
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
        const tdocAdapter = new TourDocHttpAdapter(options);

        this.tdocDataStore.setAdapter('http', undefined, '', {});
        this.pdocDataService.clearLocalStore();
        this.tdocDataService.clearLocalStore();
        this.tdocDataStore.setAdapter('http', tdocAdapter, '', {});

        return new Promise<boolean>((resolve, reject) => {
            me.backendHttpClient.makeHttpRequest({ method: 'get', url: options.basePath + 'pdoc/', withCredentials: true })
                .then(function onDocsLoaded(res: any) {
                    const docs: any[] = (res['data'] || res.json());
                    me.pdocDataService.setWritable(true);
                    return me.pdocDataService.addMany(docs);
                }).then(function onDocsAdded(records: BaseEntityRecord[]) {
                    // console.log('initially loaded pdocs from server', records);
                    me.pdocDataService.setWritable(false);
                    me.tdocDataService.setWritable(me.appConfig.permissions.tdocWritable);
                    return resolve(true);
                }).catch(function onError(reason: any) {
                    console.error('loading appdata failed:', reason);
                    me.pdocDataService.setWritable(false);
                    return reject(false);
                });
            });
    }

    initStaticData(): Promise<any> {
        const me = this;
        this.tdocDataStore.setAdapter('http', undefined, '', {});
        this.pdocDataService.clearLocalStore();
        this.tdocDataService.clearLocalStore();
        return new Promise<boolean>((resolve, reject) => {
            me.http.request('./assets/pdocs.json').toPromise()
                .then(function onDocsLoaded(res: any) {
                    const docs: any[] = res.json().pdocs;
                    me.pdocDataService.setWritable(true);
                    return me.pdocDataService.addMany(docs);
                }).then(function onDocsAdded(records: BaseEntityRecord[]) {
                    // console.log('initially loaded pdocs from assets', records);
                    me.pdocDataService.setWritable(false);

                    return me.http.request('./assets/tdocs.json').toPromise();
                }).then(function onDocsLoaded(res: any) {
                    const docs: any[] = res.json().tdocs;
                    me.tdocDataService.setWritable(true);

                    return me.tdocDataService.addMany(docs);
                }).then(function onDocsAdded(records: BaseEntityRecord[]) {
                    // console.log('initially loaded tdocs from assets', records);
                    me.tdocDataService.setWritable(me.appConfig.permissions.tdocWritable);
                    return resolve(true);
                }).catch(function onError(reason: any) {
                    console.error('loading appdata failed:', reason);
                    me.pdocDataService.setWritable(false);
                    me.tdocDataService.setWritable(false);
                    return reject(false);
                });
            });
    }
}
