--
-- import location
--
INSERT INTO location (l_id, l_meta_shortdesc, l_name, l_url_homepage, l_parent_id, l_gps_lat, l_gps_lon, l_geo_area, l_typ)
     SELECT l_id, l_meta_shortdesc, l_name, l_url_homepage, l_parent_id, l_geo_latdeg, l_geo_longdeg, l_geo_area, l_typ FROM mediadb.location;

UPDATE location SET l_lochirarchietxt=GetLocationNameAncestry(location.l_id, location.l_name, " -> "), l_lochirarchieids=GetLocationIdAncestry(location.l_id, ",");
UPDATE location SET l_lochirarchietxt=REPLACE(l_lochirarchietxt, 'OFFEN -> ', '');
UPDATE location SET l_lochirarchietxt=REPLACE(l_lochirarchietxt, ' -> ', ',,');
UPDATE location SET l_lochirarchieids=REPLACE(l_lochirarchieids, '1,', '');
UPDATE location SET l_lochirarchieids=REPLACE(l_lochirarchieids, ',', ',,');

UPDATE location toupdate,
 (SELECT GROUP_CONCAT(mk.kw_name SEPARATOR ", ") AS l_keywords, location.l_id AS l_id
  FROM location LEFT JOIN mediadb.location_keyword mjoin ON location.l_id=mjoin.l_id LEFT JOIN mediadb.keyword mk ON mjoin.kw_id=mk.kw_id
  GROUP BY location.l_id) grouped
SET toupdate.l_keywords=grouped.l_keywords
WHERE toupdate.l_id=grouped.l_id;

UPDATE location toupdate
SET
    toupdate.l_meta_shortdesc_md=l_meta_shortdesc,
    toupdate.l_meta_shortdesc_html=l_meta_shortdesc,
    toupdate.l_html=concat(coalesce(l_name, ''), ' ',
                           coalesce(l_lochirarchietxt, ''), ' ',
                           coalesce(l_meta_shortdesc, ''), ' ',
                           coalesce(l_keywords, ''), ' ');
-- TODO l_katids, l_t_ids,


--
-- import news
--
INSERT INTO news (n_id, w_id, n_date, n_datevon, n_datebis, n_message, n_message_md, n_message_html, n_headline, n_keywords)
    SELECT n_id, w_id, n_date, n_datevon, n_datebis, n_message, n_message_md, n_message_html, n_headline, n_keywords FROM mediadb.news;

UPDATE news
SET
    n_message_md=n_message,
    n_message_html=n_message;

--
-- import trip
--
INSERT INTO trip (tr_id, i_id, tr_datebis, tr_datevon, tr_geo_poly, tr_katname_replace, tr_l_ids, tr_meta_desc, tr_meta_shortdesc, tr_name, tr_typ, tr_url)
    SELECT tr_id, i_id, tr_datebis, tr_datevon, tr_geo_poly, tr_katname_replace, tr_l_ids, tr_meta_desc, tr_meta_shortdesc, tr_name, tr_typ, tr_url
FROM mediadb.trip;

UPDATE trip
SET
    tr_meta_shortdesc_md=tr_meta_shortdesc,
    tr_meta_shortdesc_html=tr_meta_shortdesc,
    tr_dateshow=tr_datevon;

--
-- import tracks
--
INSERT into kategorie_full (k_id, t_id, l_id, tr_id, k_gesperrt, k_datebis, k_datevon, k_gpstracks_basefile, k_meta_shortdesc, k_name, k_distance, k_altitude_asc, k_altitude_desc, k_altitude_min, k_altitude_max, k_rate_schwierigkeit, k_rate_ausdauer, k_rate_kraft, k_rate_mental, k_rate_bildung, k_rate_motive, k_rate_wichtigkeit, k_rate_gesamt, k_type)
    SELECT k_id, t_id, l_id, coalesce(tr_id, 0), k_gesperrt, k_datebis, k_datevon, k_gpstracks_basefile, k_meta_shortdesc, k_name, k_distance, k_altitude_asc, k_altitude_desc, k_altitude_min, k_altitude_max, k_rate_schwierigkeit, k_rate_ausdauer, k_rate_kraft, k_rate_mental, k_rate_bildung, k_rate_motive, k_rate_wichtigkeit, k_rate_gesamt, k_type
    FROM mediadb.kategorie WHERE (mediadb.kategorie.k_gesperrt=0 OR mediadb.kategorie.k_gesperrt IS NULL);

UPDATE kategorie_full toupdate,
 (SELECT kategorie_full.k_id AS k_id, GROUP_CONCAT(mk.kw_name SEPARATOR ", ") AS k_keywords
  FROM kategorie_full LEFT JOIN mediadb.kategorie_keyword mjoin ON kategorie_full.k_id=mjoin.k_id LEFT JOIN mediadb.keyword mk ON mjoin.kw_id=mk.kw_id
   GROUP BY kategorie_full.k_id) grouped
SET toupdate.k_keywords=grouped.k_keywords
WHERE toupdate.k_id=grouped.k_id;

UPDATE kategorie_full toupdate,
    (SELECT mediadb.kategorie.k_id, mediadb.image.i_id
     FROM mediadb.image INNER JOIN mediadb.kategorie ON mediadb.kategorie.k_id=mediadb.image.k_id
                        INNER JOIN mediadb.image_playlist ON mediadb.image_playlist.i_id=mediadb.image.i_id
     WHERE (mediadb.kategorie.k_gesperrt=0 OR mediadb.kategorie.k_gesperrt IS NULL)
           && (mediadb.image.i_gesperrt=0 OR mediadb.image.i_gesperrt IS NULL)
           && mediadb.image_playlist.p_id=18) grouped
SET toupdate.i_id=grouped.i_id
WHERE toupdate.k_id=grouped.k_id;

UPDATE kategorie_full toupdate,
 (SELECT kategorie_full.k_id AS k_id, GROUP_CONCAT(cast(mk.t_id AS char(100)) SEPARATOR  ", ") AS t_ids
  FROM kategorie_full LEFT JOIN mediadb.kategorie_tour mjoin ON kategorie_full.k_id=mjoin.k_id LEFT JOIN mediadb.tour mk ON mjoin.t_id=mk.t_id
  GROUP BY kategorie_full.k_id) grouped
SET toupdate.k_t_ids=coalesce(grouped.t_ids, ''), toupdate.k_t_ids_full=CONCAT(coalesce(CAST(toupdate.t_id AS CHAR(100)), ''), ',', coalesce(grouped.t_ids, ''))
WHERE toupdate.k_id=grouped.k_id;

UPDATE kategorie_full toupdate,
 (SELECT kategorie_full.k_id, location.l_gps_lat, location.l_gps_lon, location.l_lochirarchietxt
  FROM kategorie_full INNER JOIN location ON kategorie_full.l_id=location.l_id
  GROUP BY kategorie_full.k_id) grouped
SET
    toupdate.k_gps_lat=grouped.l_gps_lat,
    toupdate.k_gps_lon=grouped.l_gps_lon,
    toupdate.k_dateshow=k_datevon,
    toupdate.k_meta_shortdesc_md=k_meta_shortdesc,
    toupdate.k_meta_shortdesc_html=k_meta_shortdesc,
    toupdate.k_html=concat(coalesce(k_name, ''), ' ',
                           coalesce(grouped.l_lochirarchietxt, ''), ' ',
                           coalesce(k_meta_shortdesc, ''), ' ',
                           coalesce(k_keywords, ''), ' ')
WHERE toupdate.k_id=grouped.k_id;

UPDATE kategorie_full toupdate,
 (SELECT kategorie_full.k_id, news.n_id
  FROM kategorie_full, news
  WHERE (kategorie_full.k_dateshow >= news.n_datevon AND kategorie_full.k_dateshow <= news.n_datebis)
  GROUP BY kategorie_full.k_id) grouped
SET
    toupdate.n_id=grouped.n_id
WHERE toupdate.k_id=grouped.k_id;

--
-- import routes
--
INSERT into tour (l_id, k_id, t_datevon, t_name, t_desc_gefahren, t_desc_fuehrer, t_desc_gebiet, t_desc_talort, t_desc_ziel, t_meta_shortdesc, t_ele_max, t_gpstracks_basefile, t_rate, t_rate_ks, t_rate_firn, t_rate_gletscher, t_rate_klettern, t_rate_bergtour, t_rate_schneeschuh, t_rate_ausdauer, t_rate_bildung, t_rate_gesamt, t_rate_kraft, t_rate_mental, t_rate_motive, t_rate_schwierigkeit, t_rate_wichtigkeit, t_route_aufstieg_name, t_route_aufstieg_dauer, t_route_aufstieg_hm, t_route_aufstieg_km, t_route_aufstieg_sl, t_route_aufstieg_m, t_route_abstieg_name, t_route_abstieg_dauer, t_route_abstieg_hm, t_route_abstieg_m, t_route_huette_name, t_route_huette_dauer, t_route_huette_hm, t_route_huette_m, t_route_zustieg_dauer, t_route_zustieg_hm, t_route_zustieg_m, t_route_dauer, t_route_hm, t_route_m, t_typ)
    SELECT l_id, k_id, t_datevon, t_name, t_desc_gefahren, t_desc_fuehrer, t_desc_gebiet, t_desc_talort, t_desc_ziel, t_meta_shortdesc, t_ele_max, t_gpstracks_basefile, t_rate, t_rate_ks, t_rate_firn, t_rate_gletscher, t_rate_klettern, t_rate_bergtour, t_rate_schneeschuh, t_rate_ausdauer, t_rate_bildung, t_rate_gesamt, t_rate_kraft, t_rate_mental, t_rate_motive, t_rate_schwierigkeit, t_rate_wichtigkeit, t_route_aufstieg_name, t_route_aufstieg_dauer, t_route_aufstieg_hm, t_route_aufstieg_km, t_route_aufstieg_sl, t_route_aufstieg_m, t_route_abstieg_name, t_route_abstieg_dauer, t_route_abstieg_hm, t_route_abstieg_m, t_route_huette_name, t_route_huette_dauer, t_route_huette_hm, t_route_huette_m, t_route_zustieg_dauer, t_route_zustieg_hm, t_route_zustieg_m, t_route_dauer, t_route_hm, t_route_m, t_typ
    FROM mediadb.tour;

UPDATE tour toupdate,
    (SELECT GROUP_CONCAT(mk.kw_name SEPARATOR ", ") AS t_keywords, tour.t_id AS t_id
     FROM tour LEFT JOIN mediadb.tour_keyword mjoin ON tour.t_id=mjoin.t_id LEFT JOIN mediadb.keyword mk ON mjoin.kw_id=mk.kw_id
     GROUP BY tour.t_id) grouped
SET toupdate.t_keywords=grouped.t_keywords
WHERE toupdate.t_id=grouped.t_id;

UPDATE tour toupdate,
 (SELECT tour.t_id AS t_id, GROUP_CONCAT(mk.kw_name SEPARATOR ", ") AS t_keywords
  FROM tour LEFT JOIN mediadb.tour_keyword mjoin ON tour.t_id=mjoin.t_id LEFT JOIN mediadb.keyword mk ON mjoin.kw_id=mk.kw_id
   GROUP BY tour.t_id) grouped
SET toupdate.t_keywords=grouped.t_keywords
WHERE toupdate.t_id=grouped.t_id;

UPDATE tour toupdate,
 (SELECT tour.t_id, location.l_gps_lat, location.l_gps_lon, location.l_lochirarchietxt
  FROM tour INNER JOIN location ON tour.l_id=location.l_id
  GROUP BY tour.t_id) grouped
SET
    toupdate.t_gps_lat=grouped.l_gps_lat,
    toupdate.t_gps_lon=grouped.l_gps_lon,
    toupdate.t_dateshow=t_datevon,
    toupdate.t_desc_fuehrer_full=t_desc_fuehrer,
    toupdate.t_meta_shortdesc_md=t_meta_shortdesc,
    toupdate.t_meta_shortdesc_html=t_meta_shortdesc,
    toupdate.t_html_list=concat(coalesce(t_name, ''), ' ',
                           coalesce(grouped.l_lochirarchietxt, ''), ' ',
                           coalesce(t_meta_shortdesc, ''), ' ',
                           coalesce(t_keywords, ''), ' ')
WHERE toupdate.t_id=grouped.t_id;

-- UPDATE tour toupdate,
-- (SELECT mk.t_id AS t_id, GROUP_CONCAT(cast(kategorie_full.k_id AS char(100)) SEPARATOR  ", ") AS k_ids
--  FROM kategorie_full LEFT JOIN mediadb.kategorie_tour mjoin ON kategorie_full.k_id=mjoin.k_id LEFT JOIN mediadb.tour mk ON mjoin.t_id=mk.t_id
--  GROUP BY tour.t_id) grouped
-- SET toupdate.t_k_ids=coalesce(grouped.k_ids, ''), toupdate.k_t_ids_full=CONCAT(coalesce(CAST(toupdate.t_id AS CHAR(100)), ''), ',', coalesce(grouped.t_ids, ''))
-- WHERE toupdate.k_id=grouped.k_id;
-- TODO t_k_ids

--
-- import images
--
INSERT into image (i_id, k_id, i_gesperrt, i_date, i_dir, i_file, i_gps_lat, i_gps_lon, i_gps_ele, i_rate, i_rate_motive, i_rate_wichtigkeit)
    SELECT distinct mediadb.image.i_id, mediadb.kategorie.k_id, i_gesperrt, i_date, i_dir, i_file, i_gps_lat, i_gps_lon, i_gps_ele, i_rate, i_rate_motive, i_rate_wichtigkeit
    FROM mediadb.image INNER JOIN mediadb.kategorie ON mediadb.kategorie.k_id=mediadb.image.k_id
                       INNER JOIN mediadb.image_playlist ON mediadb.image_playlist.i_id=mediadb.image.i_id
    WHERE (mediadb.kategorie.k_gesperrt=0 OR mediadb.kategorie.k_gesperrt IS NULL)
          && (mediadb.image.i_gesperrt=0 OR mediadb.image.i_gesperrt IS NULL)
          && mediadb.image_playlist.p_id=17;

UPDATE image toupdate,
    (SELECT GROUP_CONCAT(mk.kw_name SEPARATOR ", ") AS i_keywords, image.i_id AS i_id
     FROM image LEFT JOIN mediadb.image_keyword mjoin ON image.i_id=mjoin.i_id LEFT JOIN mediadb.keyword mk ON mjoin.kw_id=mk.kw_id
     GROUP BY image.i_id) grouped
SET toupdate.i_keywords=grouped.i_keywords
WHERE toupdate.i_id=grouped.i_id;

UPDATE image toupdate,
 (SELECT image.i_id, kategorie_full.k_id, kategorie_full.t_id, k_name, kategorie_full.k_meta_shortdesc, location.l_lochirarchietxt
  FROM image INNER JOIN kategorie_full ON image.k_Id=kategorie_full.k_id INNER JOIN location ON kategorie_full.l_id=location.l_id
  GROUP BY image.i_id) grouped
SET
    toupdate.t_id=grouped.t_id,
    toupdate.i_dateshow=i_date,
    toupdate.i_katname=grouped.k_name,
    toupdate.i_katdesc=grouped.k_meta_shortdesc,
    toupdate.i_lochirarchie=grouped.l_lochirarchietxt
WHERE toupdate.i_id=grouped.i_id;

-- TODO i_image_objects
