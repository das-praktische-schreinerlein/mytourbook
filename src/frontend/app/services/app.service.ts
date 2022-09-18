import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {TourDocDataService} from '../../shared/tdoc-commons/services/tdoc-data.service';
import {HttpClient} from '@angular/common/http';
import {TourDocDataStore} from '../../shared/tdoc-commons/services/tdoc-data.store';
import {environment} from '../../environments/environment';
import {AppState, GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {TourDocHttpAdapter} from '../../shared/tdoc-commons/services/tdoc-http.adapter';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {BaseEntityRecord} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {MinimalHttpBackendClient} from '@dps/mycms-commons/dist/commons/services/minimal-http-backend-client';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {TourDocItemsJsAdapter} from '../../shared/tdoc-commons/services/tdoc-itemsjs.adapter';
import {TourDocAdapterResponseMapper} from '../../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import {FallbackHttpClient} from './fallback-http-client';
import * as Promise_serial from 'promise-serial';
import {DataMode} from '../../shared/tdoc-commons/model/datamode.enum';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class AppService extends GenericAppService {
    private onlineAppConfig = {
        adminBackendApiBaseUrl: environment.adminBackendApiBaseUrl,
        backendApiBaseUrl: environment.backendApiBaseUrl,
        tracksBaseUrl: environment.tracksBaseUrl,
        picsBaseUrl: environment.picsBaseUrl,
        videoBaseUrl: environment.videoBaseUrl,
        useAssetStoreUrls: environment.useAssetStoreUrls,
        useVideoAssetStoreUrls: environment.useVideoAssetStoreUrls,
        skipMediaCheck: environment.skipMediaCheck && true,
        staticPDocsFile: undefined,
        staticTDocsFiles: undefined,
        permissions: {
            adminWritable: environment.adminWritable,
            tdocWritable: environment.tdocWritable,
            tdocActionTagWritable: environment.tdocActionTagWritable,
            allowAutoPlay: environment.allowAutoPlay,
            m3uAvailable: environment.m3uAvailable,
        },
        tdocMaxItemsPerAlbum: environment.tdocMaxItemsPerAlbum,
        components: {},
        services: {},
        currentDataMode: environment.startDataMode ? environment.startDataMode : DataMode.BACKEND,
        startDataMode: environment.startDataMode ? environment.startDataMode : DataMode.BACKEND,
        availableDataModes: environment.availableDataModes ? environment.availableDataModes : [DataMode.BACKEND]
    };
    private staticAppConfig = {
        adminBackendApiBaseUrl: environment.adminBackendApiBaseUrl,
        backendApiBaseUrl: environment.backendApiBaseUrl,
        tracksBaseUrl: environment.tracksBaseUrl,
        picsBaseUrl: environment.picsBaseUrl,
        videoBaseUrl: environment.videoBaseUrl,
        staticPDocsFile: environment.staticPDocsFile,
        staticTDocsFiles: environment.staticTDocsFiles,
        useAssetStoreUrls: environment.useAssetStoreUrls,
        useVideoAssetStoreUrls: environment.useVideoAssetStoreUrls,
        skipMediaCheck: environment.skipMediaCheck && true,
        permissions: {
            adminWritable: environment.adminWritable,
            tdocWritable: environment.tdocWritable,
            tdocActionTagWritable: environment.tdocActionTagWritable,
            allowAutoPlay: environment.allowAutoPlay,
            m3uAvailable: environment.m3uAvailable,
        },
        tdocMaxItemsPerAlbum: environment.tdocMaxItemsPerAlbum,
        components: {},
        services: {},
        currentDataMode: environment.startDataMode ? environment.startDataMode : DataMode.STATIC,
        startDataMode: environment.startDataMode ? environment.startDataMode : DataMode.STATIC,
        availableDataModes: environment.availableDataModes ? environment.availableDataModes : [DataMode.STATIC]
    };
    private appConfig = {
        adminBackendApiBaseUrl: environment.adminBackendApiBaseUrl,
        backendApiBaseUrl: environment.backendApiBaseUrl,
        tracksBaseUrl: environment.tracksBaseUrl,
        picsBaseUrl: environment.picsBaseUrl,
        videoBaseUrl: environment.videoBaseUrl,
        useAssetStoreUrls: environment.useAssetStoreUrls,
        useVideoAssetStoreUrls: environment.useVideoAssetStoreUrls,
        skipMediaCheck: environment.skipMediaCheck && true,
        staticPDocsFile: undefined,
        staticTDocsFiles: undefined,
        permissions: {
            adminWritable: environment.adminWritable,
            tdocWritable: environment.tdocWritable,
            tdocActionTagWritable: environment.tdocActionTagWritable,
            allowAutoPlay: environment.allowAutoPlay,
            m3uAvailable: environment.m3uAvailable,
        },
        tdocMaxItemsPerAlbum: environment.tdocMaxItemsPerAlbum,
        components: {},
        services: {},
        currentDataMode: environment.startDataMode ? environment.startDataMode : DataMode.BACKEND,
        startDataMode: environment.startDataMode ? environment.startDataMode : DataMode.BACKEND,
        availableDataModes: environment.availableDataModes ? environment.availableDataModes : [DataMode.BACKEND]
    };

    constructor(private tdocDataService: TourDocDataService, private tdocDataStore: TourDocDataStore,
                private pdocDataService: PDocDataService, @Inject(LOCALE_ID) private locale: string,
                private http: HttpClient, private commonRoutingService: CommonRoutingService,
                private backendHttpClient: MinimalHttpBackendClient, private platformService: PlatformService,
                private fallBackHttpClient: FallbackHttpClient, protected toastService: ToastrService) {
        super();
    }

    initApp(): Promise<boolean> {
        const me = this;
        return this.initAppConfig().then(function onConfigLoaded() {
            if (DataMode.STATIC === me.appConfig.currentDataMode) {
                return me.initStaticData();
            } else {
                return me.initBackendData();
            }
        }).then(function onBackendLoaded() {
            console.log('app ready');
            me.setAppState(AppState.Ready);
            return Promise.resolve(true);
        }).catch(function onError(reason: any) {
            console.error('loading app failed:', reason);
            me.setAppState(AppState.Failed);
            return Promise.reject(reason);
        });
    }

    getAppConfig(): {}  {
        return this.appConfig;
    }

    doSwitchToOfflineVersion(): void {
        const me = this;
        me.appConfig.currentDataMode = DataMode.STATIC;
        me.initApp().then(() => {
            console.log('DONE - switched to offline-version');
            return me.commonRoutingService.navigateByUrl('/?' + (new Date()).getTime());
        }).catch(reason => {
            console.error('switching to offlineversion failed:', reason);
            me.toastService.error('Es gibt leider Probleme beim Wechsel zur OfflineVersion - am besten noch einmal probieren :-(', 'Oje!');
        });
    }

    doSwitchToOnlineVersion(): void {
        const me = this;
        me.appConfig.currentDataMode = DataMode.BACKEND;
        me.initApp().then(() => {
            console.log('DONE - switched to online-version');
            return me.commonRoutingService.navigateByUrl('/?' + (new Date()).getTime());
        }).catch(reason => {
            console.error('switching to onlineversion failed:', reason);
            me.toastService.error('Es gibt leider Probleme beim Wechsel zur OnlineVersion - am besten noch einmal probieren :-(', 'Oje!');
        });
    }

    initAppConfig(): Promise<any> {
        const me = this;
        if (DataMode.STATIC === me.appConfig.currentDataMode) {
            console.log('starting static app');
            me.appConfig = {...me.staticAppConfig};
            return me.fallBackHttpClient.loadJsonPData('assets/staticdata/static.mytbconfig.js', 'importStaticConfigJsonP', 'config')
                .then(function onDocLoaded(res: any) {
                    const config: {} = res;
                    console.log('initially loaded dynamic config from assets', config);
                    me.appConfig.components = config['components'];
                    me.appConfig.services = config['services'];
                    me.appConfig.tracksBaseUrl = config['tracksBaseUrl'] ? config['tracksBaseUrl'] : me.appConfig.tracksBaseUrl;
                    me.appConfig.picsBaseUrl = config['picsBaseUrl'] ? config['picsBaseUrl'] : me.appConfig.picsBaseUrl;
                    me.appConfig.videoBaseUrl = config['videoBaseUrl'] ? config['videoBaseUrl'] : me.appConfig.videoBaseUrl;
                    me.appConfig.staticPDocsFile = config['staticPDocsFile'] ? config['staticPDocsFile'] : me.appConfig.staticPDocsFile;
                    me.appConfig.staticTDocsFiles = config['staticTDocsFiles'] ? config['staticTDocsFiles'] : me.appConfig.staticTDocsFiles;
                    me.appConfig.skipMediaCheck = config['skipMediaCheck'] && true;
                    me.appConfig.useAssetStoreUrls = false;
                    me.appConfig.useVideoAssetStoreUrls = false;
                    me.appConfig.currentDataMode = DataMode.STATIC;

                    return Promise.resolve(true);
                });
        }

        console.log('starting online app');
        me.appConfig = {...me.onlineAppConfig};
        return new Promise<boolean>((resolve, reject) => {
            const url = me.platformService.getAssetsUrl(
                `./assets/config` + environment.assetsPathVersionSnippet + `.json` + environment.assetsPathVersionSuffix);
            // console.log('load config:', url);
            me.http.get(url).toPromise()
                .then(function onConfigLoaded(res: any) {
                    const config: {} = res;
                    // console.log('initially loaded config from assets', config);
                    me.appConfig.components = config['components'];
                    me.appConfig.services = config['services'];
                    me.appConfig.currentDataMode = DataMode.BACKEND;
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
        me.appConfig.permissions.tdocWritable = false;
        me.appConfig.permissions.tdocActionTagWritable = false;
        me.appConfig.permissions.adminWritable = false;

        return  me.fallBackHttpClient.loadJsonPData(me.appConfig.staticPDocsFile, 'importStaticDataPDocsJsonP', 'pdocs')
            .then(function onPDocLoaded(data: any) {
                if (data['pdocs']) {
                    return Promise.resolve(data['pdocs']);
                }

                return Promise.reject('No static tdocs found');
            }).then(function onPDocParsed(docs: any[]) {
                me.pdocDataService.setWritable(true);
                return me.pdocDataService.addMany(docs);
            }).then(function onPDocsAdded(pdocs: BaseEntityRecord[]) {
                console.log('initially loaded pdocs from assets', pdocs);
                me.pdocDataService.setWritable(false);

                const promises = [];
                for (const staticTDocsFile of me.appConfig.staticTDocsFiles) {
                    promises.push(function () {
                        return me.fallBackHttpClient.loadJsonPData(staticTDocsFile, 'importStaticDataTDocsJsonP', 'tdocs');
                    });
                }

                return Promise_serial(promises, {parallelize: 1}).then(arrayOfResults => {
                    const tdocs = [];
                    for (let i = 0; i < arrayOfResults.length; i++) {
                        const data = arrayOfResults[i];
                        if (data['mdocs']) {
                            const exportRecords = data['mdocs'].map(doc => {
                                return TourDocItemsJsAdapter.extendAdapterDocument(doc);
                            });

                            tdocs.push(...exportRecords);
                            continue;
                        }

                        if (data['currentRecords']) {
                            const options = {};
                            const responseMapper = new TourDocAdapterResponseMapper(options);
                            const searchRecords = data['currentRecords'].map(doc => {
                                const record = TourDocItemsJsAdapter.createRecordFromJson(responseMapper,
                                    me.tdocDataStore.getMapper('tdoc'), doc);
                                const adapterValues = responseMapper.mapToAdapterDocument({}, record);

                                return TourDocItemsJsAdapter.extendAdapterDocument(adapterValues);
                            });

                            tdocs.push(...searchRecords);
                            continue;
                        }

                        return Promise.reject('No static tdocs found');
                    }

                    return Promise.resolve(tdocs);
                }).catch(reason => {
                    return Promise.reject(reason);
                });
            }).then(function onDocParsed(tdocs: any[]) {
                console.log('initially loaded tdocs from assets', tdocs);
                const options = { skipMediaCheck: me.appConfig.skipMediaCheck};
                const tdocAdapter = new TourDocItemsJsAdapter(options, tdocs);
                me.tdocDataStore.setAdapter('http', tdocAdapter, '', {});
                me.tdocDataService.setWritable(false);

                return Promise.resolve(true);
            }).catch(function onError(reason: any) {
                console.error('loading appdata failed:', reason);
                me.pdocDataService.setWritable(false);
                me.tdocDataService.setWritable(false);

                return Promise.reject(false);
            });
    }

}
