-- ----------------
-- fix playlist-view
-- ----------------

-- renew views
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
                           CONCAT(lh.hirarchy, ' -> ', l.l_name),
                           CONCAT(lh.idhirarchy, ',', CAST(l.l_id AS CHAR(255)))
                    FROM location l
                             JOIN loc_hierarchy lh
                                  ON l.l_parent_id = lh.l_id
                   )
SELECT location.*, loc_hierarchy.hirarchy AS l_lochirarchietxt, loc_hierarchy.idhirarchy AS l_lochirarchieids
FROM location INNER JOIN loc_hierarchy on location.l_id = loc_hierarchy.l_id
ORDER BY l_id;

/* #############
# update-all_entries_view
############# */
DROP VIEW IF EXISTS all_entries;
CREATE VIEW IF NOT EXISTS all_entries AS
SELECT type,
       actiontype,
       subtype,
       id,
       i_id,
       v_id,
       k_id,
       t_id,
       tr_id,
       l_id,
       meta_name,
       blocked,
       date,
       datevon,
       datebis,
       dateonly,
       week,
       month,
       year,
       gpstracks_basefile,
       pdffile,
       meta_shortdesc,
       meta_shortdesc_md,
       gps_lat,
       gps_lon,
       gps_loc,
       l_lochirarchietxt,
       l_lochirarchieids,
       i_fav_url_txt,
       v_fav_url_txt,
       altitude_asc,
       altitude_desc,
       gps_ele,
       distance,
       rate_ausdauer,
       rate_bildung,
       rate_gesamt,
       rate_kraft,
       rate_mental,
       rate_motive,
       rate_schwierigkeit,
       rate_wichtigkeit,
       altAscFacet,
       altMaxFacet,
       distFacet,
       dur,
       durFacet
FROM (
         (SELECT "IMAGE"                                                                     AS type,
                 k_calced_actiontype                                                         AS actiontype,
                 k_calced_actiontype                                                         AS subtype,
                 CONCAT("IMAGE", "_", image.i_id)                                           AS id,
                 image.i_id,
                 NULL                                                                        AS v_id,
                 image.k_id,
                 kategorie.t_id,
                 kategorie.tr_id,
                 kategorie.l_id,
                 COALESCE(i_meta_name, k_name)                                               AS meta_name,
                 i_gesperrt                                                                  as blocked,
                 i_date                                                                      as date,
                 kategorie.k_datevon                                                         as datevon,
                 kategorie.k_datebis                                                         as datebis,
                 DATE_FORMAT(i_date, GET_FORMAT(DATE, "ISO"))                                AS dateonly,
                 WEEK(i_date)                                                                AS week,
                 MONTH(i_date)                                                               AS month,
                 YEAR(i_date)                                                                AS year,
                 k_gpstracks_basefile                                                        as gpstracks_basefile,
                 i_pdffile                                                                   as pdffile,
                 i_meta_shortdesc                                                            as meta_shortdesc,
                 i_meta_shortdesc                                                            AS meta_shortdesc_md,
                 i_calced_gps_lat                                                            AS gps_lat,
                 i_calced_gps_lon                                                            AS gps_lon,
                 i_calced_gps_loc                                                            AS gps_loc,
                 l_lochirarchietxt                                                           AS l_lochirarchietxt,
                 l_lochirarchieids                                                           AS l_lochirarchieids,
                 i_calced_path                                                               AS i_fav_url_txt,
                 NULL                                                                        AS v_fav_url_txt,
                 k_altitude_asc                                                              as altitude_asc,
                 k_altitude_desc                                                             as altitude_desc,
                 i_gps_ele                                                                   as gps_ele,
                 k_distance                                                                  as distance,
                 k_rate_ausdauer                                                             as rate_ausdauer,
                 k_rate_bildung                                                              as rate_bildung,
                 i_rate                                                                      as rate_gesamt,
                 k_rate_kraft                                                                as rate_kraft,
                 k_rate_mental                                                               as rate_mental,
                 i_rate_motive                                                               as rate_motive,
                 k_rate_schwierigkeit                                                        as rate_schwierigkeit,
                 i_rate_wichtigkeit                                                          as rate_wichtigkeit,
                 k_calced_altAscFacet                                                        AS altAscFacet,
                 i_calced_altMaxFacet                                                        AS altMaxFacet,
                 k_calced_distFacet                                                          AS distFacet,
                 k_calced_dur                                                                AS dur,
                 k_calced_durFacet                                                           AS durFacet
          FROM image
                   LEFT JOIN kategorie ON kategorie.k_id = image.k_id
                   LEFT JOIN location_hirarchical AS location ON location.l_id = kategorie.l_id
         )
         UNION
         (SELECT "VIDEO"                                                                     AS type,
                 k_calced_actiontype                                                         AS actiontype,
                 k_calced_actiontype                                                         AS subtype,
                 CONCAT("VIDEO", "_", video.v_id)                                            AS id,
                 NULL                                                                        AS i_id,
                 video.v_id,
                 video.k_id,
                 kategorie.t_id,
                 kategorie.tr_id,
                 kategorie.l_id,
                 COALESCE(v_meta_name, k_name)                                               AS meta_name,
                 v_gesperrt                                                                  as blocked,
                 v_date                                                                      as date,
                 kategorie.k_datevon                                                         as datevon,
                 kategorie.k_datebis                                                         as datebis,
                 DATE_FORMAT(v_date, GET_FORMAT(DATE, "ISO"))                                AS dateonly,
                 WEEK(v_date)                                                                AS week,
                 MONTH(v_date)                                                               AS month,
                 YEAR(v_date)                                                                AS year,
                 k_gpstracks_basefile                                                        as gpstracks_basefile,
                 NULL                                                                        as pdffile,
                 v_meta_shortdesc                                                            as meta_shortdesc,
                 v_meta_shortdesc                                                            AS meta_shortdesc_md,
                 v_calced_gps_lat                                                            AS gps_lat,
                 v_calced_gps_lon                                                            AS gps_lon,
                 v_calced_gps_loc                                                            AS gps_loc,
                 l_lochirarchietxt                                                           AS l_lochirarchietxt,
                 l_lochirarchieids                                                           AS l_lochirarchieids,
                 NULL                                                                        AS i_fav_url_txt,
                 v_calced_path                                                               AS v_fav_url_txt,
                 k_altitude_asc                                                              as altitude_asc,
                 k_altitude_desc                                                             as altitude_desc,
                 v_gps_ele                                                                   as gps_ele,
                 k_distance                                                                  as distance,
                 k_rate_ausdauer                                                             as rate_ausdauer,
                 k_rate_bildung                                                              as rate_bildung,
                 v_rate                                                                      as rate_gesamt,
                 k_rate_kraft                                                                as rate_kraft,
                 k_rate_mental                                                               as rate_mental,
                 v_rate_motive                                                               as rate_motive,
                 k_rate_schwierigkeit                                                        as rate_schwierigkeit,
                 v_rate_wichtigkeit                                                          as rate_wichtigkeit,
                 k_calced_altAscFacet                                                        AS altAscFacet,
                 v_calced_altMaxFacet                                                        AS altMaxFacet,
                 k_calced_distFacet                                                          AS distFacet,
                 k_calced_dur                                                                AS dur,
                 k_calced_durFacet                                                           AS durFacet
          FROM video
                   LEFT JOIN kategorie ON kategorie.k_id = video.k_id
                   LEFT JOIN location_hirarchical AS location ON location.l_id = kategorie.l_id
         )
         UNION
         (SELECT "TRACK"                                                                     AS type,
                 k_calced_actiontype                                                         AS actiontype,
                 k_calced_actiontype                                                         AS subtype,
                 CONCAT("TRACK", "_", kategorie.k_id)                                        AS id,
                 NULL                                                                        AS i_id,
                 NULL                                                                        AS v_id,
                 kategorie.k_id,
                 kategorie.t_id,
                 kategorie.tr_id,
                 kategorie.l_id,
                 k_name                                                                      AS meta_name,
                 k_gesperrt                                                                  as blocked,
                 K_DATEVON                                                                   as date,
                 kategorie.k_datevon                                                         as datevon,
                 kategorie.k_datebis                                                         as datebis,
                 DATE_FORMAT(K_DATEVON, GET_FORMAT(DATE, "ISO"))                             AS dateonly,
                 WEEK(K_DATEVON)                                                             AS week,
                 MONTH(K_DATEVON)                                                            AS month,
                 YEAR(K_DATEVON)                                                             AS year,
                 k_gpstracks_basefile                                                        as gpstracks_basefile,
                 k_pdffile                                                                   as pdffile,
                 k_meta_shortdesc                                                            as meta_shortdesc,
                 k_meta_shortdesc                                                            AS meta_shortdesc_md,
                 l_calced_gps_lat                                                            AS gps_lat,
                 l_calced_gps_lon                                                            AS gps_lon,
                 l_calced_gps_loc                                                            AS gps_loc,
                 l_lochirarchietxt                                                           AS l_lochirarchietxt,
                 l_lochirarchieids                                                           AS l_lochirarchieids,
                 NULL                                                                        AS i_fav_url_txt,
                 NULL                                                                        AS v_fav_url_txt,
                 k_altitude_asc                                                              as altitude_asc,
                 k_altitude_desc                                                             as altitude_desc,
                 K_ALTITUDE_MAX                                                              as gps_ele,
                 k_distance                                                                  as distance,
                 k_rate_ausdauer                                                             as rate_ausdauer,
                 k_rate_bildung                                                              as rate_bildung,
                 K_RATE_GESAMT                                                               as rate_gesamt,
                 k_rate_kraft                                                                as rate_kraft,
                 k_rate_mental                                                               as rate_mental,
                 k_rate_motive                                                               as rate_motive,
                 k_rate_schwierigkeit                                                        as rate_schwierigkeit,
                 k_rate_wichtigkeit                                                          as rate_wichtigkeit,
                 k_calced_altAscFacet                                                        AS altAscFacet,
                 k_calced_altMaxFacet                                                        AS altMaxFacet,
                 k_calced_distFacet                                                          AS distFacet,
                 k_calced_dur                                                                AS dur,
                 k_calced_durFacet                                                           AS durFacet
          FROM kategorie
                   LEFT JOIN location_hirarchical AS location ON location.l_id = kategorie.l_id
         )
         UNION
         (SELECT "ROUTE"                                                          AS type,
                 t_calced_actiontype                                              AS actiontype,
                 t_calced_actiontype                                              AS subtype,
                 CONCAT("ROUTE", "_", tour.t_id)                                  AS id,
                 NULL                                                             AS i_id,
                 NULL                                                             AS v_id,
                 tour.k_id,
                 tour.t_id,
                 null                                                             AS tr_id,
                 tour.l_id,
                 t_name                                                           AS meta_name,
                 t_gesperrt                                                       as blocked,
                 t_DATEFIRST                                                        as date,
                 tour.t_datefirst                                                   as datevon,
                 tour.t_datelast                                                   as datebis,
                 DATE_FORMAT(t_DATEFIRST, GET_FORMAT(DATE, "ISO"))                  AS dateonly,
                 WEEK(t_DATEFIRST)                                                  AS week,
                 MONTH(t_DATEFIRST)                                                 AS month,
                 YEAR(t_DATEFIRST)                                                  AS year,
                 t_gpstracks_basefile                                             as gpstracks_basefile,
                 t_pdffile                                                        as pdffile,
                 t_meta_shortdesc                                                 as meta_shortdesc,
                 t_meta_shortdesc                                                 AS meta_shortdesc_md,
                 l_calced_gps_lat                                                 AS gps_lat,
                 l_calced_gps_lon                                                 AS gps_lon,
                 l_calced_gps_loc                                                 AS gps_loc,
                 l_lochirarchietxt                                                AS l_lochirarchietxt,
                 l_lochirarchieids                                                AS l_lochirarchieids,
                 NULL                                                             AS i_fav_url_txt,
                 NULL                                                             AS v_fav_url_txt,
                 t_route_hm                                                       as altitude_asc,
                 null                                                             as altitude_desc,
                 T_ELE_MAX                                                        as gps_ele,
                 t_route_m                                                        as distance,
                 t_rate_ausdauer                                                  as rate_ausdauer,
                 t_rate_bildung                                                   as rate_bildung,
                 t_RATE_GESAMT                                                    as rate_gesamt,
                 t_rate_kraft                                                     as rate_kraft,
                 t_rate_mental                                                    as rate_mental,
                 t_rate_motive                                                    as rate_motive,
                 t_rate_schwierigkeit                                             as rate_schwierigkeit,
                 t_rate_wichtigkeit                                               as rate_wichtigkeit,
                 t_calced_altAscFacet                                             AS altAscFacet,
                 t_calced_altMaxFacet                                             AS altMaxFacet,
                 t_calced_distFacet                                               AS distFacet,
                 t_route_dauer                                                    AS dur,
                 t_calced_durFacet                                                AS durFacet
          FROM tour
                   LEFT JOIN location_hirarchical AS location ON location.l_id = tour.l_id
         )
         UNION
         (SELECT "TRIP"                                                                        AS type,
                 null                                                                          AS actiontype,
                 null                                                                          AS subtype,
                 CONCAT("TRIP", "_", trip.tr_id)                                               AS id,
                 NULL                                                                          AS i_id,
                 NULL                                                                          AS v_id,
                 NULL                                                                          AS k_id,
                 NULL                                                                          AS t_id,
                 trip.tr_id,
                 trip.l_id,
                 tr_name                                                                       AS meta_name,
                 tr_gesperrt                                                                   as blocked,
                 tr_DATEVON                                                                    as date,
                 trip.tr_datevon                                                               as datevon,
                 trip.tr_datebis                                                               as datebis,
                 DATE_FORMAT(tr_DATEVON, GET_FORMAT(DATE, "ISO"))                              AS dateonly,
                 WEEK(tr_DATEVON)                                                              AS week,
                 MONTH(tr_DATEVON)                                                             AS month,
                 YEAR(tr_DATEVON)                                                              AS year,
                 null                                                                          as gpstracks_basefile,
                 tr_pdffile                                                                    as pdffile,
                 tr_meta_shortdesc                                                             as meta_shortdesc,
                 tr_meta_shortdesc                                                             AS meta_shortdesc_md,
                 l_calced_gps_lat                                                              AS gps_lat,
                 l_calced_gps_lon                                                              AS gps_lon,
                 l_calced_gps_loc                                                              AS gps_loc,
                 l_lochirarchietxt                                                             AS l_lochirarchietxt,
                 l_lochirarchieids                                                             AS l_lochirarchieids,
                 NULL                                                                          AS i_fav_url_txt,
                 NULL                                                                          AS v_fav_url_txt,
                 NULL                                                                          as altitude_asc,
                 null                                                                          as altitude_desc,
                 NULL                                                                          as gps_ele,
                 NULL                                                                          as distance,
                 NULL                                                                          as rate_ausdauer,
                 NULL                                                                          as rate_bildung,
                 NULL                                                                          as rate_gesamt,
                 NULL                                                                          as rate_kraft,
                 NULL                                                                          as rate_mental,
                 NULL                                                                          as rate_motive,
                 NULL                                                                          as rate_schwierigkeit,
                 NULL                                                                          as rate_wichtigkeit,
                 NULL                                                                          AS altAscFacet,
                 NULL                                                                          AS altMaxFacet,
                 NULL                                                                          AS distFacet,
                 tr_calced_dur                                                                 AS dur,
                 tr_calced_durFacet                                                            AS durFacet
          FROM trip
                   LEFT JOIN location_hirarchical AS location ON location.l_id = trip.l_id
         )
         UNION
         (SELECT "INFO"                                                             AS type,
                 null                                                               AS actiontype,
                 null                                                               AS subtype,
                 CONCAT("INFO", "_", info.if_id)                                    AS id,
                 NULL                                                               AS i_id,
                 NULL                                                               AS v_id,
                 NULL                                                               AS k_id,
                 NULL                                                               AS t_id,
                 NULL                                                               AS tr_id,
                 info.l_id,
                 if_name                                                            AS meta_name,
                 NULL                                                               as blocked,
                 NULL                                                               as date,
                 NULL                                                               as datevon,
                 NULL                                                               as datebis,
                 NULL                                                               AS dateonly,
                 NULL                                                               AS week,
                 NULL                                                               AS month,
                 NULL                                                               AS year,
                 null                                                               as gpstracks_basefile,
                 if_pdffile                                                         as pdffile,
                 if_meta_shortdesc                                                  as meta_shortdesc,
                 if_meta_shortdesc                                                  AS meta_shortdesc_md,
                 l_calced_gps_lat                                                   AS gps_lat,
                 l_calced_gps_lon                                                   AS gps_lon,
                 l_calced_gps_loc                                                   AS gps_loc,
                 l_lochirarchietxt                                                  AS l_lochirarchietxt,
                 l_lochirarchieids                                                  AS l_lochirarchieids,
                 NULL                                                               AS i_fav_url_txt,
                 NULL                                                               AS v_fav_url_txt,
                 NULL                                                               as altitude_asc,
                 null                                                               as altitude_desc,
                 NULL                                                               as gps_ele,
                 NULL                                                               as distance,
                 NULL                                                               as rate_ausdauer,
                 NULL                                                               as rate_bildung,
                 NULL                                                               as rate_gesamt,
                 NULL                                                               as rate_kraft,
                 NULL                                                               as rate_mental,
                 NULL                                                               as rate_motive,
                 NULL                                                               as rate_schwierigkeit,
                 NULL                                                               as rate_wichtigkeit,
                 NULL                                                               AS altAscFacet,
                 NULL                                                               AS altMaxFacet,
                 NULL                                                               AS distFacet,
                 NULL                                                               AS dur,
                 NULL                                                               AS durFacet
          FROM info
                   LEFT JOIN location_hirarchical AS location ON location.l_id = info.l_id
         )
         UNION
         (SELECT "LOCATION"                                                              AS type,
                 NULL                                                                    AS actiontype,
                 NULL                                                                    AS subtype,
                 CONCAT("LOCATION", "_", location.l_id)                                  AS id,
                 NULL                                                                    AS i_id,
                 NULL                                                                    AS v_id,
                 NULL                                                                    as k_id,
                 NULL                                                                    as t_id,
                 null                                                                    AS tr_id,
                 location.l_id,
                 l_name                                                                  AS meta_name,
                 l_gesperrt                                                              as blocked,
                 NULL                                                                    as date,
                 NULL                                                                    as datevon,
                 NULL                                                                    as datebis,
                 NULL                                                                    AS dateonly,
                 NULL                                                                    AS week,
                 NULL                                                                    AS month,
                 NULL                                                                    AS year,
                 NULL                                                                    as gpstracks_basefile,
                 l_pdffile                                                               as pdffile,
                 l_meta_shortdesc                                                        as meta_shortdesc,
                 l_meta_shortdesc                                                        AS meta_shortdesc_md,
                 l_calced_gps_lat                                                        AS gps_lat,
                 l_calced_gps_lon                                                        AS gps_lon,
                 l_calced_gps_loc                                                        AS gps_loc,
                 l_lochirarchietxt                                                       AS l_lochirarchietxt,
                 l_lochirarchieids                                                       AS l_lochirarchieids,
                 NULL                                                                    AS i_fav_url_txt,
                 NULL                                                                    AS v_fav_url_txt,
                 null                                                                    as altitude_asc,
                 null                                                                    as altitude_desc,
                 l_geo_ele                                                               as gps_ele,
                 null                                                                    as distance,
                 null                                                                    as rate_ausdauer,
                 null                                                                    as rate_bildung,
                 null                                                                    as rate_gesamt,
                 null                                                                    as rate_kraft,
                 null                                                                    as rate_mental,
                 null                                                                    as rate_motive,
                 null                                                                    as rate_schwierigkeit,
                 null                                                                    as rate_wichtigkeit,
                 null                                                                    AS altAscFacet,
                 l_calced_altMaxFacet                                                    AS altMaxFacet,
                 null                                                                    AS distFacet,
                 null                                                                    AS dur,
                 null                                                                    AS durFacet
          FROM location_hirarchical as location
         )
     ) all_view;


DROP VIEW IF EXISTS all_entries_playlist_max;
CREATE VIEW IF NOT EXISTS all_entries_playlist_max AS
SELECT *
FROM (
         (SELECT "IMAGE"             AS type,
                 MAX(ip_pos)         AS pos,
                 image_playlist.p_id AS p_id
          FROM image_playlist
          GROUP BY p_id
         )
         UNION
         (SELECT "VIDEO"             AS type,
                 MAX(vp_pos)         AS pos,
                 video_playlist.p_id AS p_id
          FROM video_playlist
          GROUP BY p_id
         )
         UNION
         (SELECT "ROUTE"            AS type,
                 MAX(tp_pos)        AS pos,
                 tour_playlist.p_id AS p_id
          from tour_playlist
          GROUP BY p_id
         )
         UNION
         (SELECT "TRACK"                 AS type,
                 MAX(kp_pos)             AS pos,
                 kategorie_playlist.p_id AS p_id
          from kategorie_playlist
          GROUP BY p_id
         )
         UNION
         (SELECT "TRIP"             AS type,
                 MAX(trp_pos)       AS pos,
                 trip_playlist.p_id AS p_id
          from trip_playlist
          GROUP BY p_id
         )
         UNION
         (SELECT "INFO"             AS type,
                 MAX(ifp_pos)       AS pos,
                 info_playlist.p_id AS p_id
          from info_playlist
          GROUP BY p_id
         )
         UNION
         (SELECT "LOCATION"             AS type,
                 MAX(lp_pos)            AS pos,
                 location_playlist.p_id AS p_id
          from location_playlist
          GROUP BY p_id
         )
     ) all_playlist_view_max;
