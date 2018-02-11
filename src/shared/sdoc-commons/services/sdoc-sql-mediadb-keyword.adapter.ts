import {utils} from 'js-data';
import {KeywordValidationRule} from '../../search-commons/model/forms/generic-validator.util';

export class SDocSqlMediadbKeywordAdapter {

    private config: any;
    private knex: any;
    private keywordValidationRule = new KeywordValidationRule(false);

    constructor(config: any, knex: any) {
        this.config = config;
        this.knex = knex;
    }

    public setTrackKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('kategorie_keyword', 'k_id', dbId, keywords, opts);
    }

    public setImageKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('image_keyword', 'i_id', dbId, keywords, opts);
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

        const deleteNotUsedKeywordSql = 'DELETE FROM ' + joinTable + ' WHERE ' + idField + ' IN (' + dbId + ')';
        const insertNewKeywordsSql = 'INSERT INTO keyword (kw_name) ' +
            'SELECT kw_name ' +
            'FROM ( ' +
            '   WITH split(word, str, hascomma) AS ( ' +
            '    VALUES("", "' + keywords.replace(/ \\"'/g, '') + '", 1) ' +
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
            '  SELECT trim(word) AS kw_name FROM split WHERE word!="" ' +
            ') AS kw1 ' +
            'WHERE NOT EXISTS (SELECT 1 ' +
            '                  FROM keyword kw2 ' +
            '                  WHERE kw2.kw_name = kw1.kw_name); ';
        const insertNewKeywordJoinSql = 'INSERT INTO ' + joinTable + ' (' + idField + ', kw_id) ' +
            'SELECT ' + dbId + ' AS ' + idField + ', kw_id AS kw_id FROM keyword kkw1 WHERE kw_name IN ( ' +
            '   WITH split(word, str, hascomma) AS ( ' +
            '    values("", "' + keywords.replace(/ \\"'/g, '') + '", 1) ' +
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
            '  SELECT trim(word) as kw_name FROM split WHERE word!="" ' +
            ') and NOT EXISTS (SELECT 1 ' +
            '                  FROM ' + joinTable + ' kkw2 ' +
            '                  WHERE kkw2.kw_id = kkw1.kw_id AND ' + idField + ' = ' + dbId + '); ';

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
