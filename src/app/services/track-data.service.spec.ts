/* tslint:disable:no-unused-variable */
import {getTestBed, TestBed} from '@angular/core/testing';
import {TrackRecord} from '../model/records/track-record';
import {TrackDataService} from './track-data.service';

describe('TrackDataService', () => {
    let track1: TrackRecord = undefined;
    let track2: TrackRecord = undefined;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TrackDataService]
        });

        track1 = new TrackRecord({desc: '', name: 'Testtrack1', persons: '', id: 1});
        track2 = new TrackRecord({desc: '', name: 'Testtrack2', persons: '', id: 2});
    });

    it('should ...', done => {
        // GIVEN
        const service: TrackDataService = getTestBed().get(TrackDataService);

        // WHEN/THEN
        expect(service).toBeTruthy();
        done();
    });

    describe('#getAllTracks()', () => {
        it('should return an empty array by default', done => {
            // GIVEN
            const service: TrackDataService = getTestBed().get(TrackDataService);

            // WHEN
            service.getAllTracks().then(function (tracks) {
                // THEN
                expect(tracks).toEqual([]);
                done();
            }).catch(error => {
                expect(error).toBeUndefined();
                done();
            });
        });

        it('should return all tracks', done => {
            // GIVEN
            const service: TrackDataService = getTestBed().get(TrackDataService);
            service.addTracks([track1, track2]).then(function () {
                // WHEN
                return service.getAllTracks();
            }).then(function (tracks) {
                // THEN
                expect(tracks.toString()).toEqual([track1, track2].toString());
                done();
            }).catch(error => {
                expect(error).toBeUndefined();
                done();
            });
        });
    });

    describe('#save(track)', () => {

        it('should automatically assign an incrementing id', done => {
            // GIVEN
            const service: TrackDataService = getTestBed().get(TrackDataService);
            service.addTracks([track1, track2]).then(function () {
                // WHEN)
                return service.getTrackById(1);
            }).then(function (track) {
                // THEN
                expect(track.toString()).toEqual(track1.toString());

                // WHEN)
                return service.getTrackById(2);
            }).then(function (track) {
                // THEN
                expect(track.toString()).toEqual(track2.toString());
                done();
            }).catch(error => {
                expect(error).toBeUndefined();
                done();
            });
        });

    });

    describe('#deleteTrackById(id)', () => {

        it('should remove track with the corresponding id', done => {
            const service: TrackDataService = getTestBed().get(TrackDataService);
            service.addTracks([track1, track2]).then(function () {
                // WHEN
                return service.getAllTracks();
            }).then(function (tracks) {
                // THEN
                expect(tracks.toString()).toEqual([track1, track2].toString());

                // WHEN
                return service.deleteTrackById(1);
            }).then(function () {
                return service.getAllTracks();
            }).then(function (tracks) {
                // THEN
                expect(tracks.toString()).toEqual([track2].toString());

                // WHEN
                return service.deleteTrackById(2);
            }).then(function () {
                return service.getAllTracks();
            }).then(function (tracks) {
                // THEN
                expect(tracks.toString()).toEqual([].toString());
                done();
            }).catch(error => {
                expect(error).toBeUndefined();
                done();
            });
        });

        it('should not removing anything if track with corresponding id is not found', done => {
            const service: TrackDataService = getTestBed().get(TrackDataService);
            service.addTracks([track1, track2]).then(function () {
                // WHEN
                return service.getAllTracks();
            }).then(function (tracks) {
                // THEN
                expect(tracks.toString()).toEqual([track1, track2].toString());

                // WHEN
                return service.deleteTrackById(3);
            }).then(function () {
                return service.getAllTracks();
            }).then(function (tracks) {
                // THEN
                expect(tracks.toString()).toEqual([track1, track2].toString());
                done();
            }).catch(error => {
                expect(error).toBeUndefined();
                done();
            });
        });

    });

    describe('#updateTrackById(id, values)', () => {

        it('should return track with the corresponding id and updated data', done => {
            const service: TrackDataService = getTestBed().get(TrackDataService);
            service.addTracks([track1, track2]).then(function () {
                // WHEN
                return service.getAllTracks();
            }).then(function (tracks) {
                // THEN
                expect(tracks.toString()).toEqual([track1, track2].toString());

                // WHEN
                return service.updateTrackById(1, {
                    name: 'new name'
                });
            }).then(function (updatedTrack: TrackRecord) {
                // THEN
                expect(updatedTrack.name).toEqual('new name');

                // WHEN
                return service.getTrackById(1);
            }).then(function (track: TrackRecord) {
                // THEN
                expect(track.name).toEqual('new name');
                done();
            }).catch(error => {
                expect(error).toBeUndefined();
                done();
            });
        });

        it('should return null if track is not found', done => {
            const service: TrackDataService = getTestBed().get(TrackDataService);
            service.addTracks([track1, track2]).then(function () {
                // WHEN
                return service.getAllTracks();
            }).then(function (tracks) {
                // THEN
                expect(tracks.toString()).toEqual([track1, track2].toString());

                // WHEN
                return service.updateTrackById(26, {
                    name: 'new name'
                });
            }).then(function (updatedTrack: TrackRecord) {
                // THEN
                expect(updatedTrack).toEqual(null);

                // WHEN
                return service.getTrackById(3);
            }).then(function (track: TrackRecord) {
                // THEN
                expect(track).toEqual(undefined);
                done();
            }).catch(error => {
                expect(error).toBeUndefined();
                done();
            });
        });
    });
});
