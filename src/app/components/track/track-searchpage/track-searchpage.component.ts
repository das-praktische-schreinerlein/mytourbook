import {Component, OnInit} from '@angular/core';
import {TrackDataService} from '../../../services/track-data.service';
import {TrackRecord} from '../../../model/records/track-record';
import {Router} from '@angular/router';
import {AppService} from '../../../services/app.service';

@Component({
    selector: 'app-track-searchpage',
    templateUrl: './track-searchpage.component.html',
    styleUrls: ['./track-searchpage.component.css']
})
export class TrackSearchpageComponent implements OnInit {
    tracks: TrackRecord[];

    constructor(private appService: AppService, private trackDataService: TrackDataService, private router: Router) {
    }

    ngOnInit() {
        this.initData();
    }

    onEditTrack(track: TrackRecord) {
        this.router.navigateByUrl('/track/edit/' + track.id);
    }

    private initData() {
        const getTracks = this.trackDataService.getAllTracks();
        getTracks.subscribe(
            tracks => {
                console.log('ngOnInit update tracks', tracks);
                this.tracks = tracks;
            },
            error => {
                console.error('getAllTracks failed:' + error);
            },
            () => {
            }
        );
    }
}
