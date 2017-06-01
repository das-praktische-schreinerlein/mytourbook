import {Injectable} from '@angular/core';
import {TrackRecord, TrackRecordRelation} from '../model/records/track-record';
import {GenericDataStore} from './generic-data.store';
import {Observable} from 'rxjs/Rx';
import {TrackRecordSchema} from '../model/schemas/track-record-schema';
import {ImageRecord, ImageRecordRelation} from '../model/records/image-record';
import {ImageRecordSchema} from '../model/schemas/image-record-schema';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TrackDataStore} from './track-data.store';
import {TrackSearchForm} from '../model/forms/track-searchform';
import {TrackSearchResult} from '../model/container/track-searchresult';

@Injectable()
export class TrackDataService {
    curTrackList: BehaviorSubject<TrackSearchResult>;
    dataStore: GenericDataStore;

    constructor(dataStore: TrackDataStore) {
        this.dataStore = dataStore;
        this.dataStore.defineMapper('track', TrackRecord, TrackRecordSchema, TrackRecordRelation);
        this.dataStore.defineMapper('image', ImageRecord, ImageRecordSchema, ImageRecordRelation);
        this.curTrackList = <BehaviorSubject<TrackSearchResult>>new BehaviorSubject(new TrackSearchResult(new TrackSearchForm({}), 0, []));
    }

    generateNewId(): number {
        return (new Date()).getTime();
    }

    createRecord(props, opts): TrackRecord {
        return <TrackRecord>this.dataStore.createRecord('track', props, opts);
    }

    // Simulate POST /tracks
    addTrack(track: TrackRecord): Observable<TrackRecord> {
        return Observable.fromPromise(this.dataStore.create('track', track));
    }

    // Simulate POST /tracks
    addTracks(tracks: TrackRecord[]): Observable<TrackRecord[]> {
        return Observable.fromPromise(this.dataStore.createMany('track', tracks));
    }

    // Simulate DELETE /tracks/:id
    deleteTrackById(id: number): Observable<TrackRecord> {
        return Observable.fromPromise(this.dataStore.destroy('track', id));
    }

    // Simulate PUT /tracks/:id
    updateTrackById(id: number, values: Object = {}): Observable<TrackRecord> {
        return Observable.fromPromise(this.dataStore.update('track', id, values));
    }

    // Simulate GET /tracks
    getAllTracks(): Observable<TrackRecord[]> {
        return this.findCurTrackList(new TrackSearchForm({ pageNum: 1, perPage: -1}));
    }

    // Simulate GET /tracks
    findCurTrackList(trackSearchForm: TrackSearchForm): Observable<TrackRecord[]> {
        const query = {};

        if (trackSearchForm === undefined) {
            trackSearchForm = new TrackSearchForm({});
        }
        if (trackSearchForm.fulltext !== undefined && trackSearchForm.fulltext.length > 0) {
            query['where'] = {
                name: {
                    'likei': '%' + trackSearchForm.fulltext + '%'
                }
            };
        }

        const trackSearchResult = new TrackSearchResult(trackSearchForm, 0, []);

        const result: Observable<TrackRecord[]> = Observable.fromPromise(this.dataStore.findAll('track', query, {
            limit: trackSearchForm.perPage,
            offset: trackSearchForm.pageNum - 1,
            // We want the newest posts first
            orderBy: [['created_at', 'desc']]
        }));
        result.subscribe(tracks => {
                console.log('getAllTracks tracks', tracks);
                trackSearchResult.currentRecords = tracks;
                this.curTrackList.next(trackSearchResult);
            },
            error => {
                console.error('getAllTracks failed:' + error);
            },
            () => {
            });

        const countResult = Observable.fromPromise(this.dataStore.count('track', query, {
            limit: trackSearchForm.perPage,
            offset: trackSearchForm.pageNum - 1,
            // We want the newest posts first
            orderBy: [['created_at', 'desc']]
        }));
        countResult.subscribe(count => {
                console.log('count tracks', count);
                trackSearchResult.recordCount = count;
                this.curTrackList.next(trackSearchResult);
            },
            error => {
                console.error('count failed:' + error);
            },
            () => {
            }
        );

        return result;
    }

    // Simulate GET /tracks/:id
    getTrackById(id: number): Observable<TrackRecord> {
        return Observable.fromPromise(this.dataStore.find('track', id));
    }

    getCurTrackList(): Observable<TrackSearchResult> {
        return this.curTrackList.asObservable();
    }
}
