-- ----------------
-- add and set fields for state of gpx-data
-- ----------------

-- add fields
ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_gpstracks_state TINYINT DEFAULT 0;
ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_gpstracks_state TINYINT DEFAULT 0;
ALTER TABLE location ADD COLUMN IF NOT EXISTS l_geo_state TINYINT DEFAULT 0;

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
