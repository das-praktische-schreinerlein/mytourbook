import {Injectable} from '@angular/core';
import {TrackRecord} from '../model/records/track-record';
import {TrackDataStore} from './track-data.store';

@Injectable()
export class TrackDataService {
    trackDataStore: TrackDataStore = new TrackDataStore();

    constructor() {
    }

    createRecord(props, opts): TrackRecord {
      return this.trackDataStore.createRecord('track', props, opts);
    }

    // Simulate POST /tracks
    addTrack(track: TrackRecord): Promise<TrackRecord> {
      return this.trackDataStore.create('track', track);
    }

    // Simulate POST /tracks
    addTracks(tracks: TrackRecord[]): Promise<TrackRecord[]> {
        return this.trackDataStore.createMany('track', tracks);
    }

    // Simulate DELETE /tracks/:id
    deleteTrackById(id: number): Promise<TrackRecord> {
        return this.trackDataStore.destroy('track', id);
    }

    // Simulate PUT /tracks/:id
    updateTrackById(id: number, values: Object = {}): Promise<TrackRecord> {
        return this.trackDataStore.update('track', id, values);
    }

    // Simulate GET /tracks
    getAllTracks(): Promise<TrackRecord[]> {
        return this.trackDataStore.findAll('track', null, {
            limit: -1,
            offset: 0,
            // We want the newest posts first
            orderBy: [['created_at', 'desc']]
        });
    }

    // Simulate GET /tracks/:id
    getTrackById(id: number): Promise<TrackRecord> {
        return this.trackDataStore.find('track', id);
    }
}
