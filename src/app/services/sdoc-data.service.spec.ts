/* tslint:disable:no-unused-variable */
import {getTestBed, TestBed} from '@angular/core/testing';
import {SDocRecord} from '../model/records/sdoc-record';
import {SDocDataService} from './sdoc-data.service';
import {Observable} from 'rxjs';
import {SDocDataStore} from './sdoc-data.store';

describe('SDocDataService', () => {
    let sdoc1: SDocRecord = undefined;
    let sdoc2: SDocRecord = undefined;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SDocDataStore,
                SDocDataService
            ]
        });

        sdoc1 = new SDocRecord({desc: '', name: 'Testsdoc1', persons: '', id: '1'});
        sdoc2 = new SDocRecord({desc: '', name: 'Testsdoc2', persons: '', id: '2'});
    });

    it('should ...', done => {
        // GIVEN
        const service: SDocDataService = getTestBed().get(SDocDataService);

        // WHEN/THEN
        expect(service).toBeTruthy();
        done();
    });

    describe('#getAll()', () => {
        it('should return an empty array by default', done => {
            // GIVEN
            const service: SDocDataService = getTestBed().get(SDocDataService);

            // WHEN
            service.getAll().subscribe(
                sdocs => {
                    // THEN
                    expect(sdocs).toEqual([]);
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

        it('should return all sdocs', done => {
            // GIVEN
            const service: SDocDataService = getTestBed().get(SDocDataService);
            Observable.forkJoin(
                service.addMany([sdoc1, sdoc2]),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add SDocs
                    expect(results[0].toString()).toEqual([sdoc1, sdoc2].toString());
                    // THEN: get SDocs
                    expect(results[1].toString()).toEqual([sdoc1, sdoc2].toString());
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
    describe('#save(record)', () => {

        it('should automatically assign an incrementing id', done => {
            // GIVEN
            const service: SDocDataService = getTestBed().get(SDocDataService);

            Observable.forkJoin(
                service.addMany([sdoc1, sdoc2]),
                service.getById(1),
                service.getById(2)
            ).subscribe(
                results => {
                    // THEN: add SDocs
                    expect(results[0].toString()).toEqual([sdoc1, sdoc2].toString());
                    // THEN: get SDocs
                    expect(results[1].toString()).toEqual(sdoc1.toString());
                    expect(results[2].toString()).toEqual(sdoc2.toString());
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

    describe('#deleteById(id)', () => {

        it('should remove record with the corresponding id', done => {
            const service: SDocDataService = getTestBed().get(SDocDataService);
            Observable.forkJoin(
                service.addMany([sdoc1, sdoc2]),
                service.getAll(),
                service.deleteById('1'),
                service.getAll(),
                service.deleteById('2'),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add SDocs
                    expect(results[0].toString()).toEqual([sdoc1, sdoc2].toString());
                    expect(results[1].toString()).toEqual([sdoc1, sdoc2].toString());
                    // THEN: get SDocs
                    expect(results[2]).toEqual(sdoc1);
                    expect(results[3].toString()).toEqual([sdoc2].toString());
                    expect(results[4]).toEqual(sdoc2);
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

        it('should not removing anything if record with corresponding id is not found', done => {
            const service: SDocDataService = getTestBed().get(SDocDataService);
            Observable.forkJoin(
                service.addMany([sdoc1, sdoc2]),
                service.getAll(),
                service.deleteById('3'),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add SDocs
                    expect(results[0].toString()).toEqual([sdoc1, sdoc2].toString());
                    expect(results[1].toString()).toEqual([sdoc1, sdoc2].toString());
                    // THEN: get SDocs
                    expect(results[2]).toEqual(undefined);
                    expect(results[3].toString()).toEqual([sdoc1, sdoc2].toString());
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
    describe('#updateById(id, values)', () => {

        it('should return record with the corresponding id and updated data', done => {
            const service: SDocDataService = getTestBed().get(SDocDataService);
            Observable.forkJoin(
                service.addMany([sdoc1, sdoc2]),
                service.getAll(),
                service.updateById('1', {
                    name: 'new name'
                }),
                service.getById(1)
            ).subscribe(
                results => {
                    // THEN: add SDocs
                    expect(results[0].toString()).toEqual([sdoc1, sdoc2].toString());
                    expect(results[1].toString()).toEqual([sdoc1, sdoc2].toString());
                    // THEN: get SDocs
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

        it('should return null if record is not found', done => {
            const service: SDocDataService = getTestBed().get(SDocDataService);
            Observable.forkJoin(
                service.addMany([sdoc1, sdoc2]),
                service.getAll(),
                service.updateById('26', {
                    name: 'new name'
                }),
                service.getById(26)
            ).subscribe(
                results => {
                    // THEN: add SDocs
                    expect(results[0].toString()).toEqual([sdoc1, sdoc2].toString());
                    expect(results[1].toString()).toEqual([sdoc1, sdoc2].toString());
                    // THEN: get SDocs
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
