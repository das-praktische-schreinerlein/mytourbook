import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrackDataService} from '../../../services/track-data.service';
import {TrackRecord} from '../../../model/records/track-record';
import {ActivatedRoute, Router, RouterState, UrlSegment} from '@angular/router';
import {TrackSearchForm} from '../../../model/forms/track-searchform';
import {TrackSearchResult} from '../../../model/container/track-searchresult';
import {BehaviorSubject, Subscription} from 'rxjs';

@Component({
    selector: 'app-track-searchpage',
    templateUrl: './track-searchpage.component.html',
    styleUrls: ['./track-searchpage.component.css']
})
export class TrackSearchpageComponent implements OnInit, OnDestroy {
    private initialized = false;
    private routeSubscription: Subscription;
    private routeUrlSubscription: Subscription;
    private curTrackListSubcription: Subscription;

    private trackSearchResult: TrackSearchResult;
    trackSearchResultObervable: BehaviorSubject<TrackSearchResult>;
    private trackSearchForm: TrackSearchForm;
    trackSearchFormObervable: BehaviorSubject<TrackSearchForm>;

    constructor(private trackDataService: TrackDataService, private route: ActivatedRoute, private router: Router) {
        this.trackSearchForm = new TrackSearchForm({});
        this.trackSearchResult = new TrackSearchResult(this.trackSearchForm, 0, []);
        this.trackSearchFormObervable = <BehaviorSubject<TrackSearchForm>>new BehaviorSubject(this.trackSearchForm);
        this.trackSearchResultObervable = <BehaviorSubject<TrackSearchResult>>new BehaviorSubject(this.trackSearchResult);
    }

    ngOnInit() {
        // reset initialized
        this.initialized = false;

        // check for route
        const url = this.router.routerState.snapshot.url;
        if (url === 'tracks' || url === '/tracks') {
            console.log('ngOnInit: redirect for ', url);
            return this.redirectToSearch();
        }

        // do search
        console.log('ngOnInit: search for ', url);
        this.curTrackListSubcription = this.trackDataService.getCurTrackList().subscribe(
            trackSearchResult => {
                if (trackSearchResult === undefined) {
                    console.log('empty trackSearchResult', trackSearchResult);
                } else {
                    console.log('update trackSearchResult', trackSearchResult);
                    this.initialized = true;
                    this.trackSearchResult = trackSearchResult;
                    this.trackSearchResultObervable.next(trackSearchResult);
                    this.trackSearchForm = trackSearchResult.trackSearchForm;
                    this.trackSearchFormObervable.next(this.trackSearchForm);
                }
            },
            error => {
                console.error('getCurTrackList failed:' + error);
            },
            () => {
            });
        this.routeSubscription = this.route.params.subscribe(params => {
            return this.doSearchWithParams(params);
        });
    }

    ngOnDestroy() {
        // Clean sub to avoid memory leak
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
        if (this.routeUrlSubscription) {
            this.routeUrlSubscription.unsubscribe();
        }
        if (this.curTrackListSubcription) {
            this.curTrackListSubcription.unsubscribe();
        }
    }

    onEditTrack(track: TrackRecord) {
        this.router.navigateByUrl('/track/edit/' + track.id);
    }

    onDeleteTrack(track: TrackRecord) {
        if (window.confirm('Track wirklich löschen?')) {
            this.trackDataService.deleteTrackById(track.id).subscribe(
                () => {
                    console.log('Track deleted', track);
                    this.redirectToSearch();
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
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.trackSearchForm.pageNum = +page;
        console.log('onPageChange: redirect to page', page);
        this.redirectToSearch();
    }

    onSearchTrack(trackSearchForm: TrackSearchForm) {
        this.trackSearchForm = trackSearchForm;
        console.log('onSearchTrack: redirect to ', trackSearchForm);
        this.redirectToSearch();
    }

    private redirectToSearch() {
        // reset initialized
        this.initialized = false;

        let url = '/tracks/';
        const params: Object[] = [
            this.trackSearchForm.when || 'jederzeit',
            this.trackSearchForm.where || 'ueberall',
            this.trackSearchForm.what || 'alles',
            this.trackSearchForm.fulltext || 'egal',
            'ungefiltert',
            this.trackSearchForm.sort || 'relevanz',
            +this.trackSearchForm.perPage || 10,
            +this.trackSearchForm.pageNum || 1
        ];
        url += params.join('/');
        console.log('redirectToSearch: redirect to ', url);
        this.router.navigateByUrl(url);
        return;
    }

    private doSearchWithParams(params: any) {
        console.log('doSearchWithParams params:', params);
        this.trackSearchForm.when = (params['when'] || '').replace(/^jederzeit/, '');
        this.trackSearchForm.where = (params['where'] || '').replace(/^ueberall/, '');
        this.trackSearchForm.what = (params['what'] || '').replace(/^alles/, '');
        this.trackSearchForm.fulltext = (params['fulltext'] || '').replace(/^egal$/, '');
        this.trackSearchForm.sort = params['sort'] || '';
        this.trackSearchForm.perPage = +params['perPage'] || 10;
        this.trackSearchForm.pageNum = +params['pageNum'] || 1;
        this.trackDataService.findCurTrackList(this.trackSearchForm);
    }
}
