-- delete duplicated keywords;

-- ------------------------------------;
-- ----------- tour_keyword;
-- ------------------------------------;
update tour_keyword
set KW_ID=doubletteKeywords.new_kw_id
FROM (
    select joined_keyword.kw_id as old_kw_id, keyword.kw_name, doubleKeywords.new_kw_id
     from tour_keyword as joined_keyword
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
    tour_keyword.kw_id = doubletteKeywords.old_kw_id
    AND tour_keyword.kw_id in
      (
      SELECT kw_id from keyword where kw_name in
        (
            select kw_name FROM keyword
                GROUP BY kw_name
                HAVING COUNT(*) > 1
        )
     )
;


CREATE TEMPORARY TABLE IF NOT EXISTS tmp_tour_keyword AS
    SELECT * FROM tour_keyword where true = false;

INSERT INTO tmp_tour_keyword
    SELECT MIN(tk_id), t_id, kw_id
    FROM tour_keyword
    GROUP BY t_id, kw_id
    HAVING COUNT(*) > 1;

DELETE FROM tour_keyword
WHERE tk_id in
      (
      SELECT tour_keyword.tk_id
      FROM tour_keyword, tmp_tour_keyword
      WHERE tour_keyword.t_id = tmp_tour_keyword.t_id
        AND tour_keyword.kw_id = tmp_tour_keyword.kw_id
        AND tour_keyword.tk_id > tmp_tour_keyword.tk_id
      );
DROP TABLE tmp_tour_keyword;


select cnt, count(*)
from (
     select count(*) as cnt
     from tour_keyword as UpdateKeywords inner join keyword k on UpdateKeywords.KW_ID = k.KW_ID
     group by t_id, KW_NAME) grouped
group by cnt;
