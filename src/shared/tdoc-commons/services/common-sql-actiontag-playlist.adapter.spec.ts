/* tslint:disable:no-unused-variable */
import 'rxjs/add/observable/fromPromise';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {TestHelper} from './test-helper.spec';
import {CommonSqlActionTagPlaylistAdapter} from './common-sql-actiontag-playlist.adapter';
import {CommonSqlPlaylistAdapter, PlaylistModelConfigType} from './common-sql-playlist.adapter';
import {TestActionFormHelper} from './test-actionform-helper.spec';

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
                }
            };

            return new CommonSqlActionTagPlaylistAdapter(
                new CommonSqlPlaylistAdapter(config, knex, sqlQueryBuilder, modelConfigType));
        }
    };


    describe('test defaults', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagPlaylistAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagPlaylist should error on no payload', done => {
            TestActionFormHelper.doActionTagTestInvalidPayloadTest(knex, service, 'executeActionTagPlaylist', 'playlist' , done);
        });

        it('executeActionTagPlaylist should error on invalid id', done => {
            TestActionFormHelper.doActionTagTestInvalidIdTest(knex, service, 'executeActionTagPlaylist', 'playlist', done);
        });

        it('executeActionTagPlaylist should error on unknown table', done => {
            TestActionFormHelper.doActionTagFailInvalidTableTest(knex, service, 'executeActionTagPlaylist', 'playlist',
                {
                    playlistkey: 'playlist',
                    set: 1,
                }, 'setGenericPlaylists: unknowntable - table not valid', done);
        });


        it('executeActionTagPlaylist should reject playlist', done => {
            const id: any = 5;
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagPlaylist', 'image', id, {
                payload: {
                    playlistkey: 'playlist??`"',
                    set: false,
                },
                deletes: false,
                key: 'playlist',
                recordId: id,
                type: 'tag'
            }, 'actiontag playlist playlists not valid', done);
        });
    });

    describe('#executeActionTagPlaylist()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagPlaylistAdapter = localTestHelper.createService(knex);

        it('executeActionTagPlaylist should set playlist', done => {
            const id: any = 5;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagPlaylist', 'image', id, {
                    payload: {
                        playlistkey: 'playlist',
                        set: true,
                    },
                    deletes: false,
                    key: 'playlist',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'DELETE FROM image_playlist'
                    + ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?',
                    'INSERT INTO image_playlist (p_id, i_id)'
                    + ' SELECT p_id AS p_id,     ? AS i_id FROM playlist     WHERE p_name IN (?)'
                ],
                [
                    ['playlist', 5],
                    [5, 'playlist']
                ],
                done);
        });

        it('executeActionTagPlaylist should unset playlist', done => {
            const id: any = 5;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagPlaylist', 'image', id, {
                    payload: {
                        playlistkey: 'playlist',
                        set: false,
                    },
                    deletes: false,
                    key: 'playlist',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'DELETE FROM image_playlist'
                    + ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?'
                ],
                [
                    ['playlist', 5]
                ],
                done);
        });
    });
});
