import {Injectable} from '@angular/core';
import {SDocDataService} from '../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocSolrAdapter} from '../../shared/sdoc-commons/services/sdoc-solr.adapter';
import {Headers, Http, Jsonp, RequestOptionsArgs} from '@angular/http';
import {SDocDataStore} from '../../shared/sdoc-commons/services/sdoc-data.store';
import {environment} from '../../environments/environment';
import {AppState, GenericAppService} from '../../shared/search-commons/services/generic-app.service';
import {SDocHttpAdapter} from '../../shared/sdoc-commons/services/sdoc-http.adapter';
import {PDocDataService} from '../../shared/pdoc-commons/services/pdoc-data.service';
import {BaseEntityRecord} from '../../shared/search-commons/model/records/base-entity-record';

@Injectable()
export class AppService extends GenericAppService {
    private appConfig = {
        solrCoreSDoc: environment.solrCoreSDoc,
        solrCoreSDocReadUsername: environment.solrCoreSDocReadUsername,
        solrCoreSDocReadPassword: environment.solrCoreSDocReadPassword,
        backendApiBaseUrl: environment.backendApiBaseUrl,
        tracksBaseUrl: environment.tracksBaseUrl,
        picsBaseUrl: environment.picsBaseUrl
    };

    static configureHttpProvider(http: Http, appConfig): any {
        return function makeHttpRequest(httpConfig) {
            const headers: Headers = new Headers();
            headers.append('Content-Type', (httpConfig.contentType ? httpConfig.contentType : 'application/x-www-form-urlencoded'));
            headers.append('Authorization', 'Basic ' + btoa(appConfig.solrCoreSDocReadUsername + ':' + appConfig.solrCoreSDocReadPassword));

            const requestConfig: RequestOptionsArgs = {
                method: httpConfig.method.toLowerCase(),
                url: httpConfig.url,
                body: httpConfig.data,
                headers: headers
            };

            console.log('makeHttpRequest:', httpConfig);
            let result, request;
            request = http.request(httpConfig.url, requestConfig);
            result = request.map((res) => {
                    console.log('response makeHttpRequest:' + httpConfig.url, res);
                    const json = res.json();
                    return {
                        headers: res.headers,
                        method: httpConfig.method,
                        data: json,
                        status: res.status,
                        statusMsg: res.statusText
                    };
                },
                (error) => {
                    console.error('error makeHttpRequest:' + httpConfig.url, error);
                    return {
                        headers: [],
                        method: httpConfig.method,
                        data: {},
                        status: 300,
                        statusMsg: error
                    };
                });

            return result.toPromise();
        };
    }

    constructor(private sdocDataService: SDocDataService, private sdocDataStore: SDocDataStore,
                private pdocDataService: PDocDataService,
                private http: Http, private jsonp: Jsonp) {
        super();
    }

    initApp(): void {
        this.initBackendData();
    }

    getAppConfig(): {}  {
        return this.appConfig;
    }

    initSolrData() {
        const me = this;
        const options = {
            basePath: me.appConfig.solrCoreSDoc,
            suffix: '&wt=json&indent=on&datatype=jsonp&json.wrf=JSONP_CALLBACK&callback=JSONP_CALLBACK&',
            http: AppService.configureHttpProvider(this.jsonp, me.appConfig)
        };
        const httpAdapter = new SDocSolrAdapter(options);
        this.sdocDataStore.setAdapter('http', httpAdapter, '', {});

        this.http.request('./assets/pdocs.json').toPromise()
            .then(function onDocsLoaded(res: any) {
                const docs: any[] = res.json().pdocs;
                return me.pdocDataService.addMany(docs);
            }).then(function onDocsAdded(records: BaseEntityRecord[]) {
            console.log('initially loaded pdocs from server', records);
            me.setAppState(AppState.Ready);
        }).catch(function onError(reason: any) {
            console.error('loading appdata failed:' + reason);
            me.setAppState(AppState.Failed);
        });
    }

    initBackendData() {
        const me = this;
        const options = {
            basePath: this.appConfig.backendApiBaseUrl
        };
        const sdocAdapter = new SDocHttpAdapter(options);
        this.sdocDataStore.setAdapter('http', sdocAdapter, '', {});

        this.http.request(options.basePath + 'pdoc/').toPromise()
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

    initStaticData() {
        const me = this;
        this.http.request('./assets/pdocs.json').toPromise()
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
