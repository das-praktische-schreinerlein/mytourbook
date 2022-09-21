-- delete duplicated keywords;

-- ------------------------------------;
-- ----- location;
-- ------------------------------------;

select cnt, count(*)
from (select count(*) as cnt
      from location_keyword as UpdateKeywords inner join keyword k on UpdateKeywords.KW_ID = k.KW_ID
      group by l_id, KW_NAME) grouped
group by cnt;


select joined_keyword.kw_id as old_kw_id, keyword.kw_name, doubleKeywords.new_kw_id, doubleKeywords.all_kw_id from location_keyword as joined_keyword
    inner join keyword on joined_keyword.kw_id = keyword.kw_id
    inner join
    (select min(keyword.kw_id) as new_kw_id, GROUP_CONCAT(keyword.kw_id) as all_kw_id, keyword.kw_name, doubletes.double_count
        from keyword inner join
            (SELECT
                    kw_name, COUNT(*) as double_count
                FROM
                    keyword
                GROUP BY
                    kw_name
                HAVING
                    COUNT(*) > 1) doubletes
        where doubletes.kw_name = keyword.kw_name
        group by keyword.kw_name, doubletes.double_count) as doubleKeywords on keyword.kw_name = doubleKeywords.KW_NAME
where joined_keyword.kw_id <> new_kw_id
LIMIT 10;


update location_keyword as UpdateKeywords inner join
    (select joined_keyword.kw_id as old_kw_id, keyword.kw_name, doubleKeywords.new_kw_id
     from location_keyword as joined_keyword
              inner join keyword on joined_keyword.kw_id = keyword.kw_id
              inner join
          (select min(keyword.kw_id)          as new_kw_id,
                  keyword.kw_name,
                  doubletes.double_count
           from keyword
                    inner join
                (SELECT kw_name, kw_id,
                        COUNT(*) as double_count
                 FROM keyword
                 GROUP BY kw_name
                 HAVING COUNT(*) > 1) doubletes
           where doubletes.kw_name = keyword.kw_name
           group by keyword.kw_name, doubletes.double_count) as doubleKeywords
          on keyword.kw_name = doubleKeywords.KW_NAME
     where joined_keyword.kw_id <> new_kw_id) doubletteKeywords on UpdateKeywords.kw_id = doubletteKeywords.old_kw_id
set UpdateKeywords.KW_ID=doubletteKeywords.new_kw_id
where UpdateKeywords.kw_id in
      (
      SELECT kw_id from keyword where kw_name in
        (
            select kw_name FROM keyword
                GROUP BY kw_name
                HAVING COUNT(*) > 1
        )
     )
;

select cnt, count(*)
from (select count(*) as cnt
      from location_keyword as UpdateKeywords inner join keyword k on UpdateKeywords.KW_ID = k.KW_ID
      group by l_id, KW_NAME) grouped
group by cnt;


SELECT distinct c1.* FROM location_keyword c1
INNER JOIN location_keyword c2
WHERE
    c1.lk_id > c2.lk_id AND
    c1.l_id = c2.l_id AND
    c1.kw_id = c2.kw_id
LIMIT 10;

CREATE TEMPORARY TABLE IF NOT EXISTS tmp_location_keyword AS (SELECT *
                                                          FROM location_keyword
                                                          where true = false);
INSERT INTO tmp_location_keyword
    SELECT MIN(lk_id), l_id, kw_id
    FROM location_keyword
    GROUP BY l_id, kw_id
    HAVING COUNT(*) > 1;
DELETE location_keyword
    FROM location_keyword, tmp_location_keyword
    WHERE location_keyword.l_id = tmp_location_keyword.l_id
        AND location_keyword.kw_id = tmp_location_keyword.kw_id
        AND location_keyword.lk_id > tmp_location_keyword.lk_id;
DROP TABLE tmp_location_keyword;


select cnt, count(*)
from (select count(*) as cnt
      from location_keyword as UpdateKeywords inner join keyword k on UpdateKeywords.KW_ID = k.KW_ID
      group by l_id, KW_NAME) grouped
group by cnt;
