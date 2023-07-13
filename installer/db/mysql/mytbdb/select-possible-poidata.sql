-- select keywords used by poi to add to config.json
select concat('"', group_concat(distinct kw_name order by kw_name separator '",\n "'), '"')
from keyword inner join poi_keyword on keyword.kw_id = poi_keyword.kw_id where kw_name not like 'KW_%';

-- prepare inserts for possible tour_pois
select useIt, typ, t_name, poi_name, distance, tour_poi_name, insertMain, insertStart, t_id, poi_id from (
    select '' useIt, 'Hauptziel' as typ, t.t_id, poi.poi_id, t.t_desc_ziel tour_poi_name, poi.poi_name, t.t_name,
           ST_DISTANCE(Point(l.l_geo_latdeg, l.l_geo_longdeg), Point(poi_geo_latdeg, poi_geo_longdeg)) * 111.38 as distance,
           CONCAT('INSERT INTO tour_poi(t_id, poi_id, tpoi_pos, tpoi_type) VALUES(', cast(t.t_id as varchar(25)), ', ', cast(poi.poi_id as varchar(25)), ', 2, 20) -- ', t.t_desc_ziel, ', ', poi.poi_name, ', ', ', ', t.t_name) insertMain,
           '' insertStart
        from poi inner join tour t on poi_name like t.t_desc_ziel
        inner join location l on t.l_id=l.l_id
        where abs(l.l_geo_longdeg - poi.poi_geo_longdeg) < 0.5
         and abs(l.l_geo_latdeg - poi.poi_geo_latdeg) < 0.5
         and not exists (select poi_id from tour_poi tpoi where tpoi.t_id= t.t_id and tpoi.tpoi_type in (20, 30))
    union
    select '' useIt, 'StartEnde' as typ, t.t_id, poi.poi_id, t.t_desc_talort tour_poi_name, poi.poi_name, t.t_name,
           ST_DISTANCE(Point(l.l_geo_latdeg, l.l_geo_longdeg), Point(poi_geo_latdeg, poi_geo_longdeg)) * 111.38 as distance,
           CONCAT('INSERT INTO tour_poi(t_id, poi_id, tpoi_pos, tpoi_type) VALUES(', cast(t.t_id as varchar(25)), ', ', cast(poi.poi_id as varchar(25)), ', 2, 10) -- ', t.t_desc_ziel, ', ', poi.poi_name, ', ', ', ', t.t_name),
           CONCAT('INSERT INTO tour_poi(t_id, poi_id, tpoi_pos, tpoi_type) VALUES(', cast(t.t_id as varchar(25)), ', ', cast(poi.poi_id as varchar(25)), ', 2, 99) -- ', t.t_desc_ziel, ', ', poi.poi_name, ', ', ', ', t.t_name)
        from poi inner join tour t on t.t_desc_talort like concat('% ', poi_name)
        inner join location l on t.l_id=l.l_id
        where abs(l.l_geo_longdeg - poi.poi_geo_longdeg) < 0.5
         and abs(l.l_geo_latdeg - poi.poi_geo_latdeg) < 0.5
         and not exists (select poi_id from tour_poi tpoi where tpoi.t_id= t.t_id and tpoi.tpoi_type in (10, 99))
    union
    select '' useIt, 'StartEnde' as typ, t.t_id, poi.poi_id, l.l_name, poi.poi_name, t.t_name,
           ST_DISTANCE(Point(l.l_geo_latdeg, l.l_geo_longdeg), Point(poi_geo_latdeg, poi_geo_longdeg)) * 111.38 as distance,
           CONCAT('INSERT INTO tour_poi(t_id, poi_id, tpoi_pos, tpoi_type) VALUES(', cast(t.t_id as varchar(25)), ', ', cast(poi.poi_id as varchar(25)), ', 2, 10) -- ', t.t_desc_ziel, ', ', poi.poi_name, ', ', ', ', t.t_name),
           CONCAT('INSERT INTO tour_poi(t_id, poi_id, tpoi_pos, tpoi_type) VALUES(', cast(t.t_id as varchar(25)), ', ', cast(poi.poi_id as varchar(25)), ', 2, 99) -- ', t.t_desc_ziel, ', ', poi.poi_name, ', ', ', ', t.t_name)
        from poi inner join mediadb.location l on poi_name like l.l_name
        inner join mediadb.tour t on t.l_id=l.l_id
        where abs(l.l_geo_longdeg - poi.poi_geo_longdeg) < 0.5
         and abs(l.l_geo_latdeg - poi.poi_geo_latdeg) < 0.5
         and not exists (select poi_id from tour_poi tpoi where tpoi.t_id= t.t_id and tpoi.tpoi_type in (10, 99))
    union
    select '' useIt, 'StartEnde' as typ, t.t_id, poi.poi_id, l.l_name, poi.poi_name, t.t_name,
           ST_DISTANCE(Point(l.l_geo_latdeg, l.l_geo_longdeg), Point(poi_geo_latdeg, poi_geo_longdeg)) * 111.38 as distance,
           CONCAT('INSERT INTO tour_poi(t_id, poi_id, tpoi_pos, tpoi_type) VALUES(', cast(t.t_id as varchar(25)), ', ', cast(poi.poi_id as varchar(25)), ', 2, 10) -- ', t.t_desc_ziel, ', ', poi.poi_name, ', ', ', ', t.t_name),
           CONCAT('INSERT INTO tour_poi(t_id, poi_id, tpoi_pos, tpoi_type) VALUES(', cast(t.t_id as varchar(25)), ', ', cast(poi.poi_id as varchar(25)), ', 2, 99) -- ', t.t_desc_ziel, ', ', poi.poi_name, ', ', ', ', t.t_name)
        from poi inner join mediadb.location l on Concat('Fels ', poi_name) like l.l_name
        inner join mediadb.tour t on t.l_id=l.l_id
        where abs(l.l_geo_longdeg - poi.poi_geo_longdeg) < 0.5
         and abs(l.l_geo_latdeg - poi.poi_geo_latdeg) < 0.5
         and not exists (select poi_id from tour_poi tpoi where tpoi.t_id= t.t_id and tpoi.tpoi_type in (10, 99))
    union
    select '' useIt, 'Hauptziel' as typ, t.t_id, poi.poi_id, l.l_name, poi.poi_name, t.t_name,
           ST_DISTANCE(Point(l.l_geo_latdeg, l.l_geo_longdeg), Point(poi_geo_latdeg, poi_geo_longdeg)) * 111.38 as distance,
           CONCAT('INSERT INTO tour_poi(t_id, poi_id, tpoi_pos, tpoi_type) VALUES(', cast(t.t_id as varchar(25)), ', ', cast(poi.poi_id as varchar(25)), ', 2, 20) -- ', t.t_desc_ziel, ', ', poi.poi_name, ', ', ', ', t.t_name),
           ''
        from poi inner join mediadb.location l on Concat('Fels ', poi_name) like l.l_name
        inner join mediadb.tour t on t.l_id=l.l_id
        where abs(l.l_geo_longdeg - poi.poi_geo_longdeg) < 0.5
         and abs(l.l_geo_latdeg - poi.poi_geo_latdeg) < 0.5
         and not exists (select poi_id from tour_poi tpoi where tpoi.t_id= t.t_id and tpoi.tpoi_type in (20, 30))
) matched_pois order by t_name, distance;

-- add todo-keywords for tracks/routes without poi
INSERT INTO keyword (kw_name)
    SELECT 'KW_TODOPOISTART' FROM DUAL
    WHERE NOT EXISTS
        (SELECT * FROM keyword
         WHERE kw_name='KW_TODOPOISTART');
INSERT INTO keyword (kw_name)
    SELECT 'KW_TODOPOIMAIN' FROM DUAL
    WHERE NOT EXISTS
        (SELECT * FROM keyword
         WHERE kw_name='KW_TODOPOIMAIN');
INSERT INTO keyword (kw_name)
    SELECT 'KW_TODOPOIEND' FROM DUAL
    WHERE NOT EXISTS
        (SELECT * FROM keyword
         WHERE kw_name='KW_TODOPOIEND');

insert into tour_keyword (kw_id, t_id)
select (select kw_id from keyword where kw_name='KW_TODOPOISTART') as kw_id,
       t_id from
                tour where t_id not in (select t_id from tour_poi where tour_poi.tpoi_type in (10));
insert into tour_keyword (kw_id, t_id)
select (select kw_id from keyword where kw_name='KW_TODOPOIMAIN') as kw_id,
       t_id from
                tour where t_id not in (select t_id from tour_poi where tour_poi.tpoi_type in (20));
insert into tour_keyword (kw_id, t_id)
select (select kw_id from keyword where kw_name='KW_TODOPOIEND') as kw_id,
       t_id from
                tour where t_id not in (select t_id from tour_poi where tour_poi.tpoi_type in (90));

insert into kategorie_keyword (kw_id, k_id)
select (select kw_id from keyword where kw_name='KW_TODOPOISTART') as kw_id,
       k_id from
                kategorie where k_id not in (select k_id from kategorie_poi where kategorie_poi.kpoi_type in (10));
insert into kategorie_keyword (kw_id, k_id)
select (select kw_id from keyword where kw_name='KW_TODOPOIMAIN') as kw_id,
       k_id from
                kategorie where k_id not in (select k_id from kategorie_poi where kategorie_poi.kpoi_type in (20));
insert into kategorie_keyword (kw_id, k_id)
select (select kw_id from keyword where kw_name='KW_TODOPOIEND') as kw_id,
       k_id from
                kategorie where k_id not in (select k_id from kategorie_poi where kategorie_poi.kpoi_type in (90));
