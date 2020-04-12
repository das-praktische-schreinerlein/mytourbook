/* tslint:disable:no-unused-variable */
import {TourDocRecord} from '../model/records/tdoc-record';
import {TourDocDataService} from './tdoc-data.service';
import {from, forkJoin} from 'rxjs';
import {TourDocDataStore, TourDocTeamFilterConfig} from './tdoc-data.store';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';

describe('TourDocDataService', () => {
    let tdoc1: TourDocRecord = undefined;
    let tdoc2: TourDocRecord = undefined;
    let service: TourDocDataService;
    let datastore: TourDocDataStore;

    beforeEach(() => {
        datastore = new TourDocDataStore(new SearchParameterUtils(), new TourDocTeamFilterConfig());
        service = new TourDocDataService(datastore);
        service.setWritable(true);
        tdoc1 = new TourDocRecord({desc: '', name: 'Testtdoc1', persons: '', id: '1', type: 'image', subtype: '5'});
        tdoc2 = new TourDocRecord({desc: '', name: 'Testtdoc2', persons: '', id: '2', type: 'image', subtype: '5'});
    });

    it('should ...', done => {
        // WHEN/THEN
        expect(service).toBeTruthy();
        done();
    });

    describe('#getAll()', () => {
        it('should return an empty array by default', done => {
            // WHEN
            from(service.getAll()).subscribe(
                tdocs => {
                    // THEN
                    expect(tdocs).toEqual([]);
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

        it('should return all tdocs', done => {
            // GIVEN
            forkJoin(
                service.addMany([tdoc1, tdoc2]),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add TourDocs
                    expect(results[0].toString()).toEqual([tdoc1, tdoc2].toString());
                    // THEN: get TourDocs
                    expect(results[1].toString()).toEqual([tdoc1, tdoc2].toString());
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
            forkJoin(
                service.addMany([tdoc1, tdoc2]),
                service.getById('1'),
                service.getById('2')
            ).subscribe(
                results => {
                    // THEN: add TourDocs
                    expect(results[0].toString()).toEqual([tdoc1, tdoc2].toString());
                    // THEN: get TourDocs
                    expect(results[1].toString()).toEqual(tdoc1.toString());
                    expect(results[2].toString()).toEqual(tdoc2.toString());
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
            forkJoin(
                service.addMany([tdoc1, tdoc2]),
                service.getAll(),
                service.deleteById('1'),
                service.getAll(),
                service.deleteById('2'),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add TourDocs
                    expect(results[0].toString()).toEqual([tdoc1, tdoc2].toString());
                    expect(results[1].toString()).toEqual([tdoc1, tdoc2].toString());
                    // THEN: get TourDocs
                    expect(results[2]).toEqual(tdoc1);
                    expect(results[3].toString()).toEqual([tdoc2].toString());
                    expect(results[4]).toEqual(tdoc2);
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
            forkJoin(
                service.addMany([tdoc1, tdoc2]),
                service.getAll(),
                service.deleteById('3'),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add TourDocs
                    expect(results[0].toString()).toEqual([tdoc1, tdoc2].toString());
                    expect(results[1].toString()).toEqual([tdoc1, tdoc2].toString());
                    // THEN: get TourDocs
                    expect(results[2]).toEqual(undefined);
                    expect(results[3].toString()).toEqual([tdoc1, tdoc2].toString());
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
            forkJoin(
                service.addMany([tdoc1, tdoc2]),
                service.getAll(),
                service.updateById('1', {
                    id: '1', name: 'new name', type: 'image', subtype: '5'
                }),
                service.getById('1')
            ).subscribe(
                results => {
                    // THEN: add TourDocs
                    expect(results[0].toString()).toEqual([tdoc1, tdoc2].toString());
                    expect(results[1].toString()).toEqual([tdoc1, tdoc2].toString());
                    // THEN: get TourDocs
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
            forkJoin(
                service.addMany([tdoc1, tdoc2]),
                service.getAll(),
                service.updateById('26', {
                    id: '26', name: 'new name', type: 'image', subtype: '5'
                }),
                service.getById('26')
            ).subscribe(
                results => {
                    // THEN: add TourDocs
                    expect(results[0].toString()).toEqual([tdoc1, tdoc2].toString());
                    expect(results[1].toString()).toEqual([tdoc1, tdoc2].toString());
                    // THEN: get TourDocs
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
