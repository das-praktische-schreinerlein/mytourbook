/* #############
# add playlists
############# */
ALTER TABLE image_playlist ADD COLUMN IF NOT EXISTS ip_details varchar(1000) COLLATE latin1_general_ci DEFAULT NULL;
ALTER TABLE video_playlist ADD COLUMN IF NOT EXISTS vp_details varchar(1000) COLLATE latin1_general_ci DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_IP__IP_POS ON image_playlist (ip_pos);
CREATE INDEX IF NOT EXISTS idx_VP__VP_POS ON video_playlist (Vp_pos);

CREATE TABLE IF NOT EXISTS tour_playlist
(
    tp_id  int(11) NOT NULL AUTO_INCREMENT,
    t_id   int(11) NOT NULL DEFAULT '0',
    p_id   int(11) NOT NULL DEFAULT '0',
    tp_pos int(11)          DEFAULT NULL,
    tp_details varchar(1000) COLLATE latin1_general_ci DEFAULT NULL,
    PRIMARY KEY (tp_id),
    KEY idx_tp__tp_id (tp_id),
    KEY idx_tp__t_id (t_id),
    KEY idx_tp__p_id (p_id),
    CONSTRAINT tour_playlist_ibfk_1 FOREIGN KEY (t_id) REFERENCES tour (t_id) ON DELETE CASCADE,
    CONSTRAINT tour_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = latin1
  COLLATE = latin1_general_ci;
CREATE INDEX IF NOT EXISTS idx_TP__TP_POS ON tour_playlist (tp_pos);

CREATE TABLE IF NOT EXISTS kategorie_playlist
(
    kp_id  int(11) NOT NULL AUTO_INCREMENT,
    k_id   int(11) NOT NULL DEFAULT '0',
    p_id   int(11) NOT NULL DEFAULT '0',
    kp_pos int(11)          DEFAULT NULL,
    kp_details varchar(1000) COLLATE latin1_general_ci DEFAULT NULL,
    PRIMARY KEY (kp_id),
    KEY idx_kp__kp_id (kp_id),
    KEY idx_kp__k_id (k_id),
    KEY idx_kp__p_id (p_id),
    CONSTRAINT kategorie_playlist_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id) ON DELETE CASCADE,
    CONSTRAINT kategorie_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = latin1
  COLLATE = latin1_general_ci;
CREATE INDEX IF NOT EXISTS idx_KP__KP_POS ON kategorie_playlist (kp_pos);

CREATE TABLE IF NOT EXISTS trip_playlist
(
    trp_id  int(11) NOT NULL AUTO_INCREMENT,
    tr_id   int(11) NOT NULL DEFAULT '0',
    p_id    int(11) NOT NULL DEFAULT '0',
    trp_pos int(11)          DEFAULT NULL,
    trp_details varchar(1000) COLLATE latin1_general_ci DEFAULT NULL,
    PRIMARY KEY (trp_id),
    KEY idx_trp__trp_id (trp_id),
    KEY idx_trp__tr_id (tr_id),
    KEY idx_trp__p_id (p_id),
    CONSTRAINT trip_playlist_ibfk_1 FOREIGN KEY (tr_id) REFERENCES trip (tr_id) ON DELETE CASCADE,
    CONSTRAINT trip_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = latin1
  COLLATE = latin1_general_ci;
CREATE INDEX IF NOT EXISTS idx_TRP__TRP_POS ON trip_playlist (trp_pos);

CREATE TABLE IF NOT EXISTS info_playlist
(
    ifp_id  int(11) NOT NULL AUTO_INCREMENT,
    if_id   int(11) NOT NULL DEFAULT '0',
    p_id    int(11) NOT NULL DEFAULT '0',
    ifp_pos int(11)          DEFAULT NULL,
    ifp_details varchar(1000) COLLATE latin1_general_ci DEFAULT NULL,
    PRIMARY KEY (ifp_id),
    KEY idx_ifp__ifp_id (ifp_id),
    KEY idx_ifp__t_id (if_id),
    KEY idx_ifp__p_id (p_id),
    CONSTRAINT info_playlist_ibfk_1 FOREIGN KEY (if_id) REFERENCES info (if_id) ON DELETE CASCADE,
    CONSTRAINT info_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = latin1
  COLLATE = latin1_general_ci;
CREATE INDEX IF NOT EXISTS idx_IFP__IFP_POS ON info_playlist (ifp_pos);

CREATE TABLE IF NOT EXISTS location_playlist
(
    lp_id  int(11) NOT NULL AUTO_INCREMENT,
    l_id   int(11) NOT NULL DEFAULT '0',
    p_id   int(11) NOT NULL DEFAULT '0',
    lp_pos int(11)          DEFAULT NULL,
    lp_details varchar(1000) COLLATE latin1_general_ci DEFAULT NULL,
    PRIMARY KEY (lp_id),
    KEY idx_lp__lp_id (lp_id),
    KEY idx_lp__l_id (l_id),
    KEY idx_lp__p_id (p_id),
    CONSTRAINT location_playlist_ibfk_1 FOREIGN KEY (l_id) REFERENCES location (l_id) ON DELETE CASCADE,
    CONSTRAINT location_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = latin1
  COLLATE = latin1_general_ci;
CREATE INDEX IF NOT EXISTS idx_LP__LP_POS ON location_playlist (lp_pos);


/* #############
# initialize-all_entries_view
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
       html,
       blocked,
       date,
       datevon,
       datebis,
       dateonly,
       week,
       month,
       year,
       gpstracks_basefile,
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
                 CONCAT("ac_", kategorie.k_type)                                             AS actiontype,
                 CONCAT("ac_", kategorie.k_type)                                             AS subtype,
                 CONCAT("IMAGE", "_", image.i_id)                                            AS id,
                 image.i_id,
                 NULL                                                                        AS v_id,
                 image.k_id,
                 kategorie.t_id,
                 kategorie.tr_id,
                 kategorie.l_id,
                 COALESCE(i_meta_name, k_name)                                               AS meta_name,
                 CONCAT(COALESCE(i_meta_name, ""), " ", l_name)                              AS html,
                 i_gesperrt                                                                  as blocked,
                 i_date                                                                      as date,
                 kategorie.k_datevon                                                         as datevon,
                 kategorie.k_datebis                                                         as datebis,
                 DATE_FORMAT(i_date, GET_FORMAT(DATE, "ISO"))                                AS dateonly,
                 WEEK(i_date)                                                                AS week,
                 MONTH(i_date)                                                               AS month,
                 YEAR(i_date)                                                                AS year,
                 k_gpstracks_basefile                                                        as gpstracks_basefile,
                 i_meta_shortdesc                                                            as meta_shortdesc,
                 i_meta_shortdesc                                                            AS meta_shortdesc_md,
                 CAST(i_gps_lat AS CHAR(50))                                                 AS gps_lat,
                 CAST(i_gps_lon AS CHAR(50))                                                 AS gps_lon,
                 CONCAT(i_gps_lat, ",", i_gps_lon)                                           AS gps_loc,
                 CONCAT("T", location.l_typ, "L", location.l_parent_id, " -> ",
                        location.l_name)                                                     AS l_lochirarchietxt,
                 CONCAT(CAST(location.l_parent_id AS CHAR(50)), ",",
                        CAST(location.l_id AS CHAR(50)))                                     AS l_lochirarchieids,
                 CONCAT(image.i_dir, "/", image.i_file)                                      AS i_fav_url_txt,
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
                 ROUND((k_altitude_asc / 500)) * 500                                         AS altAscFacet,
                 ROUND((i_gps_ele / 500)) * 500                                              AS altMaxFacet,
                 ROUND((k_distance / 5)) * 5                                                 AS distFacet,
                 TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon)) / 3600                          AS dur,
                 ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon)) / 3600 * 2) / 2, 1) AS durFacet
          FROM image
                   LEFT JOIN kategorie ON kategorie.k_id = image.k_id
                   LEFT JOIN location ON location.l_id = kategorie.l_id
         )
         UNION
         (SELECT "VIDEO"                                                                     AS type,
                 CONCAT("ac_", kategorie.k_type)                                             AS actiontype,
                 CONCAT("ac_", kategorie.k_type)                                             AS subtype,
                 CONCAT("VIDEO", "_", video.v_id)                                            AS id,
                 NULL                                                                        AS i_id,
                 video.v_id,
                 video.k_id,
                 kategorie.t_id,
                 kategorie.tr_id,
                 kategorie.l_id,
                 COALESCE(v_meta_name, k_name)                                               AS meta_name,
                 CONCAT(COALESCE(v_meta_name, ""), " ", l_name)                              AS html,
                 v_gesperrt                                                                  as blocked,
                 v_date                                                                      as date,
                 kategorie.k_datevon                                                         as datevon,
                 kategorie.k_datebis                                                         as datebis,
                 DATE_FORMAT(v_date, GET_FORMAT(DATE, "ISO"))                                AS dateonly,
                 WEEK(v_date)                                                                AS week,
                 MONTH(v_date)                                                               AS month,
                 YEAR(v_date)                                                                AS year,
                 k_gpstracks_basefile                                                        as gpstracks_basefile,
                 v_meta_shortdesc                                                            as meta_shortdesc,
                 v_meta_shortdesc                                                            AS meta_shortdesc_md,
                 CAST(v_gps_lat AS CHAR(50))                                                 AS gps_lat,
                 CAST(v_gps_lon AS CHAR(50))                                                 AS gps_lon,
                 CONCAT(v_gps_lat, ",", v_gps_lon)                                           AS gps_loc,
                 CONCAT("T", location.l_typ, "L", location.l_parent_id, " -> ",
                        location.l_name)                                                     AS l_lochirarchietxt,
                 CONCAT(CAST(location.l_parent_id AS CHAR(50)), ",",
                        CAST(location.l_id AS CHAR(50)))                                     AS l_lochirarchieids,
                 NULL                                                                        AS i_fav_url_txt,
                 CONCAT(video.v_dir, "/", video.v_file)                                      AS v_fav_url_txt,
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
                 ROUND((k_altitude_asc / 500)) * 500                                         AS altAscFacet,
                 ROUND((v_gps_ele / 500)) * 500                                              AS altMaxFacet,
                 ROUND((k_distance / 5)) * 5                                                 AS distFacet,
                 TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon)) / 3600                          AS dur,
                 ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon)) / 3600 * 2) / 2, 1) AS durFacet
          FROM video
                   LEFT JOIN kategorie ON kategorie.k_id = video.k_id
                   LEFT JOIN location ON location.l_id = kategorie.l_id
         )
         UNION
         (SELECT "TRACK"                                                                     AS type,
                 CONCAT("ac_", kategorie.k_type)                                             AS actiontype,
                 CONCAT("ac_", kategorie.k_type)                                             AS subtype,
                 CONCAT("TRACK", "_", kategorie.k_id)                                        AS id,
                 NULL                                                                        AS i_id,
                 NULL                                                                        AS v_id,
                 kategorie.k_id,
                 kategorie.t_id,
                 kategorie.tr_id,
                 kategorie.l_id,
                 k_name                                                                      AS meta_name,
                 CONCAT(k_name, " ", COALESCE(k_meta_shortdesc, ""), " ", l_name)            AS html,
                 k_gesperrt                                                                  as blocked,
                 K_DATEVON                                                                   as date,
                 kategorie.k_datevon                                                         as datevon,
                 kategorie.k_datebis                                                         as datebis,
                 DATE_FORMAT(K_DATEVON, GET_FORMAT(DATE, "ISO"))                             AS dateonly,
                 WEEK(K_DATEVON)                                                             AS week,
                 MONTH(K_DATEVON)                                                            AS month,
                 YEAR(K_DATEVON)                                                             AS year,
                 k_gpstracks_basefile                                                        as gpstracks_basefile,
                 k_meta_shortdesc                                                            as meta_shortdesc,
                 k_meta_shortdesc                                                            AS meta_shortdesc_md,
                 CAST(L_GEO_LATDEG AS CHAR(50))                                              AS gps_lat,
                 CAST(L_GEO_LONGDEG AS CHAR(50))                                             AS gps_lon,
                 CONCAT(L_GEO_LATDEG, ",", L_GEO_LONGDEG)                                    AS gps_loc,
                 GetLocationNameAncestry(location.l_id, location.l_name, " -> ")             AS l_lochirarchietxt,
                 GetLocationIdAncestry(location.l_id, ",")                                   AS l_lochirarchieids,
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
                 ROUND((k_altitude_asc / 500)) * 500                                         AS altAscFacet,
                 ROUND((K_ALTITUDE_MAX / 500)) * 500                                         AS altMaxFacet,
                 ROUND((k_distance / 5)) * 5                                                 AS distFacet,
                 TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon)) / 3600                          AS dur,
                 ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon)) / 3600 * 2) / 2, 1) AS durFacet
          FROM kategorie
                   LEFT JOIN location ON location.l_id = kategorie.l_id
         )
         UNION
         (SELECT "ROUTE"                                                          AS type,
                 CONCAT("ac_", tour.t_typ)                                        AS actiontype,
                 CONCAT("ac_", tour.t_typ)                                        AS subtype,
                 CONCAT("ROUTE", "_", tour.t_id)                                  AS id,
                 NULL                                                             AS i_id,
                 NULL                                                             AS v_id,
                 tour.k_id,
                 tour.t_id,
                 null                                                             AS tr_id,
                 tour.l_id,
                 t_name                                                           AS meta_name,
                 CONCAT(t_name, " ", COALESCE(t_meta_shortdesc, ""), " ", l_name) AS html,
                 t_gesperrt                                                       as blocked,
                 t_DATEVON                                                        as date,
                 tour.t_datevon                                                   as datevon,
                 tour.t_datebis                                                   as datebis,
                 DATE_FORMAT(t_DATEVON, GET_FORMAT(DATE, "ISO"))                  AS dateonly,
                 WEEK(t_DATEVON)                                                  AS week,
                 MONTH(t_DATEVON)                                                 AS month,
                 YEAR(t_DATEVON)                                                  AS year,
                 t_gpstracks_basefile                                             as gpstracks_basefile,
                 t_meta_shortdesc                                                 as meta_shortdesc,
                 t_meta_shortdesc                                                 AS meta_shortdesc_md,
                 CAST(L_GEO_LATDEG AS CHAR(50))                                   AS gps_lat,
                 CAST(L_GEO_LONGDEG AS CHAR(50))                                  AS gps_lon,
                 CONCAT(L_GEO_LATDEG, ",", L_GEO_LONGDEG)                         AS gps_loc,
                 GetLocationNameAncestry(location.l_id, location.l_name, " -> ")  AS l_lochirarchietxt,
                 GetLocationIdAncestry(location.l_id, ",")                        AS l_lochirarchieids,
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
                 ROUND((t_route_hm / 500)) * 500                                  AS altAscFacet,
                 ROUND((T_ELE_MAX / 500)) * 500                                   AS altMaxFacet,
                 ROUND((t_route_m / 5)) * 5                                       AS distFacet,
                 t_route_dauer                                                    AS dur,
                 ROUND(ROUND(t_route_dauer * 2) / 2, 1)                           AS durFacet
          FROM tour
                   LEFT JOIN location ON location.l_id = tour.l_id
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
                 CONCAT(tr_name, " ", COALESCE(tr_meta_shortdesc, ""), " ", l_name)            AS html,
                 tr_gesperrt                                                                   as blocked,
                 tr_DATEVON                                                                    as date,
                 trip.tr_datevon                                                               as datevon,
                 trip.tr_datebis                                                               as datebis,
                 DATE_FORMAT(tr_DATEVON, GET_FORMAT(DATE, "ISO"))                              AS dateonly,
                 WEEK(tr_DATEVON)                                                              AS week,
                 MONTH(tr_DATEVON)                                                             AS month,
                 YEAR(tr_DATEVON)                                                              AS year,
                 null                                                                          as gpstracks_basefile,
                 tr_meta_shortdesc                                                             as meta_shortdesc,
                 tr_meta_shortdesc                                                             AS meta_shortdesc_md,
                 CAST(L_GEO_LATDEG AS CHAR(50))                                                AS gps_lat,
                 CAST(L_GEO_LONGDEG AS CHAR(50))                                               AS gps_lon,
                 CONCAT(L_GEO_LATDEG, ",", L_GEO_LONGDEG)                                      AS gps_loc,
                 GetLocationNameAncestry(location.l_id, location.l_name, " -> ")               AS l_lochirarchietxt,
                 GetLocationIdAncestry(location.l_id, ",")                                     AS l_lochirarchieids,
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
                 TIME_TO_SEC(TIMEDIFF(tr_datebis, tr_datevon)) / 3600                          AS dur,
                 ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(tr_datebis, tr_datevon)) / 3600 * 2) / 2, 1) AS durFacet
          FROM trip
                   LEFT JOIN location ON location.l_id = trip.l_id
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
                 CONCAT(if_name, " ", COALESCE(if_meta_shortdesc, ""), " ", l_name) AS html,
                 NULL                                                               as blocked,
                 NULL                                                               as date,
                 NULL                                                               as datevon,
                 NULL                                                               as datebis,
                 NULL                                                               AS dateonly,
                 NULL                                                               AS week,
                 NULL                                                               AS month,
                 NULL                                                               AS year,
                 null                                                               as gpstracks_basefile,
                 if_meta_shortdesc                                                  as meta_shortdesc,
                 if_meta_shortdesc                                                  AS meta_shortdesc_md,
                 CAST(L_GEO_LATDEG AS CHAR(50))                                     AS gps_lat,
                 CAST(L_GEO_LONGDEG AS CHAR(50))                                    AS gps_lon,
                 CONCAT(L_GEO_LATDEG, ",", L_GEO_LONGDEG)                           AS gps_loc,
                 GetLocationNameAncestry(location.l_id, location.l_name, " -> ")    AS l_lochirarchietxt,
                 GetLocationIdAncestry(location.l_id, ",")                          AS l_lochirarchieids,
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
                   LEFT JOIN location ON location.l_id = info.l_id
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
                 CONCAT(l_name, " ", COALESCE(l_meta_shortdesc, ""), " ",
                        GetLocationNameAncestry(location.l_id, location.l_name, " -> ")) AS html,
                 l_gesperrt                                                              as blocked,
                 NULL                                                                    as date,
                 NULL                                                                    as datevon,
                 NULL                                                                    as datebis,
                 NULL                                                                    AS dateonly,
                 NULL                                                                    AS week,
                 NULL                                                                    AS month,
                 NULL                                                                    AS year,
                 NULL                                                                    as gpstracks_basefile,
                 l_meta_shortdesc                                                        as meta_shortdesc,
                 l_meta_shortdesc                                                        AS meta_shortdesc_md,
                 CAST(L_GEO_LATDEG AS CHAR(50))                                          AS gps_lat,
                 CAST(L_GEO_LONGDEG AS CHAR(50))                                         AS gps_lon,
                 CONCAT(L_GEO_LATDEG, ",", L_GEO_LONGDEG)                                AS gps_loc,
                 GetLocationNameAncestry(location.l_id, location.l_name, " -> ")         AS l_lochirarchietxt,
                 GetLocationIdAncestry(location.l_id, ",")                               AS l_lochirarchieids,
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
                 ROUND((l_geo_ele / 500)) * 500                                          AS altMaxFacet,
                 null                                                                    AS distFacet,
                 null                                                                    AS dur,
                 null                                                                    AS durFacet
          FROM location
         )
     ) all_view;

DROP VIEW IF EXISTS all_entries_keyword;
CREATE VIEW IF NOT EXISTS all_entries_keyword AS
SELECT *
FROM (
         (SELECT "IMAGE"                                  AS type,
                 CONCAT("IMAGE", "_", image_keyword.i_id) AS id,
                 image_keyword.i_id                       AS origId,
                 image_keyword.KW_ID                      AS KW_ID
          from image_keyword
         )
         UNION
         (SELECT "VIDEO"                                  AS type,
                 CONCAT("VIDEO", "_", video_keyword.v_id) AS id,
                 video_keyword.v_id                       AS origId,
                 video_keyword.KW_ID                      AS KW_ID
          from video_keyword
         )
         UNION
         (SELECT "ROUTE"                                 AS type,
                 CONCAT("ROUTE", "_", tour_keyword.t_id) AS id,
                 tour_keyword.t_id                       AS origId,
                 tour_keyword.KW_ID                      AS KW_ID
          from tour_keyword
         )
         UNION
         (SELECT "TRACK"                                      AS type,
                 CONCAT("TRACK", "_", kategorie_keyword.k_id) AS id,
                 kategorie_keyword.k_id                       AS origId,
                 kategorie_keyword.KW_ID                      AS KW_ID
          from kategorie_keyword
         )
         UNION
         (SELECT "LOCATION"                                     AS type,
                 CONCAT("LOCATION", "_", location_keyword.l_id) AS id,
                 location_keyword.l_id                          AS origId,
                 location_keyword.KW_ID                         AS KW_ID
          from location_keyword
         )
     ) all_keyword_view;


DROP VIEW IF EXISTS all_entries_playlist;
CREATE VIEW IF NOT EXISTS all_entries_playlist AS
SELECT *
FROM (
         (SELECT "IMAGE"                                   AS type,
                 CONCAT("IMAGE", "_", image_playlist.i_id) AS id,
                 image_playlist.i_id                       AS origId,
                 image_playlist.ip_pos                     AS pos,
                image_playlist.ip_details             AS details,
                 image_playlist.p_id                       AS p_id
          from image_playlist
         )
         UNION
         (SELECT "VIDEO"                                   AS type,
                 CONCAT("VIDEO", "_", video_playlist.v_id) AS id,
                 video_playlist.v_id                       AS origId,
                 video_playlist.vp_pos                     AS pos,
                video_playlist.vp_details             AS details,
                 video_playlist.p_id                       AS p_id
          from video_playlist
         )
         UNION
         (SELECT "ROUTE"                                  AS type,
                 CONCAT("ROUTE", "_", tour_playlist.t_id) AS id,
                 tour_playlist.t_id                       AS origId,
                 tour_playlist.tp_pos                     AS pos,
                tour_playlist.tp_details                 AS details,
                 tour_playlist.p_id                       AS p_id
          from tour_playlist
         )
         UNION
         (SELECT "TRACK"                                       AS type,
                 CONCAT("TRACK", "_", kategorie_playlist.k_id) AS id,
                 kategorie_playlist.k_id                       AS origId,
                 kategorie_playlist.kp_pos                     AS pos,
                kategorie_playlist.kp_details                 AS details,
                 kategorie_playlist.p_id                       AS p_id
          from kategorie_playlist
         )
         UNION
         (SELECT "TRIP"                                   AS type,
                 CONCAT("TRIP", "_", trip_playlist.tr_id) AS id,
                 trip_playlist.tr_id                      AS origId,
                 trip_playlist.trp_pos                    AS pos,
                trip_playlist.trp_details                AS details,
                 trip_playlist.p_id                       AS p_id
          from trip_playlist
         )
         UNION
         (SELECT "INFO"                                   AS type,
                 CONCAT("INFO", "_", info_playlist.if_id) AS id,
                 info_playlist.if_id                      AS origId,
                 info_playlist.ifp_pos                    AS pos,
                info_playlist.ifp_details                AS details,
                 info_playlist.p_id                       AS p_id
          from info_playlist
         )
         UNION
         (SELECT "LOCATION"                                      AS type,
                 CONCAT("LOCATION", "_", location_playlist.l_id) AS id,
                 location_playlist.l_id                          AS origId,
                 location_playlist.lp_pos                        AS pos,
                location_playlist.lp_details                    AS details,
                 location_playlist.p_id                          AS p_id
          from location_playlist
         )
     ) all_playlist_view;

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
         )
         UNION
         (SELECT "TRACK"                 AS type,
                 MAX(kp_pos)             AS pos,
                 kategorie_playlist.p_id AS p_id
          from kategorie_playlist
         )
         UNION
         (SELECT "TRIP"             AS type,
                 MAX(trp_pos)       AS pos,
                 trip_playlist.p_id AS p_id
          from trip_playlist
         )
         UNION
         (SELECT "INFO"             AS type,
                 MAX(ifp_pos)       AS pos,
                 info_playlist.p_id AS p_id
          from info_playlist
         )
         UNION
         (SELECT "LOCATION"             AS type,
                 MAX(lp_pos)            AS pos,
                 location_playlist.p_id AS p_id
          from location_playlist
         )
     ) all_playlist_view_max;


/* #############
# update existing old playlists
############# */
UPDATE
    image_playlist AS ip
  JOIN
    ( SELECT all_entries_playlist.p_id, all_entries_playlist.type, origId, row_number() OVER (ORDER BY all_entries.date) AS rn
      FROM all_entries_playlist inner join all_entries on all_entries_playlist.id = all_entries.id
        WHERE p_id=17 and all_entries_playlist.type in ("IMAGE", "VIDEO") and all_entries.type in ("IMAGE", "VIDEO") order by date
    ) AS sub
  ON ip.i_id = sub.origId and sub.type="IMAGE" and ip.P_ID=sub.p_id
SET
    ip.IP_POS = sub.rn;

UPDATE
    video_playlist AS ip
  JOIN
    ( SELECT all_entries_playlist.p_id, all_entries_playlist.type, origId, row_number() OVER (ORDER BY all_entries.date) AS rn
      FROM all_entries_playlist inner join all_entries on all_entries_playlist.id = all_entries.id
        WHERE p_id=17 and all_entries_playlist.type in ("IMAGE", "VIDEO") and all_entries.type in ("IMAGE", "VIDEO") order by date
    ) AS sub
  ON ip.v_id = sub.origId and sub.type="VIDEO" and ip.P_ID=sub.p_id
SET
    ip.VP_POS = sub.rn;

UPDATE
    image_playlist AS ip
  JOIN
    ( SELECT all_entries_playlist.p_id, all_entries_playlist.type, origId, row_number() OVER (ORDER BY all_entries.date) AS rn
      FROM all_entries_playlist inner join all_entries on all_entries_playlist.id = all_entries.id
        WHERE p_id=18 and all_entries_playlist.type in ("IMAGE", "VIDEO") and all_entries.type in ("IMAGE", "VIDEO") order by date
    ) AS sub
  ON ip.i_id = sub.origId and sub.type="IMAGE" and ip.P_ID=sub.p_id
SET
    ip.IP_POS = sub.rn;

UPDATE
    video_playlist AS ip
  JOIN
    ( SELECT all_entries_playlist.p_id, all_entries_playlist.type, origId, row_number() OVER (ORDER BY all_entries.date) AS rn
      FROM all_entries_playlist inner join all_entries on all_entries_playlist.id = all_entries.id
        WHERE p_id=18 and all_entries_playlist.type in ("IMAGE", "VIDEO") and all_entries.type in ("IMAGE", "VIDEO") order by date
    ) AS sub
  ON ip.v_id = sub.origId and sub.type="VIDEO" and ip.P_ID=sub.p_id
SET
    ip.VP_POS = sub.rn;

UPDATE
    image_playlist AS ip
  JOIN
    ( SELECT all_entries_playlist.p_id, all_entries_playlist.type, origId, row_number() OVER (ORDER BY all_entries.date) AS rn
      FROM all_entries_playlist inner join all_entries on all_entries_playlist.id = all_entries.id
        WHERE p_id=24 and all_entries_playlist.type in ("IMAGE", "VIDEO") and all_entries.type in ("IMAGE", "VIDEO") order by date
    ) AS sub
  ON ip.i_id = sub.origId and sub.type="IMAGE" and ip.P_ID=sub.p_id
SET
    ip.IP_POS = sub.rn;

UPDATE
    video_playlist AS ip
  JOIN
    ( SELECT all_entries_playlist.p_id, all_entries_playlist.type, origId, row_number() OVER (ORDER BY all_entries.date) AS rn
      FROM all_entries_playlist inner join all_entries on all_entries_playlist.id = all_entries.id
        WHERE p_id=24 and all_entries_playlist.type in ("IMAGE", "VIDEO") and all_entries.type in ("IMAGE", "VIDEO") order by date
    ) AS sub
  ON ip.v_id = sub.origId and sub.type="VIDEO" and ip.P_ID=sub.p_id
SET
    ip.VP_POS = sub.rn;

UPDATE
    image_playlist AS ip
  JOIN
    ( SELECT all_entries_playlist.p_id, all_entries_playlist.type, origId, row_number() OVER (ORDER BY all_entries.date) AS rn
      FROM all_entries_playlist inner join all_entries on all_entries_playlist.id = all_entries.id
        WHERE p_id=25 and all_entries_playlist.type in ("IMAGE", "VIDEO") and all_entries.type in ("IMAGE", "VIDEO") order by date
    ) AS sub
  ON ip.i_id = sub.origId and sub.type="IMAGE" and ip.P_ID=sub.p_id
SET
    ip.IP_POS = sub.rn;

UPDATE
    video_playlist AS ip
  JOIN
    ( SELECT all_entries_playlist.p_id, all_entries_playlist.type, origId, row_number() OVER (ORDER BY all_entries.date) AS rn
      FROM all_entries_playlist inner join all_entries on all_entries_playlist.id = all_entries.id
        WHERE p_id=25 and all_entries_playlist.type in ("IMAGE", "VIDEO") and all_entries.type in ("IMAGE", "VIDEO") order by date
    ) AS sub
  ON ip.v_id = sub.origId and sub.type="VIDEO" and ip.P_ID=sub.p_id
SET
    ip.VP_POS = sub.rn;

UPDATE
    image_playlist AS ip
  JOIN
    ( SELECT all_entries_playlist.p_id, all_entries_playlist.type, origId, row_number() OVER (ORDER BY all_entries.date) AS rn
      FROM all_entries_playlist inner join all_entries on all_entries_playlist.id = all_entries.id
        WHERE p_id=29 and all_entries_playlist.type in ("IMAGE", "VIDEO") and all_entries.type in ("IMAGE", "VIDEO") order by date
    ) AS sub
  ON ip.i_id = sub.origId and sub.type="IMAGE" and ip.P_ID=sub.p_id
SET
    ip.IP_POS = sub.rn;

UPDATE
    video_playlist AS ip
  JOIN
    ( SELECT all_entries_playlist.p_id, all_entries_playlist.type, origId, row_number() OVER (ORDER BY all_entries.date) AS rn
      FROM all_entries_playlist inner join all_entries on all_entries_playlist.id = all_entries.id
        WHERE p_id=29 and all_entries_playlist.type in ("IMAGE", "VIDEO") and all_entries.type in ("IMAGE", "VIDEO") order by date
    ) AS sub
  ON ip.v_id = sub.origId and sub.type="VIDEO" and ip.P_ID=sub.p_id
SET
    ip.VP_POS = sub.rn;
