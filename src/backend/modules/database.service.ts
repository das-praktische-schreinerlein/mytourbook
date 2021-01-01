import * as fs from 'fs';
import * as Promise_serial from 'promise-serial';
import {utils} from 'js-data';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {SqlUtils} from '@dps/mycms-commons/dist/search-commons/services/sql-utils';

export class DatabaseService {
    protected knex: any;
    protected sqlQueryBuilder: SqlQueryBuilder;

    public static extractSqlFileOnScriptPath(sqlFile: string, splitter: string): string[] {
        return fs.readFileSync(sqlFile, {encoding: 'utf8'}).split(splitter);
    }

    public constructor(knex: any, sqlQueryBuilder: SqlQueryBuilder) {
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.knex = knex;
    }

    public executeSqls(sqls: string[]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises = [];
            const me = this;
            const sqlBuilder = this.knex;
            for (const sql of sqls) {
                promises.push(function () {
                    if (sql === undefined || sql.trim() === '' || sql.startsWith('DELIMITER ') || sql.includes('\nDELIMITER ')) {
                        return utils.resolve(true);
                    }
                    return sqlBuilder.raw(me.transformToSqlDialect(sql)).catch(reason => {
                        if (reason.errno === 21) {
                            console.error('skip misue', reason, sql);
                            return Promise.resolve();
                        }

                        return Promise.reject(reason);
                    });
                });
            }

            Promise_serial(promises, {parallelize: 1}).then(() => {
                return resolve(true);
            }).catch(reason => {
                return reject(reason);
            });
        });
    }

    public transformToSqlDialect(sql: string): string {
        const client = this.knex.client['config']['client'];
        if (client === 'sqlite3') {
            sql = SqlUtils.transformToSqliteDialect(sql);
        }

        return this.sqlQueryBuilder.transformToSqlDialect(sql, client);
    }

}
