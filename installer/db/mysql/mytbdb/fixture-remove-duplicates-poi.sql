-- ------------------------------------;
-- ----------- poi;
-- ------------------------------------;

update poi_keyword as UpdateKeywords inner join
    (select joined_keyword.kw_id as old_kw_id, keyword.kw_name, doubleKeywords.new_kw_id
    from poi_keyword as joined_keyword
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


CREATE TEMPORARY TABLE IF NOT EXISTS tmp_poi_keyword AS (SELECT *
                                                          FROM poi_keyword
                                                          where true = false);
INSERT INTO tmp_poi_keyword
SELECT MIN(poik_id), poi_id, kw_id
FROM poi_keyword
GROUP BY poi_id, kw_id
HAVING COUNT(*) > 1;
DELETE poi_keyword
    FROM poi_keyword, tmp_poi_keyword
    WHERE poi_keyword.poi_id = tmp_poi_keyword.poi_id
        AND poi_keyword.kw_id = tmp_poi_keyword.kw_id
        AND poi_keyword.poik_id > tmp_poi_keyword.poik_id;
DROP TABLE tmp_poi_keyword;


select cnt, count(*)
from (select count(*) as cnt
      from poi_keyword as UpdateKeywords inner join keyword k on UpdateKeywords.KW_ID = k.KW_ID
      group by poi_id, KW_NAME) grouped
group by cnt;
