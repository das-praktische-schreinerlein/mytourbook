#!/usr/bin/env node

var stdin = process.stdin,
    stdout = process.stdout,
    inputChunks = [];

stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
    inputChunks.push(chunk);
});

stdin.on('end', function () {
    var inputSql = inputChunks.join();
    var transormedSql = transformTourDocToSqliteDialect(inputSql);
    transormedSql = transformGenericToSqliteDialect(transormedSql);
    stdout.write(transormedSql);
    stdout.write('\n');
});

function transformGenericToSqliteDialect(sql) {
    var replace = ' CONCAT(';
    while (sql.indexOf(replace) >= 0) {
        var start = sql.indexOf(replace);
        var end = sql.indexOf(')', start);
        var sqlPre = sql.substr(0, start + 1);
        var sqlAfter = sql.substr(end + 1);
        var toBeConverted = sql.substr(start + replace.length, end - start - replace.length);
        // TODO: check security
        sql = sqlPre + toBeConverted.replace(/, /g, ' || ') + sqlAfter;
    }

    sql = sql.replace(/GREATEST\(/g, 'MAX(');
    sql = sql.replace(/SUBSTRING_INDEX\(/g, 'SUBSTR(');
    sql = sql.replace(/CHAR_LENGTH\(/g, 'LENGTH(');
    sql = sql.replace(/GROUP_CONCAT\(DISTINCT CONCAT\((.*?)\) SEPARATOR (.*?)\)/g, 'GROUP_CONCAT( CONCAT($1), $2)');
    sql = sql.replace(/GROUP_CONCAT\(DISTINCT (.*?) ORDER BY (.*?) SEPARATOR (.*?)\)/g, 'GROUP_CONCAT($1, $3)');
    sql = sql.replace(/GROUP_CONCAT\(DISTINCT (.*?) SEPARATOR (.*?)\)/g, 'GROUP_CONCAT($1, $2)');
    sql = sql.replace(/GROUP_CONCAT\((.*?) SEPARATOR (.*?)\)/g, 'GROUP_CONCAT($1, $2)');
    sql = sql.replace(/MONTH\((.*?)\)/g, 'CAST(STRFTIME(\'%m\', $1) AS INT)');
    sql = sql.replace(/WEEK\((.*?)\)/g, 'CAST(STRFTIME(\'%W\', $1) AS INT)');
    sql = sql.replace(/YEAR\((.*?)\)/g, 'CAST(STRFTIME(\'%Y\', $1) AS INT)');
    sql = sql.replace(/DATE_FORMAT\((.+?), GET_FORMAT\(DATE, 'ISO'\)\)/g, 'DATETIME($1)');
    sql = sql.replace(/TIME_TO_SEC\(TIMEDIFF\((.*?), (.*?)\)\)\/3600/g, '(JULIANDAY($1) - JULIANDAY($2)) * 24');
    sql = sql.replace(/TIME_TO_SEC\(TIMEDIFF\((.*?), (.*?)\)\) \/ 3600/g, '(JULIANDAY($1) - JULIANDAY($2)) * 24');
    sql = sql.replace(/ FROM DUAL /gi, ' ');

    return  sql;
}


function transformTourDocToSqliteDialect(sql) {
    // dirty workaround because sqlite has no functions as mysql
    sql = sql.replace(/GetTechName\(GetLocationNameAncestry\(location.l_id, location.l_name, \' -> \'\)\)/g,
        'GetTechName(location.l_name)');
    sql = sql.replace(/GetTechName\(GetLocationNameAncestry\(lifl.l_id, lifl.l_name, \' -> \'\)\)/g,
        'GetTechName(lifl.l_name)');
    sql = sql.replace(/GetLocationNameAncestry\(location.l_id, location.l_name, \' -> \'\)/g,
        '\'T\' || location.l_typ || \'L\' || location.l_parent_id || \' -> \' || location.l_name');
    sql = sql.replace(/GetLocationNameAncestry\(location.l_id, location.l_name, \'->\'\)/g,
        '\'T\' || location.l_typ || \'L\' || location.l_parent_id || \'->\' || location.l_name');
    sql = sql.replace(/GetLocationIdAncestry\(location.l_id, \',\'\)/g,
        'CAST(location.l_parent_id AS CHAR(50)) || \',\' || CAST(location.l_id AS CHAR(50))');

    sql = sql.replace('CONCAT(CAST(location.l_parent_id AS CHAR(50)), \',\', CAST(location.l_id AS CHAR(50)))',
        'CAST(location.l_parent_id AS CHAR(50)) || \',\' || CAST(location.l_id AS CHAR(50))');
    sql = sql.replace(/GetTechName\(([a-zA-Z0-9_.]+)\)/g,
        'REPLACE(REPLACE(LOWER($1), \' \', \'_\'), \'/\', \'_\')');
    sql = sql.replace(/REGEXP_REPLACE\(/g, 'REPLACE(');
    sql = sql.replace(/MD5\(CONCAT\(([a-zA-Z0-9_.]+), \'_\', ([a-zA-Z0-9_.]+), \'_\', ([a-zA-Z0-9_.]+), \'_\', ([a-zA-Z0-9_.]+)\)\)/g,
        'REPLACE(REPLACE(LOWER($1 || \'_\' || $2 || \'_\' || $3 || \'_\' || $4), \' \', \'_\'), \'/\', \'_\')');
    sql = sql.replace(/\(SELECT CONCAT\(\'type=subroute:::name=\', COALESCE\(t_name, \'null\'\), \':::refId=\', CAST\(tour.t_id AS CHAR\),   \':::full=\', CAST\(COALESCE\(kt_full, \'false\'\) AS CHAR\)\)/g,
        'SELECT linkedroutes FROM (SELECT \'type=subroute:::name=\'  ||  COALESCE(t_name, \'null\')  ||  \':::refId=\'  ||  CAST(tour.t_id AS CHAR)  || ' +
        '   \':::full=\'  ||  CAST(COALESCE(kt_full, \'false\') AS CHAR)');
    sql = sql.replace(/\(SELECT CONCAT\(\'type=\', COALESCE\(if_typ, \'null\'\), \':::name=\', COALESCE\(if_name, \'null\'\),    \':::refId=\', CAST\(info.if_id AS CHAR\), \':::linkedDetails=\', COALESCE\((.*?), \'null\'\)\)/g,
        'SELECT linkedinfos FROM (SELECT \'type=\' || COALESCE(if_typ, \'null\') || \':::name=\' || COALESCE(if_name, \'null\') ||' +
        '    \':::refId=\' || CAST(info.if_id AS CHAR) || \':::linkedDetails=\' || COALESCE($1, \'null\')');
    sql = sql.replace(/\(SELECT CONCAT\("navid=(.*?)", (.*?), ":::name=", COALESCE\((.*?), "null"\), ":::navtype=", "/g,
        'SELECT navigation_objects FROM (SELECT ("navid=$1" || $2 || ":::name=" || COALESCE($3, "null") || ":::navtype=');
    sql = sql.replace(/CONCAT\((.*?), CAST\(COUNT\(DISTINCT (.*?)\) AS CHAR\)\)/g,
        '$1 || CAST(COUNT(DISTINCT $2) AS CHAR(50))');
    sql = sql.replace(/CONCAT\((.*?), CAST\(COUNT\(DISTINCT (.*?)\) AS CHAR\)\)/g,
        '$1 || CAST(COUNT(DISTINCT $2) AS CHAR(50))');
    sql = sql.replace(/CONCAT\((.*?), CAST\(COUNT\(DISTINCT (.*?)\) AS CHAR\)\)/g,
        '$1 || CAST(COUNT(DISTINCT $2) AS CHAR(50))');

    return sql;
}

