import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrackRecord} from '../../../model/records/track-record';
import {TrackDataService} from '../../../services/track-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-track-editpage',
    templateUrl: './track-editpage.component.html',
    styleUrls: ['./track-editpage.component.css']
})
export class TrackEditpageComponent implements OnInit, OnDestroy {
    private routeSubscription: Subscription;
    public track: TrackRecord;

    constructor(private trackDataService: TrackDataService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        // Subscribe to route params
        this.routeSubscription = this.route.params.subscribe(params => {
            const trackId = params['trackId'];
            this.trackDataService.getTrackById(trackId).subscribe(
                track => {
                    this.track = track;
                },
                error => {
                },
                () => {
                }
            );
        });
    }

    ngOnDestroy() {
        // Clean sub to avoid memory leak
        this.routeSubscription.unsubscribe();
    }

    onSaveTrack(values: {}) {
        this.trackDataService.updateTrackById(values['id'], values).subscribe(
            track => {
                this.router.navigateByUrl('/track/list');
            },
            error => {
                console.error('updateTrackById failed:' + error);
            },
            () => {
            }
        );
    }
}
