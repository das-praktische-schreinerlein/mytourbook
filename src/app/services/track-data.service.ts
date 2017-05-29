import {Injectable} from '@angular/core';
import {TrackRecord, TrackRecordRelation} from '../model/records/track-record';
import {GenericDataStore} from './generic-data.store';
import {Observable} from 'rxjs/Rx';
import {TrackRecordSchema} from '../model/schemas/track-record-schema';
import {ImageRecord, ImageRecordRelation} from '../model/records/image-record';
import {ImageRecordSchema} from '../model/schemas/image-record-schema';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class TrackDataService {
    curTrackList: BehaviorSubject<TrackRecord[]>;
    dataStore: GenericDataStore = new GenericDataStore();

    constructor(dataStore: GenericDataStore) {
        this.dataStore = dataStore;
        this.dataStore.defineMapper('track', TrackRecord, TrackRecordSchema, TrackRecordRelation);
        this.dataStore.defineMapper('image', ImageRecord, ImageRecordSchema, ImageRecordRelation);
        this.curTrackList = <BehaviorSubject<TrackRecord[]>>new BehaviorSubject([]);
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
        Observable.fromPromise(this.dataStore.findAll('track', null, {
            limit: -1,
            offset: 0,
            // We want the newest posts first
            orderBy: [['created_at', 'desc']]
        })).subscribe(tracks => {
                console.log('ngOnInit update tracks', tracks);
                const bla: TrackRecord[] = <TrackRecord[]>tracks;
                this.curTrackList.next(bla);
            },
            error => {
                console.error('getAllTracks failed:' + error);
            },
            () => {
            });

        return this.curTrackList.asObservable();
    }

    // Simulate GET /tracks/:id
    getTrackById(id: number): Observable<TrackRecord> {
        return Observable.fromPromise(this.dataStore.find('track', id));
    }


}
