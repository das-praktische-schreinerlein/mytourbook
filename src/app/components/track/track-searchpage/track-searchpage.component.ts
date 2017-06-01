import {Component, OnInit} from '@angular/core';
import {TrackDataService} from '../../../services/track-data.service';
import {TrackRecord} from '../../../model/records/track-record';
import {Router} from '@angular/router';
import {TrackSearchForm} from '../../../model/forms/track-searchform';
import {TrackSearchResult} from '../../../model/container/track-searchresult';

@Component({
    selector: 'app-track-searchpage',
    templateUrl: './track-searchpage.component.html',
    styleUrls: ['./track-searchpage.component.css']
})
export class TrackSearchpageComponent implements OnInit {
    trackSearchResult: TrackSearchResult;
    trackSearchForm: TrackSearchForm = new TrackSearchForm({});

    constructor(private trackDataService: TrackDataService, private router: Router) {
    }

    ngOnInit() {
        this.initData();
    }

    onEditTrack(track: TrackRecord) {
        this.router.navigateByUrl('/track/edit/' + track.id);
    }

    onDeleteTrack(track: TrackRecord) {
        if (window.confirm('Track wirklich löschen?')) {
            this.trackDataService.deleteTrackById(track.id).subscribe(
                () => {
                    console.log('Track deleted', track);
                    this.trackDataService.findCurTrackList(this.trackSearchForm);
                },
                error => {
                    console.error('deleteTrackById failed:' + error);
                },
                () => {
                }
            );
        }
    }

    onPageChange(page: number) {
        this.trackSearchForm.pageNum = page;
        this.trackDataService.findCurTrackList(this.trackSearchForm);
    }

    onSearchTrack(trackSearchForm: TrackSearchForm) {
        this.trackDataService.findCurTrackList(trackSearchForm);
    }

    private initData() {
        this.trackDataService.findCurTrackList(this.trackSearchForm);
        const getTracks = this.trackDataService.getCurTrackList();
        getTracks.subscribe(
            trackSearchResult => {
                console.log('ngOnInit update trackSearchResult', trackSearchResult);
                this.trackSearchResult = trackSearchResult;
            },
            error => {
                console.error('getCurTrackList failed:' + error);
            },
            () => {
            }
        );
    }
}
