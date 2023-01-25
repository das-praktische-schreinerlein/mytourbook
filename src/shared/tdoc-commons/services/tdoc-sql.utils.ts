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

        sql = sql.replace(/\(SELECT CONCAT\("type=mainroute:::name=", COALESCE\(t_name, "null"\), ":::refId=", CAST\(tour.t_id AS CHAR\),   ":::full=true:::linkedRouteAttr=", COALESCE\(kategorie.k_route_attr, "null"\)\)/g,
            'SELECT linkedroutes FROM (SELECT "type=mainroute:::name="  ||  COALESCE(t_name, "null")  ||  ":::refId="  ||  CAST(tour.t_id AS CHAR)  || ' +
            '   ":::full=true:::linkedRouteAttr=" || COALESCE(kategorie.k_route_attr, "null")');
        sql = sql.replace(/\(SELECT CONCAT\("type=subroute:::name=", COALESCE\(t_name, "null"\), ":::refId=", CAST\(tour.t_id AS CHAR\),   ":::full=", CAST\(COALESCE\(kt_full, "false"\) AS CHAR\), ":::linkedRouteAttr=", COALESCE\(kategorie_tour.kt_route_attr, "null"\)\)/g,
            'SELECT linkedroutes FROM (SELECT "type=subroute:::name="  ||  COALESCE(t_name, "null")  ||  ":::refId="  ||  CAST(tour.t_id AS CHAR)  || ' +
            '   ":::full="  ||  CAST(COALESCE(kt_full, "false") AS CHAR) || ":::linkedRouteAttr=" || COALESCE(kategorie_tour.kt_route_attr, "null")');
        sql = sql.replace(/SELECT CONCAT\("type=", COALESCE\(if_typ, "null"\), ":::name=", COALESCE\(if_name, "null"\),    ":::refId=", CAST\(info.if_id AS CHAR\), ":::linkedDetails=", COALESCE\((.*?), "null"\)\)/g,
            'SELECT "type=" || COALESCE(if_typ, "null") || ":::name=" || COALESCE(if_name, "null") ||' +
            '    ":::refId=" || CAST(info.if_id AS CHAR) || ":::linkedDetails=" || COALESCE($1, "null")');
        sql = sql.replace(/SELECT CONCAT\("type=playlist:::name=", COALESCE\(p_name, "null"\), ":::refId=", CAST\(playlist.p_id AS CHAR\),   ":::position=", COALESCE\((.*?), "null"\),   ":::details=", COALESCE\((.*?), "null"\)\)/g,
            'SELECT "type=playlist:::name=" || COALESCE(p_name, "null") ||' +
            '    ":::refId=" || CAST(playlist.p_id AS CHAR) || ":::position=" || COALESCE($1, "null") || ":::details=" || COALESCE($2, "null")');
        sql = sql.replace(/\(SELECT CONCAT\("navid=(.*?)", (.*?), ":::name=", COALESCE\((.*?), "null"\), ":::navtype=", "/g,
            'SELECT navigation_objects FROM (SELECT ("navid=$1" || $2 || ":::name=" || COALESCE($3, "null") || ":::navtype=');
        sql = sql.replace(/CONCAT\("type=", COALESCE\(1, "null"\), ":::name=", COALESCE\(poi_name, "null"\),    ":::refId=", CAST\(poi.poi_id AS CHAR\), ":::poitype=", COALESCE\((.*?), "null"\),    ":::position=", COALESCE\((.*?), "null"\),    ":::geoLoc=", CONCAT\(poi_geo_latdeg, ",", poi_geo_longdeg\), ":::geoEle=", COALESCE\(poi_geo_ele, 0\)   \)/g,
           '"type=" || COALESCE(1, "null") || ":::name=" || COALESCE(poi_name, "null") ||    ":::refId=" || CAST(poi.poi_id AS CHAR) || ":::poitype=" || COALESCE($1, "null") ||    ":::position=" || COALESCE($2, "null") ||    ":::geoLoc=" || poi_geo_latdeg || "," || poi_geo_longdeg || ":::geoEle=" || COALESCE(poi_geo_ele, 0)');
        sql = sql.replace(/CONCAT\("ioId=", COALESCE\(image_object.io_id, ""\), ":::key=", COALESCE\(image_object.io_obj_type, ""\), ":::detector=", COALESCE\(image_object.io_detector, ""\), ":::imgWidth=", COALESCE\(image_object.io_img_width, ""\), ":::imgHeight=", COALESCE\(image_object.io_img_height, ""\), ":::objX=", COALESCE\(image_object.io_obj_x1, ""\), ":::objY=", COALESCE\(image_object.io_obj_y1, ""\), ":::objWidth=", COALESCE\(image_object.io_obj_width, ""\), ":::objHeight=", COALESCE\(image_object.io_obj_height, ""\), ":::name=", objects.o_name, ":::category=", objects.o_category, ":::precision=", COALESCE\(image_object.io_precision, ""\), ":::state=", COALESCE\(image_object.io_state, ""\)\)/g,
            '"ioId=" || COALESCE(image_object.io_id, "") || ":::key=" || COALESCE(image_object.io_obj_type, "") || ":::detector=" || COALESCE(image_object.io_detector, "") || ":::imgWidth=" || COALESCE(image_object.io_img_width, "") || ":::imgHeight=" || COALESCE(image_object.io_img_height, "") || ":::objX=" || COALESCE(image_object.io_obj_x1, "") || ":::objY=" || COALESCE(image_object.io_obj_y1, "") || ":::objWidth=" || COALESCE(image_object.io_obj_width, "") || ":::objHeight=" || COALESCE(image_object.io_obj_height, "") || ":::name=" || objects.o_name || ":::category=" || objects.o_category || ":::precision=" || COALESCE(image_object.io_precision, "") || ":::state=" || COALESCE(image_object.io_state, "")');
        sql = sql.replace(/CONCAT\("ioId=", COALESCE\(image_object.io_id, ""\), ":::fileName=", COALESCE\(image.i_calced_path, ""\), ":::key=", COALESCE\(image_object.io_obj_type, ""\), ":::detector=", COALESCE\(image_object.io_detector, ""\), ":::imgWidth=", COALESCE\(image_object.io_img_width, ""\), ":::imgHeight=", COALESCE\(image_object.io_img_height, ""\), ":::objX=", COALESCE\(image_object.io_obj_x1, ""\), ":::objY=", COALESCE\(image_object.io_obj_y1, ""\), ":::objWidth=", COALESCE\(image_object.io_obj_width, ""\), ":::objHeight=", COALESCE\(image_object.io_obj_height, ""\), ":::name=", objects.o_name, ":::category=", objects.o_category, ":::precision=", COALESCE\(image_object.io_precision, ""\), ":::state=", COALESCE\(image_object.io_state, ""\)\)/g,
            '"ioId=" || COALESCE(image_object.io_id, "") || ":::fileName=" || COALESCE(image.i_calced_path, "") || ":::key=" || COALESCE(image_object.io_obj_type, "") || ":::detector=" || COALESCE(image_object.io_detector, "") || ":::imgWidth=" || COALESCE(image_object.io_img_width, "") || ":::imgHeight=" || COALESCE(image_object.io_img_height, "") || ":::objX=" || COALESCE(image_object.io_obj_x1, "") || ":::objY=" || COALESCE(image_object.io_obj_y1, "") || ":::objWidth=" || COALESCE(image_object.io_obj_width, "") || ":::objHeight=" || COALESCE(image_object.io_obj_height, "") || ":::name=" || objects.o_name || ":::category=" || objects.o_category || ":::precision=" || COALESCE(image_object.io_precision, "") || ":::state=" || COALESCE(image_object.io_state, "")');

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

