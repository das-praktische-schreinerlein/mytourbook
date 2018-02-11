import {utils} from 'js-data';

export class SDocSqlMediadbKeywordAdapter {

    private config: any;
    private knex: any;

    constructor(config: any, knex: any) {
        this.config = config;
        this.knex = knex;
    }

    public setTrackKeywords(dbId: string | number, keywords: string, opts: any): Promise<any> {
        opts = opts || {};

        const deleteNotUsedKeywordSql = 'DELETE FROM kategorie_keyword WHERE k_id IN (' + dbId + ')';
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
        const insertNewKeywordJoinSql = 'INSERT INTO kategorie_keyword (k_id, kw_id) ' +
            'SELECT ' + dbId + ' AS k_id, kw_id AS kw_id FROM keyword kkw1 where kw_name in ( ' +
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
            '                  FROM kategorie_keyword kkw2 ' +
            '                  WHERE kkw2.kw_id = kkw1.kw_id and k_id = ' + dbId + '); ';

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const result = new Promise((resolve, reject) => {
            sqlBuilder.raw(deleteNotUsedKeywordSql).then(function doneDelete(dbresults: any) {
                    return sqlBuilder.raw(insertNewKeywordsSql);
                }).then(function doneInsert(insertResults: any) {
                    return sqlBuilder.raw(insertNewKeywordJoinSql);
                }).then(function doneInsert(insertResults: any) {
                    return resolve(true);
                }).catch(function errorPlaylist(reason) {
                    console.error('setTrackKeywords insert trackkeywords failed:', reason);
                    return reject(reason);
                });
        });

        return result;
    }
}
