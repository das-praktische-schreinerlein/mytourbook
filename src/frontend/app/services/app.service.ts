import {Injectable} from '@angular/core';
import {SDocDataService} from '../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocSolrAdapter} from '../../shared/sdoc-commons/services/sdoc-solr.adapter';
import {Headers, Http, Jsonp, RequestOptionsArgs} from '@angular/http';
import {SDocDataStore} from '../../shared/sdoc-commons/services/sdoc-data.store';
import {environment} from '../../environments/environment';
import {SDocRecord} from '../../shared/sdoc-commons/model/records/sdoc-record';
import {AppState, GenericAppService} from '../../shared/search-commons/services/generic-app.service';
import {SDocHttpAdapter} from '../../shared/sdoc-commons/services/sdoc-http.adapter';
import {PDocHttpAdapter} from '../../shared/pdoc-commons/services/pdoc-http.adapter';
import {PDocDataService} from '../../shared/pdoc-commons/services/pdoc-data.service';
import {PDocDataStore} from '../../shared/pdoc-commons/services/pdoc-data.store';

@Injectable()
export class AppService extends GenericAppService {
    private appConfig = {
        solrBaseUrl: environment.solrBaseUrl,
        backendApiBaseUrl: environment.backendApiBaseUrl,
        tracksBaseUrl: environment.tracksBaseUrl,
        picsBaseUrl: environment.picsBaseUrl
    };

    static configureHttpProvider(jsonP: Jsonp): any {
        return function makeHttpRequest(httpConfig) {
            const headers: Headers = new Headers();
            headers.append('Content-Type', (httpConfig.contentType ? httpConfig.contentType : 'application/x-www-form-urlencoded'));

            const requestConfig: RequestOptionsArgs = {
                method: httpConfig.method.toLowerCase(),
                url: httpConfig.url,
                body: httpConfig.data,
                headers: headers
            };

            console.log('makeHttpRequest:', httpConfig);
            let result, request;
            request = jsonP.get(httpConfig.url, requestConfig);
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
                private pdocDataStore: PDocDataStore, private http: Http, private jsonp: Jsonp) {
        super();
    }

    initApp(): void {
        this.initBackendData();
    }

    getAppConfig(): {}  {
        return this.appConfig;
    }

    initSolrData() {
        const options = {
            basePath: this.appConfig.solrBaseUrl,
            suffix: '&wt=json&indent=on&datatype=jsonp&json.wrf=JSONP_CALLBACK&callback=JSONP_CALLBACK&',
            http: AppService.configureHttpProvider(this.jsonp)
        };
        const httpAdapter = new SDocSolrAdapter(options);
        this.sdocDataStore.setAdapter('http', httpAdapter, '', {});
        this.setAppState(AppState.Ready);
    }

    initBackendData() {
        const options = {
            basePath: this.appConfig.backendApiBaseUrl
        };
        const sdocAdapter = new SDocHttpAdapter(options);
        this.sdocDataStore.setAdapter('http', sdocAdapter, '', {});
        const pdocAdapter = new PDocHttpAdapter(options);
        this.pdocDataStore.setAdapter('http', pdocAdapter, '', {});

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
}
