import {utils} from 'js-data';
import {KeywordValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {RawSqlQueryData, SqlUtils} from '@dps/mycms-commons/dist/search-commons/services/sql-utils';

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
        const deleteNotUsedKeywordSqlQuery: RawSqlQueryData = deleteOld ? {
            sql: 'DELETE FROM ' + joinTable + ' WHERE ' + joinBaseIdField + ' IN (' + '?' + ')',
            parameters: [dbId]
        } : { sql: 'SELECT 1', parameters: []};
        let insertNewKeywordsSqlQuery: RawSqlQueryData;
        let insertNewKeywordJoinSqlQuery: RawSqlQueryData;
        if (this.knex.client['config']['client'] !== 'mysql') {
            const keywordSplitParameter = newKeywords.replace(/[ \\"']/g, '');
            const keywordSplitSql = ' WITH split(word, str, hascomma) AS ( ' +
                '    VALUES("", ' + '?' + ', 1) ' +
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

            insertNewKeywordsSqlQuery = {
                sql: 'INSERT INTO ' + keywordTable + ' (' + keywordNameField + ') ' +
                    'SELECT ' + keywordNameField + ' ' +
                    'FROM ( ' +
                    keywordSplitSql +
                    ') AS kw1 ' +
                    'WHERE NOT EXISTS (SELECT 1 ' +
                    '                  FROM ' + keywordTable + ' kw2 ' +
                    '                  WHERE kw2.' + keywordNameField + ' = kw1.' + keywordNameField + '); ',
                parameters: [keywordSplitParameter]
            };
            insertNewKeywordJoinSqlQuery = {
                sql: 'INSERT INTO ' + joinTable + ' (' + joinBaseIdField + ', ' + keywordIdField + ') ' +
                    'SELECT ' + '?' + ' AS ' + joinBaseIdField + ', ' + keywordIdField + ' AS ' + keywordIdField +
                    ' FROM ' + keywordTable + ' kkw1 WHERE ' + keywordNameField + ' IN ( ' +
                    keywordSplitSql +
                    ') AND NOT EXISTS (SELECT 1 ' +
                    '                  FROM ' + joinTable + ' kkw2 ' +
                    '                  WHERE kkw2.' + keywordIdField + ' = kkw1.' + keywordIdField +
                    '                        AND ' + joinBaseIdField + ' = ' + '?' + '); ',
                parameters: [].concat([dbId]).concat([keywordSplitParameter]).concat([dbId])
            };
        } else {
            const escapedKeywords = newKeywords.replace(/[ \\"']/g, '').split(',');
            const keywordSplitSql = escapedKeywords.map(value => 'SELECT ? AS ' + keywordNameField + ' ').join(' UNION ALL ');
            const keywordSplitParameter = escapedKeywords.map(value => value);

            insertNewKeywordsSqlQuery = {
                sql: 'INSERT INTO ' + keywordTable + ' (' + keywordNameField + ') ' +
                    'SELECT ' + keywordNameField + ' ' +
                    'FROM ( ' +
                    keywordSplitSql +
                    ') AS kw1 ' +
                    'WHERE NOT EXISTS (SELECT 1 ' +
                    '                  FROM ' + keywordTable + ' kw2 ' +
                    '                  WHERE BINARY kw2.' + keywordNameField + ' = BINARY kw1.' + keywordNameField + '); ',
                parameters: [].concat(keywordSplitParameter)
            };
            insertNewKeywordJoinSqlQuery = {
                sql: 'INSERT INTO ' + joinTable + ' (' + joinBaseIdField + ', ' + keywordIdField + ') ' +
                    'SELECT ' + '?' + ' AS ' + joinBaseIdField + ', ' + keywordIdField + ' AS ' + keywordIdField +
                    '  FROM ' + keywordTable + ' kkw1 WHERE ' + keywordNameField + ' IN ( ' + keywordSplitSql + ') AND' +
                    '      NOT EXISTS (SELECT 1 ' + ' FROM ' + joinTable + ' kkw2 ' +
                    '                  WHERE kkw2.' + keywordIdField + ' = kkw1.' + keywordIdField +
                    '                        AND ' + joinBaseIdField + ' = ' + '?' + '); ',
                parameters: [].concat([dbId]).concat(keywordSplitParameter).concat([dbId])
            };
        }

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const result = new Promise((resolve, reject) => {
            SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteNotUsedKeywordSqlQuery).then(() => {
                return SqlUtils.executeRawSqlQueryData(sqlBuilder, insertNewKeywordsSqlQuery);
            }).then(insertResults => {
                return SqlUtils.executeRawSqlQueryData(sqlBuilder, insertNewKeywordJoinSqlQuery);
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
        let deleteNotUsedKeywordSql: RawSqlQueryData;
        if (this.knex.client['config']['client'] !== 'mysql') {
            const keywordSplitParameter = newKeywords.replace(/[ \\"']/g, '');
            const keywordSplitSql = ' WITH split(word, str, hascomma) AS ( ' +
                '    VALUES("", "' + '?' + '", 1) ' +
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

            deleteNotUsedKeywordSql = {
                sql: 'DELETE FROM ' + joinTable +
                    ' WHERE ' + joinBaseIdField + ' = ' + '?' +
                    '     AND ' + keywordIdField + ' IN ' +
                    '         (SELECT ' + keywordIdField + ' FROM ' + keywordTable + ' kkw1' +
                    '           WHERE ' + keywordNameField + ' IN ( ' + keywordSplitSql + ')); ',
                parameters: [].concat([dbId]).concat(keywordSplitParameter)};
        } else {
            const escapedKeywords = newKeywords.replace(/[ \\"']/g, '').split(',');
            const keywordSplitSql = escapedKeywords.map(value => 'SELECT ? AS ' + keywordNameField + ' ').join(' UNION ALL ');
            const keywordSplitParameter = escapedKeywords.map(value => value);

            deleteNotUsedKeywordSql = {
                sql: 'DELETE FROM ' + joinTable +
                    ' WHERE ' + joinBaseIdField + ' = ' + '?' +
                    '     AND ' + keywordIdField + ' IN ' +
                    '         (SELECT ' + keywordIdField + ' FROM ' + keywordTable + ' kkw1' +
                    '           WHERE ' + keywordNameField + ' IN ( ' + keywordSplitSql + ')); ',
                parameters: [].concat([dbId]).concat(keywordSplitParameter)
            };
        }

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const result = new Promise((resolve, reject) => {
            SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteNotUsedKeywordSql).then(() => {
            }).then(insertResults => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                return reject(reason);
            });
        });

        return result;
    }
}
