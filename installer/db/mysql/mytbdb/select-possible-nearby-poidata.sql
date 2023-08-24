-- add pois-nearby gps-trackpoints

-- activate pipes as concat in sql
SET sql_mode=(SELECT CONCAT(@@sql_mode,',PIPES_AS_CONCAT'));

set @maxLatDist = 0.001;
set @maxLonDist = 0.001;
set @minK_ID = 1;
set @maxK_Id = 99999999;
set @minT_ID = 1;
set @maxT_Id = 99999999;
set @border = 0.001;
select *,
       'INSERT INTO ' || tabname || '_poi' ||
       ' (' || prefix || '_id, poi_id, ' || prefix || 'poi_pos, ' || prefix || 'poi_type, ' || prefix || 'poi_date)'  ||
       ' VALUES(' || tid || ', ' || poi_id || ', ' || poi_pos || ', 65, ' ||
       CASE WHEN tpdate IS NOT NULL THEN '"' || tpdate || '"'
            ELSE 'null'
           END
           || ');'                                                                                                                                                                                                                        trackpoi_sql,
       'UPDATE poi SET poi.l_id = ' || l_id || ' WHERE poi_id=' ||  poi_id || ' AND poi.l_id IS NULL; insert into poi_keyword (kw_id, poi_id) select (select kw_id from keyword where kw_name="KW_TODOPOICHECK") as kw_id, ' || poi_id || ';' poi_sql
from
    (
        select 'track' as type,
               'kategorie' as tabname,
               'k' as prefix,
               110 + rank() over(PARTITION BY track_pois.tid order by track_pois.tid, track_pois.tpdate, track_pois.tpid) poi_pos,
               kpoi.kpoi_type tpoi_type,
               kpoi.kpoi_pos tpoi_pos,
               track_pois.*
        from
            (
                SELECT distinct
                    GetLocationNameAncestry(l.l_id, l.l_name, ' -> ') l_lochirarchie,
                    l.l_id,
                    k.k_id tid,
                    k.k_name tname,
                    poi.poi_id,
                    poi.poi_name,
                    min(KTP_DATE) as tpdate,
                    min(KTP_ID) as tpid,
                    min(3959 * ACOS (COS ( RADIANS(KTP_LAT) ) * COS( RADIANS(poi_geo_latdeg) )
                                         * COS( RADIANS(poi_geo_longdeg) - RADIANS(KTP_LON) )
                        + SIN ( RADIANS(KTP_LAT) ) * SIN( RADIANS(poi_geo_latdeg) ))) as distance
                FROM kategorie k
                         INNER JOIN location l on k.L_ID = l.L_ID
                         INNER JOIN
                     (select distinct karea.k_id, poi_area.poi_id
                      FROM (select kparea.k_id,
                                   min(KTP_LAT) minKTP_LAT,
                                   max(KTP_LAT) maxKTP_LAT,
                                   min(KTP_LON) minKTP_LON,
                                   max(KTP_LON) maxKTP_LON
                            from kategorie_tourpoint kparea
                            WHERE kparea.k_id BETWEEN @minK_ID AND @maxK_Id
                            group by kparea.k_id) karea
                               INNER JOIN poi poi_area
                                          ON (poi_geo_latdeg <= (karea.maxKTP_LAT + @border)
                                              AND poi_geo_latdeg >= (karea.minKTP_LAT - @border)
                                              AND poi_geo_longdeg <= (karea.maxKTP_LON + @border)
                                              AND poi_geo_longdeg >= (karea.minKTP_LON - @border)
                                              )
                     ) k_poi_area ON k.k_id=k_poi_area.K_ID
                         INNER JOIN
                     kategorie_tourpoint kp ON k_poi_area.K_ID = kp.K_ID
                         INNER JOIN
                     poi
                     ON (
                                 poi.poi_id = k_poi_area.poi_id
                             AND poi_geo_latdeg <= kp.KTP_LAT + @maxLatDist
                             AND poi_geo_latdeg >= kp.KTP_LAT - @maxLatDist
                             AND poi_geo_longdeg <= kp.KTP_LON + @maxLonDist
                             AND poi_geo_longdeg >= kp.KTP_LON - @maxLonDist
                         )
                GROUP BY kp.k_id, poi.poi_id, k_name, poi_name, K_DATEVON
                order by l_lochirarchie, K_DATEVON, k_NAME, tpdate, tpid, poi_name
            ) track_pois
                LEFT JOIN kategorie_poi kpoi ON kpoi.k_id=track_pois.tID AND kpoi.poi_id=track_pois.poi_id
        UNION
        select 'route' as type,
               'tour' as tabname,
               't' as prefix,
               110 + rank() over(PARTITION BY track_pois.tid order by track_pois.tid, track_pois.tpdate, track_pois.tpid) poi_pos,
               tpoi.tpoi_type tpoi_type,
               tpoi.tpoi_pos tpoi_pos,
               track_pois.*
        from
            (
                SELECT distinct
                    GetLocationNameAncestry(l.l_id, l.l_name, ' -> ') l_lochirarchie,
                    l.l_id,
                    t.t_id tid,
                    t.t_name tname,
                    poi.poi_id,
                    poi.poi_name,
                    min(TP_DATE) as tpdate,
                    min(TP_ID) as tpid,
                    min(3959 * ACOS (COS ( RADIANS(TP_LAT) ) * COS( RADIANS(poi_geo_latdeg) )
                                         * COS( RADIANS(poi_geo_longdeg) - RADIANS(TP_LON) )
                        + SIN ( RADIANS(TP_LAT) ) * SIN( RADIANS(poi_geo_latdeg) ))) as distance
                FROM tour t
                         INNER JOIN location l on t.L_ID = l.L_ID
                         INNER JOIN
                     (select distinct karea.t_id, poi_area.poi_id
                      FROM (select tparea.t_id,
                                   min(TP_LAT) minTP_LAT,
                                   max(TP_LAT) maxTP_LAT,
                                   min(TP_LON) minTP_LON,
                                   max(TP_LON) maxTP_LON
                            from tourpoint tparea
                            WHERE tparea.t_id BETWEEN @minT_ID AND @maxT_Id
                            group by tparea.t_id) karea
                               INNER JOIN poi poi_area
                                          ON (poi_geo_latdeg <= (karea.maxTP_LAT + @border)
                                              AND poi_geo_latdeg >= (karea.minTP_LAT - @border)
                                              AND poi_geo_longdeg <= (karea.maxTP_LON + @border)
                                              AND poi_geo_longdeg >= (karea.minTP_LON - @border)
                                              )
                     ) t_poi_area ON t.t_id=t_poi_area.T_ID
                         INNER JOIN
                     tourpoint tp ON t_poi_area.T_ID = tp.T_ID
                         INNER JOIN
                     poi
                     ON (
                                 poi.poi_id = t_poi_area.poi_id
                             AND poi_geo_latdeg <= tp.TP_LAT + @maxLatDist
                             AND poi_geo_latdeg >= tp.TP_LAT - @maxLatDist
                             AND poi_geo_longdeg <= tp.TP_LON + @maxLonDist
                             AND poi_geo_longdeg >= tp.TP_LON - @maxLonDist
                         )
                GROUP BY tp.t_id, poi.poi_id, t_name, t_datefirst, poi_name
                order by l_lochirarchie, t_NAME, tpdate, tpid, poi_name
            ) track_pois
                LEFT JOIN tour_poi tpoi ON tpoi.t_id=track_pois.TID AND tpoi.poi_id=track_pois.poi_id
    ) as trackroute_pois
--    where l_lochirarchie not like '%Sachsen%'
order by l_lochirarchie, type, tname, tpdate, tpid, type, tname
;

-- TODO keywords
INSERT INTO keyword (kw_name)
    SELECT 'KW_TODOPOICHECK' FROM DUAL
        WHERE NOT EXISTS
            (SELECT * FROM keyword
                  WHERE kw_name='KW_TODOPOICHECK');


-- TODO execute generated track/route-pois sql


-- TODO execute generated poi sql


insert into tour_keyword (kw_id, t_id)
select (select kw_id from keyword where kw_name='KW_TODOPOICHECK') as kw_id,
       t_id from
    tour where t_id in (select t_id from tour_poi where tour_poi.tpoi_type in (65));

insert into kategorie_keyword (kw_id, k_id)
select (select kw_id from keyword where kw_name='KW_TODOPOICHECK') as kw_id,
       k_id from
    kategorie where k_id in (select k_id from kategorie_poi where kategorie_poi.kpoi_type in (65));
