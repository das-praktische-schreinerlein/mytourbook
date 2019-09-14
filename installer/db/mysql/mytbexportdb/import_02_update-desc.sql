-- track: calc desc
UPDATE kategorie_full toupdate,
 (SELECT kategorie_full.k_id, location.l_gps_lat, location.l_gps_lon, location.l_lochirarchietxt
  FROM kategorie_full INNER JOIN location ON kategorie_full.l_id=location.l_id
  GROUP BY kategorie_full.k_id) grouped
SET
    toupdate.k_html=CONCAT('<h1>', COALESCE(k_name, ''), '</h1>\n',
                           '<h2>', COALESCE(grouped.l_lochirarchietxt, ''), '</h2>\n',
                           '<p>', COALESCE(k_meta_shortdesc, ''), '</p>\n',
                           '<label>tags</label><span>', COALESCE(k_keywords, ''), '</span>\n',
                           '<label>persons</label><span>', COALESCE(k_persons, ''), '</span>\n',
                           '<label>objects</label><span>', COALESCE(k_objects, ''), '</span>\n',
                           '<label>k_distance</label><span>', COALESCE(k_distance, ''), '</span>\n',
                           '<label>k_altitude_asc</label><span>', COALESCE(k_altitude_asc, ''), '</span>\n',
                           '<label>k_altitude_desc</label><span>', COALESCE(k_altitude_desc, ''), '</span>\n',
                           '<label>k_altitude_min</label><span>', COALESCE(k_altitude_min, ''), '</span>\n',
                           '<label>k_altitude_max</label><span>', COALESCE(k_altitude_max, ''), '</span>\n',
                           '<label>k_rate_schwierigkeit</label><span>k_rate_schwierigkeit_', COALESCE(k_rate_schwierigkeit, ''), '</span>\n',
                           '<label>k_rate_ausdauer</label><span>k_rate_ausdauer_', COALESCE(k_rate_ausdauer, ''), '</span>\n',
                           '<label>k_rate_kraft</label><span>k_rate_kraft_', COALESCE(k_rate_kraft, ''), '</span>\n',
                           '<label>k_rate_mental</label><span>k_rate_mental_', COALESCE(k_rate_mental, ''), '</span>\n',
                           '<label>k_rate_bildung</label><span>k_rate_bildung_', COALESCE(k_rate_bildung, ''), '</span>\n',
                           '<label>k_rate_motive</label><span>k_rate_motive_', COALESCE(k_rate_motive, ''), '</span>\n',
                           '<label>k_rate_wichtigkeit</label><span>k_rate_wichtigkeit_', COALESCE(k_rate_wichtigkeit, ''), '</span>\n',
                           '<label>k_rate_gesamt</label><span>k_rate_gesamt_', COALESCE(k_rate_gesamt, ''), '</span>\n',
                           '<label>k_type</label><span>k_type_', COALESCE(k_type, ''), '</span>\n',
                           '')
WHERE toupdate.k_id=grouped.k_id;

UPDATE kategorie_full toupdate,
 (SELECT kategorie_full.k_id, tour.t_name
  FROM kategorie_full INNER JOIN tour ON kategorie_full.t_id=tour.t_id
  GROUP BY kategorie_full.k_id) grouped
SET
    toupdate.k_html=CONCAT(COALESCE(k_html, ''), '<label>tour</label><span>k_type_', COALESCE(t_name, ''), '</span>\n')
WHERE toupdate.k_id=grouped.k_id;

UPDATE kategorie_full toupdate,
  (SELECT mjoin.k_id AS k_id, GROUP_CONCAT(CAST(tour.t_name AS char(200)) SEPARATOR  '</li><li>') AS t_names
   FROM testmytbdb.kategorie_tour mjoin INNER JOIN tour ON mjoin.t_id = tour.t_id
   GROUP BY mjoin.k_id) grouped
SET toupdate.k_html=CONCAT(COALESCE(k_html, ''), '<label>tour</label><ul><li>', COALESCE(grouped.t_names, ''), '</li></ul>\n')
WHERE toupdate.k_id=grouped.k_id;

-- tour: calc desc
UPDATE tour toupdate,
 (SELECT tour.t_id, location.l_gps_lat, location.l_gps_lon, location.l_lochirarchietxt
  FROM tour INNER JOIN location ON tour.l_id=location.l_id
  GROUP BY tour.t_id) grouped
SET
    toupdate.t_html_list=CONCAT('<h1>', COALESCE(t_name, ''), '</h1>\n',
                           '<h2>', COALESCE(grouped.l_lochirarchietxt, ''), '</h2>\n',
                           '<p>', COALESCE(t_meta_shortdesc, ''), '</p>\n',
                           '<label>tags</label><span>', COALESCE(t_keywords, ''), '</span>\n',
                            '<label>t_desc_gefahren</label><span>', COALESCE(t_desc_gefahren, ''), '</span>\n',
                            '<label>t_desc_fuehrer</label><span>', COALESCE(t_desc_fuehrer, ''), '</span>\n',
                            '<label>t_desc_fuehrer_full</label><span>', COALESCE(t_desc_fuehrer_full, ''), '</span>\n',
                            '<label>t_desc_gebiet</label><span>', COALESCE(t_desc_gebiet, ''), '</span>\n',
                            '<label>t_desc_talort</label><span>', COALESCE(t_desc_talort, ''), '</span>\n',
                            '<label>t_desc_ziel</label><span>', COALESCE(t_desc_ziel, ''), '</span>\n',
                            '<label>t_rate</label><span>', COALESCE(t_rate, ''), '</span>\n',
                            '<label>t_rate_ks</label><span>', COALESCE(t_rate_ks, ''), '</span>\n',
                            '<label>t_rate_firn</label><span>', COALESCE(t_rate_firn, ''), '</span>\n',
                            '<label>t_rate_gletscher</label><span>', COALESCE(t_rate_gletscher, ''), '</span>\n',
                            '<label>t_rate_klettern</label><span>', COALESCE(t_rate_klettern, ''), '</span>\n',
                            '<label>t_rate_bergtour</label><span>', COALESCE(t_rate_bergtour, ''), '</span>\n',
                            '<label>t_rate_schneeschuh</label><span>', COALESCE(t_rate_schneeschuh, ''), '</span>\n',
                            '<label>t_rate_ausdauer</label><span>t_rate_ausdauer_', COALESCE(t_rate_ausdauer, ''), '</span>\n',
                            '<label>t_rate_bildung</label><span>t_rate_bildung_', COALESCE(t_rate_bildung, ''), '</span>\n',
                            '<label>t_rate_gesamt</label><span>t_rate_gesamt_', COALESCE(t_rate_gesamt, ''), '</span>\n',
                            '<label>t_rate_kraft</label><span>t_rate_kraft_', COALESCE(t_rate_kraft, ''), '</span>\n',
                            '<label>t_rate_mental</label><span>t_rate_mental_', COALESCE(t_rate_mental, ''), '</span>\n',
                            '<label>t_rate_motive</label><span>t_rate_motive_', COALESCE(t_rate_motive, ''), '</span>\n',
                            '<label>t_rate_schwierigkeit</label><span>t_rate_schwierigkeit_', COALESCE(t_rate_schwierigkeit, ''), '</span>\n',
                            '<label>t_rate_wichtigkeit</label><span>t_rate_wichtigkeit_', COALESCE(t_rate_wichtigkeit, ''), '</span>\n',
                            '<label>t_route_aufstieg_name</label><span>', COALESCE(t_route_aufstieg_name, ''), '</span>\n',
                            '<label>t_route_aufstieg_dauer</label><span>', COALESCE(t_route_aufstieg_dauer, ''), '</span>\n',
                            '<label>t_route_aufstieg_hm</label><span>', COALESCE(t_route_aufstieg_hm, ''), '</span>\n',
                            '<label>t_route_aufstieg_km</label><span>', COALESCE(t_route_aufstieg_km, ''), '</span>\n',
                            '<label>t_route_aufstieg_m</label><span>', COALESCE(t_route_aufstieg_m, ''), '</span>\n',
                            '<label>t_route_aufstieg_sl</label><span>', COALESCE(t_route_aufstieg_sl, ''), '</span>\n',
                            '<label>t_route_abstieg_name</label><span>', COALESCE(t_route_abstieg_name, ''), '</span>\n',
                            '<label>t_route_abstieg_dauer</label><span>', COALESCE(t_route_abstieg_dauer, ''), '</span>\n',
                            '<label>t_route_abstieg_hm</label><span>', COALESCE(t_route_abstieg_hm, ''), '</span>\n',
                            '<label>t_route_abstieg_m</label><span>', COALESCE(t_route_abstieg_m, ''), '</span>\n',
                            '<label>t_route_huette_name</label><span>', COALESCE(t_route_huette_name, ''), '</span>\n',
                            '<label>t_route_huette_dauer</label><span>', COALESCE(t_route_huette_dauer, ''), '</span>\n',
                            '<label>t_route_huette_hm</label><span>', COALESCE(t_route_huette_hm, ''), '</span>\n',
                            '<label>t_route_huette_m</label><span>', COALESCE(t_route_huette_m, ''), '</span>\n',
                            '<label>t_route_zustieg_dauer</label><span>', COALESCE(t_route_zustieg_dauer, ''), '</span>\n',
                            '<label>t_route_zustieg_hm</label><span>', COALESCE(t_route_zustieg_hm, ''), '</span>\n',
                            '<label>t_route_zustieg_m</label><span>', COALESCE(t_route_zustieg_m, ''), '</span>\n',
                            '<label>t_route_dauer</label><span>', COALESCE(t_route_dauer, ''), '</span>\n',
                            '<label>t_route_hm</label><span>', COALESCE(t_route_hm, ''), '</span>\n',
                            '<label>t_route_m</label><span>', COALESCE(t_route_m, ''), '</span>\n',
                            '<label>t_typ</label><span>t_typ_', COALESCE(t_typ, ''), '</span>\n',
                           '')
WHERE toupdate.t_id=grouped.t_id;

