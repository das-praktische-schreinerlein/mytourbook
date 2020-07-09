/* tslint:disable:no-unused-variable */
import {TourDocRecord} from '../model/records/tdoc-record';
import {TourDocDataService} from './tdoc-data.service';
import {Observable} from 'rxjs/Observable';
import {TourDocDataStore, TourDocTeamFilterConfig} from './tdoc-data.store';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/forkJoin';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {TourDocSqlMytbDbAdapter} from './tdoc-sql-mytbdb.adapter';
import {TestHelper} from '@dps/mycms-commons/dist/testing/test-helper';

describe('TourDocDataService', () => {
    let tdoc1: TourDocRecord = undefined;
    let tdoc2: TourDocRecord = undefined;
    let service: TourDocDataService;
    let datastore: TourDocDataStore;
    let knex;

    function addSqliteAdapter() {
        const options = {
            knexOpts: {
                'client': 'sqlite3',
                'connection': {
                    'filename': ':memory:'
                }
            },
            mapperConfig: {
                'allowedKeywordPatterns': ['KW_.*', 'TODO.*', 'Harry', 'Booga', 'Buddy', 'Micha', '.*'],
                'replaceKeywordPatterns': []
            }
        };
        knex = TestHelper.createKnex(options.knexOpts.client, []);
        const adapter = new TourDocSqlMytbDbAdapter(options, { active : false, entities: {}});
        adapter['knex'] = knex;
        datastore.setAdapter('http', adapter, '', {});

        return knex;
    }

    beforeEach(() => {
        datastore = new TourDocDataStore(new SearchParameterUtils(), new TourDocTeamFilterConfig());
        service = new TourDocDataService(datastore);
        service.setWritable(true);
        tdoc1 = new TourDocRecord({desc: '', name: 'Testtdoc1', persons: '', id: '1', type: 'image', subtype: '5'});
        tdoc2 = new TourDocRecord({desc: '', name: 'Testtdoc2', persons: '', id: '2', type: 'image', subtype: '5'});
    });

/**
    describe('#search with adapter', () => {
        it('should return searchResult and correct sql', done => {
            const knexRes = addSqliteAdapter();
            knex.resetTestResults([
                [{id: '50', type: 'TRACK'}],
                [{id: '51', type: 'IMAGE'}],
                [{'COUNT( DISTINCT kategorie.k_id)': 1}]
            ]);
            Observable.forkJoin(
                service.search(service.newSearchForm({fulltext: 'bla', type: 'TRACK', sort: 'dateAsc', pageNum: 11, perPage: 12}))
            ).subscribe(
                results => {
                    // THEN: get Track
                    expect(results[0].recordCount).toEqual(1);
                    expect(JSON.stringify(results[0].currentRecords[0].toSerializableJsonObj())).toEqual(JSON.stringify(
                        {
                            'type': 'TRACK',
                            'id': '50',
                            'tdocimages': [{
                                'tdoc_id': '50',
                                'id': '5000000050' }
                            ],
                            'tdocvideos': [],
                            'tdocodimageobjects': [],
                            'tdocnavigationobjects': [],
                            'tdocflagobjects': []}));
                    expect(knexRes.sqls[0]).toContain('where k_name || " " || COALESCE(k_meta_shortdesc,"", " ", l_name) LIKE "%bla%"' +
                        '  AND  ( "track"  IN ("TRACK"))' +
                        '   order by k_datevon ASC' +
                        ' limit 120, 12');
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
**/
});
