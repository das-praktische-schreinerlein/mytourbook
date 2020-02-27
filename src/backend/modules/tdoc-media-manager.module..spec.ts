/* tslint:disable:no-unused-variable */
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/forkJoin';
import {TestHelper} from '@dps/mycms-commons/dist/testing/test-helper';
import {FileInfoType, FileSystemDBSyncType, TourDocMediaManagerModule} from './tdoc-media-manager.module';
import {MediaManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/media-manager.module';
import * as os from 'os';
import {utils} from 'js-data';

describe('TourDocMediaManagerModule', () => {
    const backendConfig = {
        'TourDocSqlMytbDbAdapter': {
            'client': 'sqlite3',
            'connection': {
                'filename': ':memory:'
            }
        }
    };

    class TestMediaManagerModule extends MediaManagerModule {
        public readExifForImage(imagePath: string): Promise<{}> {
            return utils.resolve({
                exif: {
                    DateTimeOriginal: new Date(1582750000)
                }
            });
        }
    }

    class TestTourDocMediaManagerModule extends TourDocMediaManagerModule {
        public myKnex;
        protected createKnex(localBackendConfig: {}): any {
            this.myKnex = TestHelper.createKnex(backendConfig.TourDocSqlMytbDbAdapter.client, []);
            return this.myKnex;
        }
    }

    let service: TestTourDocMediaManagerModule;
    const mediaManagerModule = new TestMediaManagerModule(backendConfig['imageMagicAppPath'], os.tmpdir());

    const basedir = 'bladir';
    const fileInfo: FileInfoType = {
        dir: 'testdir',
        name: 'testfile.jpg',
        created: new Date(1582750000),
        type: 'IMAGE',
        exifDate: new Date(1582751000),
        lastModified: new Date(1582752000),
        size: 10
    };
    const fileInfo2: FileInfoType = {
        dir: 'testdir2',
        name: 'testfile2.jpg',
        created: new Date(1582753000),
        type: 'jpg',
        exifDate: new Date(1582754000),
        lastModified: new Date(1582755000),
        size: 20
    };
    const preferedMatchingSql = 'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir,' +
        ' i_date AS created, i_date AS lastModified,      i_date AS exifDate,' +
        ' "IMAGE" AS type, "FILEDIRANDNAME" AS matching,' +
        '      "filename:testfile.jpg" AS matchingDetails, 0 AS matchingScore' +
        '  FROM image  WHERE LOWER(CONCAT(I_dir, "_", i_file)) = LOWER("testfile.jpg")' +
        ' UNION ' +
        'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir,' +
        ' i_date AS created, i_date AS lastModified,      i_date AS exifDate,' +
        ' "IMAGE" AS type, "FILEDIRANDNAME" AS matching,' +
        '      "dir: testdir filename:testfile.jpg" AS matchingDetails, 0 AS matchingScore' +
        '  FROM image  WHERE LOWER(CONCAT(I_dir, "/", i_file)) = LOWER("testdir/testfile.jpg")' +
        ' UNION ' +
        'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir,' +
        ' i_date AS created, i_date AS lastModified,       i_date AS exifDate,' +
        ' "IMAGE" AS type, "FILENAMEANDDATE" AS matching,' +
        '      "filename:testfile.jpg cdate:1582750 mdate:1582752" AS matchingDetails,       0.25 AS matchingScore' +
        '  FROM image  WHERE LOWER(i_file) = LOWER("testfile.jpg")' +
        '      AND (   UNIX_TIMESTAMP(i_date) BETWEEN "1582749" AND "1582751"' +
        '           OR UNIX_TIMESTAMP(i_date) BETWEEN "1582751" AND "1582753")' +
        ' UNION ' +
        'SELECT DISTINCT CONCAT("VIDEO_", v_id) as id, v_file AS name, v_dir AS dir,' +
        ' v_date AS created, v_date AS lastModified,      v_date AS exifDate,' +
        ' "VIDEO" AS type, "FILEDIRANDNAME" AS matching,' +
        '      "filename:testfile.jpg" AS matchingDetails, 0 AS matchingScore' +
        '  FROM video  WHERE LOWER(CONCAT(V_dir, "_", v_file)) = LOWER("testfile.jpg")' +
        ' UNION ' +
        'SELECT DISTINCT CONCAT("VIDEO_", v_id) as id, v_file AS name, v_dir AS dir,' +
        ' v_date AS created, v_date AS lastModified,      v_date AS exifDate,' +
        ' "VIDEO" AS type, "FILEDIRANDNAME" AS matching,' +
        '      "dir: testdir filename:testfile.jpg" AS matchingDetails, 0 AS matchingScore' +
        '  FROM video  WHERE LOWER(CONCAT(v_dir, "/", v_file)) = LOWER("testdir/testfile.jpg")' +
        ' UNION ' +
        'SELECT DISTINCT CONCAT("VIDEO_", v_id) as id, v_file AS name, v_dir AS dir,' +
        ' v_date AS created, v_date AS lastModified,      v_date AS exifDate,' +
        ' "VIDEO" AS type, "FILENAMEANDDATE" AS matching,' +
        '      "filename:testfile.jpg cdate:1582750 mdate:1582752" AS matchingDetails,       0.25 AS matchingScore' +
        '  FROM video  WHERE LOWER(v_file) = LOWER("testfile.jpg")' +
        '      AND (   UNIX_TIMESTAMP(v_date) BETWEEN "1582749" AND "1582751"' +
        '           OR UNIX_TIMESTAMP(v_date) BETWEEN "1582751" AND "1582753")';
    const fallbackMatchingSql = 'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir,' +
        ' i_date AS created,       i_date AS lastModified, i_date AS exifDate,' +
        ' "IMAGE" AS type, "FILENAME" AS matching,       "filename:testfile.jpg" AS matchingDetails, 0.5 AS matchingScore' +
        '  FROM image  WHERE LOWER(i_file) = LOWER("testfile.jpg")' +
        ' UNION ' +
        'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir,' +
        ' i_date AS created,       i_date AS lastModified, i_date AS exifDate,' +
        ' "IMAGE" AS type, "FILEDATE" AS matching,      "cdate:1582750 mdate:1582752" AS matchingDetails,       0.75 AS matchingScore' +
        '  FROM image  WHERE (   UNIX_TIMESTAMP(i_date) BETWEEN "1582749" AND "1582751"' +
        '         OR UNIX_TIMESTAMP(i_date) BETWEEN "1582751" AND "1582753")' +
        ' UNION ' +
        'SELECT DISTINCT CONCAT("VIDEO_", v_id) as id, v_file AS name, v_dir AS dir,' +
        ' v_date AS created,       v_date AS lastModified, v_date AS exifDate,' +
        ' "VIDEO" AS type, "FILENAME" AS matching,       "filename:testfile.jpg" AS matchingDetails, 0.5 AS matchingScore' +
        '  FROM video  WHERE LOWER(v_file) = LOWER("testfile.jpg")' +
        ' UNION ' +
        'SELECT DISTINCT CONCAT("VIDEO_", v_id) as id, v_file AS name, v_dir AS dir,' +
        ' v_date AS created,       v_date AS lastModified, v_date AS exifDate,' +
        ' "VIDEO" AS type, "FILEDATE" AS matching,      "cdate:1582750 mdate:1582752" AS matchingDetails,       0.75 AS matchingScore' +
        '  FROM video  WHERE (   UNIX_TIMESTAMP(v_date) BETWEEN "1582749" AND "1582751"' +
        '         OR UNIX_TIMESTAMP(v_date) BETWEEN "1582751" AND "1582753")';
    const fallBackMatchingWithExternals =
        'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir,' +
        ' i_date AS created,       i_date AS lastModified, i_date AS exifDate,' +
        ' "IMAGE" AS type, "FILENAME" AS matching,       "filename:testfile.jpg" AS matchingDetails, 0.5 AS matchingScore' +
        '  FROM image  WHERE LOWER(i_file) = LOWER("testfile.jpg")' +
        ' UNION ' +
        'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir,' +
        ' i_date AS created,       i_date AS lastModified, i_date AS exifDate,' +
        ' "IMAGE" AS type, "FILEDATE" AS matching,      "cdate:1582750 mdate:1582752" AS matchingDetails,       0.75 AS matchingScore' +
        '  FROM image  WHERE (   UNIX_TIMESTAMP(i_date) BETWEEN "1582749" AND "1582751"' +
        '         OR UNIX_TIMESTAMP(i_date) BETWEEN "1582751" AND "1582753")' +
        ' UNION ' +
        'SELECT DISTINCT CONCAT("VIDEO_", v_id) as id, v_file AS name, v_dir AS dir,' +
        ' v_date AS created,       v_date AS lastModified, v_date AS exifDate,' +
        ' "VIDEO" AS type, "FILENAME" AS matching,       "filename:testfile.jpg" AS matchingDetails, 0.5 AS matchingScore' +
        '  FROM video  WHERE LOWER(v_file) = LOWER("testfile.jpg")' +
        ' UNION ' +
        'SELECT DISTINCT CONCAT("VIDEO_", v_id) as id, v_file AS name, v_dir AS dir,' +
        ' v_date AS created,       v_date AS lastModified, v_date AS exifDate,' +
        ' "VIDEO" AS type, "FILEDATE" AS matching,      "cdate:1582750 mdate:1582752" AS matchingDetails,       0.75 AS matchingScore' +
        '  FROM video  WHERE (   UNIX_TIMESTAMP(v_date) BETWEEN "1582749" AND "1582751"' +
        '         OR UNIX_TIMESTAMP(v_date) BETWEEN "1582751" AND "1582753")' +
        ' UNION ' +
        'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir,' +
        ' i_date AS created,       i_date AS lastModified, i_date AS exifDate,' +
        ' "IMAGE" AS type,       "SIMILARITY" AS matching,' +
        '       "OpponentHistogram" AS matchingDetails,       "8.876523575567672" AS matchingScore' +
        '  FROM image  WHERE LOWER(CONCAT(I_dir, "/", i_file)) = LOWER("import-dir/IMAGE.JPG")' +
        ' UNION ' +
        'SELECT DISTINCT CONCAT("VIDEO_", v_id) as id, v_file AS name, v_dir AS dir,' +
        ' v_date AS created,       v_date AS lastModified, v_date AS exifDate,' +
        ' "VIDEO" AS type,       "SIMILARITY" AS matching,' +
        '       "OpponentHistogram" AS matchingDetails,       "8.876523575567672" AS matchingScore' +
        '  FROM video  WHERE LOWER(CONCAT(v_dir, "/", v_file)) = LOWER("import-dir/IMAGE.JPG")';
    const exifMatchingSql = 'SELECT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir,' +
        ' i_date AS created,       i_date AS lastModified, i_date AS exifDate,' +
        '       "IMAGE" AS type, "EXIFDATE" AS matching,      "exifdate:1579150" AS matchingDetails, 0.9 AS matchingScore' +
        '  FROM image  WHERE UNIX_TIMESTAMP(i_date)        BETWEEN "1579149" AND "1579151"';

    beforeEach(() => {
        service = new TestTourDocMediaManagerModule(backendConfig, null, mediaManagerModule);
    });

    describe('findTourDocRecordsForFileInfo matching none found', () => {
        it('should return searchResult and correct sql', done => {
           service.myKnex.resetTestResults([
                [],
                [],
                []
            ]);
            const additionalMappings: {[key: string]: FileSystemDBSyncType} = {};
            Observable.forkJoin(
                service.findTourDocRecordsForFileInfo(basedir, fileInfo, additionalMappings)
            ).subscribe(
                results => {
                    // THEN: get Track
                    expect(results[0].length).toEqual(0);
                    expect(service.myKnex.sqls.length).toEqual(3);
                    expect(service.myKnex.sqls[0]).toEqual(preferedMatchingSql);
                    expect(service.myKnex.sqls[1]).toEqual(fallbackMatchingSql);
                    expect(service.myKnex.sqls[2]).toEqual(exifMatchingSql);
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

    describe('findTourDocRecordsForFileInfo matching prefered one found', () => {
        it('should return searchResult and correct sql', done => {
            service.myKnex.resetTestResults([
                [    {
                    'dir': 'import-dir',
                    'exifDate': '2015-02-06T14:18:49.000Z',
                    'id': 'IMAGE_148391',
                    'created': '2015-02-06T14:18:49.000Z',
                    'lastModified': '2015-02-06T14:18:49.000Z',
                    'matching': 'SIMILARITY',
                    'matchingDetails': 'OpponentHistogram',
                    'matchingScore': '8.876523575567672',
                    'name': 'IMAGE.JPG',
                    'type': 'IMAGE'
                }
                ]
            ]);
            const additionalMappings: {[key: string]: FileSystemDBSyncType} = {};
            Observable.forkJoin(
                service.findTourDocRecordsForFileInfo(basedir, fileInfo, additionalMappings)
            ).subscribe(
                results => {
                    // THEN: get Track
                    expect(results[0].length).toEqual(1);
                    expect(JSON.stringify(results[0])).toEqual(JSON.stringify(
                        [{
                            'dir': 'import-dir',
                            'exifDate': '2015-02-06T14:18:49.000Z',
                            'id': 'IMAGE_148391',
                            'created': '2015-02-06T14:18:49.000Z',
                            'lastModified': '2015-02-06T14:18:49.000Z',
                            'matching': 'SIMILARITY',
                            'matchingDetails': 'OpponentHistogram',
                            'matchingScore': '8.876523575567672',
                            'name': 'IMAGE.JPG',
                            'type': 'IMAGE'
                        }]));
                    expect(service.myKnex.sqls.length).toEqual(1);
                    expect(service.myKnex.sqls[0]).toEqual(preferedMatchingSql);
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

    describe('findTourDocRecordsForFileInfo matching fallback one found', () => {
        it('should return searchResult and correct sql', done => {
            service.myKnex.resetTestResults([
                [],
                [{
                    'dir': 'import-dir',
                    'exifDate': '2015-02-06T14:18:49.000Z',
                    'id': 'IMAGE_148391',
                    'created': '2015-02-06T14:18:49.000Z',
                    'lastModified': '2015-02-06T14:18:49.000Z',
                    'matching': 'SIMILARITY',
                    'matchingDetails': 'OpponentHistogram',
                    'matchingScore': '8.876523575567672',
                    'name': 'IMAGE.JPG',
                    'type': 'IMAGE'
                }]
            ]);
            const additionalMappings: {[key: string]: FileSystemDBSyncType} = {};
            Observable.forkJoin(
                service.findTourDocRecordsForFileInfo(basedir, fileInfo, additionalMappings)
            ).subscribe(
                results => {
                    // THEN: get Track
                    expect(results[0].length).toEqual(1);
                    expect(JSON.stringify(results[0])).toEqual(JSON.stringify(
                        [{
                            'dir': 'import-dir',
                            'exifDate': '2015-02-06T14:18:49.000Z',
                            'id': 'IMAGE_148391',
                            'created': '2015-02-06T14:18:49.000Z',
                            'lastModified': '2015-02-06T14:18:49.000Z',
                            'matching': 'SIMILARITY',
                            'matchingDetails': 'OpponentHistogram',
                            'matchingScore': '8.876523575567672',
                            'name': 'IMAGE.JPG',
                            'type': 'IMAGE'
                        }]));
                    expect(service.myKnex.sqls.length).toEqual(2);
                    expect(service.myKnex.sqls[0]).toEqual(preferedMatchingSql);
                    expect(service.myKnex.sqls[1]).toEqual(fallbackMatchingSql);
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

    describe('findTourDocRecordsForFileInfo matching fallback with additionalMappings one found', () => {
        it('should return searchResult and correct sql', done => {
            service.myKnex.resetTestResults([
                [],
                [{
                    'dir': 'import-dir',
                    'exifDate': '2015-02-06T14:18:49.000Z',
                    'id': 'IMAGE_148391',
                    'created': '2015-02-06T14:18:49.000Z',
                    'lastModified': '2015-02-06T14:18:49.000Z',
                    'matching': 'SIMILARITY',
                    'matchingDetails': 'OpponentHistogram',
                    'matchingScore': '8.876523575567672',
                    'name': 'IMAGE.JPG',
                    'type': 'IMAGE'
                }]
            ]);
            const additionalMappings: {[key: string]: FileSystemDBSyncType} = {
                'bladir/testdir/testfile.jpg': {
                    file: fileInfo2,
                    records: [
                        {
                            'dir': 'import-dir',
                            'exifDate': new Date(1582758000),
                            'id': 'IMAGE_148391',
                            'created': new Date(1582756000),
                            'lastModified': new Date(1582757000),
                            'matching': 'SIMILARITY',
                            'matchingDetails': 'OpponentHistogram',
                            'matchingScore': 8.876523575567672,
                            'name': 'IMAGE.JPG',
                            'type': 'IMAGE',
                            'size': 100
                        }
                    ]
                }
            };
            Observable.forkJoin(
                service.findTourDocRecordsForFileInfo(basedir, fileInfo, additionalMappings)
            ).subscribe(
                results => {
                    // THEN: get Track
                    expect(results[0].length).toEqual(1);
                    expect(JSON.stringify(results[0])).toEqual(JSON.stringify(
                        [{
                            'dir': 'import-dir',
                            'exifDate': '2015-02-06T14:18:49.000Z',
                            'id': 'IMAGE_148391',
                            'created': '2015-02-06T14:18:49.000Z',
                            'lastModified': '2015-02-06T14:18:49.000Z',
                            'matching': 'SIMILARITY',
                            'matchingDetails': 'OpponentHistogram',
                            'matchingScore': '8.876523575567672',
                            'name': 'IMAGE.JPG',
                            'type': 'IMAGE'
                        }]));
                    expect(service.myKnex.sqls.length).toEqual(2);
                    expect(service.myKnex.sqls[0]).toEqual(preferedMatchingSql);
                    expect(service.myKnex.sqls[1]).toEqual(fallBackMatchingWithExternals);
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
