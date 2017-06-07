import {Injectable} from '@angular/core';
import {SDocDataService} from './sdoc-data.service';
import {SDocSolrAdapter} from './sdoc-solr.adapter';
import {Http, Jsonp} from '@angular/http';
import {SDocDataStore} from './sdoc-data.store';

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
            basePath: 'http://192.168.99.100:8983/solr/mat/',
            suffix: '&wt=json&indent=on&datatype=jsonp&json.wrf=JSONP_CALLBACK&callback=JSONP_CALLBACK&',
        };
        const httpAdapter = new SDocSolrAdapter(options, this.jsonp);
        this.sdocDataStore.setAdapter('http', httpAdapter, '', {});
    }

    initStaticData() {
        this.http.request('./assets/sdocs.json').subscribe(
            res => {
                const sdocs: any[] = res.json().sdocs;
                this.sdocDataService.addMany(sdocs).subscribe(
                    sdocsRecords => {
                        console.log('loaded sdocs from assets', sdocsRecords);
                        this.sdocDataService.getAll();
                    },
                    error => {
                        console.error('parsing appdata failed:' + error);
                    });
            },
            error => {
                console.error('loading appdata failed:' + error);
            });
    }
}
