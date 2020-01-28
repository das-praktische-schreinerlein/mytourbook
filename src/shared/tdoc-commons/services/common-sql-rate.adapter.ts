import {utils} from 'js-data';
import {NumberValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {RawSqlQueryData, SqlUtils} from '@dps/mycms-commons/dist/search-commons/services/sql-utils';

export interface RateModelConfigRateType {
    [key: string]: string;
}

export interface RateModelConfigTableType {
    fieldId: string;
    fieldSum: string;
    rateFields: RateModelConfigRateType;
    table: string;
}

export interface RateModelConfigTablesType {
    [key: string]: RateModelConfigTableType;
}

export interface RateModelConfigType {
    tables: RateModelConfigTablesType;
}

export class CommonSqlRateAdapter {

    private config: any;
    private readonly knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;
    private readonly rateModelConfig: RateModelConfigType;
    private rateValidationRule = new NumberValidationRule(true, -1, 15, 0);

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, rateModelConfig: RateModelConfigType) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.rateModelConfig = rateModelConfig;
    }

    public setRates(rateTableKey: string, dbId: number, rates: {[key: string]: number}, checkGreatestHimself: boolean, opts: any):
        Promise<any> {
        if (!utils.isInteger(dbId)) {
            return utils.reject('setRates ' + rateTableKey + ' id not an integer');
        }
        if (!this.rateModelConfig.tables[rateTableKey]) {
            return utils.reject('setRates: ' + rateTableKey + ' - table not valid');
        }
        const rateConfig = this.rateModelConfig.tables[rateTableKey];
        const rateUpdateSqls = [];
        const rateUpdateSqlParams = [];
        for (const rateKey in rates) {
            if (!rates.hasOwnProperty(rateKey)) {
                continue;
            }

            const rate = rates[rateKey];
            if (!this.rateValidationRule.isValid(rate)) {
                return utils.reject('setRates ' + rateTableKey + ' rate not valid');
            }
            if (!rateConfig.rateFields[rateKey]) {
                return utils.reject('setRates: ' + rateTableKey + ' - rateKey not valid');
            }
            const base = checkGreatestHimself ? rateConfig.rateFields[rateKey] : '-1';
            rateUpdateSqls.push(rateConfig.rateFields[rateKey] + '=GREATEST(COALESCE(' + base + ', -1), ?)');
            rateUpdateSqlParams.push(rate);
        }

        if (rateConfig.fieldSum !== undefined) {
            const greatesSqls = [];
            for (const rateFieldKey in rateConfig.rateFields) {
                if (!rateConfig.rateFields.hasOwnProperty(rateFieldKey)) {
                    continue;
                }

                greatesSqls.push('COALESCE(' + rateConfig.rateFields[rateFieldKey] + ', -1)');
            }
            if (checkGreatestHimself) {
                greatesSqls.push('COALESCE(' + rateConfig.fieldSum + ', -1)');
            }
            rateUpdateSqls.push(rateConfig.fieldSum + '=GREATEST(' + greatesSqls.join(', ') + ')');
        }

        let updateSql = 'UPDATE ' + rateConfig.table + ' SET ' + rateUpdateSqls.join(', ') +
            '  WHERE ' + rateConfig.fieldId + ' = ' + '?' + '';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);
        const updateSqlQuery: RawSqlQueryData = {
            sql: updateSql,
            parameters: [].concat(rateUpdateSqlParams).concat(dbId)
        };

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawUpdate = SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
        const result = new Promise((resolve, reject) => {
            rawUpdate.then(() => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag update ' + rateConfig.table + ' rate failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }
}
