-- delete duplicated keywords;

-- ------------------------------------;
-- ----------- kategorie;
-- ------------------------------------;
select cnt, count(*)
from (select count(*) as cnt
      from kategorie_keyword as UpdateKeywords inner join keyword k on UpdateKeywords.KW_ID = k.KW_ID
      group by k_id, KW_NAME) grouped
group by cnt;


select joined_keyword.kw_id as old_kw_id, keyword.kw_name, doubleKeywords.new_kw_id, doubleKeywords.all_kw_id from kategorie_keyword as joined_keyword
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


update kategorie_keyword as UpdateKeywords inner join
    (select joined_keyword.kw_id as old_kw_id, keyword.kw_name, doubleKeywords.new_kw_id
     from kategorie_keyword as joined_keyword
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
      from kategorie_keyword as UpdateKeywords inner join keyword k on UpdateKeywords.KW_ID = k.KW_ID
      group by k_id, KW_NAME) grouped
group by cnt;


SELECT distinct c1.* FROM kategorie_keyword c1
INNER JOIN kategorie_keyword c2
WHERE
    c1.kk_id > c2.kk_id AND
    c1.k_id = c2.k_id AND
    c1.kw_id = c2.kw_id
LIMIT 10;

CREATE TEMPORARY TABLE IF NOT EXISTS tmp_kategorie_keyword AS (SELECT *
                                                          FROM kategorie_keyword
                                                          where true = false);
INSERT INTO tmp_kategorie_keyword
    SELECT MIN(kk_id), k_id, kw_id
    FROM kategorie_keyword
    GROUP BY k_id, kw_id
    HAVING COUNT(*) > 1;
DELETE kategorie_keyword
    FROM kategorie_keyword, tmp_kategorie_keyword
    WHERE kategorie_keyword.k_id = tmp_kategorie_keyword.k_id
        AND kategorie_keyword.kw_id = tmp_kategorie_keyword.kw_id
        AND kategorie_keyword.kk_id > tmp_kategorie_keyword.kk_id;
DROP TABLE tmp_kategorie_keyword;


select cnt, count(*)
from (select count(*) as cnt
      from kategorie_keyword as UpdateKeywords inner join keyword k on UpdateKeywords.KW_ID = k.KW_ID
      group by k_id, KW_NAME) grouped
group by cnt;
