-----------------
--- system-tables
-----------------
DROP TABLE IF EXISTS appids;
CREATE TABLE appids (
  ai_table char(255)  NOT NULL DEFAULT '',
  ai_curid int(11) DEFAULT '0'
);

-----------------
--- configuration-tables
-----------------
DROP TABLE IF EXISTS keyword;
CREATE TABLE keyword (
  kw_id integer PRIMARY KEY,
  kw_meta_desc text,
  kw_name varchar(255)  DEFAULT NULL,
  kw_parent_id int(11) DEFAULT NULL,
  kw_name_pl varchar(255)  DEFAULT NULL,
  kw_name_aliases text,
  kw_name_alias text,
  CONSTRAINT keyword_ibfk_1 FOREIGN KEY (kw_parent_id) REFERENCES keyword (kw_id)
);

DROP TABLE IF EXISTS objects;
CREATE TABLE objects (
    O_ID int NOT NULL PRIMARY KEY,
    O_PICASA_KEY varchar(50) NOT NULL,
    O_NAME varchar(100) NULL,
    P_ID int NULL,
    O_KEY varchar(100) NULL,
    CONSTRAINT objects_O_KEY_pk UNIQUE (O_KEY)
);

DROP TABLE IF EXISTS person;
CREATE TABLE person (
  pn_id integer PRIMARY KEY,
  pn_comment text,
  pn_email_extern varchar(255)  DEFAULT NULL,
  pn_email_intern varchar(255)  DEFAULT NULL,
  pn_geb date DEFAULT NULL,
  pn_image varchar(255)  DEFAULT NULL,
  pn_name varchar(80)  DEFAULT NULL,
  pn_shortname varchar(80)  DEFAULT NULL,
  pn_vorname varchar(80)  DEFAULT NULL,
  pn_typ int(11) DEFAULT NULL,
  pn_first_ausflug date DEFAULT NULL,
  pn_last_ausflug date DEFAULT NULL,
  pn_url varchar(255)  DEFAULT NULL,
  pn_desc text,
  pn_flag_export int(11) DEFAULT NULL
);

DROP TABLE IF EXISTS playlist;
CREATE TABLE playlist (
  p_id integer PRIMARY KEY,
  p_meta_desc text,
  p_name varchar(255)  DEFAULT NULL
);

DROP TABLE IF EXISTS rates;
CREATE TABLE rates (
  r_id integer PRIMARY KEY,
  r_fieldname varchar(80)  DEFAULT NULL,
  r_fieldvalue int(11) DEFAULT NULL,
  r_grade varchar(80)  DEFAULT NULL,
  r_grade_desc varchar(80)  DEFAULT NULL
);

-----------------
--- news-data
-----------------
DROP TABLE IF EXISTS news;
CREATE TABLE news (
    n_id integer PRIMARY KEY,
    w_id int DEFAULT '0',
    n_date datetime DEFAULT NULL,
    n_message text DEFAULT NULL,
    n_headline varchar(255) DEFAULT NULL,
    n_datevon date DEFAULT NULL,
    n_datebis date DEFAULT NULL,
    n_message_md mediumtext DEFAULT NULL,
    n_message_html mediumtext DEFAULT NULL,
    n_keywords mediumtext DEFAULT NULL
);

-----------------
--- trip-data
-----------------
DROP TABLE IF EXISTS trip;
CREATE TABLE trip (
  tr_id integer PRIMARY KEY,
  i_id int(11) DEFAULT NULL,
  tr_datebis datetime DEFAULT NULL,
  tr_datevon datetime DEFAULT NULL,
  tr_geo_poly text,
  tr_katname_replace varchar(2000)  DEFAULT NULL,
  tr_l_ids varchar(2000)  DEFAULT NULL,
  tr_meta_desc text,
  tr_meta_shortdesc text,
  tr_name varchar(255)  DEFAULT NULL,
  tr_typ int(11) DEFAULT NULL,
  tr_url varchar(255)  DEFAULT NULL
);

-----------------
--- location-data
-----------------
DROP TABLE IF EXISTS location;
CREATE TABLE location (
  l_id integer PRIMARY KEY,
  l_meta_desc text,
  l_meta_shortdesc text,
  l_name varchar(255)  DEFAULT NULL,
  l_parent_id int(11) DEFAULT NULL,
  l_typ int(11) DEFAULT NULL,
  l_map_urlparams varchar(255)  DEFAULT NULL,
  l_url_homepage varchar(255)  DEFAULT NULL,
  l_url_intern varchar(255)  DEFAULT NULL,
  l_geo_poly text,
  l_geo_longdeg float DEFAULT NULL,
  l_geo_latdeg float DEFAULT NULL,
  l_geo_ele float DEFAULT NULL,
  l_gpstracks_gpx mediumtext,
  l_history mediumtext,
  l_historie mediumtext,
  l_geo_area mediumtext,
  CONSTRAINT location_ibfk_1 FOREIGN KEY (l_parent_id) REFERENCES location (l_id)
);

DROP TABLE IF EXISTS location_keyword;
CREATE TABLE location_keyword (
  lk_id integer PRIMARY KEY,
  l_id int(11) NOT NULL DEFAULT '0',
  kw_id int(11) NOT NULL DEFAULT '0',
  CONSTRAINT location_keyword_ibfk_1 FOREIGN KEY (l_id) REFERENCES location (l_id) ON DELETE CASCADE,
  CONSTRAINT location_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id) ON DELETE CASCADE
);

-----------------
--- tour-data
-----------------
DROP TABLE IF EXISTS tour;
CREATE TABLE tour (
  t_id integer PRIMARY KEY,
  l_id int(11) DEFAULT NULL,
  t_meta_desc text,
  t_meta_shortdesc text,
  t_name varchar(255)  DEFAULT NULL,
  t_datevon datetime DEFAULT NULL,
  t_datebis datetime DEFAULT NULL,
  t_gpstracks_txt mediumtext,
  t_geo_poly text,
  t_gpstracks_basefile char(255)  DEFAULT NULL,
  t_gpstracks_gpx mediumtext,
  t_gpstracks_jsgmap mediumtext,
  t_ref varchar(8)  DEFAULT NULL,
  t_desc_gebiet varchar(255)  DEFAULT NULL,
  t_desc_talort varchar(255)  DEFAULT NULL,
  t_desc_ziel varchar(255)  DEFAULT NULL,
  t_route_aufstieg_name varchar(255)  DEFAULT NULL,
  t_route_abstieg_name varchar(255)  DEFAULT NULL,
  t_ele_max double DEFAULT NULL,
  t_rate varchar(255)  DEFAULT NULL,
  t_rate_ks varchar(255)  DEFAULT NULL,
  t_rate_firn varchar(255)  DEFAULT NULL,
  t_rate_gletscher varchar(255)  DEFAULT NULL,
  t_rate_klettern varchar(255)  DEFAULT NULL,
  t_rate_bergtour varchar(255)  DEFAULT NULL,
  t_rate_schneeschuh varchar(255)  DEFAULT NULL,
  t_typ int(11) DEFAULT NULL,
  t_route_huette_name varchar(255)  DEFAULT NULL,
  t_route_huette_dauer double DEFAULT NULL,
  t_route_zustieg_dauer double DEFAULT NULL,
  t_route_zustieg_hm double DEFAULT NULL,
  t_route_zustieg_m double DEFAULT NULL,
  t_route_aufstieg_dauer double DEFAULT NULL,
  t_route_aufstieg_hm double DEFAULT NULL,
  t_route_aufstieg_km double DEFAULT NULL,
  t_route_aufstieg_sl double DEFAULT NULL,
  t_route_aufstieg_m double DEFAULT NULL,
  t_route_abstieg_dauer double DEFAULT NULL,
  t_route_abstieg_hm double DEFAULT NULL,
  t_route_abstieg_m double DEFAULT NULL,
  t_route_dauer double DEFAULT NULL,
  t_desc_gefahren text,
  t_desc_fuehrer text,
  t_done datetime DEFAULT NULL,
  t_rate_schwierigkeit int(11) DEFAULT '0',
  t_rate_ausdauer int(11) DEFAULT '0',
  t_rate_kraft int(11) DEFAULT '0',
  t_rate_mental int(11) DEFAULT '0',
  t_rate_bildung int(11) DEFAULT '0',
  t_rate_motive int(11) DEFAULT '0',
  t_rate_wichtigkeit int(11) DEFAULT '0',
  t_rate_gesamt int(11) DEFAULT '0',
  t_route_huette_hm double DEFAULT NULL,
  t_route_huette_m double DEFAULT NULL,
  t_route_hm double DEFAULT NULL,
  t_route_m double DEFAULT NULL,
  k_id int(11) DEFAULT NULL,
  t_idx_color int(11) DEFAULT NULL,
  t_history mediumtext,
  t_historie mediumtext,
  t_state_trackcomplete int(11) DEFAULT '0',
  t_state_trackquality int(11) DEFAULT '0',
  t_state_tracksrc int(11) DEFAULT '0',
  t_state_trackdata int(11) DEFAULT '0',
  t_state_rate int(11) DEFAULT '0',
  t_state_desc int(11) DEFAULT '0',
  t_state_all int(11) DEFAULT '0'
);

DROP TABLE IF EXISTS tour_keyword;
CREATE TABLE tour_keyword (
  tk_id integer PRIMARY KEY,
  t_id int(11) NOT NULL,
  kw_id int(11) NOT NULL,
  CONSTRAINT tour_keyword_ibfk_1 FOREIGN KEY (t_id) REFERENCES tour (t_id) ON DELETE CASCADE,
  CONSTRAINT tour_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS tourpoint;
CREATE TABLE tourpoint (
  tp_id integer PRIMARY KEY,
  t_id int(11) DEFAULT NULL,
  l_id int(11) DEFAULT NULL,
  tp_meta_desc text,
  tp_meta_shortdesc text,
  tp_name char(255)  DEFAULT NULL,
  tp_date datetime DEFAULT NULL,
  tp_lat float DEFAULT NULL,
  tp_lon float DEFAULT NULL,
  tp_ele float DEFAULT NULL,
  CONSTRAINT tourpoint_ibfk_1 FOREIGN KEY (t_id) REFERENCES tour (t_id) ON DELETE CASCADE,
  CONSTRAINT tourpoint_ibfk_2 FOREIGN KEY (l_id) REFERENCES location (l_id) ON DELETE CASCADE
);

-----------------
--- track-data
-----------------
DROP TABLE IF EXISTS kategorie;
CREATE TABLE kategorie (
  k_id integer PRIMARY KEY,
  parent_k_id int(11) DEFAULT NULL,
  k_extref varchar(255)  DEFAULT NULL,
  k_datebis datetime DEFAULT NULL,
  k_datevon datetime DEFAULT NULL,
  k_meta_desc text,
  k_meta_shortdesc text,
  k_name varchar(255)  DEFAULT NULL,
  t_id int(11) DEFAULT NULL,
  l_id int(11) DEFAULT NULL,
  k_distance float DEFAULT '0',
  k_altitude_min float DEFAULT '0',
  k_altitude_max float DEFAULT '0',
  k_altitude_asc float DEFAULT '0',
  k_altitude_desc float DEFAULT '0',
  k_type int(11) DEFAULT '0',
  k_rate_schwierigkeit int(11) DEFAULT '0',
  k_rate_ausdauer int(11) DEFAULT '0',
  k_rate_kraft int(11) DEFAULT '0',
  k_rate_mental int(11) DEFAULT '0',
  k_rate_bildung int(11) DEFAULT '0',
  k_rate_motive int(11) DEFAULT '0',
  k_rate_wichtigkeit int(11) DEFAULT '0',
  k_rate_gesamt int(11) DEFAULT '0',
  k_gpstracks_txt mediumtext,
  k_gpstracks_basefile char(255)  DEFAULT NULL,
  k_gpstracks_gpx mediumtext,
  k_gpstracks_gpx_source mediumtext,
  k_gpstracks_jsgmap mediumtext,
  old_t_id int(11) DEFAULT NULL,
  k_gesperrt int(11) DEFAULT '0',
  k_idx_color int(11) DEFAULT NULL,
  k_history mediumtext,
  k_historie mediumtext,
  k_state_trackcomplete int(11) DEFAULT '0',
  k_state_trackquality int(11) DEFAULT '0',
  k_state_tracksrc int(11) DEFAULT '0',
  k_state_trackdata int(11) DEFAULT '0',
  k_state_rate int(11) DEFAULT '0',
  k_state_desc int(11) DEFAULT '0',
  k_state_all int(11) DEFAULT '0',
  k_gpstracks_gpx_timecorrector int(11) DEFAULT '0',
  tr_id int(11) DEFAULT NULL,
  k_name_full char(255)  DEFAULT NULL
--- ,
---  CONSTRAINT kategorie_ibfk_1 FOREIGN KEY (T_ID) REFERENCES tour (T_ID),
---  CONSTRAINT kategorie_ibfk_2 FOREIGN KEY (L_ID) REFERENCES location (L_ID),
---  CONSTRAINT kategorie_ibfk_3 FOREIGN KEY (TR_ID) REFERENCES trip (TR_ID)
);

DROP TABLE IF EXISTS kategorie_keyword;
CREATE TABLE kategorie_keyword (
  kk_id integer PRIMARY KEY,
  k_id int(11) NOT NULL DEFAULT '0',
  kw_id int(11) NOT NULL DEFAULT '0',
  CONSTRAINT kategorie_keyword_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id) ON DELETE CASCADE,
  CONSTRAINT kategorie_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS kategorie_person;
CREATE TABLE kategorie_person (
  kpn_id integer PRIMARY KEY,
  k_id int(11) DEFAULT NULL,
  pn_id int(11) DEFAULT NULL,
  CONSTRAINT kategorie_person_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id) ON DELETE CASCADE,
  CONSTRAINT kategorie_person_ibfk_2 FOREIGN KEY (pn_id) REFERENCES person (pn_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS kategorie_tour;
CREATE TABLE kategorie_tour (
  kt_id integer PRIMARY KEY,
  k_id int(11) NOT NULL,
  t_id int(11) NOT NULL,
  kt_full int(11) DEFAULT '0',
  CONSTRAINT kategorie_tour_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id) ON DELETE CASCADE,
  CONSTRAINT kategorie_tour_ibfk_2 FOREIGN KEY (t_id) REFERENCES tour (t_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS kategorie_tourpoint;
CREATE TABLE kategorie_tourpoint (
  ktp_id integer PRIMARY KEY,
  k_id int(11) DEFAULT NULL,
  l_id int(11) DEFAULT NULL,
  ktp_meta_desc text,
  ktp_meta_shortdesc text,
  ktp_name char(255)  DEFAULT NULL,
  ktp_date datetime DEFAULT NULL,
  ktp_lat float DEFAULT NULL,
  ktp_lon float DEFAULT NULL,
  ktp_ele float DEFAULT NULL,
  CONSTRAINT kategorie_tourpoint_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id) ON DELETE CASCADE,
  CONSTRAINT kategorie_tourpoint_ibfk_2 FOREIGN KEY (l_id) REFERENCES location (l_id) ON DELETE CASCADE
);

-----------------
--- image-data
-----------------
DROP TABLE IF EXISTS image;
CREATE TABLE image (
  i_id integer PRIMARY KEY,
  k_id int(11) DEFAULT NULL,
  i_date datetime DEFAULT NULL,
  i_origpath varchar(255)  DEFAULT NULL,
  i_file varchar(255)  DEFAULT NULL,
  i_dir varchar(255)  DEFAULT NULL,
  i_meta_desc text,
  i_meta_name varchar(255)  DEFAULT NULL,
  i_meta_shortdesc varchar(255)  DEFAULT NULL,
  l_id int(11) DEFAULT NULL,
  i_gps_lat float DEFAULT NULL,
  i_gps_lon float DEFAULT NULL,
  i_gps_ele float DEFAULT NULL,
  i_rate int(11) DEFAULT '0',
  i_rate_motive int(11) DEFAULT '0',
  i_rate_wichtigkeit int(11) DEFAULT '0',
  i_indexed_date datetime DEFAULT NULL,
  i_history mediumtext,
  i_historie mediumtext,
  i_similar_i_ids longtext,
  i_gesperrt tinyint(4) DEFAULT '0',
  CONSTRAINT image_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id)
);

DROP TABLE IF EXISTS image_keyword;
CREATE TABLE image_keyword (
  ik_id integer PRIMARY KEY,
  i_id int(11) NOT NULL DEFAULT '0',
  kw_id int(11) NOT NULL DEFAULT '0',
  CONSTRAINT image_keyword_ibfk_1 FOREIGN KEY (i_id) REFERENCES image (i_id) ON DELETE CASCADE,
  CONSTRAINT image_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS image_object;
CREATE TABLE image_object (
  io_id integer PRIMARY KEY,
  i_id int(11) NOT NULL,
  io_img_width int(11) DEFAULT NULL,
  io_img_height int(11) DEFAULT NULL,
  io_obj_type char(255)  DEFAULT NULL,
  io_obj_x1 int(11) DEFAULT NULL,
  io_obj_y1 int(11) DEFAULT NULL,
  io_obj_x2 int(11) DEFAULT NULL,
  io_obj_y2 int(11) DEFAULT NULL,
  io_obj_centerx int(11) DEFAULT NULL,
  io_obj_centery int(11) DEFAULT NULL,
  io_obj_width int(11) DEFAULT NULL,
  io_obj_height int(11) DEFAULT NULL,
  io_status int(11) DEFAULT '0',
  CONSTRAINT image_object_ibfk_1 FOREIGN KEY (i_id) REFERENCES image (i_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS image_playlist;
CREATE TABLE image_playlist (
  ip_id integer PRIMARY KEY,
  i_id int(11) NOT NULL DEFAULT '0',
  p_id int(11) NOT NULL DEFAULT '0',
  ip_pos int(11) DEFAULT NULL,
  CONSTRAINT image_playlist_ibfk_1 FOREIGN KEY (i_id) REFERENCES image (i_id) ON DELETE CASCADE,
  CONSTRAINT image_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
);


-----------------
--- video-data
-----------------
DROP TABLE IF EXISTS video;
CREATE TABLE video (
  v_id integer PRIMARY KEY,
  k_id int(11) DEFAULT NULL,
  v_date datetime DEFAULT NULL,
  v_origpath varchar(255)  DEFAULT NULL,
  v_file varchar(255)  DEFAULT NULL,
  v_dir varchar(255)  DEFAULT NULL,
  v_meta_desc text,
  v_meta_name varchar(255)  DEFAULT NULL,
  v_meta_shortdesc varchar(255)  DEFAULT NULL,
  l_id int(11) DEFAULT NULL,
  v_gps_lat float DEFAULT NULL,
  v_gps_lon float DEFAULT NULL,
  v_gps_ele float DEFAULT NULL,
  v_rate int(11) DEFAULT '0',
  v_rate_motive int(11) DEFAULT '0',
  v_rate_wichtigkeit int(11) DEFAULT '0',
  v_indexed_date datetime DEFAULT NULL,
  v_history mediumtext,
  v_historie mediumtext,
  v_similar_v_ids longtext,
  v_gesperrt tinyint(4) DEFAULT '0',
  CONSTRAINT video_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id)
);

DROP TABLE IF EXISTS video_keyword;
CREATE TABLE video_keyword (
  vk_id integer PRIMARY KEY,
  v_id int(11) NOT NULL DEFAULT '0',
  kw_id int(11) NOT NULL DEFAULT '0',
  CONSTRAINT video_keyword_ibfk_1 FOREIGN KEY (v_id) REFERENCES video (v_id) ON DELETE CASCADE,
  CONSTRAINT video_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS video_object;
CREATE TABLE video_object (
  vo_id integer PRIMARY KEY,
  v_id int(11) NOT NULL,
  vo_img_width int(11) DEFAULT NULL,
  vo_img_height int(11) DEFAULT NULL,
  vo_obj_type char(255)  DEFAULT NULL,
  vo_obj_x1 int(11) DEFAULT NULL,
  vo_obj_y1 int(11) DEFAULT NULL,
  vo_obj_x2 int(11) DEFAULT NULL,
  vo_obj_y2 int(11) DEFAULT NULL,
  vo_obj_centerx int(11) DEFAULT NULL,
  vo_obj_centery int(11) DEFAULT NULL,
  vo_obj_width int(11) DEFAULT NULL,
  vo_obj_height int(11) DEFAULT NULL,
  vo_status int(11) DEFAULT '0',
  CONSTRAINT video_object_ibfk_1 FOREIGN KEY (v_id) REFERENCES video (v_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS video_playlist;
CREATE TABLE video_playlist (
  vp_id integer PRIMARY KEY,
  v_id int(11) NOT NULL DEFAULT '0',
  p_id int(11) NOT NULL DEFAULT '0',
  vp_pos int(11) DEFAULT NULL,
  CONSTRAINT video_playlist_ibfk_1 FOREIGN KEY (v_id) REFERENCES video (v_id) ON DELETE CASCADE,
  CONSTRAINT video_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
);

-----------------
--- info-data
-----------------
DROP TABLE IF EXISTS info;
CREATE TABLE info (
  if_id integer PRIMARY KEY,
  kw_id int(11) DEFAULT NULL,
  if_url varchar(255)  DEFAULT NULL,
  if_meta_desc text,
  if_meta_shortdesc varchar(255)  DEFAULT NULL,
  if_name varchar(255)  DEFAULT NULL,
  if_typ int(11) DEFAULT NULL,
  CONSTRAINT info_ibfk_1 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id)
);

DROP TABLE IF EXISTS info_keyword;
CREATE TABLE info_keyword (
  ifkw_id integer PRIMARY KEY,
  if_id int(11) NOT NULL DEFAULT '0',
  kw_id int(11) NOT NULL DEFAULT '0',
  CONSTRAINT info_keyword_ibfk_1 FOREIGN KEY (if_id) REFERENCES info (if_id) ON DELETE CASCADE,
  CONSTRAINT info_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id) ON DELETE CASCADE
);
