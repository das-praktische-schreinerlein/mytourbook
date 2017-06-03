import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrackRecord} from '../../../model/records/track-record';
import {TrackDataService} from '../../../services/track-data.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-track-createpage',
    templateUrl: './track-createpage.component.html',
    styleUrls: ['./track-createpage.component.css']
})
export class TrackCreatepageComponent implements OnInit, OnDestroy {
    public track: TrackRecord;

    constructor(private trackDataService: TrackDataService, private router: Router) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    onCreateTrack(values: {}) {
        this.track = this.trackDataService.createRecord(values, undefined);
        this.track.id = this.trackDataService.generateNewId();
        this.trackDataService.addTrack(this.track).subscribe(
            track => {
                this.router.navigateByUrl('/track/list');
            },
            error => {
            },
            () => {
            }
        );
    }
}
