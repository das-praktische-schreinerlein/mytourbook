export class TourDocSqlUtils {
    public static generateDoubletteNameSql(field: string): string {
        return 'REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(' + field + '), "ß", "ss"),' +
            ' "ö", "oe"),' +
            ' "ü", "ue"),' +
            ' "ä", "ae"),' +
            ' "[^a-z0-9]", "")';
    }

    public static transformToSqliteDialect(sql: string): string {
        // dirty workaround because sqlite has no functions as mysql
        sql = sql.replace(/GetTechName\(GetLocationNameAncestry\(location.l_id, location.l_name, " -> "\)\)/g,
            'GetTechName(location.l_name)');
        sql = sql.replace(/GetTechName\(GetLocationNameAncestry\(lifl.l_id, lifl.l_name, " -> "\)\)/g,
            'GetTechName(lifl.l_name)');
        sql = sql.replace(/GetLocationNameAncestry\(location.l_id, location.l_name, " -> "\)/g,
            '"T" || location.l_typ || "L" || location.l_parent_id || " -> " || location.l_name');
        sql = sql.replace(/GetLocationNameAncestry\(location.l_id, location.l_name, "->"\)/g,
            '"T" || location.l_typ || "L" || location.l_parent_id || "->" || location.l_name');
        sql = sql.replace(/GetLocationIdAncestry\(location.l_id, ","\)/g,
            'CAST(location.l_parent_id AS CHAR(50)) || "," || CAST(location.l_id AS CHAR(50))');

        sql = sql.replace('CONCAT(CAST(location.l_parent_id AS CHAR(50)), ",", CAST(location.l_id AS CHAR(50)))',
            'CAST(location.l_parent_id AS CHAR(50)) || "," || CAST(location.l_id AS CHAR(50))');
        sql = sql.replace(/GetTechName\(([a-zA-Z0-9_.]+)\)/g,
            'REPLACE(REPLACE(LOWER($1), " ", "_"), "/", "_")');
        sql = sql.replace(/REGEXP_REPLACE\(/g, 'REPLACE(');
        sql = sql.replace(/MD5\(CONCAT\(([a-zA-Z0-9_.]+), "_", ([a-zA-Z0-9_.]+), "_", ([a-zA-Z0-9_.]+), "_", ([a-zA-Z0-9_.]+)\)\)/g,
            'REPLACE(REPLACE(LOWER($1 || "_" || $2 || "_" || $3 || "_" || $4), " ", "_"), "/", "_")');
        sql = sql.replace(/\(SELECT CONCAT\("type=subroute:::name=", COALESCE\(t_name, "null"\), ":::refId=", CAST\(tour.t_id AS CHAR\),   ":::full=", CAST\(COALESCE\(kt_full, "false"\) AS CHAR\), ":::linkedRouteAttr=", COALESCE\(kategorie_tour.kt_route_attr, "null"\)\)/g,
            'SELECT linkedroutes FROM (SELECT "type=subroute:::name="  ||  COALESCE(t_name, "null")  ||  ":::refId="  ||  CAST(tour.t_id AS CHAR)  || ' +
            '   ":::full="  ||  CAST(COALESCE(kt_full, "false") AS CHAR) || ":::linkedRouteAttr=" || COALESCE(kategorie_tour.kt_route_attr, "null")');
        sql = sql.replace(/\(SELECT CONCAT\("type=", COALESCE\(if_typ, "null"\), ":::name=", COALESCE\(if_name, "null"\),    ":::refId=", CAST\(info.if_id AS CHAR\), ":::linkedDetails=", COALESCE\((.*?), "null"\)\)/g,
            'SELECT linkedinfos FROM (SELECT "type=" || COALESCE(if_typ, "null") || ":::name=" || COALESCE(if_name, "null") ||' +
            '    ":::refId=" || CAST(info.if_id AS CHAR) || ":::linkedDetails=" || COALESCE($1, "null")');
        sql = sql.replace(/\(SELECT CONCAT\("navid=(.*?)", (.*?), ":::name=", COALESCE\((.*?), "null"\), ":::navtype=", "/g,
            'SELECT navigation_objects FROM (SELECT ("navid=$1" || $2 || ":::name=" || COALESCE($3, "null") || ":::navtype=');
        sql = sql.replace(/CONCAT\((.*?), CAST\(COUNT\(DISTINCT (.*?)\) AS CHAR\)\)/g,
            '$1 || CAST(COUNT(DISTINCT $2) AS CHAR(50))');
        sql = sql.replace(/CONCAT\((.*?), CAST\(COUNT\(DISTINCT (.*?)\) AS CHAR\)\)/g,
            '$1 || CAST(COUNT(DISTINCT $2) AS CHAR(50))');
        sql = sql.replace(/CONCAT\((.*?), CAST\(COUNT\(DISTINCT (.*?)\) AS CHAR\)\)/g,
            '$1 || CAST(COUNT(DISTINCT $2) AS CHAR(50))');
        sql = sql.replace(/CONCAT\("ele_", ROUND\(\((.*?) \/ 500\)\)\*500\)/g,
            '"ele_" || CAST(ROUND(($1 / 500))*500 AS INTEGER)');

        return sql;
    }
}

