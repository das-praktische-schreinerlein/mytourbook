-- ##################
-- import playlist
-- ##################
INSERT INTO playlist (p_id, p_name, p_meta_desc,
        p_calced_id)
    SELECT p_id, p_name, p_meta_desc,
        "PLAYLIST" || "_" || p_id
    FROM importmytbdb_playlist;

-- ##################
-- import location
-- ##################
INSERT INTO location (l_id, l_gesperrt, l_meta_shortdesc, l_name, l_parent_id, l_gps_lat, l_gps_lon, l_geo_area, l_typ, l_lochirarchietxt, l_lochirarchieids,
                      l_geo_state, l_calced_id, l_calced_subtype, l_calced_gps_loc, l_calced_gps_lat, l_calced_gps_lon, l_calced_altMaxFacet)
    SELECT l_id, l_gesperrt, l_meta_shortdesc, l_name, l_parent_id, l_geo_latdeg, l_geo_longdeg, l_geo_area, l_typ, l_lochirarchietxt, l_lochirarchieids,
           l_geo_state, "LOCATION" || "_" || l_id, l_calced_subtype, l_calced_gps_loc, l_calced_gps_lat, l_calced_gps_lon, l_calced_altMaxFacet
    FROM importmytbdb_location;

-- no more needed UPDATE location SET l_lochirarchietxt=GetLocationNameAncestry(location.l_id, location.l_name, ' -> '), l_lochirarchieids=GetLocationIdAncestry(location.l_id, ',');
UPDATE location SET l_lochirarchietxt=REPLACE(l_lochirarchietxt, 'OFFEN -> ', '');
UPDATE location SET l_lochirarchietxt=REPLACE(l_lochirarchietxt, ' -> ', ',,');
UPDATE location SET l_lochirarchietxt=TRIM(l_lochirarchietxt);
UPDATE location SET l_lochirarchieids=SUBSTR(l_lochirarchieids, 3, LENGTH(l_lochirarchietxt)) WHERE LENGTH(l_lochirarchietxt) > 2;
UPDATE location SET l_lochirarchieids=REPLACE(l_lochirarchieids, ',', ',,');
UPDATE location SET l_lochirarchieids=TRIM(l_lochirarchieids);

-- calc keywords
UPDATE location
   SET l_keywords = (SELECT GROUP_CONCAT(DISTINCT mk.kw_name) AS l_keywords
                        FROM importmytbdb_location_keyword mjoin LEFT JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
                        WHERE location.l_id=mjoin.l_id);

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

-- import playlists
INSERT into location_playlist (lp_id, l_id, p_id, lp_pos)
    SELECT lp_id, l_id, p_id, lp_pos
    FROM importmytbdb_location_playlist;

-- ##################
-- import poi
-- ##################
INSERT INTO poi (poi_id, poi_meta_desc, poi_name, poi_reference, poi_geo_longdeg, poi_geo_latdeg, poi_geo_ele,
                 poi_calced_id, poi_calced_gps_loc, poi_calced_gps_lat, poi_calced_gps_lon, poi_calced_altMaxFacet)
SELECT poi_id, poi_meta_desc, poi_name, poi_reference, poi_geo_longdeg, poi_geo_latdeg, poi_geo_ele,
       "POI" || "_" || poi_id, poi_calced_gps_loc, poi_calced_gps_lat, poi_calced_gps_lon, poi_calced_altMaxFacet
FROM importmytbdb_poi WHERE poi_id IN (
    SELECT distinct poi_id FROM importmytbdb_tour_poi
    UNION
    SELECT distinct poi_id FROM importmytbdb_kategorie_poi
    );

-- calc keywords
UPDATE poi
SET poi_keywords = (SELECT GROUP_CONCAT(DISTINCT mk.kw_name) AS poi_keywords
                  FROM importmytbdb_poi_keyword mjoin LEFT JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
                  WHERE poi.poi_id=mjoin.poi_id);

-- remove todos
UPDATE poi SET poi_meta_desc=REPLACE(poi_meta_desc, 'TODODESC', '');

-- ##################
-- import info
-- ##################
INSERT INTO info (if_id, l_id, if_gesperrt, if_meta_desc, if_meta_shortdesc, if_name, if_publisher, if_typ, if_url,
        if_calced_id, if_calced_subtype)
    SELECT if_id, l_id, if_gesperrt, if_meta_desc, if_meta_shortdesc, if_name, if_publisher, if_typ, if_url,
        "INFO" || "_" || if_id, if_calced_subtype
    FROM importmytbdb_info;

-- calc keywords
UPDATE info
SET if_keywords = (SELECT GROUP_CONCAT(DISTINCT mk.kw_name) AS if_keywords
                    FROM importmytbdb_info_keyword mjoin LEFT JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
                    WHERE info.if_id=mjoin.if_id);

-- remove todos
UPDATE info SET if_meta_desc=REPLACE(if_meta_desc, 'TODODESC', '');
UPDATE info SET if_meta_shortdesc=REPLACE(if_meta_shortdesc, 'TODODESC', '');

-- import playlists
INSERT into info_playlist (ifp_id, if_id, p_id, ifp_pos)
    SELECT ifp_id, if_id, p_id, ifp_pos
    FROM importmytbdb_info_playlist;

-- ##################
-- import-locationinfos
-- ##################
INSERT into location_info (lif_id, if_id, l_id, lif_linked_details)
    SELECT lif_id, if_id, l_id, lif_linked_details
    FROM importmytbdb_location_info where l_id IS NOT NULL AND if_ID IS NOT NULL;

-- ##################
-- import news
-- ##################
INSERT INTO news (n_id, w_id, n_gesperrt, n_date, n_datevon, n_datebis, n_message, n_message_md, n_message_html, n_headline, n_keywords,
        n_calced_id)
    SELECT n_id, w_id, n_gesperrt, n_date, n_datevon, n_datebis, n_message, n_message_md, n_message_html, n_headline, n_keywords,
        "NEWS" || "_" || n_id
    FROM importmytbdb_news;

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
INSERT INTO trip (tr_id, i_id, l_id, tr_gesperrt, tr_datebis, tr_datevon, tr_geo_poly, tr_katname_replace, tr_l_ids, tr_meta_desc, tr_meta_shortdesc, tr_name, tr_typ,
        tr_calced_id, tr_calced_dur, tr_calced_durFacet, tr_calced_dateonly, tr_calced_week, tr_calced_month, tr_calced_year)
    SELECT tr_id, i_id, l_id, tr_gesperrt, tr_datebis, tr_datevon, tr_geo_poly, tr_katname_replace, tr_l_ids, tr_meta_desc, tr_meta_shortdesc, tr_name, tr_typ,
        "TRIP" || "_" || tr_id, tr_calced_dur, tr_calced_durFacet,
         DATETIME(tr_datevon), CAST(STRFTIME('%W', tr_datevon) AS INT), CAST(STRFTIME('%m', tr_datevon) AS INT), CAST(STRFTIME('%Y', tr_datevon) AS INT)
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

-- import playlists
INSERT into trip_playlist (trp_id, tr_id, p_id, trp_pos)
    SELECT trp_id, tr_id, p_id, trp_pos
    FROM importmytbdb_trip_playlist;

-- ##################
-- import tracks
-- ##################
INSERT into kategorie_full (k_id, t_id, l_id, tr_id, k_gesperrt, k_datebis, k_datevon, k_gpstracks_basefile, k_meta_shortdesc, k_name, k_distance, k_altitude_asc, k_altitude_desc, k_altitude_min, k_altitude_max, k_rate_schwierigkeit, k_rate_ausdauer, k_rate_kraft, k_rate_mental, k_rate_bildung, k_rate_motive, k_rate_wichtigkeit, k_rate_gesamt, k_route_attr, k_type,
                            k_gpstracks_state, k_calced_id, k_calced_actiontype, k_calced_altAscFacet, k_calced_altMaxFacet, k_calced_distFacet, k_calced_dur, k_calced_durFacet,
                            k_calced_dateonly, k_calced_week, k_calced_month, k_calced_year)
    SELECT k_id, t_id, l_id, COALESCE(tr_id, 0), k_gesperrt, k_datebis, k_datevon, k_gpstracks_basefile, k_meta_shortdesc, k_name, k_distance, k_altitude_asc, k_altitude_desc, k_altitude_min, k_altitude_max, k_rate_schwierigkeit, k_rate_ausdauer, k_rate_kraft, k_rate_mental, k_rate_bildung, k_rate_motive, k_rate_wichtigkeit, k_rate_gesamt, k_route_attr, k_type,
           k_gpstracks_state, "TRACK" || "_" || k_id, k_calced_actiontype, k_calced_altAscFacet, k_calced_altMaxFacet, k_calced_distFacet, k_calced_dur, k_calced_durFacet,
           DATETIME(k_datevon), CAST(STRFTIME('%W', k_datevon) AS INT), CAST(STRFTIME('%m', k_datevon) AS INT), CAST(STRFTIME('%Y', k_datevon) AS INT)
    FROM importmytbdb_kategorie WHERE (importmytbdb_kategorie.k_gesperrt=0 OR importmytbdb_kategorie.k_gesperrt IS NULL);

-- calc keywords
UPDATE kategorie_full
   SET k_keywords = (SELECT GROUP_CONCAT(DISTINCT mk.kw_name) AS k_keywords
                                FROM importmytbdb_kategorie_keyword mjoin LEFT JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
                                WHERE kategorie_full.k_id=mjoin.k_id);


-- calc master-image
UPDATE kategorie_full
SET i_id = (SELECT importmytbdb_image.i_id
                FROM importmytbdb_image INNER JOIN importmytbdb_kategorie ON importmytbdb_kategorie.k_id=importmytbdb_image.k_id
                        INNER JOIN importmytbdb_image_playlist ON importmytbdb_image_playlist.i_id=importmytbdb_image.i_id
                WHERE importmytbdb_kategorie.k_id = kategorie_full.k_id
                        AND (importmytbdb_kategorie.k_gesperrt=0 OR importmytbdb_kategorie.k_gesperrt IS NULL)
                        AND (importmytbdb_image.i_gesperrt=0 OR importmytbdb_image.i_gesperrt IS NULL)
                        AND importmytbdb_image_playlist.p_id=18);
-- remove todos
UPDATE kategorie_full SET k_meta_shortdesc=REPLACE(k_meta_shortdesc, 'TODODESC', '');
UPDATE kategorie_full SET k_keywords=REPLACE(k_keywords, 'KW_TODOKEYWORDS,', '');
UPDATE kategorie_full SET k_keywords=REPLACE(k_keywords, ',KW_TODOKEYWORDS', '');
UPDATE kategorie_full SET k_keywords=REPLACE(k_keywords, 'KW_TODOKEYWORDS', '');

-- calc desc+dates+coords
UPDATE kategorie_full
SET
    k_dateshow=k_datevon,
    k_meta_shortdesc_md=k_meta_shortdesc,
    k_meta_shortdesc_html=k_meta_shortdesc,
    k_html=COALESCE(k_name, '') || ' ' || COALESCE(k_meta_shortdesc, '') || ' ' || COALESCE(k_keywords, '');

UPDATE kategorie_full
SET
    k_gps_lat = (SELECT location.l_gps_lat FROM location WHERE kategorie_full.l_id=location.l_id),
    k_gps_lon = (SELECT location.l_gps_lon FROM location WHERE kategorie_full.l_id=location.l_id);

-- calc news.id
UPDATE kategorie_full
SET
    n_id = (SELECT news.n_id
                FROM news
                WHERE (kategorie_full.k_dateshow >= news.n_datevon AND kategorie_full.k_dateshow <= news.n_datebis));

-- import playlists
INSERT into kategorie_playlist(kp_id, k_id, p_id, kp_pos)
    SELECT kp_id, k_id, p_id, kp_pos
    FROM importmytbdb_kategorie_playlist;

-- import pois
INSERT into kategorie_poi(kpoi_id, k_id, poi_id, kpoi_pos, kpoi_type)
    SELECT kpoi_id, k_id, poi_id, kpoi_pos, kpoi_type
    FROM importmytbdb_kategorie_poi;

-- ##################
-- import-poiinfos
-- ##################
INSERT into poi_info (poiif_id, if_id, poi_id, poiif_linked_details)
SELECT poiif_id, if_id, poi_id, poiif_linked_details
FROM importmytbdb_poi_info where poi_id IS NOT NULL AND if_ID IS NOT NULL;

-- ##################
-- import routes
-- ##################
INSERT into tour (t_id, l_id, k_id, t_gesperrt, t_datefirst, t_name, t_desc_gefahren, t_desc_fuehrer, t_desc_gebiet, t_desc_talort, t_desc_ziel, t_desc_sectionDetails, t_meta_shortdesc, t_ele_max, t_gpstracks_basefile, t_rate, t_rate_ks, t_rate_firn, t_rate_gletscher, t_rate_klettern, t_rate_bergtour, t_rate_schneeschuh, t_rate_ausdauer, t_rate_bildung, t_rate_gesamt, t_rate_kraft, t_rate_mental, t_rate_motive, t_rate_schwierigkeit, t_rate_wichtigkeit, t_route_aufstieg_name, t_route_aufstieg_dauer, t_route_aufstieg_hm, t_route_aufstieg_km, t_route_aufstieg_sl, t_route_aufstieg_m, t_route_abstieg_name, t_route_abstieg_dauer, t_route_abstieg_hm, t_route_abstieg_m, t_route_huette_name, t_route_huette_dauer, t_route_huette_hm, t_route_huette_m, t_route_zustieg_dauer, t_route_zustieg_hm, t_route_zustieg_m, t_route_dauer, t_route_hm, t_route_m, t_typ,
                  t_gpstracks_state, t_calced_id, t_calced_d_id, t_calced_sections, t_calced_actiontype, t_calced_altAscFacet, t_calced_altMaxFacet, t_calced_distFacet, t_calced_durFacet,
                  t_calced_dateonly, t_calced_week, t_calced_month, t_calced_year)
    SELECT t_id, l_id, k_id, t_gesperrt, t_datefirst, t_name, t_desc_gefahren, t_desc_fuehrer, t_desc_gebiet, t_desc_talort, t_desc_ziel, t_desc_sectionDetails, t_meta_shortdesc, t_ele_max, t_gpstracks_basefile, t_rate, t_rate_ks, t_rate_firn, t_rate_gletscher, t_rate_klettern, t_rate_bergtour, t_rate_schneeschuh, t_rate_ausdauer, t_rate_bildung, t_rate_gesamt, t_rate_kraft, t_rate_mental, t_rate_motive, t_rate_schwierigkeit, t_rate_wichtigkeit, t_route_aufstieg_name, t_route_aufstieg_dauer, t_route_aufstieg_hm, t_route_aufstieg_km, t_route_aufstieg_sl, t_route_aufstieg_m, t_route_abstieg_name, t_route_abstieg_dauer, t_route_abstieg_hm, t_route_abstieg_m, t_route_huette_name, t_route_huette_dauer, t_route_huette_hm, t_route_huette_m, t_route_zustieg_dauer, t_route_zustieg_hm, t_route_zustieg_m, t_route_dauer, t_route_hm, t_route_m, t_typ,
           t_gpstracks_state, "ROUTE" || "_" || t_id, t_calced_d_id, t_calced_sections, t_calced_actiontype, t_calced_altAscFacet, t_calced_altMaxFacet, t_calced_distFacet, t_calced_durFacet,
           DATETIME(t_datefirst), CAST(STRFTIME('%W', t_datefirst) AS INT), CAST(STRFTIME('%m', t_datefirst) AS INT), CAST(STRFTIME('%Y', t_datefirst) AS INT)
    FROM importmytbdb_tour;

-- calc tour: d-ids
UPDATE tour SET d_id=t_calced_d_id;

-- calc keywords
UPDATE tour
    SET t_keywords = (SELECT GROUP_CONCAT(DISTINCT mk.kw_name) AS t_keywords
                        FROM importmytbdb_tour_keyword mjoin LEFT JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
                        WHERE tour.t_id=mjoin.t_id);

-- remove todos
UPDATE tour SET t_meta_shortdesc=REPLACE(t_meta_shortdesc, 'TODODESC', '');
UPDATE tour SET t_keywords=REPLACE(t_keywords, 'KW_TODOKEYWORDS,', '');
UPDATE tour SET t_keywords=REPLACE(t_keywords, ',KW_TODOKEYWORDS', '');
UPDATE tour SET t_keywords=REPLACE(t_keywords, 'KW_TODOKEYWORDS', '');

-- calc desc+dates+coords
UPDATE tour
SET
    t_dateshow=t_datefirst,
    t_desc_fuehrer_full=t_desc_fuehrer,
    t_meta_shortdesc_md=t_meta_shortdesc,
    t_meta_shortdesc_html=t_meta_shortdesc,
    t_html_list=COALESCE(t_name, '') || ' ' || COALESCE(t_meta_shortdesc, '') || ' ' || COALESCE(t_keywords, '');

UPDATE tour
SET
    t_gps_lat = (SELECT location.l_gps_lat FROM location WHERE tour.l_id=location.l_id),
    t_gps_lon = (SELECT location.l_gps_lon FROM location WHERE tour.l_id=location.l_id);

-- import playlists
INSERT into tour_playlist(tp_id, t_id, p_id, tp_pos)
    SELECT tp_id, t_id, p_id, tp_pos
    FROM importmytbdb_tour_playlist;

-- import pois
INSERT into tour_poi(tpoi_id, t_id, poi_id, tpoi_pos, tpoi_type)
    SELECT tpoi_id, t_id, poi_id, tpoi_pos, tpoi_type
    FROM importmytbdb_tour_poi;

-- ##################
-- import-trackroutes
-- ##################
INSERT into kategorie_tour (t_id, k_id, kt_route_attr)
    SELECT t_id, k_id, kt_route_attr
    FROM importmytbdb_kategorie_tour where k_id IS NOT NULL AND t_ID IS NOT NULL;
INSERT into kategorie_tour (t_id, k_id, kt_route_attr)
    SELECT t_id, k_id, k_route_attr
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
       d_datefirst,
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
       d_route_dauer,
       d_calced_id,
       d_calced_actiontype,
       d_calced_altAscFacet,
       d_calced_altMaxFacet,
       d_calced_distFacet,
       d_calced_durFacet
       )
SELECT tour.t_calced_d_id AS d_id,
       tour.l_id,
       t_gesperrt AS d_gesperrt,
       t_desc_gebiet AS d_desc_gebiet,
       t_desc_ziel AS d_desc_ziel,
       t_desc_ziel AS d_name,
       t_typ AS d_typ,
       min(t_datefirst)                                                AS d_datefirst,
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
       min(t_route_dauer)                                              AS d_route_dauer,
       "DESTINATION" || "_" || t_calced_d_id                           AS d_calced_id,
       t_calced_actiontype                                             AS d_calced_actiontype,
       min(t_calced_altAscFacet)                                       AS d_calced_altAscFacet,
       min(t_calced_altMaxFacet)                                       AS d_calced_altMaxFacet,
       min(t_calced_distFacet)                                         AS d_calced_distFacet,
       min(t_calced_durFacet)                                          AS d_calced_durFacet
FROM tour
         LEFT JOIN location ON tour.l_id = location.l_id
GROUP BY d_id;

-- calc desc+dates+coords
UPDATE destination
SET
    d_dateshow=d_datefirst;

UPDATE destination
SET
    d_gps_lat = (SELECT location.l_gps_lat FROM location WHERE destination.l_id=location.l_id),
    d_gps_lon = (SELECT location.l_gps_lon FROM location WHERE destination.l_id=location.l_id);


-- ##################
-- import images
-- ##################
INSERT into image (i_id, k_id, i_gesperrt, i_date, i_dir, i_file, i_gps_lat, i_gps_lon, i_gps_ele, i_rate, i_rate_motive, i_rate_wichtigkeit,
        i_calced_id, i_calced_path, i_calced_gps_loc, i_calced_gps_lat, i_calced_gps_lon, i_calced_altMaxFacet,
        i_calced_dateonly, i_calced_week, i_calced_month, i_calced_year)
    SELECT distinct importmytbdb_image.i_id, importmytbdb_image.k_id, i_gesperrt, i_date, i_dir, i_file, i_gps_lat, i_gps_lon, i_gps_ele, i_rate, i_rate_motive, i_rate_wichtigkeit,
        "IMAGE" || "_" || importmytbdb_image.i_id, i_calced_path, i_calced_gps_loc, i_calced_gps_lat, i_calced_gps_lon, i_calced_altMaxFacet,
         DATETIME(i_date), CAST(STRFTIME('%W', i_date) AS INT), CAST(STRFTIME('%m', i_date) AS INT), CAST(STRFTIME('%Y', i_date) AS INT)
    FROM importmytbdb_image INNER JOIN importmytbdb_image_playlist ON importmytbdb_image_playlist.i_id=importmytbdb_image.i_id
    WHERE importmytbdb_image_playlist.p_id=17;

-- import playlist
INSERT into image_playlist (ip_id, i_id, p_id, ip_pos)
    SELECT ip_id, i_id, p_id, ip_pos
    FROM importmytbdb_image_playlist
    WHERE importmytbdb_image_playlist.i_id in (select i_id from importmytbdb_image_playlist where importmytbdb_image_playlist.p_id=17);

-- calc keywords
UPDATE image
SET i_keywords = (SELECT GROUP_CONCAT(DISTINCT mk.kw_name) AS i_keywords
                    FROM importmytbdb_image_keyword mjoin LEFT JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
                    WHERE image.i_id=mjoin.i_id);

-- image calc persons
UPDATE image
SET i_persons = (SELECT GROUP_CONCAT(DISTINCT importmytbdb_objects.o_name) AS i_persons
     FROM importmytbdb_image_object
        INNER JOIN importmytbdb_objects_key ON importmytbdb_image_object.io_obj_type=importmytbdb_objects_key.ok_key AND importmytbdb_image_object.io_detector=importmytbdb_objects_key.ok_detector
        INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=importmytbdb_objects.o_id
     WHERE image.i_id=importmytbdb_image_object.i_id
        AND LOWER(o_category) LIKE 'person'
        AND (importmytbdb_image_object.io_precision = 1
             OR importmytbdb_image_object.io_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                          'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))
    );


-- image calc objects
UPDATE image
SET i_objects = (SELECT GROUP_CONCAT(DISTINCT importmytbdb_objects.o_name) AS i_objects
     FROM importmytbdb_image_object
        INNER JOIN importmytbdb_objects_key ON importmytbdb_image_object.io_obj_type=importmytbdb_objects_key.ok_key AND importmytbdb_image_object.io_detector=importmytbdb_objects_key.ok_detector
        INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=importmytbdb_objects.o_id
     WHERE image.i_id=importmytbdb_image_object.i_id
        AND LOWER(o_category) NOT LIKE 'person'
        AND (importmytbdb_image_object.io_precision = 1
             OR importmytbdb_image_object.io_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                          'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))
     );

-- HINT: SEPARATOR must be manually replaced because semicolon is used as separator
UPDATE image
SET i_objectdetections = (SELECT GROUP_CONCAT(i_objectdetections, 'SEPARATOR')
                          FROM (SELECT 'ioId=' || COALESCE(importmytbdb_image_object.io_id, '') ||
                                       ':::key=' || COALESCE(importmytbdb_image_object.io_obj_type, '') ||
                                       ':::detector=' || COALESCE(importmytbdb_image_object.io_detector, '') ||
                                       ':::imgWidth=' || COALESCE(importmytbdb_image_object.io_img_width, '') ||
                                       ':::imgHeight=' || COALESCE(importmytbdb_image_object.io_img_height, '') ||
                                       ':::objX=' || COALESCE(importmytbdb_image_object.io_obj_x1, '') ||
                                       ':::objY=' || COALESCE(importmytbdb_image_object.io_obj_y1, '') ||
                                       ':::objWidth=' || COALESCE(importmytbdb_image_object.io_obj_width, '') ||
                                       ':::objHeight=' || COALESCE(importmytbdb_image_object.io_obj_height, '') ||
                                       ':::name=' || importmytbdb_objects.o_name ||
                                       ':::category=' || importmytbdb_objects.o_category ||
                                       ':::precision=' || COALESCE(importmytbdb_image_object.io_precision, '') ||
                                       ':::state=' || COALESCE(importmytbdb_image_object.io_state, '') AS i_objectdetections
                                FROM importmytbdb_image_object
                                         INNER JOIN importmytbdb_objects_key ON importmytbdb_image_object.io_obj_type=importmytbdb_objects_key.ok_key AND importmytbdb_image_object.io_detector=importmytbdb_objects_key.ok_detector
                                         INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=importmytbdb_objects.o_id
                                WHERE image.i_id=importmytbdb_image_object.i_id
                                  AND LOWER(o_category) NOT LIKE 'person'
                                  AND (importmytbdb_image_object.io_precision = 1
                                    OR importmytbdb_image_object.io_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                                                              'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))
                               )  objectdetectionssrc
);

-- remove todos
UPDATE image SET i_keywords=REPLACE(i_keywords, 'KW_TODOKEYWORDS,', '');
UPDATE image SET i_keywords=REPLACE(i_keywords, ',KW_TODOKEYWORDS', '');
UPDATE image SET i_keywords=REPLACE(i_keywords, 'KW_TODOKEYWORDS', '');

-- image calc desc+dates+coords
UPDATE image
SET
    i_dateshow=i_date;

UPDATE image
SET
    i_lochirarchie = (SELECT location.l_lochirarchietxt FROM kategorie_full INNER JOIN location ON kategorie_full.l_id=location.l_id
                                              WHERE image.k_id=kategorie_full.k_id);

-- TODO
/**
UPDATE image toupdate,
 (SELECT image.i_id, kategorie_full.k_id, kategorie_full.t_id, k_name, kategorie_full.k_meta_shortdesc, location.l_lochirarchietxt
  FROM image INNER JOIN kategorie_full ON image.k_Id=kategorie_full.k_id INNER JOIN location ON kategorie_full.l_id=location.l_id
  GROUP BY image.i_id) grouped
SET
    toupdate.t_id=grouped.t_id,
    toupdate.i_katname=grouped.k_name,
    toupdate.i_katdesc=grouped.k_meta_shortdesc
WHERE toupdate.i_id=grouped.i_id**/;

-- ##################
-- import videos
-- ##################
INSERT into video (v_id, k_id, v_gesperrt, v_date, v_dir, v_file, v_gps_lat, v_gps_lon, v_gps_ele, v_rate, v_rate_motive, v_rate_wichtigkeit,
        v_calced_id, v_calced_path, v_calced_gps_loc, v_calced_gps_lat, v_calced_gps_lon, v_calced_altMaxFacet,
        v_calced_dateonly, v_calced_week, v_calced_month, v_calced_year)
    SELECT distinct importmytbdb_video.v_id, importmytbdb_video.k_id, v_gesperrt, v_date, v_dir, v_file, v_gps_lat, v_gps_lon, v_gps_ele, v_rate, v_rate_motive, v_rate_wichtigkeit,
        "VIDEO" || "_" || importmytbdb_video.v_id, v_calced_path, v_calced_gps_loc, v_calced_gps_lat, v_calced_gps_lon, v_calced_altMaxFacet,
        DATETIME(v_date), CAST(STRFTIME('%W', v_date) AS INT), CAST(STRFTIME('%m', v_date) AS INT), CAST(STRFTIME('%Y', v_date) AS INT)
    FROM importmytbdb_video INNER JOIN importmytbdb_video_playlist ON importmytbdb_video_playlist.v_id=importmytbdb_video.v_id
    WHERE importmytbdb_video_playlist.p_id=17;

-- import playlist
INSERT into video_playlist (vp_id, v_id, p_id, vp_pos)
    SELECT vp_id, v_id, p_id, vp_pos
    FROM importmytbdb_video_playlist
    WHERE importmytbdb_video_playlist.v_id in (select v_id from video);

-- calc keywords
UPDATE video
SET v_keywords = (SELECT GROUP_CONCAT(DISTINCT mk.kw_name) AS v_keywords
     FROM importmytbdb_video_keyword mjoin LEFT JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
     WHERE video.v_id=mjoin.v_id);

-- video calc persons
UPDATE video
SET v_persons = (SELECT GROUP_CONCAT(DISTINCT importmytbdb_objects.o_name) AS v_persons
     FROM importmytbdb_video_object
        INNER JOIN importmytbdb_objects_key ON importmytbdb_video_object.vo_obj_type=importmytbdb_objects_key.ok_key AND importmytbdb_video_object.vo_detector=importmytbdb_objects_key.ok_detector
        INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=importmytbdb_objects.o_id
     WHERE video.v_id=importmytbdb_video_object.v_id
        AND LOWER(o_category) LIKE 'person'
        AND (importmytbdb_video_object.vo_precision = 1
             OR importmytbdb_video_object.vo_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                          'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))
     );

-- video calc objects
UPDATE video
SET v_objects = (SELECT GROUP_CONCAT(DISTINCT importmytbdb_objects.o_name) AS v_objects
     FROM importmytbdb_video_object
        INNER JOIN importmytbdb_objects_key ON importmytbdb_video_object.vo_obj_type=importmytbdb_objects_key.ok_key AND importmytbdb_video_object.vo_detector=importmytbdb_objects_key.ok_detector
        INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=importmytbdb_objects.o_id
     WHERE video.v_id=importmytbdb_video_object.v_id
        AND LOWER(o_category) NOT LIKE 'person'
        AND (importmytbdb_video_object.vo_precision = 1
             OR importmytbdb_video_object.vo_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                          'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))
     );

UPDATE video
SET v_objectdetections = (SELECT GROUP_CONCAT(v_objectdetections, 'SEPARATOR')
                          FROM (SELECT 'voId=' || COALESCE(importmytbdb_video_object.vo_id, '') ||
                                       ':::key=' || COALESCE(importmytbdb_video_object.vo_obj_type, '') ||
                                       ':::detector=' || COALESCE(importmytbdb_video_object.vo_detector, '') ||
                                       ':::imgWidth=' || COALESCE(importmytbdb_video_object.vo_img_width, '') ||
                                       ':::imgHeight=' || COALESCE(importmytbdb_video_object.vo_img_height, '') ||
                                       ':::objX=' || COALESCE(importmytbdb_video_object.vo_obj_x1, '') ||
                                       ':::objY=' || COALESCE(importmytbdb_video_object.vo_obj_y1, '') ||
                                       ':::objWidth=' || COALESCE(importmytbdb_video_object.vo_obj_width, '') ||
                                       ':::objHeight=' || COALESCE(importmytbdb_video_object.vo_obj_height, '') ||
                                       ':::name=' || importmytbdb_objects.o_name ||
                                       ':::category=' || importmytbdb_objects.o_category ||
                                       ':::precision=' || COALESCE(importmytbdb_video_object.vo_precision, '') ||
                                       ':::state=' || COALESCE(importmytbdb_video_object.vo_state, '') AS v_objectdetections
                                FROM importmytbdb_video_object
                                         INNER JOIN importmytbdb_objects_key ON importmytbdb_video_object.vo_obj_type=importmytbdb_objects_key.ok_key AND importmytbdb_video_object.vo_detector=importmytbdb_objects_key.ok_detector
                                         INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=importmytbdb_objects.o_id
                                WHERE video.v_id=importmytbdb_video_object.v_id
                                  AND LOWER(o_category) NOT LIKE 'person'
                                  AND (importmytbdb_video_object.vo_precision = 1
                                    OR importmytbdb_video_object.vo_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                                                              'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))
                               )  objectdetectionssrc
);

-- remove todos
UPDATE video SET v_keywords=REPLACE(v_keywords, 'KW_TODOKEYWORDS,', '');
UPDATE video SET v_keywords=REPLACE(v_keywords, ',KW_TODOKEYWORDS', '');
UPDATE video SET v_keywords=REPLACE(v_keywords, 'KW_TODOKEYWORDS', '');

-- video calc desc+dates+coords
UPDATE video
SET
    v_dateshow=v_date;

UPDATE video
SET
    v_lochirarchie = (SELECT location.l_lochirarchietxt FROM kategorie_full INNER JOIN location ON kategorie_full.l_id=location.l_id
                        WHERE video.k_id=kategorie_full.k_id);

-- TODO
/**
UPDATE video toupdate,
 (SELECT video.v_id, kategorie_full.k_id, kategorie_full.t_id, k_name, kategorie_full.k_meta_shortdesc, location.l_lochirarchietxt
  FROM video INNER JOIN kategorie_full ON video.k_Id=kategorie_full.k_id INNER JOIN location ON kategorie_full.l_id=location.l_id
  GROUP BY video.v_id) grouped
SET
    toupdate.t_id=grouped.t_id,
    toupdate.v_katname=grouped.k_name,
    toupdate.v_katdesc=grouped.k_meta_shortdesc
WHERE toupdate.v_id=grouped.v_id**/;

-- ##################
-- update id-summary-fields
-- ##################

-- calc location: kat/tour-ids
UPDATE location SET l_tids='0';
UPDATE location SET l_dids='0';
UPDATE location SET l_katids='0';

UPDATE location
SET l_tids = (SELECT GROUP_CONCAT(t_id, ',,') AS l_t_ids
                FROM tour where tour.l_id = location.l_id GROUP BY tour.l_id);

UPDATE location
SET l_dids = (SELECT GROUP_CONCAT(d_id, ',,') AS l_d_ids
                FROM destination where destination.l_id = location.l_id GROUP BY destination.l_id);

UPDATE location
SET l_katids = (SELECT GROUP_CONCAT(k_id, ',,') AS l_k_ids
                FROM kategorie_full where kategorie_full.l_id = location.l_id GROUP BY kategorie_full.l_id);

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
UPDATE location SET l_dids=REPLACE(l_dids, ',,', ',');
UPDATE location SET l_tids=REPLACE(l_tids, ',,', ',');
UPDATE location SET l_katids=REPLACE(l_katids, ',,', ',');

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
UPDATE location SET l_dids=REPLACE(l_dids, ',,', ',');
UPDATE location SET l_tids=REPLACE(l_tids, ',,', ',');
UPDATE location SET l_katids=REPLACE(l_katids, ',,', ',');

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
UPDATE location SET l_dids=REPLACE(l_dids, ',,', ',');
UPDATE location SET l_tids=REPLACE(l_tids, ',,', ',');
UPDATE location SET l_katids=REPLACE(l_katids, ',,', ',');

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
UPDATE location SET l_dids=REPLACE(l_dids, ',,', ',');
UPDATE location SET l_tids=REPLACE(l_tids, ',,', ',');
UPDATE location SET l_katids=REPLACE(l_katids, ',,', ',');

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
UPDATE location SET l_dids=REPLACE(l_dids, ',,', ',');
UPDATE location SET l_tids=REPLACE(l_tids, ',,', ',');
UPDATE location SET l_katids=REPLACE(l_katids, ',,', ',');

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
UPDATE location SET l_dids=REPLACE(l_dids, ',,', ',');
UPDATE location SET l_tids=REPLACE(l_tids, ',,', ',');
UPDATE location SET l_katids=REPLACE(l_katids, ',,', ',');

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
UPDATE location SET l_dids=REPLACE(l_dids, ',,', ',');
UPDATE location SET l_tids=REPLACE(l_tids, ',,', ',');
UPDATE location SET l_katids=REPLACE(l_katids, ',,', ',');

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
UPDATE location SET l_dids=REPLACE(l_dids, ',,', ',');
UPDATE location SET l_tids=REPLACE(l_tids, ',,', ',');
UPDATE location SET l_katids=REPLACE(l_katids, ',,', ',');

UPDATE location SET l_dids=l_dids || ',';
UPDATE location SET l_tids=l_tids || ',';
UPDATE location SET l_katids=l_katids  || ',';

-- calc tour: kat-ids
UPDATE tour SET t_k_ids='0';

UPDATE tour
    SET t_k_ids = (SELECT GROUP_CONCAT(kategorie_full.k_id, ',,') AS t_kids
                    FROM kategorie_full WHERE tour.t_id=kategorie_full.t_id GROUP BY kategorie_full.t_id ORDER BY kategorie_full.t_id);

UPDATE tour
SET t_k_ids = COALESCE(t_k_ids, '') || ',,' ||
    COALESCE((SELECT GROUP_CONCAT(CAST(mjoin.k_id AS char(100)), ',,') AS k_ids
        FROM importmytbdb_kategorie_tour mjoin
        WHERE mjoin.t_id=tour.t_id
        GROUP BY mjoin.t_id), '');

-- TODO UPDATE tour SET t_k_ids=REGEXP_REPLACE(REGEXP_REPLACE(t_k_ids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE tour SET t_k_ids=REPLACE(t_k_ids, ',,', ',');
UPDATE tour SET t_k_ids=t_k_ids || ',';
UPDATE tour SET k_id=0 WHERE K_ID IS NULL;
-- TODO UPDATE tour SET t_k_ids=REGEXP_REPLACE(REGEXP_REPLACE(t_k_ids, '^,*(.*),*$', '\\1'), ',+', ',');
UPDATE tour SET t_k_ids=REPLACE(t_k_ids, ',,', ',');


-- calc track: d_id
-- TODO
UPDATE kategorie_full
SET d_id = (SELECT tour.d_id FROM tour WHERE kategorie_full.t_id=tour.t_id);

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
UPDATE kategorie_full SET k_t_ids_full=REPLACE(k_t_ids_full, ',,', ',');
-- TODOUPDATE kategorie_full SET k_d_ids=REGEXP_REPLACE(REGEXP_REPLACE(k_d_ids, '^",*(.*),"*$', '\\1'), ',+', ',');
UPDATE kategorie_full SET k_d_ids=k_d_ids || '"';
UPDATE kategorie_full SET k_d_ids=REPLACE(k_d_ids, ',,', ',');
UPDATE kategorie_full SET k_d_ids_full=COALESCE(k_d_ids, '');


--
-- update trackdata
-- track calc keywords-persons
UPDATE kategorie_full
SET k_persons = (SELECT GROUP_CONCAT(DISTINCT mk.kw_name) AS k_persons
                  FROM importmytbdb_kategorie_keyword mjoin
                       INNER JOIN importmytbdb_keyword mk ON mjoin.kw_id=mk.kw_id
                       INNER JOIN importmytbdb_person mp ON LOWER(mp.pn_shortname) like LOWER(mk.kw_name)
                  WHERE kategorie_full.k_id=mjoin.k_id);

-- track calc image-persons
UPDATE kategorie_full
SET k_persons = COALESCE(k_persons, '') || ',' ||
                COALESCE((SELECT GROUP_CONCAT(DISTINCT importmytbdb_objects.o_name) AS i_persons
                             FROM image INNER JOIN importmytbdb_image_object ON image.i_id=importmytbdb_image_object.i_id
                                INNER JOIN importmytbdb_objects_key ON importmytbdb_image_object.io_obj_type=importmytbdb_objects_key.ok_key AND importmytbdb_image_object.io_detector=importmytbdb_objects_key.ok_detector
                                INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=importmytbdb_objects.o_id
                             WHERE image.k_id=kategorie_full.k_id
                                AND LOWER(o_category) LIKE 'person'
                                AND (importmytbdb_image_object.io_precision = 1
                                     OR importmytbdb_image_object.io_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                                                  'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))), '');

-- track calc video-persons
UPDATE kategorie_full
SET k_persons = COALESCE(k_persons, '') || ',' ||
                COALESCE((SELECT GROUP_CONCAT(DISTINCT importmytbdb_objects.o_name) AS v_persons
                             FROM video INNER JOIN importmytbdb_video_object ON video.v_id=importmytbdb_video_object.v_id
                                INNER JOIN importmytbdb_objects_key ON importmytbdb_video_object.vo_obj_type=importmytbdb_objects_key.ok_key AND importmytbdb_video_object.vo_detector=importmytbdb_objects_key.ok_detector
                                INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=importmytbdb_objects.o_id
                             WHERE video.k_id=kategorie_full.k_id
                                AND LOWER(o_category) LIKE 'person'
                                AND (importmytbdb_video_object.vo_precision = 1
                                     OR importmytbdb_video_object.vo_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                                                  'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))), '');

-- track calc image-objects
UPDATE kategorie_full
SET k_persons = COALESCE(k_persons, '') || ',' ||
                COALESCE((SELECT GROUP_CONCAT(DISTINCT importmytbdb_objects.o_name) AS i_persons
                             FROM image INNER JOIN importmytbdb_image_object ON image.i_id=importmytbdb_image_object.i_id
                                INNER JOIN importmytbdb_objects_key ON importmytbdb_image_object.io_obj_type=importmytbdb_objects_key.ok_key AND importmytbdb_image_object.io_detector=importmytbdb_objects_key.ok_detector
                                INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=importmytbdb_objects.o_id
                             WHERE image.k_id=kategorie_full.k_id
                                AND LOWER(o_category) NOT LIKE 'person'
                                AND (importmytbdb_image_object.io_precision = 1
                                     OR importmytbdb_image_object.io_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                                                  'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))), '');

-- track calc video-objects
UPDATE kategorie_full
SET k_persons = COALESCE(k_persons, '') || ',' ||
                COALESCE((SELECT GROUP_CONCAT(DISTINCT importmytbdb_objects.o_name) AS v_persons
                             FROM video INNER JOIN importmytbdb_video_object ON video.v_id=importmytbdb_video_object.v_id
                                INNER JOIN importmytbdb_objects_key ON importmytbdb_video_object.vo_obj_type=importmytbdb_objects_key.ok_key AND importmytbdb_video_object.vo_detector=importmytbdb_objects_key.ok_detector
                                INNER JOIN importmytbdb_objects ON importmytbdb_objects_key.o_id=importmytbdb_objects.o_id
                             WHERE video.k_id=kategorie_full.k_id
                                AND LOWER(o_category) NOT LIKE 'person'
                                AND (importmytbdb_video_object.vo_precision = 1
                                     OR importmytbdb_video_object.vo_state in ('RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
                                                                  'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'))), '');
