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

-- calc keywords
UPDATE location toupdate,
 (SELECT GROUP_CONCAT(mk.kw_name SEPARATOR ',') AS l_keywords, location.l_id AS l_id
  FROM location LEFT JOIN mediadb.location_keyword mjoin ON location.l_id=mjoin.l_id LEFT JOIN mediadb.keyword mk ON mjoin.kw_id=mk.kw_id
  GROUP BY location.l_id) grouped
SET toupdate.l_keywords=grouped.l_keywords
WHERE toupdate.l_id=grouped.l_id;

-- calc desc
UPDATE location toupdate
SET
    toupdate.l_meta_shortdesc_md=l_meta_shortdesc,
    toupdate.l_meta_shortdesc_html=l_meta_shortdesc,
    toupdate.l_html=CONCAT(COALESCE(l_name, ''), ' ',
                           COALESCE(l_lochirarchietxt, ''), ' ',
                           COALESCE(l_meta_shortdesc, ''), ' ',
                           COALESCE(l_keywords, ''), ' ');

--
-- import news
--
INSERT INTO news (n_id, w_id, n_date, n_datevon, n_datebis, n_message, n_message_md, n_message_html, n_headline, n_keywords)
    SELECT n_id, w_id, n_date, n_datevon, n_datebis, n_message, n_message_md, n_message_html, n_headline, n_keywords FROM mediadb.news;

-- calc desc
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

-- calc desc+dates
UPDATE trip
SET
    tr_meta_shortdesc_md=tr_meta_shortdesc,
    tr_meta_shortdesc_html=tr_meta_shortdesc,
    tr_dateshow=tr_datevon;

--
-- import tracks
--
INSERT into kategorie_full (k_id, t_id, l_id, tr_id, k_gesperrt, k_datebis, k_datevon, k_gpstracks_basefile, k_meta_shortdesc, k_name, k_distance, k_altitude_asc, k_altitude_desc, k_altitude_min, k_altitude_max, k_rate_schwierigkeit, k_rate_ausdauer, k_rate_kraft, k_rate_mental, k_rate_bildung, k_rate_motive, k_rate_wichtigkeit, k_rate_gesamt, k_type)
    SELECT k_id, t_id, l_id, COALESCE(tr_id, 0), k_gesperrt, k_datebis, k_datevon, k_gpstracks_basefile, k_meta_shortdesc, k_name, k_distance, k_altitude_asc, k_altitude_desc, k_altitude_min, k_altitude_max, k_rate_schwierigkeit, k_rate_ausdauer, k_rate_kraft, k_rate_mental, k_rate_bildung, k_rate_motive, k_rate_wichtigkeit, k_rate_gesamt, k_type
    FROM mediadb.kategorie WHERE (mediadb.kategorie.k_gesperrt=0 OR mediadb.kategorie.k_gesperrt IS NULL);

-- calc keywords
UPDATE kategorie_full toupdate,
 (SELECT kategorie_full.k_id AS k_id, GROUP_CONCAT(mk.kw_name SEPARATOR ',') AS k_keywords
  FROM kategorie_full LEFT JOIN mediadb.kategorie_keyword mjoin ON kategorie_full.k_id=mjoin.k_id LEFT JOIN mediadb.keyword mk ON mjoin.kw_id=mk.kw_id
   GROUP BY kategorie_full.k_id) grouped
SET toupdate.k_keywords=grouped.k_keywords
WHERE toupdate.k_id=grouped.k_id;

-- calc master-image
UPDATE kategorie_full toupdate,
    (SELECT mediadb.kategorie.k_id, mediadb.image.i_id
     FROM mediadb.image INNER JOIN mediadb.kategorie ON mediadb.kategorie.k_id=mediadb.image.k_id
                        INNER JOIN mediadb.image_playlist ON mediadb.image_playlist.i_id=mediadb.image.i_id
     WHERE (mediadb.kategorie.k_gesperrt=0 OR mediadb.kategorie.k_gesperrt IS NULL)
           && (mediadb.image.i_gesperrt=0 OR mediadb.image.i_gesperrt IS NULL)
           && mediadb.image_playlist.p_id=18) grouped
SET toupdate.i_id=grouped.i_id
WHERE toupdate.k_id=grouped.k_id;

-- calc desc+dates+coords
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
    toupdate.k_html=CONCAT(COALESCE(k_name, ''), ' ',
                           COALESCE(grouped.l_lochirarchietxt, ''), ' ',
                           COALESCE(k_meta_shortdesc, ''), ' ',
                           COALESCE(k_keywords, ''), ' ')
WHERE toupdate.k_id=grouped.k_id;

-- calc news.id
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
INSERT into tour (t_id, l_id, k_id, t_datevon, t_name, t_desc_gefahren, t_desc_fuehrer, t_desc_gebiet, t_desc_talort, t_desc_ziel, t_meta_shortdesc, t_ele_max, t_gpstracks_basefile, t_rate, t_rate_ks, t_rate_firn, t_rate_gletscher, t_rate_klettern, t_rate_bergtour, t_rate_schneeschuh, t_rate_ausdauer, t_rate_bildung, t_rate_gesamt, t_rate_kraft, t_rate_mental, t_rate_motive, t_rate_schwierigkeit, t_rate_wichtigkeit, t_route_aufstieg_name, t_route_aufstieg_dauer, t_route_aufstieg_hm, t_route_aufstieg_km, t_route_aufstieg_sl, t_route_aufstieg_m, t_route_abstieg_name, t_route_abstieg_dauer, t_route_abstieg_hm, t_route_abstieg_m, t_route_huette_name, t_route_huette_dauer, t_route_huette_hm, t_route_huette_m, t_route_zustieg_dauer, t_route_zustieg_hm, t_route_zustieg_m, t_route_dauer, t_route_hm, t_route_m, t_typ)
    SELECT t_id, l_id, k_id, t_datevon, t_name, t_desc_gefahren, t_desc_fuehrer, t_desc_gebiet, t_desc_talort, t_desc_ziel, t_meta_shortdesc, t_ele_max, t_gpstracks_basefile, t_rate, t_rate_ks, t_rate_firn, t_rate_gletscher, t_rate_klettern, t_rate_bergtour, t_rate_schneeschuh, t_rate_ausdauer, t_rate_bildung, t_rate_gesamt, t_rate_kraft, t_rate_mental, t_rate_motive, t_rate_schwierigkeit, t_rate_wichtigkeit, t_route_aufstieg_name, t_route_aufstieg_dauer, t_route_aufstieg_hm, t_route_aufstieg_km, t_route_aufstieg_sl, t_route_aufstieg_m, t_route_abstieg_name, t_route_abstieg_dauer, t_route_abstieg_hm, t_route_abstieg_m, t_route_huette_name, t_route_huette_dauer, t_route_huette_hm, t_route_huette_m, t_route_zustieg_dauer, t_route_zustieg_hm, t_route_zustieg_m, t_route_dauer, t_route_hm, t_route_m, t_typ
    FROM mediadb.tour;

-- calc keywords
UPDATE tour toupdate,
 (SELECT tour.t_id AS t_id, GROUP_CONCAT(mk.kw_name SEPARATOR ",") AS t_keywords
  FROM tour LEFT JOIN mediadb.tour_keyword mjoin ON tour.t_id=mjoin.t_id LEFT JOIN mediadb.keyword mk ON mjoin.kw_id=mk.kw_id
   GROUP BY tour.t_id) grouped
SET toupdate.t_keywords=grouped.t_keywords
WHERE toupdate.t_id=grouped.t_id;

-- calc desc+dates+coords
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
    toupdate.t_html_list=CONCAT(COALESCE(t_name, ''), ' ',
                           COALESCE(grouped.l_lochirarchietxt, ''), ' ',
                           COALESCE(t_meta_shortdesc, ''), ' ',
                           COALESCE(t_keywords, ''), ' ')
WHERE toupdate.t_id=grouped.t_id;

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

-- calc keywords
UPDATE image toupdate,
    (SELECT GROUP_CONCAT(mk.kw_name SEPARATOR ",") AS i_keywords, image.i_id AS i_id
     FROM image LEFT JOIN mediadb.image_keyword mjoin ON image.i_id=mjoin.i_id LEFT JOIN mediadb.keyword mk ON mjoin.kw_id=mk.kw_id
     GROUP BY image.i_id) grouped
SET toupdate.i_keywords=grouped.i_keywords
WHERE toupdate.i_id=grouped.i_id;

-- image calc persons
UPDATE image toupdate,
    (SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ",") AS i_persons, image.i_id AS i_id
     FROM image INNER JOIN mediadb.image_object ON image.i_id=mediadb.image_object.i_id
        INNER JOIN mediadb.objects_key ON mediadb.image_object.io_obj_type=objects_key.ok_key AND mediadb.image_object.io_detector=mediadb.objects_key.ok_detector
        INNER JOIN mediadb.objects ON mediadb.objects_key.o_id=objects.o_id
     WHERE LOWER(o_category) LIKE "person"
     GROUP BY image.i_id) grouped
SET toupdate.i_persons=grouped.i_persons
WHERE toupdate.i_id=grouped.i_id;

-- calc desc+dates+coords
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

--
-- import videos
--
INSERT into video (v_id, k_id, v_gesperrt, v_date, v_dir, v_file, v_gps_lat, v_gps_lon, v_gps_ele, v_rate, v_rate_motive, v_rate_wichtigkeit)
    SELECT distinct mediadb.video.v_id, mediadb.kategorie.k_id, v_gesperrt, v_date, v_dir, v_file, v_gps_lat, v_gps_lon, v_gps_ele, v_rate, v_rate_motive, v_rate_wichtigkeit
    FROM mediadb.video INNER JOIN mediadb.kategorie ON mediadb.kategorie.k_id=mediadb.video.k_id
                       INNER JOIN mediadb.video_playlist ON mediadb.video_playlist.v_id=mediadb.video.v_id
    WHERE (mediadb.kategorie.k_gesperrt=0 OR mediadb.kategorie.k_gesperrt IS NULL)
          && (mediadb.video.v_gesperrt=0 OR mediadb.video.v_gesperrt IS NULL)
          && mediadb.video_playlist.p_id=17;

-- calc keywords
UPDATE video toupdate,
    (SELECT GROUP_CONCAT(mk.kw_name SEPARATOR ",") AS v_keywords, video.v_id AS v_id
     FROM video LEFT JOIN mediadb.video_keyword mjoin ON video.v_id=mjoin.v_id LEFT JOIN mediadb.keyword mk ON mjoin.kw_id=mk.kw_id
     GROUP BY video.v_id) grouped
SET toupdate.v_keywords=grouped.v_keywords
WHERE toupdate.v_id=grouped.v_id;

-- video calc persons
UPDATE video toupdate,
    (SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ",") AS v_persons, video.v_id AS v_id
     FROM video INNER JOIN mediadb.video_object ON video.v_id=mediadb.video_object.v_id
        INNER JOIN mediadb.objects_key ON mediadb.video_object.vo_obj_type=objects_key.ok_key AND mediadb.video_object.vo_detector=mediadb.objects_key.ok_detector
        INNER JOIN mediadb.objects ON mediadb.objects_key.o_id=objects.o_id
     WHERE LOWER(o_category) LIKE "person"
     GROUP BY video.v_id) grouped
SET toupdate.v_persons=grouped.v_persons
WHERE toupdate.v_id=grouped.v_id;

-- calc desc+dates+coords
UPDATE video toupdate,
 (SELECT video.v_id, kategorie_full.k_id, kategorie_full.t_id, k_name, kategorie_full.k_meta_shortdesc, location.l_lochirarchietxt
  FROM video INNER JOIN kategorie_full ON video.k_Id=kategorie_full.k_id INNER JOIN location ON kategorie_full.l_id=location.l_id
  GROUP BY video.v_id) grouped
SET
    toupdate.t_id=grouped.t_id,
    toupdate.v_dateshow=v_date,
    toupdate.v_katname=grouped.k_name,
    toupdate.v_katdesc=grouped.k_meta_shortdesc,
    toupdate.v_lochirarchie=grouped.l_lochirarchietxt
WHERE toupdate.v_id=grouped.v_id;

-- -----------
-- update id-summary-fields
-- -----------
SET SESSION group_concat_max_len = 200000000;


-- calc location: kat/tour-ids
UPDATE location SET l_tids='0';
UPDATE location SET l_katids='0';
UPDATE location toupdate,
 (SELECT tour.l_id AS l_id, GROUP_CONCAT(t_id SEPARATOR ',,') AS l_t_ids
  FROM tour GROUP BY tour.l_id) grouped
SET toupdate.l_tids=grouped.l_t_ids
WHERE toupdate.l_id=grouped.l_id;

UPDATE location toupdate,
 (SELECT kategorie_full.l_id AS l_id, GROUP_CONCAT(k_id SEPARATOR ',,') AS l_k_ids
  FROM kategorie_full GROUP BY kategorie_full.l_id) grouped
SET toupdate.l_katids=grouped.l_k_ids
WHERE toupdate.l_id=grouped.l_id;

UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id, GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=7;
UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');

UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id, GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=6;
UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');


UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id, GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=5;
UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');


UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id, GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=4;
UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');


UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id, GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=3;
UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');


UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id, GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=2;
UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');

UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id, GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=1;
UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');

UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id, GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=0;
UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');

UPDATE location SET l_tids=CONCAT(l_tids, ',');
UPDATE location SET l_katids=CONCAT(l_katids, ',');

-- calc tour: kat-ids
UPDATE tour SET t_k_ids='0';
UPDATE tour toupdate,
 (SELECT tour.t_id, tour.t_name, GROUP_CONCAT(kategorie_full.k_id SEPARATOR ',,') AS t_kids, CHAR_LENGTH(GROUP_CONCAT(kategorie_full.k_id SEPARATOR ',,'))
  FROM tour left join kategorie_full ON tour.t_id=kategorie_full.t_id GROUP BY tour.t_id ORDER BY tour.t_id) grouped
SET toupdate.t_k_ids=grouped.t_kids
WHERE toupdate.t_id=grouped.t_id AND toupdate.t_id > 1 AND CHAR_LENGTH(t_kids) < 2000;

UPDATE tour toupdate,
  (SELECT mjoin.t_id AS t_id, GROUP_CONCAT(CAST(mjoin.k_id AS char(100)) SEPARATOR  ',,') AS k_ids
   FROM mediadb.kategorie_tour mjoin
   GROUP BY mjoin.t_id) grouped
SET toupdate.t_k_ids=CONCAT(COALESCE(t_k_ids, ''), ',,', COALESCE(grouped.k_ids, ''))
WHERE toupdate.t_id=grouped.t_id;
UPDATE tour SET t_k_ids=REGEXP_REPLACE(REGEXP_REPLACE(t_k_ids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE tour SET t_k_ids=CONCAT(t_k_ids, ',');
UPDATE tour SET k_id=0 where k_id is null;
UPDATE tour SET k_t_ids=REGEXP_REPLACE(REGEXP_REPLACE(t_k_ids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE tour SET k_t_ids_full=COALESCE(k_t_ids, '');


-- calc track: tour-ids
UPDATE kategorie_full SET k_t_ids=COALESCE(t_id, '0');
UPDATE kategorie_full toupdate,
  (SELECT mjoin.k_id AS k_id, GROUP_CONCAT(CAST(mjoin.t_id AS char(100)) SEPARATOR  ',,') AS t_ids
   FROM mediadb.kategorie_tour mjoin
   GROUP BY mjoin.k_id) grouped
SET toupdate.k_t_ids=CONCAT(COALESCE(k_t_ids, ''), ',,', COALESCE(grouped.t_ids, ''))
WHERE toupdate.k_id=grouped.k_id;

UPDATE kategorie_full SET k_t_ids=REGEXP_REPLACE(REGEXP_REPLACE(k_t_ids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE kategorie_full SET k_t_ids_full=COALESCE(k_t_ids, '');

------------ update trackdata
-- track calc keywords-persons
UPDATE kategorie_full toupdate,
 (SELECT kategorie_full.k_id AS k_id, GROUP_CONCAT(mk.kw_name SEPARATOR ',') AS k_persons
  FROM kategorie_full LEFT JOIN mediadb.kategorie_keyword mjoin ON kategorie_full.k_id=mjoin.k_id
       INNER JOIN mediadb.keyword mk ON mjoin.kw_id=mk.kw_id
       INNER JOIN mediadb.person mp ON LOWER(mp.pn_shortname) like LOWER(mk.kw_name)
  GROUP BY kategorie_full.k_id) grouped
SET toupdate.k_persons=grouped.k_persons
WHERE toupdate.k_id=grouped.k_id;

-- track calc image-persons
UPDATE kategorie_full toupdate,
  (SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS i_persons, image.k_id AS k_id
     FROM image INNER JOIN mediadb.image_object ON image.i_id=mediadb.image_object.i_id
        INNER JOIN mediadb.objects_key ON mediadb.image_object.io_obj_type=objects_key.ok_key AND mediadb.image_object.io_detector=mediadb.objects_key.ok_detector
        INNER JOIN mediadb.objects ON mediadb.objects_key.o_id=objects.o_id
     WHERE LOWER(o_category) LIKE "person"
     GROUP BY image.k_id) grouped
SET toupdate.k_persons=CONCAT(COALESCE(toupdate.k_persons, ''), ',',
                              COALESCE(grouped.i_persons, ''), '')
WHERE toupdate.k_id=grouped.k_id;

-- track calc video-persons
UPDATE kategorie_full toupdate,
  (SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ",") AS v_persons, video.k_id AS k_id
     FROM video INNER JOIN mediadb.video_object ON video.v_id=mediadb.video_object.v_id
        INNER JOIN mediadb.objects_key ON mediadb.video_object.vo_obj_type=objects_key.ok_key AND mediadb.video_object.vo_detector=mediadb.objects_key.ok_detector
        INNER JOIN mediadb.objects ON mediadb.objects_key.o_id=objects.o_id
     WHERE LOWER(o_category) LIKE "person"
     GROUP BY video.k_id) grouped
SET toupdate.k_persons=CONCAT(COALESCE(toupdate.k_persons, ''), ',',
                              COALESCE(grouped.v_persons, ''), '')
WHERE toupdate.k_id=grouped.k_id;
