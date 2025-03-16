-- delete duplicated pois;


-- ------
-- fix duplicated kategorie_poi
-- ------
-- duplicated kategorie_poi
select count(*), k_id, kpoi_type, poi_id from kategorie_poi group by k_id, kpoi_type, poi_id having count(*) > 1;

-- additional noautogpx to autogpx -> update autogpx with type of noautogpx and delete noautogpx -> kategorie
select
    noautogpx.k_id as id, noautogpx.poi_id,
    autogpx.kpoi_type as auto_type,
    autogpx.kpoi_pos as auto_pos,
    autogpx.kpoi_date as auto_date,
    noautogpx.kpoi_type as noauto_type,
    noautogpx.kpoi_pos as noauto_pos,
    noautogpx.kpoi_date as noauto_date,
    autogpx.kpoi_id, noautogpx.kpoi_id
from
    (select k_id, kpoi_type, poi_id, kpoi_id, kpoi_pos, kpoi_date from kategorie_poi where kpoi_type not in (65)) noautogpx
        inner join
    (select k_id, kpoi_type, poi_id, kpoi_id, kpoi_pos, kpoi_date from kategorie_poi where kpoi_type in (65)) autogpx
    on noautogpx.k_id = autogpx.k_id and noautogpx.poi_id = autogpx.poi_id
order by id, poi_id, auto_pos;

update kategorie_poi
    inner Join (select noautogpx.k_id      as id,
    noautogpx.poi_id,
    autogpx.kpoi_type   as auto_type,
    autogpx.kpoi_pos    as auto_pos,
    autogpx.kpoi_date    as auto_date,
    noautogpx.kpoi_type as noauto_type,
    noautogpx.kpoi_pos  as noauto_pos,
    noautogpx.kpoi_date  as noauto_date,
    autogpx.kpoi_id as auto_kpoi_id,
    noautogpx.kpoi_id as noauto_kpoi_id
    from (select k_id, kpoi_type, poi_id, kpoi_id, kpoi_pos, kpoi_date from kategorie_poi where kpoi_type not in (65)) noautogpx
    inner join
    (select k_id, kpoi_type, poi_id, kpoi_id, kpoi_pos, kpoi_date from kategorie_poi where kpoi_type in (65)) autogpx
    on noautogpx.k_id = autogpx.k_id and noautogpx.poi_id = autogpx.poi_id
    order by id, poi_id, auto_pos) as updatepois on noauto_kpoi_id = kategorie_poi.kpoi_id
    set
        kategorie_poi.kpoi_pos= auto_pos + 1000;

select k_id, kpoi_type, poi_id, kpoi_id, kpoi_pos from kategorie_poi where kpoi_pos > 1000;
select count(*), k_id, kpoi_type, poi_id from kategorie_poi group by k_id, kpoi_type, poi_id having count(*) > 1;


update kategorie_poi
    inner Join (select noautogpx.k_id      as id,
    noautogpx.poi_id,
    autogpx.kpoi_type   as auto_type,
    autogpx.kpoi_pos    as auto_pos,
    noautogpx.kpoi_type as noauto_type,
    noautogpx.kpoi_pos  as noauto_pos,
    autogpx.kpoi_id as auto_kpoi_id,
    noautogpx.kpoi_id as noauto_kpoi_id
    from (select k_id, kpoi_type, poi_id, kpoi_id, kpoi_pos from kategorie_poi where kpoi_type not in (65)) noautogpx
    inner join
    (select k_id, kpoi_type, poi_id, kpoi_id, kpoi_pos from kategorie_poi where kpoi_type in (65)) autogpx
    on noautogpx.k_id = autogpx.k_id and noautogpx.poi_id = autogpx.poi_id
    order by id, poi_id, auto_pos) as updatepois on auto_kpoi_id = kategorie_poi.kpoi_id
    set
        kategorie_poi.kpoi_type=noauto_type;

select count(*), k_id, kpoi_type, poi_id from kategorie_poi group by k_id, kpoi_type, poi_id having count(*) > 1;


select
    noautogpx.k_id as id, noautogpx.poi_id,
    autogpx.kpoi_type as auto_type,
    autogpx.kpoi_pos as auto_pos,
    autogpx.kpoi_date as auto_date,
    noautogpx.kpoi_type as noauto_type,
    noautogpx.kpoi_pos as noauto_pos,
    noautogpx.kpoi_date as noauto_date,
    autogpx.kpoi_id, noautogpx.kpoi_id
from
    (select k_id, kpoi_type, poi_id, kpoi_id, kpoi_pos, kpoi_date from kategorie_poi where kpoi_type not in (65)) noautogpx
        inner join
    (select k_id, kpoi_type, poi_id, kpoi_id, kpoi_pos, kpoi_date from kategorie_poi where kpoi_type in (65)) autogpx
    on noautogpx.k_id = autogpx.k_id and noautogpx.poi_id = autogpx.poi_id
order by id, poi_id, auto_pos;

delete from kategorie_poi where kpoi_pos > 1000;

select count(*), k_id, kpoi_type, poi_id from kategorie_poi group by k_id, kpoi_type, poi_id having count(*) > 1;



-- ------
-- fix duplicated tour_poi
-- ------
-- duplicated tour_poi
select count(*), t_id, tpoi_type, poi_id from tour_poi group by t_id, tpoi_type, poi_id having count(*) > 1;

-- additional noautogpx to autogpx -> update autogpx with type of noautogpx and delete noautogpx -> tour
select
    noautogpx.t_id as id, noautogpx.poi_id,
    autogpx.tpoi_type as auto_type,
    autogpx.tpoi_pos as auto_pos,
    autogpx.tpoi_date as auto_date,
    noautogpx.tpoi_type as noauto_type,
    noautogpx.tpoi_pos as noauto_pos,
    noautogpx.tpoi_date as noauto_date,
    autogpx.tpoi_id, noautogpx.tpoi_id
from
    (select t_id, tpoi_type, poi_id, tpoi_id, tpoi_pos, tpoi_date from tour_poi where tpoi_type not in (65)) noautogpx
        inner join
    (select t_id, tpoi_type, poi_id, tpoi_id, tpoi_pos, tpoi_date from tour_poi where tpoi_type in (65)) autogpx
    on noautogpx.t_id = autogpx.t_id and noautogpx.poi_id = autogpx.poi_id
order by id, poi_id, auto_pos;

update tour_poi
    inner Join (select noautogpx.t_id      as id,
    noautogpx.poi_id,
    autogpx.tpoi_type   as auto_type,
    autogpx.tpoi_pos    as auto_pos,
    autogpx.tpoi_date    as auto_date,
    noautogpx.tpoi_type as noauto_type,
    noautogpx.tpoi_pos  as noauto_pos,
    noautogpx.tpoi_date  as noauto_date,
    autogpx.tpoi_id as auto_kpoi_id,
    noautogpx.tpoi_id as noauto_kpoi_id
    from (select t_id, tpoi_type, poi_id, tpoi_id, tpoi_pos, tpoi_date from tour_poi where tpoi_type not in (65)) noautogpx
    inner join
    (select t_id, tpoi_type, poi_id, tpoi_id, tpoi_pos, tpoi_date from tour_poi where tpoi_type in (65)) autogpx
    on noautogpx.t_id = autogpx.t_id and noautogpx.poi_id = autogpx.poi_id
    order by id, poi_id, auto_pos) as updatepois on noauto_kpoi_id = tour_poi.tpoi_id
    set
        tour_poi.tpoi_pos= auto_pos + 1000;

select t_id, tpoi_type, poi_id, tpoi_id, tpoi_pos from tour_poi where tpoi_pos > 1000;
select count(*), t_id, tpoi_type, poi_id from tour_poi group by t_id, tpoi_type, poi_id having count(*) > 1;


update tour_poi
    inner Join (select noautogpx.t_id      as id,
    noautogpx.poi_id,
    autogpx.tpoi_type   as auto_type,
    autogpx.tpoi_pos    as auto_pos,
    noautogpx.tpoi_type as noauto_type,
    noautogpx.tpoi_pos  as noauto_pos,
    autogpx.tpoi_id as auto_kpoi_id,
    noautogpx.tpoi_id as noauto_kpoi_id
    from (select t_id, tpoi_type, poi_id, tpoi_id, tpoi_pos from tour_poi where tpoi_type not in (65)) noautogpx
    inner join
    (select t_id, tpoi_type, poi_id, tpoi_id, tpoi_pos from tour_poi where tpoi_type in (65)) autogpx
    on noautogpx.t_id = autogpx.t_id and noautogpx.poi_id = autogpx.poi_id
    order by id, poi_id, auto_pos) as updatepois on auto_kpoi_id = tour_poi.tpoi_id
    set
        tour_poi.tpoi_type=noauto_type;

select count(*), t_id, tpoi_type, poi_id from tour_poi group by t_id, tpoi_type, poi_id having count(*) > 1;


select
    noautogpx.t_id as id, noautogpx.poi_id,
    autogpx.tpoi_type as auto_type,
    autogpx.tpoi_pos as auto_pos,
    autogpx.tpoi_date as auto_date,
    noautogpx.tpoi_type as noauto_type,
    noautogpx.tpoi_pos as noauto_pos,
    noautogpx.tpoi_date as noauto_date,
    autogpx.tpoi_id, noautogpx.tpoi_id
from
    (select t_id, tpoi_type, poi_id, tpoi_id, tpoi_pos, tpoi_date from tour_poi where tpoi_type not in (65)) noautogpx
        inner join
    (select t_id, tpoi_type, poi_id, tpoi_id, tpoi_pos, tpoi_date from tour_poi where tpoi_type in (65)) autogpx
    on noautogpx.t_id = autogpx.t_id and noautogpx.poi_id = autogpx.poi_id
order by id, poi_id, auto_pos;

delete from tour_poi where tpoi_pos > 1000;

select count(*), t_id, tpoi_type, poi_id from tour_poi group by t_id, tpoi_type, poi_id having count(*) > 1;
