export class TourDocSqlUtils {
    public static transformToSqliteDialect(sql: string): string {
        // dirty workaround because sqlite has no functions as mysql
        sql = sql.replace(/GetTechName\(GetLocationNameAncestry\(location.l_id, location.l_name, " -> "\)\)/g,
            'GetTechName(location.l_name)');
        sql = sql.replace(/GetLocationNameAncestry\(location.l_id, location.l_name, " -> "\)/g,
            '"T" || location.l_typ || "L" || location.l_parent_id || " -> " || location.l_name');
        sql = sql.replace(/GetLocationIdAncestry\(location.l_id, ","\)/g,
            'CAST(location.l_parent_id AS CHAR(50)) || "," || CAST(location.l_id AS CHAR(50))');
        sql = sql.replace('CONCAT(CAST(location.l_parent_id AS CHAR(50)), ",", CAST(location.l_id AS CHAR(50)))',
            'CAST(location.l_parent_id AS CHAR(50)) || "," || CAST(location.l_id AS CHAR(50))');
        sql = sql.replace(/GetTechName\(([a-zA-Z0-9_.]+)\)/g,
            'REPLACE(REPLACE(LOWER($1), " ", "_"), "/", "_")');

        return sql;
    }
}
