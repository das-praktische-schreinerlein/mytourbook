import {Injectable} from '@angular/core';
import {TrackDataService} from './track-data.service';
import {TrackSolrAdapter} from './track-solr.adapter';
import {Http, Jsonp} from '@angular/http';
import {TrackDataStore} from './track-data.store';

@Injectable()
export class AppService {
    constructor(private trackDataService: TrackDataService, private trackDataStore: TrackDataStore,
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
        const httpAdapter = new TrackSolrAdapter(options, this.jsonp);
        this.trackDataStore.setAdapter('http', httpAdapter, '', {});
    }

    initStaticData() {
        this.http.request('./assets/tracks.json').subscribe(
            res => {
                const tracks: any[] = res.json().tracks;
                this.trackDataService.addTracks(tracks).subscribe(
                    tracksRecords => {
                        console.log('loaded tracks from assets', tracksRecords);
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
