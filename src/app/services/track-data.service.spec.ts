/* tslint:disable:no-unused-variable */
import {getTestBed, TestBed} from '@angular/core/testing';
import {TrackRecord} from '../model/records/track-record';
import {TrackDataService} from './track-data.service';
import {Observable} from 'rxjs';
import {TrackDataStore} from './track-data.store';

describe('TrackDataService', () => {
    let track1: TrackRecord = undefined;
    let track2: TrackRecord = undefined;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TrackDataStore,
                TrackDataService
            ]
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
            service.getAllTracks().subscribe(
                tracks => {
                    // THEN
                    expect(tracks).toEqual([]);
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('should return all tracks', done => {
            // GIVEN
            const service: TrackDataService = getTestBed().get(TrackDataService);
            Observable.forkJoin(
                service.addTracks([track1, track2]),
                service.getAllTracks()
            ).subscribe(
                results => {
                    // THEN: add Tracks
                    expect(results[0].toString()).toEqual([track1, track2].toString());
                    // THEN: get Tracks
                    expect(results[1].toString()).toEqual([track1, track2].toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });
    });
    describe('#save(track)', () => {

        it('should automatically assign an incrementing id', done => {
            // GIVEN
            const service: TrackDataService = getTestBed().get(TrackDataService);

            Observable.forkJoin(
                service.addTracks([track1, track2]),
                service.getTrackById(1),
                service.getTrackById(2)
            ).subscribe(
                results => {
                    // THEN: add Tracks
                    expect(results[0].toString()).toEqual([track1, track2].toString());
                    // THEN: get Tracks
                    expect(results[1].toString()).toEqual(track1.toString());
                    expect(results[2].toString()).toEqual(track2.toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

    });

    describe('#deleteTrackById(id)', () => {

        it('should remove track with the corresponding id', done => {
            const service: TrackDataService = getTestBed().get(TrackDataService);
            Observable.forkJoin(
                service.addTracks([track1, track2]),
                service.getAllTracks(),
                service.deleteTrackById(1),
                service.getAllTracks(),
                service.deleteTrackById(2),
                service.getAllTracks()
            ).subscribe(
                results => {
                    // THEN: add Tracks
                    expect(results[0].toString()).toEqual([track1, track2].toString());
                    expect(results[1].toString()).toEqual([track1, track2].toString());
                    // THEN: get Tracks
                    expect(results[2]).toEqual(track1);
                    expect(results[3].toString()).toEqual([track2].toString());
                    expect(results[4]).toEqual(track2);
                    expect(results[5].toString()).toEqual([].toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('should not removing anything if track with corresponding id is not found', done => {
            const service: TrackDataService = getTestBed().get(TrackDataService);
            Observable.forkJoin(
                service.addTracks([track1, track2]),
                service.getAllTracks(),
                service.deleteTrackById(3),
                service.getAllTracks()
            ).subscribe(
                results => {
                    // THEN: add Tracks
                    expect(results[0].toString()).toEqual([track1, track2].toString());
                    expect(results[1].toString()).toEqual([track1, track2].toString());
                    // THEN: get Tracks
                    expect(results[2]).toEqual(undefined);
                    expect(results[3].toString()).toEqual([track1, track2].toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

    });
    describe('#updateTrackById(id, values)', () => {

        it('should return track with the corresponding id and updated data', done => {
            const service: TrackDataService = getTestBed().get(TrackDataService);
            Observable.forkJoin(
                service.addTracks([track1, track2]),
                service.getAllTracks(),
                service.updateTrackById(1, {
                    name: 'new name'
                }),
                service.getTrackById(1)
            ).subscribe(
                results => {
                    // THEN: add Tracks
                    expect(results[0].toString()).toEqual([track1, track2].toString());
                    expect(results[1].toString()).toEqual([track1, track2].toString());
                    // THEN: get Tracks
                    expect(results[2].name).toEqual('new name');
                    expect(results[3].name).toEqual('new name');
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('should return null if track is not found', done => {
            const service: TrackDataService = getTestBed().get(TrackDataService);
            Observable.forkJoin(
                service.addTracks([track1, track2]),
                service.getAllTracks(),
                service.updateTrackById(26, {
                    name: 'new name'
                }),
                service.getTrackById(26)
            ).subscribe(
                results => {
                    // THEN: add Tracks
                    expect(results[0].toString()).toEqual([track1, track2].toString());
                    expect(results[1].toString()).toEqual([track1, track2].toString());
                    // THEN: get Tracks
                    expect(results[2]).toEqual(null);
                    expect(results[3]).toEqual(undefined);
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });
    });
});
