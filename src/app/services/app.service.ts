import {Injectable} from '@angular/core';
import {SDocDataService} from './sdoc-data.service';
import {SDocSolrAdapter} from './sdoc-solr.adapter';
import {Http, Jsonp} from '@angular/http';
import {SDocDataStore} from './sdoc-data.store';
import {environment} from '../../environments/environment';
import {SDocRecord} from '../model/records/sdoc-record';

@Injectable()
export class AppService {
    constructor(private sdocDataService: SDocDataService, private sdocDataStore: SDocDataStore,
                private http: Http, private jsonp: Jsonp) {
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
    }

    initStaticData() {
        const me = this;
        this.http.request('./assets/sdocs.json').subscribe(
            res => {
                const sdocs: any[] = res.json().sdocs;
                this.sdocDataService.addMany(sdocs).then(function doneAddMany(sdocsRecords: SDocRecord[]) {
                        console.log('loaded sdocs from assets', sdocsRecords);
                        me.sdocDataService.getAll();
                    },
                    function errorCreate(reason: any) {
                        console.error('loading appdata failed:' + reason);
                    }
                );
            },
            error => {
                console.error('loading appdata failed:' + error);
            });
    }
}
