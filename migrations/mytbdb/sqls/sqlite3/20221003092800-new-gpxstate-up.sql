-- ----------------
-- add and set fields for state of gpx-data
-- ----------------

-- add fields
ALTER TABLE kategorie ADD COLUMN k_gpstracks_state TINYINT DEFAULT 0;
ALTER TABLE tour ADD COLUMN t_gpstracks_state TINYINT DEFAULT 0;
ALTER TABLE location ADD COLUMN l_geo_state TINYINT DEFAULT 0;

DROP VIEW IF EXISTS location_hirarchical;
CREATE VIEW location_hirarchical
    AS
    WITH RECURSIVE loc_hierarchy(
                                 l_id,
                                 l_parent_id,
                                 l_name,
                                 hirarchy,
                                 idhirarchy)
                       AS
                       (SELECT l_id,
                               l_parent_id,
                               l_name,
                               l_name,
                               CAST(l_id AS CHAR(255))
                        FROM location
                        WHERE l_parent_id IS NULL
                        UNION ALL
                        SELECT l.l_id,
                               l.l_parent_id,
                               l.l_name,
                               lh.hirarchy ||  ' -> ' || l.l_name,
                               lh.idhirarchy ||  ',' || CAST(l.l_id AS CHAR(255))
                        FROM location l
                                 JOIN loc_hierarchy lh
                                      ON l.l_parent_id = lh.l_id
                       )
    SELECT location.*, loc_hierarchy.hirarchy AS l_lochirarchietxt, loc_hierarchy.idhirarchy AS l_lochirarchieids
    FROM location INNER JOIN loc_hierarchy ON location.l_id = loc_hierarchy.l_id
    ORDER BY l_id;

-- gpx-tracker
update kategorie set k_gpstracks_state = 1
where length(COALESCE(K_GPSTRACKS_GPX_SOURCE, '')) > 10
  and K_GPSTRACKS_GPX_SOURCE like '%<time>%';
update tour set t_gpstracks_state = 1
where length(COALESCE(T_GPSTRACKS_GPX, '')) > 10
  and t_GPSTRACKS_GPX like '%<time>%';
update location set l_geo_state = 1
where length(COALESCE(L_GEO_POLY, '')) > 10;

-- manually
update kategorie set k_gpstracks_state = 2
where length(COALESCE(K_GPSTRACKS_GPX_SOURCE, '')) > 10
  and K_GPSTRACKS_GPX_SOURCE not like '%<time>%';
update tour set t_gpstracks_state = 2
where length(COALESCE(T_GPSTRACKS_GPX, '')) > 10
  and T_GPSTRACKS_GPX not like '%<time>%';
update location set l_geo_state = 2
where length(COALESCE(L_GEO_AREA, '')) > 10;

-- txt-tracker
update kategorie set k_gpstracks_state = 3
where length(COALESCE(K_GPSTRACKS_TXT, '')) > 10
  and length(COALESCE(K_GPSTRACKS_GPX_SOURCE, '')) < 10;
update tour set t_gpstracks_state = 3
where length(COALESCE(t_GPSTRACKS_TXT, '')) > 10;

-- no gpx
update kategorie set k_gpstracks_state = -1
where (k_gpstracks_state = 0 or k_gpstracks_state is null)
  and length(COALESCE(K_GPSTRACKS_BASEFILE, '')) < 10
  and length(COALESCE(K_GPSTRACKS_GPX_SOURCE, '')) < 10;
update tour set t_gpstracks_state = -1
where (t_gpstracks_state = 0 or t_gpstracks_state is null)
  and length(COALESCE(t_GPSTRACKS_BASEFILE, '')) < 10
  and length(COALESCE(T_GPSTRACKS_GPX, '')) < 10;
update location set l_geo_state = -1
where (l_geo_state = 0 or l_geo_state is null)
  and length(COALESCE(L_GEO_AREA, '')) < 10
  and length(COALESCE(L_GEO_POLY, '')) < 10;

-- open
update kategorie set k_gpstracks_state = 0
where k_gpstracks_state is null;
update tour set t_gpstracks_state = 0
where t_gpstracks_state is null;
update location set l_geo_state = 0
where l_geo_state is null;

-- check all
select 'TRACK', k_gpstracks_state, count(*), max(k_id) from kategorie group by k_gpstracks_state
union
select 'ROUTE', t_gpstracks_state, count(*), max(t_id) from tour group by t_gpstracks_state
union
select 'LOCATION', l_geo_state, count(*), max(l_id) from location group by l_geo_state
;
