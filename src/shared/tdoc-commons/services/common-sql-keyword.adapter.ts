import {utils} from 'js-data';
import {KeywordValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';

export interface KeywordModelConfigJoinType {
    joinTable: string;
    fieldReference: string;
    table: string;
}

export interface KeywordModelConfigJoinsType {
    [key: string]: KeywordModelConfigJoinType;
}

export interface KeywordModelConfigType {
    fieldId: string;
    fieldName: string;
    joins: KeywordModelConfigJoinsType;
    table: string;
}

export class CommonSqlKeywordAdapter {

    private config: any;
    private readonly knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;
    private readonly keywordModelConfig: KeywordModelConfigType;
    private keywordValidationRule = new KeywordValidationRule(false);

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, keywordModelConfig: KeywordModelConfigType) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.keywordModelConfig = keywordModelConfig;
    }

    public setGenericKeywords(joinTableKey: string, dbId: number, keywords: string, opts: any, deleteOld: boolean):
        Promise<any> {
        if (!utils.isInteger(dbId)) {
            return utils.reject('setGenericKeywords: ' + joinTableKey + ' - id not an integer');
        }
        if (!this.keywordValidationRule.isValid(keywords)) {
            return utils.reject('setGenericKeywords: ' + joinTableKey + ' - keywords not valid');
        }
        if (!this.keywordModelConfig.joins[joinTableKey]) {
            return utils.reject('setGenericKeywords: ' + joinTableKey + ' - table not valid');
        }

        const keywordTable = this.keywordModelConfig.table;
        const keywordNameField = this.keywordModelConfig.fieldName;
        const keywordIdField = this.keywordModelConfig.fieldId;
        const joinTable = this.keywordModelConfig.joins[joinTableKey].joinTable;
        const joinBaseIdField = this.keywordModelConfig.joins[joinTableKey].fieldReference;
        const newKeywords = StringUtils.uniqueKeywords(keywords).join(',');
        const deleteNotUsedKeywordSql = deleteOld ?
            'DELETE FROM ' + joinTable + ' WHERE ' + joinBaseIdField + ' IN (' + dbId + ')' :
            'SELECT 1';
        let insertNewKeywordsSql;
        let insertNewKeywordJoinSql;
        if (this.knex.client['config']['client'] !== 'mysql') {
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
            '  SELECT trim(word) AS ' + keywordNameField + ' FROM split WHERE word!="" ';

            insertNewKeywordsSql = 'INSERT INTO ' + keywordTable + ' (' + keywordNameField + ') ' +
                'SELECT ' + keywordNameField + ' ' +
                'FROM ( ' +
                keywordSplit +
                ') AS kw1 ' +
                'WHERE NOT EXISTS (SELECT 1 ' +
                '                  FROM ' + keywordTable + ' kw2 ' +
                '                  WHERE kw2.' + keywordNameField + ' = kw1.' + keywordNameField + '); ';
            insertNewKeywordJoinSql = 'INSERT INTO ' + joinTable + ' (' + joinBaseIdField + ', ' + keywordIdField + ') ' +
                'SELECT ' + dbId + ' AS ' + joinBaseIdField + ',' +
                ' ' + keywordIdField + ' AS ' + keywordIdField + ' FROM ' + keywordTable + ' kkw1 WHERE ' + keywordNameField + ' IN ( ' +
                keywordSplit +
                ') and NOT EXISTS (SELECT 1 ' +
                '                  FROM ' + joinTable + ' kkw2 ' +
                '                  WHERE kkw2.' + keywordIdField + ' = kkw1.' + keywordIdField +
                '                        AND ' + joinBaseIdField + ' = ' + dbId + '); ';
        } else {
            const keywordSplit = ' SELECT ' +
                '"' + newKeywords.replace(/[ \\"']/g, '').split(',').join('" AS ' + keywordNameField +
                ' UNION ALL SELECT "') + '" AS ' + keywordNameField + ' ';

            insertNewKeywordsSql = 'INSERT INTO ' + keywordTable + ' (' + keywordNameField + ') ' +
                'SELECT ' + keywordNameField + ' ' +
                'FROM ( ' +
                keywordSplit +
                ') AS kw1 ' +
                'WHERE NOT EXISTS (SELECT 1 ' +
                '                  FROM ' + keywordTable + ' kw2 ' +
                '                  WHERE BINARY kw2.' + keywordNameField + ' = BINARY kw1.' + keywordNameField + '); ';
            insertNewKeywordJoinSql = 'INSERT INTO ' + joinTable + ' (' + joinBaseIdField + ', ' + keywordIdField + ') ' +
                'SELECT ' + dbId + ' AS ' + joinBaseIdField + ', ' + keywordIdField + ' AS ' + keywordIdField +
                '  FROM ' + keywordTable + ' kkw1 WHERE ' + keywordNameField + ' IN ( ' + keywordSplit + ') AND' +
                '      NOT EXISTS (SELECT 1 ' + ' FROM ' + joinTable + ' kkw2 ' +
                '                  WHERE kkw2.' + keywordIdField + ' = kkw1.' + keywordIdField +
                '                        AND ' + joinBaseIdField + ' = ' + dbId + '); ';
        }

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const result = new Promise((resolve, reject) => {
            sqlBuilder.raw(deleteNotUsedKeywordSql).then(() => {
                return sqlBuilder.raw(insertNewKeywordsSql);
            }).then(insertResults => {
                return sqlBuilder.raw(insertNewKeywordJoinSql);
            }).then(insertResults => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                return reject(reason);
            });
        });

        return result;
    }

    public unsetGenericKeywords(joinTableKey: string, dbId: number, keywords: string, opts: any):
        Promise<any> {
        if (!utils.isInteger(dbId)) {
            return utils.reject('setGenericKeywords: ' + joinTableKey + ' - id not an integer');
        }
        if (!this.keywordValidationRule.isValid(keywords)) {
            return utils.reject('setGenericKeywords: ' + joinTableKey + ' - keywords not valid');
        }
        if (!this.keywordModelConfig.joins[joinTableKey]) {
            return utils.reject('setGenericKeywords: ' + joinTableKey + ' - table not valid');
        }

        const keywordTable = this.keywordModelConfig.table;
        const keywordNameField = this.keywordModelConfig.fieldName;
        const keywordIdField = this.keywordModelConfig.fieldId;
        const joinTable = this.keywordModelConfig.joins[joinTableKey].joinTable;
        const joinBaseIdField = this.keywordModelConfig.joins[joinTableKey].fieldReference;
        const newKeywords = StringUtils.uniqueKeywords(keywords).join(',');
        let deleteNotUsedKeywordSql;
        if (this.knex.client['config']['client'] !== 'mysql') {
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
                '  SELECT trim(word) AS ' + keywordNameField + ' FROM split WHERE word!="" ';

            deleteNotUsedKeywordSql = 'DELETE FROM ' + joinTable +
                ' WHERE ' + joinBaseIdField + ' = ' + dbId +
                '     AND ' + keywordIdField + ' IN ' +
                '         (SELECT ' + keywordIdField + ' FROM ' + keywordTable + ' kkw1' +
                '           WHERE ' + keywordNameField + ' IN ( ' + keywordSplit + ')); ';
        } else {
            const keywordSplit = ' SELECT ' +
                '"' + newKeywords.replace(/[ \\"']/g, '').split(',').join('" AS ' + keywordNameField +
                    ' UNION ALL SELECT "') + '" AS ' + keywordNameField + ' ';

            deleteNotUsedKeywordSql = 'DELETE FROM ' + joinTable +
                ' WHERE ' + joinBaseIdField + ' = ' + dbId +
                '     AND ' + keywordIdField + ' IN ' +
                '         (SELECT ' + keywordIdField + ' FROM ' + keywordTable + ' kkw1' +
                '           WHERE ' + keywordNameField + ' IN ( ' + keywordSplit + ')); ';
        }

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const result = new Promise((resolve, reject) => {
            sqlBuilder.raw(deleteNotUsedKeywordSql).then(() => {
            }).then(insertResults => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                return reject(reason);
            });
        });

        return result;
    }
}
