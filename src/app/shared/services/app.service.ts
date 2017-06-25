import {Injectable} from '@angular/core';
import {SDocDataService} from '../../sdocshared/services/sdoc-data.service';
import {SDocSolrAdapter} from '../../sdocbackend/services/sdoc-solr.adapter';
import {Http, Jsonp} from '@angular/http';
import {SDocDataStore} from '../../sdocbackend/services/sdoc-data.store';
import {environment} from '../../../environments/environment';
import {SDocRecord} from '../../sdocshared/model/records/sdoc-record';
import {AppState, GenericAppService} from '../../../commons/services/generic-app.service';

@Injectable()
export class AppService extends GenericAppService {
    constructor(private sdocDataService: SDocDataService, private sdocDataStore: SDocDataStore,
                private http: Http, private jsonp: Jsonp) {
        super();
    }

    initApp(): void {
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
}
