import {utils} from 'js-data';
import {KeywordValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';

export class TourDocSqlMediadbKeywordAdapter {

    private config: any;
    private knex: any;
    private keywordValidationRule = new KeywordValidationRule(false);
    private sqlQueryBuilder: SqlQueryBuilder;

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
    }

    public setTrackKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('kategorie_keyword', 'k_id', dbId, keywords, opts);
    }

    public setImageKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('image_keyword', 'i_id', dbId, keywords, opts);
    }

    public setVideoKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('video_keyword', 'v_id', dbId, keywords, opts);
    }

    public setLocationKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('location_keyword', 'l_id', dbId, keywords, opts);
    }

    public setRouteKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('tour_keyword', 't_id', dbId, keywords, opts);
    }

    protected setGenericKeywords(joinTable: string, idField: string, dbId: number, keywords: string, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(dbId)) {
            return utils.reject('setGenericKeywords ' + joinTable + ' id not an integer');
        }
        if (!this.keywordValidationRule.isValid(keywords)) {
            return utils.reject('setGenericKeywords ' + joinTable + ' keywords not valid');
        }

        const newKeywords = StringUtils.uniqueKeywords(keywords).join(',');
        const deleteNotUsedKeywordSql = 'DELETE FROM ' + joinTable + ' WHERE ' + idField + ' IN (' + dbId + ')';
        let insertNewKeywordsSql;
        let insertNewKeywordJoinSql;
        if (this.config.knexOpts.client !== 'mysql') {
            const keywordSplit = ' WITH split(word, str, hascomma) AS ( ' +
                '    VALUES("", "' + newKeywords.replace(/[ \\"']/g, '') + '", 1) ' +
            '    UNION ALL SELECT ' +
            '    substr(str, 0, ' +
            '        case when instr(str, ",") ' +
            '        then instr(str, ",") ' +
            '        else length(str)+1 end), ' +
            '    ltrim(substr(str, instr(str, ",")), ","), ' +
            '    instr(str, ",") ' +
            '    FROM split ' +
            '    WHERE hascomma ' +
            '  ) ' +
            '  SELECT trim(word) AS kw_name FROM split WHERE word!="" ';

            insertNewKeywordsSql = 'INSERT INTO keyword (kw_name) ' +
                'SELECT kw_name ' +
                'FROM ( ' +
                keywordSplit +
                ') AS kw1 ' +
                'WHERE NOT EXISTS (SELECT 1 ' +
                '                  FROM keyword kw2 ' +
                '                  WHERE kw2.kw_name = kw1.kw_name); ';
            insertNewKeywordJoinSql = 'INSERT INTO ' + joinTable + ' (' + idField + ', kw_id) ' +
                'SELECT ' + dbId + ' AS ' + idField + ', kw_id AS kw_id FROM keyword kkw1 WHERE kw_name IN ( ' +
                keywordSplit +
                ') and NOT EXISTS (SELECT 1 ' +
                '                  FROM ' + joinTable + ' kkw2 ' +
                '                  WHERE kkw2.kw_id = kkw1.kw_id AND ' + idField + ' = ' + dbId + '); ';
        } else {
            const keywordSplit = ' SELECT ' +
                '"' + newKeywords.replace(/[ \\"']/g, '').split(',').join('" AS kw_name UNION ALL SELECT "') + '" AS kw_name ';

            insertNewKeywordsSql = 'INSERT INTO keyword (kw_name) ' +
                'SELECT kw_name ' +
                'FROM ( ' +
                keywordSplit +
                ') AS kw1 ' +
                'WHERE NOT EXISTS (SELECT 1 ' +
                '                  FROM keyword kw2 ' +
                '                  WHERE BINARY kw2.kw_name = BINARY kw1.kw_name); ';
            insertNewKeywordJoinSql = 'INSERT INTO ' + joinTable + ' (' + idField + ', kw_id) ' +
                'SELECT ' + dbId + ' AS ' + idField + ', kw_id AS kw_id FROM keyword kkw1 WHERE kw_name IN ( ' +
                keywordSplit +
                ') and NOT EXISTS (SELECT 1 ' +
                '                  FROM ' + joinTable + ' kkw2 ' +
                '                  WHERE kkw2.kw_id = kkw1.kw_id AND ' + idField + ' = ' + dbId + '); ';
        }

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const result = new Promise((resolve, reject) => {
            sqlBuilder.raw(deleteNotUsedKeywordSql).then(function doneDelete(dbresults: any) {
                return sqlBuilder.raw(insertNewKeywordsSql);
            }).then(function doneInsert(insertResults: any) {
                return sqlBuilder.raw(insertNewKeywordJoinSql);
            }).then(function doneInsert(insertResults: any) {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('setGenericKeywords insert ' + joinTable + ' failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }
}
