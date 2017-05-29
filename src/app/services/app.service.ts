import {Injectable} from '@angular/core';
import {TrackDataService} from './track-data.service';
import {Http} from '@angular/http';

@Injectable()
export class AppService {
    constructor(private trackDataService: TrackDataService, private http: Http) {
    }

    initApp() {
        this.http.request('./assets/tracks.json').subscribe(
            res => {
                const tracks: any[] = res.json().tracks;
                this.trackDataService.addTracks(tracks).subscribe(
                    tracksRecords => {
                        console.log('loaded tracks from assets', tracksRecords);
                        this.trackDataService.getAllTracks();
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
