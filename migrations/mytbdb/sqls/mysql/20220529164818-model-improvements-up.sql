-- ----------------
-- add location-view with hierarchical fields, improve model
-- ----------------
-- not supported ALTER TABLE image ADD COLUMN IF NOT EXISTS i_calced_id VARCHAR(50) GENERATED ALWAYS AS (CONCAT("IMAGE", "_", i_id)) STORED;
-- not supported ALTER TABLE image_object ADD COLUMN IF NOT EXISTS io_calced_id VARCHAR(50) GENERATED ALWAYS AS (CONCAT("ODIMGOBJECT", "_", io_id)) STORED;
-- not supported ALTER TABLE info ADD COLUMN IF NOT EXISTS if_calced_id VARCHAR(50) GENERATED ALWAYS AS (CONCAT("INFO", "_", if_id)) STORED;
-- not supported ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_calced_id VARCHAR(50) GENERATED ALWAYS AS (CONCAT("TRACK", "_", k_id)) STORED;
-- not supported ALTER TABLE location ADD COLUMN IF NOT EXISTS l_calced_id VARCHAR(50) GENERATED ALWAYS AS (CONCAT("LOCATION", "_", l_id)) STORED;
-- not supported ALTER TABLE news ADD COLUMN IF NOT EXISTS n_calced_id VARCHAR(50) GENERATED ALWAYS AS (CONCAT("NEWS", "_", n_id)) STORED;
-- not supported ALTER TABLE playlist ADD COLUMN IF NOT EXISTS p_calced_id VARCHAR(50) GENERATED ALWAYS AS (CONCAT("PLAYLIST", "_", p_id)) STORED;
-- not supported ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_calced_id VARCHAR(50) GENERATED ALWAYS AS (CONCAT("ROUTE", "_", t_id)) STORED;
-- not supported ALTER TABLE trip ADD COLUMN IF NOT EXISTS tr_calced_id VARCHAR(50) GENERATED ALWAYS AS (CONCAT("TRIP", "_", tr_id)) STORED;
-- not supported ALTER TABLE video ADD COLUMN IF NOT EXISTS v_calced_id VARCHAR(50) GENERATED ALWAYS AS (CONCAT("VIDEO", "_", v_id)) STORED;

ALTER TABLE info ADD COLUMN IF NOT EXISTS if_calced_subtype VARCHAR(50) GENERATED ALWAYS AS (CONCAT("if_", if_typ)) STORED;
ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_calced_actiontype VARCHAR(50) GENERATED ALWAYS AS (CONCAT("ac_", k_type)) STORED;
ALTER TABLE location ADD COLUMN IF NOT EXISTS l_calced_subtype VARCHAR(50) GENERATED ALWAYS AS (CONCAT("ac_", l_typ)) STORED;
ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_calced_actiontype VARCHAR(50) GENERATED ALWAYS AS (CONCAT("ac_", t_typ)) STORED;

ALTER TABLE image ADD COLUMN IF NOT EXISTS i_calced_gps_loc VARCHAR(50) GENERATED ALWAYS AS (CONCAT(i_gps_lat, ",", i_gps_lon)) STORED;
ALTER TABLE image ADD COLUMN IF NOT EXISTS i_calced_gps_lat VARCHAR(50) GENERATED ALWAYS AS (CAST(i_gps_lat AS CHAR(50))) STORED;
ALTER TABLE image ADD COLUMN IF NOT EXISTS i_calced_gps_lon VARCHAR(50) GENERATED ALWAYS AS (CAST(i_gps_lon AS CHAR(50))) STORED;
ALTER TABLE location ADD COLUMN IF NOT EXISTS l_calced_gps_loc VARCHAR(50) GENERATED ALWAYS AS (CONCAT(L_GEO_LATDEG, ",", L_GEO_LONGDEG)) STORED;
ALTER TABLE location ADD COLUMN IF NOT EXISTS l_calced_gps_lat VARCHAR(50) GENERATED ALWAYS AS (CAST(L_GEO_LATDEG AS CHAR(50))) STORED;
ALTER TABLE location ADD COLUMN IF NOT EXISTS l_calced_gps_lon VARCHAR(50) GENERATED ALWAYS AS (CAST(L_GEO_LONGDEG AS CHAR(50))) STORED;
ALTER TABLE video ADD COLUMN IF NOT EXISTS v_calced_gps_loc VARCHAR(50) GENERATED ALWAYS AS (CONCAT(v_gps_lat, ",", v_gps_lon)) STORED;
ALTER TABLE video ADD COLUMN IF NOT EXISTS v_calced_gps_lat VARCHAR(50) GENERATED ALWAYS AS (CAST(v_gps_lat AS CHAR(50))) STORED;
ALTER TABLE video ADD COLUMN IF NOT EXISTS v_calced_gps_lon VARCHAR(50) GENERATED ALWAYS AS (CAST(v_gps_lon AS CHAR(50))) STORED;

ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_calced_d_id VARCHAR(255) GENERATED ALWAYS AS ( MD5(CONCAT(COALESCE(l_id, ""), "_",
                                                                                                      COALESCE(t_desc_gebiet, ""), "_",
                                                                                                      COALESCE(t_desc_ziel, ""), "_",
                                                                                                      COALESCE(t_typ, "")))) STORED;
ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_calced_statisticname_actiontype VARCHAR(255) GENERATED ALWAYS AS (CONCAT(l_id, "_", t_desc_gebiet, "_", t_desc_ziel, "_ac_", t_typ)) STORED;
ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_calced_statisticname_ele VARCHAR(255) GENERATED ALWAYS AS (CONCAT(l_id, "_", t_desc_gebiet, "_", t_desc_ziel, "_ele_", t_ele_max)) STORED;


ALTER TABLE image ADD COLUMN IF NOT EXISTS i_calced_altMaxFacet DECIMAL UNSIGNED GENERATED ALWAYS AS (ROUND((i_gps_ele / 500)) * 500) STORED;
-- not supported ALTER TABLE image ADD COLUMN IF NOT EXISTS i_calced_dateonly VARCHAR(20) GENERATED ALWAYS AS (DATE_FORMAT(i_date, GET_FORMAT(DATE, "ISO"))) STORED;
-- not supported ALTER TABLE image ADD COLUMN IF NOT EXISTS i_calced_week tinyint GENERATED ALWAYS AS (WEEK(i_date)) STORED;
-- not supported ALTER TABLE image ADD COLUMN IF NOT EXISTS i_calced_month tinyint GENERATED ALWAYS AS (MONTH(i_date)) STORED;
-- not supported ALTER TABLE image ADD COLUMN IF NOT EXISTS i_calced_year tinyint GENERATED ALWAYS AS (YEAR(i_date)) STORED;

ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_calced_altAscFacet DECIMAL UNSIGNED GENERATED ALWAYS AS (ROUND((k_altitude_asc / 500)) * 500) STORED;
ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_calced_altMaxFacet DECIMAL UNSIGNED GENERATED ALWAYS AS (ROUND((k_altitude_max / 500)) * 500) STORED;
ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_calced_distFacet DECIMAL(11, 1) UNSIGNED GENERATED ALWAYS AS (ROUND((k_distance / 5)) * 5) STORED;
ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_calced_dur DECIMAL(11, 2) GENERATED ALWAYS AS (TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon)) / 3600) STORED;
ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_calced_durFacet DECIMAL(11, 1) GENERATED ALWAYS AS (ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon)) / 3600 * 2) / 2, 1)) STORED;
-- not supported ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_calced_dateonly VARCHAR(20) GENERATED  ALWAYS AS (DATE_FORMAT(k_datevon, GET_FORMAT(DATE, "ISO"))) STORED;
-- not supported ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_calced_week tinyint GENERATED  ALWAYS AS (WEEK(k_datevon)) STORED;
-- not supported ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_calced_month tinyint GENERATED  ALWAYS AS (MONTH(k_datevon)) STORED;
-- not supported ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_calced_year tinyint GENERATED  ALWAYS AS (YEAR(k_datevon)) STORED;

ALTER TABLE location ADD COLUMN IF NOT EXISTS l_calced_altMaxFacet DECIMAL UNSIGNED GENERATED ALWAYS AS (ROUND((l_geo_ele / 500)) * 500) STORED;

ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_calced_altAscFacet DECIMAL UNSIGNED GENERATED ALWAYS AS (ROUND((t_route_hm / 500)) * 500) STORED;
ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_calced_altMaxFacet DECIMAL UNSIGNED GENERATED ALWAYS AS (ROUND((t_ele_max / 500)) * 500) STORED;
ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_calced_distFacet DECIMAL(11, 1) UNSIGNED GENERATED ALWAYS AS (ROUND((t_route_m / 5)) * 5) STORED;
ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_calced_durFacet DECIMAL(11, 1) GENERATED ALWAYS AS (ROUND(ROUND(t_route_dauer * 2) / 2, 1)) STORED;
-- not supported ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_calced_dateonly VARCHAR(20) GENERATED  ALWAYS AS (DATE_FORMAT(t_datevon, GET_FORMAT(DATE, "ISO"))) STORED;
-- not supported ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_calced_week tinyint GENERATED  ALWAYS AS (WEEK(t_datevon)) STORED;
-- not supported ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_calced_month tinyint GENERATED  ALWAYS AS (MONTH(t_datevon)) STORED;
-- not supported ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_calced_year tinyint GENERATED  ALWAYS AS (YEAR(t_datevon)) STORED;

ALTER TABLE trip ADD COLUMN IF NOT EXISTS tr_calced_dur DECIMAL(11, 2) GENERATED ALWAYS AS (TIME_TO_SEC(TIMEDIFF(tr_datebis, tr_datevon)) / 3600) STORED;
ALTER TABLE trip ADD COLUMN IF NOT EXISTS tr_calced_durFacet DECIMAL(11, 1) GENERATED ALWAYS AS (ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(tr_datebis, tr_datevon)) / 3600 * 2) / 2, 1)) STORED;
-- not supported ALTER TABLE trip ADD COLUMN IF NOT EXISTS tr_calced_dateonly VARCHAR(20) GENERATED  ALWAYS AS (DATE_FORMAT(tr_datevon, GET_FORMAT(DATE, "ISO"))) STORED;
-- not supported ALTER TABLE trip ADD COLUMN IF NOT EXISTS tr_calced_week tinyint GENERATED  ALWAYS AS (WEEK(tr_datevon)) STORED;
-- not supported ALTER TABLE trip ADD COLUMN IF NOT EXISTS tr_calced_month tinyint GENERATED  ALWAYS AS (MONTH(tr_datevon)) STORED;
-- not supported ALTER TABLE trip ADD COLUMN IF NOT EXISTS tr_calced_year tinyint GENERATED  ALWAYS AS (YEAR(tr_datevon)) STORED;

ALTER TABLE video ADD COLUMN IF NOT EXISTS v_calced_altMaxFacet DECIMAL UNSIGNED GENERATED ALWAYS AS (ROUND((v_gps_ele / 500)) * 500) STORED;
-- not supported ALTER TABLE video ADD COLUMN IF NOT EXISTS v_calced_dateonly VARCHAR(20) GENERATED  ALWAYS AS (DATE_FORMAT(v_date, GET_FORMAT(DATE, "ISO"))) STORED;
-- not supported ALTER TABLE video ADD COLUMN IF NOT EXISTS v_calced_week tinyint GENERATED  ALWAYS AS (WEEK(v_date)) STORED;
-- not supported ALTER TABLE video ADD COLUMN IF NOT EXISTS v_calced_month tinyint GENERATED  ALWAYS AS (MONTH(v_date)) STORED;
-- not supported ALTER TABLE video ADD COLUMN IF NOT EXISTS v_calced_year tinyint GENERATED  ALWAYS AS (YEAR(v_date)) STORED;

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
# update-destination_view
############# */
CREATE OR REPLACE VIEW DESTINATION AS
SELECT tour.t_calced_d_id                                              AS d_id,
       tour.l_id,
       t_desc_gebiet AS d_desc_gebiet,
       t_desc_ziel AS d_desc_ziel,
       t_desc_ziel AS d_name,
       t_typ AS d_typ,
       min(t_datevon)                                                  AS d_datevon,
       max(t_datebis)                                                  AS d_datebis,
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
       CONCAT("DESTINATION", "_", t_calced_d_id)                       AS d_calced_id,
       t_calced_actiontype                                             AS d_calced_actiontype,
       min(t_calced_altAscFacet)                                       AS d_calced_altAscFacet,
       min(t_calced_altMaxFacet)                                       AS d_calced_altMaxFacet,
       min(t_calced_distFacet)                                         AS d_calced_distFacet,
       min(t_calced_durFacet)                                          AS d_calced_durFacet
FROM tour
         LEFT JOIN location ON tour.l_id = location.l_id
GROUP BY d_id;

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

