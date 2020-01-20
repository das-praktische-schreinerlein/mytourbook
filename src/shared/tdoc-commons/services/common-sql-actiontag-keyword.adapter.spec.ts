/* tslint:disable:no-unused-variable */
import 'rxjs/add/observable/fromPromise';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {TestHelperSpec} from './test-helper.spec';
import {CommonSqlKeywordAdapter, KeywordModelConfigType} from './common-sql-keyword.adapter';
import {CommonSqlActionTagKeywordAdapter} from './common-sql-actiontag-keyword.adapter';

describe('CommonSqlActionTagKeywordAdapter', () => {
    const modelConfigType: KeywordModelConfigType = {
        table: 'keyword',
        fieldId: 'kw_id',
        fieldName: 'kw_name',
        joins: {
            'image': {
                table: 'image', joinTable: 'image_keyword', fieldReference: 'i_id'
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
            return new CommonSqlActionTagKeywordAdapter(
                new CommonSqlKeywordAdapter(config, knex, sqlQueryBuilder, modelConfigType));
        },
    };


    describe('test defaults', () => {
        const knex = TestHelperSpec.createKnex('mysql', []);
        const service: CommonSqlActionTagKeywordAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagKeyword should error on no payload', done => {
            TestHelperSpec.doActionTagTestInvalidPayloadTest(knex, service, 'executeActionTagKeyword', 'keyword' , done);
        });

        it('executeActionTagKeyword should error on invalid id', done => {
            TestHelperSpec.doActionTagTestInvalidIdTest(knex, service, 'executeActionTagKeyword', 'keyword', done);
        });

        it('executeActionTagKeyword should error on unknown table', done => {
            TestHelperSpec.doActionTagFailInvalidTableTest(knex, service, 'executeActionTagKeyword', 'keyword',
                {
                    keywordAction: 'set',
                    keywords: 'KW_1, KW_2'
                }, 'setGenericKeywords: unknowntable - table not valid', done);
        });


        it('executeActionTagKeyword should reject keywords', done => {
            const id: any = 5;
            return TestHelperSpec.doActionTagFailTest(knex, service, 'executeActionTagKeyword', 'image', id, {
                payload: {
                    keywordAction: 'set',
                    keywords: '"""""'
                },
                deletes: false,
                key: 'keyword',
                recordId: id,
                type: 'tag'
            }, 'actiontag keyword keywords not valid', done);
        });
    });

    describe('#executeActionTagKeyword() mysql', () => {
        const knex = TestHelperSpec.createKnex('mysql', []);
        const service: CommonSqlActionTagKeywordAdapter = localTestHelper.createService(knex);

        it('executeActionTagKeyword should set keywords mysql', done => {
            const id: any = 5;
            TestHelperSpec.doActionTagTestSuccessTest(knex, service, 'executeActionTagKeyword', 'image', id, {
                    payload: {
                        keywordAction: 'set',
                        keywords: 'KW_1, KW_2'
                    },
                    deletes: false,
                    key: 'keyword',
                    recordId: id,
                    type: 'tag'
                }, true,
                [
                    'SELECT 1',
                    'INSERT INTO keyword (kw_name) SELECT kw_name FROM ( SELECT ? AS kw_name  UNION ALL SELECT ? AS kw_name ) AS kw1' +
                    ' WHERE NOT EXISTS (SELECT 1                   FROM keyword kw2' +
                    '                   WHERE BINARY kw2.kw_name = BINARY kw1.kw_name); ',
                    'INSERT INTO image_keyword (i_id, kw_id) SELECT ? AS i_id, kw_id AS kw_id  FROM keyword kkw1' +
                    ' WHERE kw_name IN ( SELECT ? AS kw_name  UNION ALL SELECT ? AS kw_name )' +
                    ' AND      NOT EXISTS (SELECT 1  FROM image_keyword kkw2' +
                    '                   WHERE kkw2.kw_id = kkw1.kw_id                        AND i_id = ?); '],
                [
                    [],
                    ['KW_1', 'KW_2'],
                    [5, 'KW_1', 'KW_2', 5]],
                done);
        });

        it('executeActionTagKeyword should unset keywords mysql', done => {
            const id: any = 5;
            TestHelperSpec.doActionTagTestSuccessTest(knex, service, 'executeActionTagKeyword', 'image', id, {
                    payload: {
                        keywordAction: 'unset',
                        keywords: 'KW_1, KW_2'
                    },
                    deletes: false,
                    key: 'keyword',
                    recordId: id,
                    type: 'tag'
                }, true,
                [
                    'DELETE FROM image_keyword' +
                    ' WHERE i_id = ?     AND kw_id IN' +
                    '          (SELECT kw_id FROM keyword kkw1' +
                    '           WHERE kw_name IN ( SELECT ? AS kw_name  UNION ALL SELECT ? AS kw_name )); '],
                [
                    [5, 'KW_1', 'KW_2']],
                done);
        });
    });

    describe('#executeActionTagKeyword() sqlite3', () => {
        const knex = TestHelperSpec.createKnex('sqlite3', []);
        const service: CommonSqlActionTagKeywordAdapter = localTestHelper.createService(knex);

        it('executeActionTagKeyword should set keywords sqlite3', done => {
            const id: any = 5;
            TestHelperSpec.doActionTagTestSuccessTest(knex, service, 'executeActionTagKeyword', 'image', id, {
                    payload: {
                        keywordAction: 'set',
                        keywords: 'KW_1, KW_2'
                    },
                    deletes: false,
                    key: 'keyword',
                    recordId: id,
                    type: 'tag'
                }, true,
                [
                    'SELECT 1',
                    'INSERT INTO keyword (kw_name)' +
                    ' SELECT kw_name FROM (' +
                    '  WITH split(word, str, hascomma) AS (     VALUES("", ?, 1)     UNION ALL SELECT     substr(str, 0,         case when instr(str, ",")         then instr(str, ",")         else length(str)+1 end),     ltrim(substr(str, instr(str, ",")), ","),     instr(str, ",")     FROM split     WHERE hascomma   )   SELECT trim(word) AS kw_name FROM split WHERE word!="" )' +
                    ' AS kw1 WHERE NOT EXISTS (SELECT 1                   FROM keyword kw2' +
                    '                   WHERE kw2.kw_name = kw1.kw_name); ',
                    'INSERT INTO image_keyword (i_id, kw_id)' +
                    ' SELECT ? AS i_id, kw_id AS kw_id FROM keyword kkw1 WHERE kw_name IN (' +
                    '  WITH split(word, str, hascomma) AS (     VALUES("", ?, 1)' +
                    '     UNION ALL SELECT     substr(str, 0,         case when instr(str, ",")         then instr(str, ",")         else length(str)+1 end),     ltrim(substr(str, instr(str, ",")), ","),     instr(str, ",")     FROM split' +
                    '     WHERE hascomma   )   SELECT trim(word) AS kw_name FROM split WHERE word!="" )' +
                    ' AND NOT EXISTS (SELECT 1                   FROM image_keyword kkw2' +
                    '                   WHERE kkw2.kw_id = kkw1.kw_id                        AND i_id = ?); '],
                [
                    [],
                    ['KW_1,KW_2'],
                    [5, 'KW_1,KW_2', 5]],
                done);
        });

        it('executeActionTagKeyword should unset keywords sqlite3', done => {
            const id: any = 5;
            TestHelperSpec.doActionTagTestSuccessTest(knex, service, 'executeActionTagKeyword', 'image', id, {
                    payload: {
                        keywordAction: 'unset',
                        keywords: 'KW_1, KW_2'
                    },
                    deletes: false,
                    key: 'keyword',
                    recordId: id,
                    type: 'tag'
                }, true,
                [
                    'DELETE FROM image_keyword WHERE i_id = ?' +
                    '     AND kw_id IN          (SELECT kw_id FROM keyword kkw1' +
                    '           WHERE kw_name IN (' +
                    '  WITH split(word, str, hascomma) AS (     VALUES("", "?", 1)     UNION ALL SELECT     substr(str, 0,         case when instr(str, ",")         then instr(str, ",")         else length(str)+1 end),     ltrim(substr(str, instr(str, ",")), ","),     instr(str, ",")     FROM split     WHERE hascomma   )   SELECT trim(word) AS kw_name FROM split WHERE word!="" )); '],
                [
                    [5, 'KW_1,KW_2']],
                done);
        });
    });
});
