-- ##################
-- import location
-- ##################
INSERT INTO location (l_id, l_gesperrt, l_meta_shortdesc, l_name, l_url_homepage, l_parent_id, l_gps_lat, l_gps_lon, l_geo_area, l_typ)
     SELECT l_id, l_gesperrt, l_meta_shortdesc, l_name, l_url_homepage, l_parent_id, l_geo_latdeg, l_geo_longdeg, l_geo_area, l_typ FROM importmytbdb_location;

-- TODO UPDATE location SET l_lochirarchietxt=GetLocationNameAncestry(location.l_id, location.l_name, ' -> '), l_lochirarchieids=GetLocationIdAncestry(location.l_id, ',');
UPDATE location SET l_lochirarchietxt=REPLACE(l_lochirarchietxt, 'OFFEN -> ', '');
UPDATE location SET l_lochirarchietxt=REPLACE(l_lochirarchietxt, ' -> ', ',,');
UPDATE location SET l_lochirarchietxt=TRIM(l_lochirarchietxt);

UPDATE location SET l_lochirarchieids='0,';
-- TODO UPDATE location SET l_lochirarchieids=REGEXP_REPLACE(l_lochirarchieids, '^1,', '');
UPDATE location SET l_lochirarchieids=REPLACE(l_lochirarchieids, ',', ',,');
UPDATE location SET l_lochirarchieids=TRIM(l_lochirarchieids);

-- calc keywords
-- TODO
/**
UPDATE location toupdate,
 (SELECT GROUP_CONCAT(mk.kw_name SEPARATOR ',') AS l_keywords, location.l_id AS l_id
  FROM location LEFT JOIN importmytbdb_location_keyword mjoin ON location.l_id=mjoin.l_id LEFT JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
  GROUP BY location.l_id) grouped
SET toupdate.l_keywords=grouped.l_keywords
WHERE toupdate.l_id=grouped.l_id **/;

-- remove todos
UPDATE location SET l_meta_shortdesc=REPLACE(l_meta_shortdesc, 'TODODESC', '');
UPDATE location SET l_keywords=REPLACE(l_keywords, 'KW_TODOKEYWORDS,', '');
UPDATE location SET l_keywords=REPLACE(l_keywords, ',KW_TODOKEYWORDS', '');
UPDATE location SET l_keywords=REPLACE(l_keywords, 'KW_TODOKEYWORDS', '');

-- calc desc
UPDATE location
SET
    l_meta_shortdesc_md=l_meta_shortdesc,
    l_meta_shortdesc_html=l_meta_shortdesc,
    l_html=COALESCE(l_name, '') || ' ' ||
                           COALESCE(l_lochirarchietxt, '') || ' ' ||
                           COALESCE(l_meta_shortdesc, '') || ' ' ||
                           COALESCE(l_keywords, '') || ' ';

-- ##################
-- import info
-- ##################
INSERT INTO info (if_id, l_id, if_gesperrt, if_meta_desc, if_meta_shortdesc, if_name, if_publisher, if_typ, if_url)
    SELECT if_id, l_id, if_gesperrt, if_meta_desc, if_meta_shortdesc, if_name, if_publisher, if_typ, if_url
    FROM importmytbdb_info;

-- calc keywords
-- TODO
/**
UPDATE info toupdate,
 (SELECT info.if_id AS if_id, GROUP_CONCAT(mk.kw_name SEPARATOR ',') AS if_keywords
  FROM info LEFT JOIN importmytbdb_info_keyword mjoin ON info.if_id=mjoin.if_id LEFT JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
   GROUP BY info.if_id) grouped
SET toupdate.if_keywords=grouped.if_keywords
WHERE toupdate.if_id=grouped.if_id**/;

-- remove todos
UPDATE info SET if_meta_desc=REPLACE(if_meta_desc, 'TODODESC', '');
UPDATE info SET if_meta_shortdesc=REPLACE(if_meta_shortdesc, 'TODODESC', '');

-- ##################
-- import-locationinfos
-- ##################
INSERT into location_info (lif_id, if_id, l_id, lif_linked_details)
    SELECT lif_id, if_id, l_id, lif_linked_details
    FROM importmytbdb_location_info where l_id IS NOT NULL AND if_ID IS NOT NULL;

-- ##################
-- import news
-- ##################
INSERT INTO news (n_id, w_id, n_gesperrt, n_date, n_datevon, n_datebis, n_message, n_message_md, n_message_html, n_headline, n_keywords)
    SELECT n_id, w_id, n_gesperrt, n_date, n_datevon, n_datebis, n_message, n_message_md, n_message_html, n_headline, n_keywords FROM importmytbdb_news;

-- remove todos
UPDATE news SET n_message=REPLACE(n_message, 'TODODESC', '');
UPDATE news SET n_message_md=REPLACE(n_message_md, 'TODODESC', '');
UPDATE news SET n_message_html=REPLACE(n_message_html, 'TODODESC', '');
UPDATE news SET n_keywords=REPLACE(n_keywords, 'KW_TODOKEYWORDS,', '');
UPDATE news SET n_keywords=REPLACE(n_keywords, ',KW_TODOKEYWORDS', '');
UPDATE news SET n_keywords=REPLACE(n_keywords, 'KW_TODOKEYWORDS', '');

-- calc desc
UPDATE news
SET
    n_message_md=n_message,
    n_message_html=n_message;

-- ##################
-- import trip
-- ##################
INSERT INTO trip (tr_id, i_id, l_id, tr_gesperrt, tr_datebis, tr_datevon, tr_geo_poly, tr_katname_replace, tr_l_ids, tr_meta_desc, tr_meta_shortdesc, tr_name, tr_typ, tr_url)
    SELECT tr_id, i_id, l_id, tr_gesperrt, tr_datebis, tr_datevon, tr_geo_poly, tr_katname_replace, tr_l_ids, tr_meta_desc, tr_meta_shortdesc, tr_name, tr_typ, tr_url
FROM importmytbdb_trip;

-- remove todos
UPDATE trip SET tr_meta_desc=REPLACE(tr_meta_desc, 'TODODESC', '');
UPDATE trip SET tr_meta_shortdesc=REPLACE(tr_meta_shortdesc, 'TODODESC', '');

-- calc desc+dates
UPDATE trip
SET
    tr_meta_shortdesc_md=tr_meta_shortdesc,
    tr_meta_shortdesc_html=tr_meta_shortdesc,
    tr_dateshow=tr_datevon;

-- ##################
-- import tracks
-- ##################
INSERT into kategorie_full (k_id, t_id, l_id, tr_id, k_gesperrt, k_datebis, k_datevon, k_gpstracks_basefile, k_meta_shortdesc, k_name, k_distance, k_altitude_asc, k_altitude_desc, k_altitude_min, k_altitude_max, k_rate_schwierigkeit, k_rate_ausdauer, k_rate_kraft, k_rate_mental, k_rate_bildung, k_rate_motive, k_rate_wichtigkeit, k_rate_gesamt, k_type)
    SELECT k_id, t_id, l_id, COALESCE(tr_id, 0), k_gesperrt, k_datebis, k_datevon, k_gpstracks_basefile, k_meta_shortdesc, k_name, k_distance, k_altitude_asc, k_altitude_desc, k_altitude_min, k_altitude_max, k_rate_schwierigkeit, k_rate_ausdauer, k_rate_kraft, k_rate_mental, k_rate_bildung, k_rate_motive, k_rate_wichtigkeit, k_rate_gesamt, k_type
    FROM importmytbdb_kategorie WHERE (importmytbdb_kategorie.k_gesperrt=0 OR importmytbdb_kategorie.k_gesperrt IS NULL);

-- calc keywords
-- TODO
/**
UPDATE kategorie_full toupdate,
 (SELECT kategorie_full.k_id AS k_id, GROUP_CONCAT(mk.kw_name SEPARATOR ',') AS k_keywords
  FROM kategorie_full LEFT JOIN importmytbdb_kategorie_keyword mjoin ON kategorie_full.k_id=mjoin.k_id LEFT JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
   GROUP BY kategorie_full.k_id) grouped
SET toupdate.k_keywords=grouped.k_keywords
WHERE toupdate.k_id=grouped.k_id**/;

-- calc master-image
-- TODO
/**
UPDATE kategorie_full toupdate,
    (SELECT importmytbdb_kategorie.k_id, importmytbdb_image.i_id
     FROM importmytbdb_image INNER JOIN importmytbdb_kategorie ON importmytbdb_kategorie.k_id=importmytbdb_image.k_id
                        INNER JOIN importmytbdb_image_playlist ON importmytbdb_image_playlist.i_id=importmytbdb_image.i_id
     WHERE (importmytbdb_kategorie.k_gesperrt=0 OR importmytbdb_kategorie.k_gesperrt IS NULL)
           AND (importmytbdb_image.i_gesperrt=0 OR importmytbdb_image.i_gesperrt IS NULL)
           AND importmytbdb_image_playlist.p_id=18) grouped
SET toupdate.i_id=grouped.i_id
WHERE toupdate.k_id=grouped.k_id**/;

-- remove todos
UPDATE kategorie_full SET k_meta_shortdesc=REPLACE(k_meta_shortdesc, 'TODODESC', '');
UPDATE kategorie_full SET k_keywords=REPLACE(k_keywords, 'KW_TODOKEYWORDS,', '');
UPDATE kategorie_full SET k_keywords=REPLACE(k_keywords, ',KW_TODOKEYWORDS', '');
UPDATE kategorie_full SET k_keywords=REPLACE(k_keywords, 'KW_TODOKEYWORDS', '');

-- calc desc+dates+coords
-- TODO
/**
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
WHERE toupdate.k_id=grouped.k_id**/;

-- calc news.id
-- TODO
/**
UPDATE kategorie_full toupdate,
 (SELECT kategorie_full.k_id, news.n_id
  FROM kategorie_full, news
  WHERE (kategorie_full.k_dateshow >= news.n_datevon AND kategorie_full.k_dateshow <= news.n_datebis)
  GROUP BY kategorie_full.k_id) grouped
SET
    toupdate.n_id=grouped.n_id
WHERE toupdate.k_id=grouped.k_id**/;

-- ##################
-- import routes
-- ##################
INSERT into tour (t_id, l_id, k_id, t_gesperrt, t_datevon, t_name, t_desc_gefahren, t_desc_fuehrer, t_desc_gebiet, t_desc_talort, t_desc_ziel, t_meta_shortdesc, t_ele_max, t_gpstracks_basefile, t_rate, t_rate_ks, t_rate_firn, t_rate_gletscher, t_rate_klettern, t_rate_bergtour, t_rate_schneeschuh, t_rate_ausdauer, t_rate_bildung, t_rate_gesamt, t_rate_kraft, t_rate_mental, t_rate_motive, t_rate_schwierigkeit, t_rate_wichtigkeit, t_route_aufstieg_name, t_route_aufstieg_dauer, t_route_aufstieg_hm, t_route_aufstieg_km, t_route_aufstieg_sl, t_route_aufstieg_m, t_route_abstieg_name, t_route_abstieg_dauer, t_route_abstieg_hm, t_route_abstieg_m, t_route_huette_name, t_route_huette_dauer, t_route_huette_hm, t_route_huette_m, t_route_zustieg_dauer, t_route_zustieg_hm, t_route_zustieg_m, t_route_dauer, t_route_hm, t_route_m, t_typ)
    SELECT t_id, l_id, k_id, t_gesperrt, t_datevon, t_name, t_desc_gefahren, t_desc_fuehrer, t_desc_gebiet, t_desc_talort, t_desc_ziel, t_meta_shortdesc, t_ele_max, t_gpstracks_basefile, t_rate, t_rate_ks, t_rate_firn, t_rate_gletscher, t_rate_klettern, t_rate_bergtour, t_rate_schneeschuh, t_rate_ausdauer, t_rate_bildung, t_rate_gesamt, t_rate_kraft, t_rate_mental, t_rate_motive, t_rate_schwierigkeit, t_rate_wichtigkeit, t_route_aufstieg_name, t_route_aufstieg_dauer, t_route_aufstieg_hm, t_route_aufstieg_km, t_route_aufstieg_sl, t_route_aufstieg_m, t_route_abstieg_name, t_route_abstieg_dauer, t_route_abstieg_hm, t_route_abstieg_m, t_route_huette_name, t_route_huette_dauer, t_route_huette_hm, t_route_huette_m, t_route_zustieg_dauer, t_route_zustieg_hm, t_route_zustieg_m, t_route_dauer, t_route_hm, t_route_m, t_typ
    FROM importmytbdb_tour;

-- calc tour: d-ids
UPDATE tour SET d_id=REPLACE(REPLACE(LOWER(COALESCE(tour.l_id, "") || "_" ||
            COALESCE(t_desc_gebiet, "") || "_" ||
            COALESCE(t_desc_ziel, "") || "_" ||
            COALESCE(t_typ, "")), " ", "_"), "/", "_");

-- calc keywords
-- TODO
/**
UPDATE tour toupdate,
 (SELECT tour.t_id AS t_id, GROUP_CONCAT(mk.kw_name SEPARATOR ',') AS t_keywords
  FROM tour LEFT JOIN importmytbdb_tour_keyword mjoin ON tour.t_id=mjoin.t_id LEFT JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
   GROUP BY tour.t_id) grouped
SET toupdate.t_keywords=grouped.t_keywords
WHERE toupdate.t_id=grouped.t_id**/;

-- remove todos
UPDATE tour SET t_meta_shortdesc=REPLACE(t_meta_shortdesc, 'TODODESC', '');
UPDATE tour SET t_keywords=REPLACE(t_keywords, 'KW_TODOKEYWORDS,', '');
UPDATE tour SET t_keywords=REPLACE(t_keywords, ',KW_TODOKEYWORDS', '');
UPDATE tour SET t_keywords=REPLACE(t_keywords, 'KW_TODOKEYWORDS', '');

-- calc desc+dates+coords
-- TODO
/**
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
WHERE toupdate.t_id=grouped.t_id**/;

-- ##################
-- import-trackroutes
-- ##################
INSERT into kategorie_tour (t_id, k_id)
    SELECT t_id, k_id
    FROM importmytbdb_kategorie_tour where k_id IS NOT NULL AND t_ID IS NOT NULL;
INSERT into kategorie_tour (t_id, k_id)
    SELECT t_id, k_id
    FROM importmytbdb_kategorie where k_id IS NOT NULL AND t_ID IS NOT NULL;

-- ##################
-- import-routeinfos
-- ##################
INSERT into tour_info (tif_id, if_id, t_id, tif_linked_details)
    SELECT tif_id, if_id, t_id, tif_linked_details
    FROM importmytbdb_tour_info where t_id IS NOT NULL AND if_ID IS NOT NULL;

-- ##################
-- import-destinations
-- ##################
INSERT INTO destination (d_id,
       l_id,
       d_gesperrt,
       d_desc_gebiet,
       d_desc_ziel,
       d_name,
       d_typ,
       d_datevon,
       d_route_hm,
       d_ele_max,
       d_route_m,
       d_rate_ausdauer,
       d_rate_bildung,
       d_rate_gesamt,
       d_rate_kraft,
       d_rate_mental,
       d_rate_motive,
       d_rate_schwierigkeit,
       d_rate_wichtigkeit,
       d_rate,
       d_rate_ks,
       d_rate_firn,
       d_rate_gletscher,
       d_rate_klettern,
       d_rate_bergtour,
       d_rate_schneeschuh,
       d_route_dauer
       )
SELECT REPLACE(REPLACE(LOWER(COALESCE(tour.l_id, "") || "_" ||
            COALESCE(t_desc_gebiet, "") || "_" ||
            COALESCE(t_desc_ziel, "") || "_" ||
            COALESCE(t_typ, "")), " ", "_"), "/", "_")                    AS d_id,
       tour.l_id,
       t_gesperrt AS d_gesperrt,
       t_desc_gebiet AS d_desc_gebiet,
       t_desc_ziel AS d_desc_ziel,
       t_desc_ziel AS d_name,
       t_typ AS d_typ,
       min(t_datevon)                                                  AS d_datevon,
       min(t_route_hm)                                                 AS d_route_hm,
       min(t_ele_max)                                                  AS d_ele_max,
       min(t_route_m)                                                  AS d_route_m,
       min(t_rate_ausdauer)                                            AS d_rate_ausdauer,
       max(t_rate_bildung)                                             AS d_rate_bildung,
       max(t_rate_gesamt)                                              AS d_rate_gesamt,
       min(t_rate_kraft)                                               AS d_rate_kraft,
       min(t_rate_mental)                                              AS d_rate_mental,
       max(t_rate_motive)                                              AS d_rate_motive,
       min(t_rate_schwierigkeit)                                       AS d_rate_schwierigkeit,
       max(t_rate_wichtigkeit)                                         AS d_rate_wichtigkeit,
       min(t_rate)                                                     AS d_rate,
       min(t_rate_ks)                                                  AS d_rate_ks,
       min(t_rate_firn)                                                AS d_rate_firn,
       min(t_rate_gletscher)                                           AS d_rate_gletscher,
       min(t_rate_klettern)                                            AS d_rate_klettern,
       min(t_rate_bergtour)                                            AS d_rate_bergtour,
       min(t_rate_schneeschuh)                                         AS d_rate_schneeschuh,
       min(t_route_dauer)                                              AS d_route_dauer
FROM tour
         LEFT JOIN location ON tour.l_id = location.l_id
GROUP BY d_id;

-- calc desc+dates+coords
-- TODO
/**
UPDATE destination toupdate,
 (SELECT destination.d_id, location.l_gps_lat, location.l_gps_lon, location.l_lochirarchietxt
  FROM destination INNER JOIN location ON destination.l_id=location.l_id
  GROUP BY destination.d_id) grouped
SET
    toupdate.d_gps_lat=grouped.l_gps_lat,
    toupdate.d_gps_lon=grouped.l_gps_lon,
    toupdate.d_dateshow=d_datevon
WHERE toupdate.d_id=grouped.d_id**/;


-- ##################
-- import images
-- ##################
INSERT into image (i_id, k_id, i_gesperrt, i_date, i_dir, i_file, i_gps_lat, i_gps_lon, i_gps_ele, i_rate, i_rate_motive, i_rate_wichtigkeit)
    SELECT distinct importmytbdb_image.i_id, importmytbdb_image.k_id, i_gesperrt, i_date, i_dir, i_file, i_gps_lat, i_gps_lon, i_gps_ele, i_rate, i_rate_motive, i_rate_wichtigkeit
    FROM importmytbdb_image INNER JOIN importmytbdb_image_playlist ON importmytbdb_image_playlist.i_id=importmytbdb_image.i_id
    WHERE importmytbdb_image_playlist.p_id=17;

-- calc keywords
-- TODO
/**
UPDATE image toupdate,
    (SELECT GROUP_CONCAT(mk.kw_name SEPARATOR ',') AS i_keywords, image.i_id AS i_id
     FROM image LEFT JOIN importmytbdb_image_keyword mjoin ON image.i_id=mjoin.i_id LEFT JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
     GROUP BY image.i_id) grouped
SET toupdate.i_keywords=grouped.i_keywords
WHERE toupdate.i_id=grouped.i_id**/;

-- image calc persons
-- TODO
/**
UPDATE image toupdate,
    (SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ',') AS i_persons, image.i_id AS i_id
     FROM image INNER JOIN importmytbdb_image_object ON image.i_id=importmytbdb_image_object.i_id
        INNER JOIN importmytbdb_objects_key ON importmytbdb_image_object.io_obj_type=objects_key.ok_key AND importmytbdb_image_object.io_detector=importmytbdb_objects_key.ok_detector
        INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=objects.o_id
     WHERE LOWER(o_category) LIKE 'person'
        AND (importmytbdb_image_object.io_precision = 1
             OR importmytbdb_image_object.io_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                          'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))
     GROUP BY image.i_id) grouped
SET toupdate.i_persons=grouped.i_persons
WHERE toupdate.i_id=grouped.i_id**/;


-- image calc objects
-- TODO
/**
UPDATE image toupdate,
    (SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ',') AS i_objects, image.i_id AS i_id
     FROM image INNER JOIN importmytbdb_image_object ON image.i_id=importmytbdb_image_object.i_id
        INNER JOIN importmytbdb_objects_key ON importmytbdb_image_object.io_obj_type=objects_key.ok_key AND importmytbdb_image_object.io_detector=importmytbdb_objects_key.ok_detector
        INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=objects.o_id
     WHERE LOWER(o_category) NOT LIKE 'person'
        AND (importmytbdb_image_object.io_precision = 1
             OR importmytbdb_image_object.io_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                          'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))
     GROUP BY image.i_id) grouped
SET toupdate.i_objects=grouped.i_objects
WHERE toupdate.i_id=grouped.i_id**/;

-- remove todos
UPDATE image SET i_keywords=REPLACE(i_keywords, 'KW_TODOKEYWORDS,', '');
UPDATE image SET i_keywords=REPLACE(i_keywords, ',KW_TODOKEYWORDS', '');
UPDATE image SET i_keywords=REPLACE(i_keywords, 'KW_TODOKEYWORDS', '');

-- image calc desc+dates+coords
-- TODO
/**
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
WHERE toupdate.i_id=grouped.i_id**/;

-- ##################
-- import videos
-- ##################
INSERT into video (v_id, k_id, v_gesperrt, v_date, v_dir, v_file, v_gps_lat, v_gps_lon, v_gps_ele, v_rate, v_rate_motive, v_rate_wichtigkeit)
    SELECT distinct importmytbdb_video.v_id, importmytbdb_video.k_id, v_gesperrt, v_date, v_dir, v_file, v_gps_lat, v_gps_lon, v_gps_ele, v_rate, v_rate_motive, v_rate_wichtigkeit
    FROM importmytbdb_video INNER JOIN importmytbdb_video_playlist ON importmytbdb_video_playlist.v_id=importmytbdb_video.v_id
    WHERE importmytbdb_video_playlist.p_id=17;

-- calc keywords
-- TODO
/**
UPDATE video toupdate,
    (SELECT GROUP_CONCAT(mk.kw_name SEPARATOR ',') AS v_keywords, video.v_id AS v_id
     FROM video LEFT JOIN importmytbdb_video_keyword mjoin ON video.v_id=mjoin.v_id LEFT JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
     GROUP BY video.v_id) grouped
SET toupdate.v_keywords=grouped.v_keywords
WHERE toupdate.v_id=grouped.v_id**/;

-- video calc persons
-- TODO
/**
UPDATE video toupdate,
    (SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ',') AS v_persons, video.v_id AS v_id
     FROM video INNER JOIN importmytbdb_video_object ON video.v_id=importmytbdb_video_object.v_id
        INNER JOIN importmytbdb_objects_key ON importmytbdb_video_object.vo_obj_type=objects_key.ok_key AND importmytbdb_video_object.vo_detector=importmytbdb_objects_key.ok_detector
        INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=objects.o_id
     WHERE LOWER(o_category) LIKE 'person'
        AND (importmytbdb_video_object.vo_precision = 1
             OR importmytbdb_video_object.vo_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                          'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))
     GROUP BY video.v_id) grouped
SET toupdate.v_persons=grouped.v_persons
WHERE toupdate.v_id=grouped.v_id**/;

-- video calc objects
-- TODO
/**
UPDATE video toupdate,
    (SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ',') AS v_objects, video.v_id AS v_id
     FROM video INNER JOIN importmytbdb_video_object ON video.v_id=importmytbdb_video_object.v_id
        INNER JOIN importmytbdb_objects_key ON importmytbdb_video_object.vo_obj_type=objects_key.ok_key AND importmytbdb_video_object.vo_detector=importmytbdb_objects_key.ok_detector
        INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=objects.o_id
     WHERE LOWER(o_category) NOT LIKE 'person'
        AND (importmytbdb_video_object.vo_precision = 1
             OR importmytbdb_video_object.vo_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                          'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))
     GROUP BY video.v_id) grouped
SET toupdate.v_objects=grouped.v_objects
WHERE toupdate.v_id=grouped.v_id**/;

-- remove todos
UPDATE video SET v_keywords=REPLACE(v_keywords, 'KW_TODOKEYWORDS,', '');
UPDATE video SET v_keywords=REPLACE(v_keywords, ',KW_TODOKEYWORDS', '');
UPDATE video SET v_keywords=REPLACE(v_keywords, 'KW_TODOKEYWORDS', '');

-- video calc desc+dates+coords
-- TODO
/**
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
WHERE toupdate.v_id=grouped.v_id**/;

-- ##################
-- update id-summary-fields
-- ##################

-- calc location: kat/tour-ids
UPDATE location SET l_tids='0';
UPDATE location SET l_dids='0';
UPDATE location SET l_katids='0';
-- TODO
/**
UPDATE location toupdate,
 (SELECT tour.l_id AS l_id, GROUP_CONCAT(t_id SEPARATOR ',,') AS l_t_ids
  FROM tour GROUP BY tour.l_id) grouped
SET toupdate.l_tids=grouped.l_t_ids
WHERE toupdate.l_id=grouped.l_id**/;

-- TODO
/**
UPDATE location toupdate,
 (SELECT destination.l_id AS l_id, GROUP_CONCAT(d_id SEPARATOR ',,') AS l_d_ids
  FROM destination GROUP BY destination.l_id) grouped
SET toupdate.l_dids=grouped.l_d_ids
WHERE toupdate.l_id=grouped.l_id**/;

-- TODO
/**
UPDATE location toupdate,
 (SELECT kategorie_full.l_id AS l_id, GROUP_CONCAT(k_id SEPARATOR ',,') AS l_k_ids
  FROM kategorie_full GROUP BY kategorie_full.l_id) grouped
SET toupdate.l_katids=grouped.l_k_ids
WHERE toupdate.l_id=grouped.l_id**/;

-- TODO
/**
UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id,
    GROUP_CONCAT(COALESCE(l_dids, '') SEPARATOR ',,') AS l_d_ids,
    GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_dids=CONCAT(COALESCE(l_dids, ''), ',,', COALESCE(grouped.l_d_ids, '')),
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=7**/;

-- TODO UPDATE location SET l_dids=REGEXP_REPLACE(REGEXP_REPLACE(l_dids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');

-- TODO
/**UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id,
    GROUP_CONCAT(COALESCE(l_dids, '') SEPARATOR ',,') AS l_d_ids,
    GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_dids=CONCAT(COALESCE(l_dids, ''), ',,', COALESCE(grouped.l_d_ids, '')),
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=6**/;

-- TODO UPDATE location SET l_dids=REGEXP_REPLACE(REGEXP_REPLACE(l_dids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');

-- TODO
/**
UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id,
    GROUP_CONCAT(COALESCE(l_dids, '') SEPARATOR ',,') AS l_d_ids,
    GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_dids=CONCAT(COALESCE(l_dids, ''), ',,', COALESCE(grouped.l_d_ids, '')),
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=5**/;

-- TODO UPDATE location SET l_dids=REGEXP_REPLACE(REGEXP_REPLACE(l_dids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');

-- TODO
/**
UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id,
    GROUP_CONCAT(COALESCE(l_dids, '') SEPARATOR ',,') AS l_d_ids,
    GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_dids=CONCAT(COALESCE(l_dids, ''), ',,', COALESCE(grouped.l_d_ids, '')),
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=4**/;

-- TODO UPDATE location SET l_dids=REGEXP_REPLACE(REGEXP_REPLACE(l_dids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');

-- TODO
/**
UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id,
    GROUP_CONCAT(COALESCE(l_dids, '') SEPARATOR ',,') AS l_d_ids,
    GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_dids=CONCAT(COALESCE(l_dids, ''), ',,', COALESCE(grouped.l_d_ids, '')),
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=3**/;

-- TODO UPDATE location SET l_dids=REGEXP_REPLACE(REGEXP_REPLACE(l_dids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');

-- TODO
/**
UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id,
    GROUP_CONCAT(COALESCE(l_dids, '') SEPARATOR ',,') AS l_d_ids,
    GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_dids=CONCAT(COALESCE(l_dids, ''), ',,', COALESCE(grouped.l_d_ids, '')),
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=2**/;

-- TODO UPDATE location SET l_dids=REGEXP_REPLACE(REGEXP_REPLACE(l_dids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');

-- TODO
/**
UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id,
    GROUP_CONCAT(COALESCE(l_dids, '') SEPARATOR ',,') AS l_d_ids,
    GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_dids=CONCAT(COALESCE(l_dids, ''), ',,', COALESCE(grouped.l_d_ids, '')),
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=1**/;

-- TODO UPDATE location SET l_dids=REGEXP_REPLACE(REGEXP_REPLACE(l_dids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');

-- TODO
/**
UPDATE location toupdate,
 (SELECT location.l_parent_id AS l_parent_id,
    GROUP_CONCAT(COALESCE(l_dids, '') SEPARATOR ',,') AS l_d_ids,
    GROUP_CONCAT(COALESCE(l_tids, '') SEPARATOR ',,') AS l_t_ids,
    GROUP_CONCAT(COALESCE(l_katids, '') SEPARATOR ',,') AS l_k_ids
  FROM location where l_id <> 1 GROUP BY location.l_parent_id ORDER BY l_typ desc, l_parent_id desc) grouped
SET
  toupdate.l_dids=CONCAT(COALESCE(l_dids, ''), ',,', COALESCE(grouped.l_d_ids, '')),
  toupdate.l_tids=CONCAT(COALESCE(l_tids, ''), ',,', COALESCE(grouped.l_t_ids, '')),
  toupdate.l_katids=CONCAT(COALESCE(l_katids, ''), ',,', COALESCE(grouped.l_k_ids, ''))
WHERE toupdate.l_id=grouped.l_parent_id AND ROUND (
        (
            CHAR_LENGTH(l_lochirarchietxt)
            - CHAR_LENGTH( REPLACE ( l_lochirarchietxt, ',,', '') )
        ) / CHAR_LENGTH(',,')
    )=0**/;

-- TODO UPDATE location SET l_dids=REGEXP_REPLACE(REGEXP_REPLACE(l_dids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_tids=REGEXP_REPLACE(REGEXP_REPLACE(l_tids, '^,*(.*),*$', '\\1'), ',+', ',');
-- TODO UPDATE location SET l_katids=REGEXP_REPLACE(REGEXP_REPLACE(l_katids, '^,*(.*),*$', '\\1'), ',+', ',');

UPDATE location SET l_dids=l_dids || ',';
UPDATE location SET l_tids=l_tids || ',';
UPDATE location SET l_katids=l_katids  || ',';

-- calc tour: kat-ids
UPDATE tour SET t_k_ids='0';
-- TODO
/**
UPDATE tour toupdate,
 (SELECT tour.t_id, tour.t_name, GROUP_CONCAT(kategorie_full.k_id SEPARATOR ',,') AS t_kids, CHAR_LENGTH(GROUP_CONCAT(kategorie_full.k_id SEPARATOR ',,'))
  FROM tour left join kategorie_full ON tour.t_id=kategorie_full.t_id GROUP BY tour.t_id ORDER BY tour.t_id) grouped
SET toupdate.t_k_ids=grouped.t_kids
WHERE toupdate.t_id=grouped.t_id AND toupdate.t_id > 1 AND CHAR_LENGTH(t_kids) < 2000**/;

-- TODO
/**
UPDATE tour toupdate,
  (SELECT mjoin.t_id AS t_id, GROUP_CONCAT(CAST(mjoin.k_id AS char(100)) SEPARATOR  ',,') AS k_ids
   FROM importmytbdb_kategorie_tour mjoin
   GROUP BY mjoin.t_id) grouped
SET toupdate.t_k_ids=CONCAT(COALESCE(t_k_ids, ''), ',,', COALESCE(grouped.k_ids, ''))
WHERE toupdate.t_id=grouped.t_id**/;


-- TODO UPDATE tour SET t_k_ids=REGEXP_REPLACE(REGEXP_REPLACE(t_k_ids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE tour SET t_k_ids=t_k_ids || ',';
UPDATE tour SET k_id=0 WHERE K_ID IS NULL;
-- TODO UPDATE tour SET t_k_ids=REGEXP_REPLACE(REGEXP_REPLACE(t_k_ids, '^,*(.*),*$', '\\1'), ',+', ',');


-- calc track: d_id
-- TODO
/**
UPDATE kategorie_full toupdate,
 (SELECT kategorie_full.k_id, tour.d_id
  FROM kategorie_full INNER JOIN tour ON kategorie_full.t_id=tour.t_id
  GROUP BY kategorie_full.k_id) grouped
SET
    toupdate.d_id=grouped.d_id
WHERE toupdate.k_id=grouped.k_id**/;

-- calc track: destination/tour-ids
UPDATE kategorie_full SET k_t_ids=COALESCE(t_id, '0');
UPDATE kategorie_full SET k_d_ids='"' || COALESCE(d_id, '0');
-- TODO
/**
UPDATE kategorie_full toupdate,
  (SELECT mjoin.k_id AS k_id,
    GROUP_CONCAT(CAST(mjoin.t_id AS char(100)) SEPARATOR  ',,') AS t_ids,
    GROUP_CONCAT(tour.d_id SEPARATOR  '",,"') AS d_ids
   FROM importmytbdb_kategorie_tour mjoin INNER JOIN tour on mjoin.t_id=tour.t_id
   GROUP BY mjoin.k_id) grouped
SET toupdate.k_t_ids=CONCAT(COALESCE(k_t_ids, ''), ',,', COALESCE(grouped.t_ids, '')),
    toupdate.k_d_ids=CONCAT(COALESCE(k_d_ids, ''), '",,"', COALESCE(grouped.d_ids, ''))
WHERE toupdate.k_id=grouped.k_id**/;

-- TODOUPDATE kategorie_full SET k_t_ids=REGEXP_REPLACE(REGEXP_REPLACE(k_t_ids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE kategorie_full SET k_t_ids_full=COALESCE(k_t_ids, '');
-- TODOUPDATE kategorie_full SET k_d_ids=REGEXP_REPLACE(REGEXP_REPLACE(k_d_ids, '^",*(.*),"*$', '\\1'), ',+', ',');
UPDATE kategorie_full SET k_d_ids=k_d_ids || '"';
UPDATE kategorie_full SET k_d_ids_full=COALESCE(k_d_ids, '');


--
-- update trackdata
-- track calc keywords-persons
-- TODO
/**
UPDATE kategorie_full toupdate,
 (SELECT kategorie_full.k_id AS k_id, GROUP_CONCAT(mk.kw_name SEPARATOR ',') AS k_persons
  FROM kategorie_full LEFT JOIN importmytbdb_kategorie_keyword mjoin ON kategorie_full.k_id=mjoin.k_id
       INNER JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
       INNER JOIN importmytbdb_person mp ON LOWER(mp.pn_shortname) like LOWER(mk.kw_name)
  GROUP BY kategorie_full.k_id) grouped
SET toupdate.k_persons=grouped.k_persons
WHERE toupdate.k_id=grouped.k_id**/;

-- track calc image-persons
-- TODO
/**
UPDATE kategorie_full toupdate,
  (SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ', ') AS i_persons, image.k_id AS k_id
     FROM image INNER JOIN importmytbdb_image_object ON image.i_id=importmytbdb_image_object.i_id
        INNER JOIN importmytbdb_objects_key ON importmytbdb_image_object.io_obj_type=objects_key.ok_key AND importmytbdb_image_object.io_detector=importmytbdb_objects_key.ok_detector
        INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=objects.o_id
     WHERE LOWER(o_category) LIKE 'person'
        AND (importmytbdb_image_object.io_precision = 1
             OR importmytbdb_image_object.io_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                          'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))
     GROUP BY image.k_id) grouped
SET toupdate.k_persons=CONCAT(COALESCE(toupdate.k_persons, ''), ',',
                              COALESCE(grouped.i_persons, ''), '')
WHERE toupdate.k_id=grouped.k_id**/;

-- track calc video-persons
-- TODO
/**
UPDATE kategorie_full toupdate,
  (SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ',') AS v_persons, video.k_id AS k_id
     FROM video INNER JOIN importmytbdb_video_object ON video.v_id=importmytbdb_video_object.v_id
        INNER JOIN importmytbdb_objects_key ON importmytbdb_video_object.vo_obj_type=objects_key.ok_key AND importmytbdb_video_object.vo_detector=importmytbdb_objects_key.ok_detector
        INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=objects.o_id
     WHERE LOWER(o_category) LIKE 'person'
        AND (importmytbdb_video_object.vo_precision = 1
             OR importmytbdb_video_object.vo_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                          'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))
     GROUP BY video.k_id) grouped
SET toupdate.k_persons=CONCAT(COALESCE(toupdate.k_persons, ''), ',',
                              COALESCE(grouped.v_persons, ''), '')
WHERE toupdate.k_id=grouped.k_id**/;

-- track calc image-objects
-- TODO
/**
UPDATE kategorie_full toupdate,
  (SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ', ') AS i_objects, image.k_id AS k_id
     FROM image INNER JOIN importmytbdb_image_object ON image.i_id=importmytbdb_image_object.i_id
        INNER JOIN importmytbdb_objects_key ON importmytbdb_image_object.io_obj_type=objects_key.ok_key AND importmytbdb_image_object.io_detector=importmytbdb_objects_key.ok_detector
        INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=objects.o_id
     WHERE LOWER(o_category) NOT LIKE 'person'
        AND (importmytbdb_image_object.io_precision = 1
             OR importmytbdb_image_object.io_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                          'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))
     GROUP BY image.k_id) grouped
SET toupdate.k_objects=CONCAT(COALESCE(toupdate.k_objects, ''), ',',
                              COALESCE(grouped.i_objects, ''), '')
WHERE toupdate.k_id=grouped.k_id**/;

-- track calc video-objects
-- TODO
/**
UPDATE kategorie_full toupdate,
  (SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ',') AS v_objects, video.k_id AS k_id
     FROM video INNER JOIN importmytbdb_video_object ON video.v_id=importmytbdb_video_object.v_id
        INNER JOIN importmytbdb_objects_key ON importmytbdb_video_object.vo_obj_type=objects_key.ok_key AND importmytbdb_video_object.vo_detector=importmytbdb_objects_key.ok_detector
        INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=objects.o_id
     WHERE LOWER(o_category) NOT LIKE 'person'
        AND (importmytbdb_video_object.vo_precision = 1
             OR importmytbdb_video_object.vo_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                          'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))
     GROUP BY video.k_id) grouped
SET toupdate.k_objects=CONCAT(COALESCE(toupdate.k_objects, ''), ',',
                              COALESCE(grouped.v_objects, ''), '')
WHERE toupdate.k_id=grouped.k_id**/;
