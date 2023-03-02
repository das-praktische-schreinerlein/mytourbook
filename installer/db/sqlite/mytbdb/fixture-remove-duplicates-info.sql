-- delete duplicated keywords;

-- ------------------------------------;
-- ----- info;
-- ------------------------------------;
update info
set KW_ID=doubletteKeywords.new_kw_id
FROM (
    select joined_keyword.kw_id as old_kw_id, keyword.kw_name, doubleKeywords.new_kw_id
     from info as joined_keyword
              inner join keyword on joined_keyword.kw_id = keyword.kw_id
              inner join
          (
           select min(keyword.kw_id)as new_kw_id,
                  keyword.kw_name,
                  doubletes.double_count
           from keyword inner join
                (
                SELECT kw_name, kw_id,
                        COUNT(*) as double_count
                FROM keyword
                GROUP BY kw_name
                HAVING COUNT(*) > 1
                ) doubletes
           where doubletes.kw_name = keyword.kw_name
           group by keyword.kw_name, doubletes.double_count) as doubleKeywords
          on keyword.kw_name = doubleKeywords.KW_NAME
     where joined_keyword.kw_id <> new_kw_id
     ) doubletteKeywords
where
    info.kw_id = doubletteKeywords.old_kw_id
    AND info.kw_id in
      (
      SELECT kw_id from keyword where kw_name in
        (
            select kw_name FROM keyword
                GROUP BY kw_name
                HAVING COUNT(*) > 1
        )
     )
;

-- ------------------------------------;
-- ----- info_keywords;
-- ------------------------------------;
update info_keyword
set KW_ID=doubletteKeywords.new_kw_id
FROM (
    select joined_keyword.kw_id as old_kw_id, keyword.kw_name, doubleKeywords.new_kw_id
     from info_keyword as joined_keyword
              inner join keyword on joined_keyword.kw_id = keyword.kw_id
              inner join
          (
           select min(keyword.kw_id)as new_kw_id,
                  keyword.kw_name,
                  doubletes.double_count
           from keyword inner join
                (
                SELECT kw_name, kw_id,
                        COUNT(*) as double_count
                FROM keyword
                GROUP BY kw_name
                HAVING COUNT(*) > 1
                ) doubletes
           where doubletes.kw_name = keyword.kw_name
           group by keyword.kw_name, doubletes.double_count) as doubleKeywords
          on keyword.kw_name = doubleKeywords.KW_NAME
     where joined_keyword.kw_id <> new_kw_id
     ) doubletteKeywords
where
    info_keyword.kw_id = doubletteKeywords.old_kw_id
    AND info_keyword.kw_id in
      (
      SELECT kw_id from keyword where kw_name in
        (
            select kw_name FROM keyword
                GROUP BY kw_name
                HAVING COUNT(*) > 1
        )
     )
;


CREATE TEMPORARY TABLE IF NOT EXISTS tmp_info_keyword AS
    SELECT * FROM info_keyword where true = false;

INSERT INTO tmp_info_keyword
    SELECT MIN(ifkw_id), if_id, kw_id
    FROM info_keyword
    GROUP BY if_id, kw_id
    HAVING COUNT(*) > 1;

DELETE FROM info_keyword
WHERE ifkw_id in
      (
      SELECT info_keyword.ifkw_id
      FROM info_keyword, tmp_info_keyword
      WHERE info_keyword.if_id = tmp_info_keyword.if_id
        AND info_keyword.kw_id = tmp_info_keyword.kw_id
        AND info_keyword.ifkw_id > tmp_info_keyword.ifkw_id
      );
DROP TABLE tmp_info_keyword;


select cnt, count(*)
from (
     select count(*) as cnt
     from info_keyword as UpdateKeywords inner join keyword k on UpdateKeywords.KW_ID = k.KW_ID
     group by if_id, KW_NAME) grouped
group by cnt;
