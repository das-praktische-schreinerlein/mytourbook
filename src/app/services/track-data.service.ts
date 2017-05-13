import {Injectable} from '@angular/core';
import {Track} from '../model/track';

@Injectable()
export class TrackDataService {
  // Placeholder for last id so we can simulate
  // automatic incrementing of id's
  lastId: number = 3;

  // Placeholder for track's
  tracks: Track[] = [
  ];

  constructor() {
  }

  // Simulate POST /tracks
  addTrack(track: Track): TrackDataService {
    if (!track.id) {
      track.id = ++this.lastId;
    }
    this.tracks.push(track);
    return this;
  }

  // Simulate DELETE /tracks/:id
  deleteTrackById(id: number): TrackDataService {
    this.tracks = this.tracks
      .filter(track => track.id != id);
    return this;
  }

  // Simulate PUT /tracks/:id
  updateTrackById(id: number, values: Object = {}): Track {
    const track = this.getTrackById(id);
    if (!track) {
      return null;
    }
    Object.assign(track, values);
    return track;
  }

  // Simulate GET /tracks
  getAllTracks(): Track[] {
    return this.tracks;
  }

  // Simulate GET /tracks/:id
  getTrackById(id: number): Track {
    return this.tracks.filter(track => track.id == id).pop();
  }
}
