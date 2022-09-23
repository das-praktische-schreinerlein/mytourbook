-- delete duplicated keywords;

-- -----------------------
--  keywords
-- -----------------------

select min(keyword.kw_id) as new_kw_id, GROUP_CONCAT(keyword.kw_id) as all_kw_id, keyword.kw_name, doubletes.double_count
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
group by keyword.kw_name, doubletes.double_count
LIMIT 10;


DELETE FROM keyword
WHERE KW_ID NOT IN (
    select distinct KW_PARENT_ID from keyword where KW_PARENT_ID IS NOT NULL
    UNION
    select distinct kw_id from image_keyword
    UNION
    select distinct kw_id from info_keyword
    UNION
    select distinct kw_id from info where KW_ID IS NOT NULL
    UNION
    select distinct kw_id from kategorie_keyword
    UNION
    select distinct kw_id from location_keyword
    UNION
    select distinct kw_id from tour_keyword
    UNION
    select distinct kw_id from video_keyword
);


select cnt, count(*)
from (select count(*) as cnt
      from keyword as UpdateKeywords
      group by kw_name) grouped
group by cnt;
