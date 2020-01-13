/* tslint:disable:no-unused-variable */
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {TestHelperSpec} from './test-helper.spec';
import {CommonDocSqlActionTagPlaylistAdapter} from './common-sql-actiontag-playlist.adapter';
import {CommonSqlPlaylistAdapter, PlaylistModelConfigType} from './common-sql-playlist.adapter';

describe('CommonDocSqlActionTagPlaylistAdapter', () => {
    const modelConfigType: PlaylistModelConfigType = {
        table: 'playlist',
        fieldId: 'p_id',
        fieldName: 'p_name',
        joins: {
            'image': {
                table: 'image', joinTable: 'image_playlist', fieldReference: 'i_id'
            }
        }
    };

    const sqlQueryBuilder: SqlQueryBuilder = new SqlQueryBuilder();
    const localTestHelper = {
        createService: function (knex) {
            const config = {
                knexOpts: {
                    client: knex.client.config.client
                }};
            return new CommonDocSqlActionTagPlaylistAdapter(
                new CommonSqlPlaylistAdapter(config, knex, sqlQueryBuilder, modelConfigType));
        },
    };


    describe('test defaults', () => {
        const knex = TestHelperSpec.createKnex('mysql', []);
        const service: CommonDocSqlActionTagPlaylistAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagBlock should error on no payload', done => {
            TestHelperSpec.doDefaultTestActionTagInvalidPayload(knex, service, 'executeActionTagPlaylist', 'playlist' , done);
        });

        it('executeActionTagBlock should error on invalid id', done => {
            TestHelperSpec.doDefaultTestActionTagInvalidId(knex, service, 'executeActionTagPlaylist', 'playlist', done);
        });

        it('executeActionTagBlock should error on unknown table', done => {
            TestHelperSpec.doDefaultTestActionTagInvalidTable(knex, service, 'executeActionTagPlaylist', 'playlist',
                {
                    playlistkey: 'playlist',
                    set: 1,
                }, 'setGenericPlaylists: unknowntable - table not valid', done);
        });


        it('executeActionTagPlaylist should reject playlist', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            Observable.fromPromise(service.executeActionTagPlaylist('image', id, {
                payload: {
                    playlistkey: 'playlist??`"',
                    set: false,
                },
                deletes: false,
                key: 'playlist',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toBeUndefined();
                    done();
                },
                error => {
                    expect(error).toEqual('actiontag playlist playlists not valid');
                    done();
                },
                () => {
                    done();
                }
            );
        });
    });

    describe('#executeActionTagPlaylist()', () => {
        const knex = TestHelperSpec.createKnex('mysql', []);
        const service: CommonDocSqlActionTagPlaylistAdapter = localTestHelper.createService(knex);

        it('executeActionTagPlaylist should set playlist', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            Observable.fromPromise(service.executeActionTagPlaylist('image', id, {
                payload: {
                    playlistkey: 'playlist',
                    set: true,
                },
                deletes: false,
                key: 'playlist',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toEqual(true);
                    expect(knex.sqls).toEqual(['DELETE FROM image_playlist' +
                    ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?',
                        'INSERT INTO image_playlist (p_id, i_id)' +
                        ' SELECT p_id +  AS p_id,     ? AS i_id FROM playlist     WHERE p_name IN (?)']);
                    expect(knex.params).toEqual([['playlist', 5], [5, 'playlist']]);
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

        it('executeActionTagPlaylist should unset playlist', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            Observable.fromPromise(service.executeActionTagPlaylist('image', id, {
                payload: {
                    playlistkey: 'playlist',
                    set: false,
                },
                deletes: false,
                key: 'playlist',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toEqual(true);
                    expect(knex.sqls).toEqual(['DELETE FROM image_playlist' +
                    ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?']);
                    expect(knex.params).toEqual([['playlist', 5]]);
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
