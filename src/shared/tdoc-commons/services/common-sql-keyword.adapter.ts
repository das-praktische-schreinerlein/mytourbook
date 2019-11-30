import {utils} from 'js-data';
import {KeywordValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';

export interface KeywordModelConfigJoinType {
    table: string;
    joinTable: string;
    referenceField: string;
}

export interface KeywordModelConfigJoinsType {
    [key: string]: KeywordModelConfigJoinType;
}

export interface KeywordModelConfigType {
    table: string;
    idField: string;
    nameField: string;
    joins: KeywordModelConfigJoinsType;
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


    public setGenericKeywords(table: string, dbId: number, keywords: string, opts: any, deleteOld: boolean):
        Promise<any> {
        if (!utils.isInteger(dbId)) {
            return utils.reject('setGenericKeywords: ' + table + ' - id not an integer');
        }
        if (!this.keywordValidationRule.isValid(keywords)) {
            return utils.reject('setGenericKeywords: ' + table + ' - keywords not valid');
        }
        if (!this.keywordModelConfig.joins[table]) {
            return utils.reject('setGenericKeywords: ' + table + ' - table not valid');
        }

        const nameField = this.keywordModelConfig.nameField;
        const idField = this.keywordModelConfig.idField;
        const joinTable = this.keywordModelConfig.joins[table].joinTable;
        const joinBaseIdField = this.keywordModelConfig.joins[table].referenceField;
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
            '  SELECT trim(word) AS ' + nameField + ' FROM split WHERE word!="" ';

            insertNewKeywordsSql = 'INSERT INTO keyword (' + nameField + ') ' +
                'SELECT ' + nameField + ' ' +
                'FROM ( ' +
                keywordSplit +
                ') AS kw1 ' +
                'WHERE NOT EXISTS (SELECT 1 ' +
                '                  FROM keyword kw2 ' +
                '                  WHERE kw2.' + nameField + ' = kw1.' + nameField + '); ';
            insertNewKeywordJoinSql = 'INSERT INTO ' + joinTable + ' (' + joinBaseIdField + ', ' + idField + ') ' +
                'SELECT ' + dbId + ' AS ' + joinBaseIdField + ',' +
                ' ' + idField + ' AS ' + idField + ' FROM keyword kkw1 WHERE ' + nameField + ' IN ( ' +
                keywordSplit +
                ') and NOT EXISTS (SELECT 1 ' +
                '                  FROM ' + joinTable + ' kkw2 ' +
                '                  WHERE kkw2.' + idField + ' = kkw1.' + idField + ' AND ' + joinBaseIdField + ' = ' + dbId + '); ';
        } else {
            const keywordSplit = ' SELECT ' +
                '"' + newKeywords.replace(/[ \\"']/g, '').split(',').join('" AS ' + nameField +
                ' UNION ALL SELECT "') + '" AS ' + nameField + ' ';

            insertNewKeywordsSql = 'INSERT INTO keyword (' + nameField + ') ' +
                'SELECT ' + nameField + ' ' +
                'FROM ( ' +
                keywordSplit +
                ') AS kw1 ' +
                'WHERE NOT EXISTS (SELECT 1 ' +
                '                  FROM keyword kw2 ' +
                '                  WHERE BINARY kw2.' + nameField + ' = BINARY kw1.' + nameField + '); ';
            insertNewKeywordJoinSql = 'INSERT INTO ' + joinTable + ' (' + joinBaseIdField + ', ' + idField + ') ' +
                'SELECT ' + dbId + ' AS ' + joinBaseIdField + ', ' + idField + ' AS ' + idField +
                '  FROM keyword kkw1 WHERE ' + nameField + ' IN ( ' + keywordSplit + ') AND' +
                '      NOT EXISTS (SELECT 1 ' + ' FROM ' + joinTable + ' kkw2 ' +
                '                  WHERE kkw2.' + idField + ' = kkw1.' + idField + ' AND ' + joinBaseIdField + ' = ' + dbId + '); ';
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

    public unsetGenericKeywords(table: string, dbId: number, keywords: string, opts: any):
        Promise<any> {
        if (!utils.isInteger(dbId)) {
            return utils.reject('setGenericKeywords: ' + table + ' - id not an integer');
        }
        if (!this.keywordValidationRule.isValid(keywords)) {
            return utils.reject('setGenericKeywords: ' + table + ' - keywords not valid');
        }
        if (!this.keywordModelConfig.joins[table]) {
            return utils.reject('setGenericKeywords: ' + table + ' - table not valid');
        }

        const nameField = this.keywordModelConfig.nameField;
        const idField = this.keywordModelConfig.idField;
        const joinTable = this.keywordModelConfig.joins[table].joinTable;
        const joinBaseIdField = this.keywordModelConfig.joins[table].referenceField;
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
                '  SELECT trim(word) AS ' + nameField + ' FROM split WHERE word!="" ';

            deleteNotUsedKeywordSql = 'DELETE FROM ' + joinTable +
                ' WHERE ' + joinBaseIdField + ' = ' + dbId +
                '     AND ' + idField + ' IN ' +
                '         (SELECT ' + idField + ' FROM keyword kkw1 WHERE ' + nameField + ' IN ( ' + keywordSplit + ')); ';
        } else {
            const keywordSplit = ' SELECT ' +
                '"' + newKeywords.replace(/[ \\"']/g, '').split(',').join('" AS ' + nameField +
                    ' UNION ALL SELECT "') + '" AS ' + nameField + ' ';

            deleteNotUsedKeywordSql = 'DELETE FROM ' + joinTable +
                ' WHERE ' + joinBaseIdField + ' = ' + dbId +
                '     AND ' + idField + ' IN ' +
                '         (SELECT ' + idField + ' FROM keyword kkw1 WHERE ' + nameField + ' IN ( ' + keywordSplit + ')); ';
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
