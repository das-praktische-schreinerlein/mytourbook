/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {Track} from '../model/track';
import {TrackDataService} from './track-data.service';

describe('TrackDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackDataService]
    });
  });

  it('should ...', inject([TrackDataService], (service: TrackDataService) => {
    expect(service).toBeTruthy();
  }));

  describe('#getAllTracks()', () => {

    it('should return an empty array by default', inject([TrackDataService], (service: TrackDataService) => {
      expect(service.getAllTracks()).toEqual([]);
    }));

    it('should return all tracks', inject([TrackDataService], (service: TrackDataService) => {
      const track1 = new Track({desc: '', name: 'Testtrack1', persons: '', id: 1 });
      const track2 = new Track({ desc: '', name: 'Testtrack2', persons: '', id: 2 });
      service.addTrack(track1);
      service.addTrack(track2);
      expect(service.getAllTracks()).toEqual([track1, track2]);
    }));

  });

  describe('#save(track)', () => {

    it('should automatically assign an incrementing id', inject([TrackDataService], (service: TrackDataService) => {
      const track1 = new Track({ desc: '', name: 'Testtrack1', persons: '', id: 1 });
      const track2 = new Track({ desc: '', name: 'Testtrack2', persons: '', id: 2 });
      service.addTrack(track1);
      service.addTrack(track2);
      expect(service.getTrackById(1)).toEqual(track1);
      expect(service.getTrackById(2)).toEqual(track2);
    }));

  });

  describe('#deleteTrackById(id)', () => {

    it('should remove track with the corresponding id', inject([TrackDataService], (service: TrackDataService) => {
      const track1 = new Track({ desc: '', name: 'Testtrack1', persons: '', id: 1 });
      const track2 = new Track({ desc: '', name: 'Testtrack2', persons: '', id: 2 });
      service.addTrack(track1);
      service.addTrack(track2);
      expect(service.getAllTracks()).toEqual([track1, track2]);
      service.deleteTrackById(1);
      expect(service.getAllTracks()).toEqual([track2]);
      service.deleteTrackById(2);
      expect(service.getAllTracks()).toEqual([]);
    }));

    it('should not removing anything if track with corresponding id is not found', inject([TrackDataService], (service: TrackDataService) => {
      const track1 = new Track({ desc: '', name: 'Testtrack1', persons: '', id: 1 });
      const track2 = new Track({ desc: '', name: 'Testtrack2', persons: '', id: 2 });
      service.addTrack(track1);
      service.addTrack(track2);
      expect(service.getAllTracks()).toEqual([track1, track2]);
      service.deleteTrackById(3);
      expect(service.getAllTracks()).toEqual([track1, track2]);
    }));

  });

  describe('#updateTrackById(id, values)', () => {

    it('should return track with the corresponding id and updated data', inject([TrackDataService], (service: TrackDataService) => {
      const track = new Track({ desc: '', name: 'Testtrack1', persons: '', id: 1 });
      service.addTrack(track);
      const updatedTrack = service.updateTrackById(1, {
        name: 'new name'
      });
      expect(updatedTrack.name).toEqual('new name');
    }));

    it('should return null if track is not found', inject([TrackDataService], (service: TrackDataService) => {
      const track = new Track({ desc: '', name: 'Testtrack1', persons: '', id: 1 });
      service.addTrack(track);
      const updatedTrack = service.updateTrackById(2, {
        name: 'new name'
      });
      expect(updatedTrack).toEqual(null);
    }));

  });
});
