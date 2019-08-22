-- ------------------------------------
-- create model
-- ------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

--
-- system-tables
--
CREATE TABLE IF NOT EXISTS appids (
  ai_table char(255) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  ai_curid int(11) DEFAULT '0',
  PRIMARY KEY (ai_table),
  KEY idx_ai__ai_table (ai_table)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;


--
-- configuration-tables
--
CREATE TABLE IF NOT EXISTS keyword (
  kw_id int(11) NOT NULL AUTO_INCREMENT,
  kw_meta_desc text COLLATE latin1_general_ci,
  kw_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  kw_parent_id int(11) DEFAULT NULL,
  kw_name_pl varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  kw_name_aliases text COLLATE latin1_general_ci,
  kw_name_alias text COLLATE latin1_general_ci,
  PRIMARY KEY (kw_id),
  KEY idx_kw__kw_id (kw_id),
  KEY idx_kw__parent_kw_id (kw_parent_id),
  KEY idx_kw__kw_name (kw_name),
  KEY idx_kw__kw_name_pl (kw_name_pl),
  CONSTRAINT keyword_ibfk_1 FOREIGN KEY (kw_parent_id) REFERENCES keyword (kw_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS objects (
  o_id int(11) NOT NULL,
  o_picasa_key varchar(50) COLLATE latin1_general_ci NOT NULL,
  o_name varchar(100) COLLATE latin1_general_ci DEFAULT NULL,
  p_id int(11) DEFAULT NULL,
  o_key varchar(100) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (o_id),
  UNIQUE KEY objects_o_key_pk (o_key)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS person (
  pn_id int(11) NOT NULL AUTO_INCREMENT,
  pn_comment text COLLATE latin1_general_ci,
  pn_email_extern varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  pn_email_intern varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  pn_geb date DEFAULT NULL,
  pn_image varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  pn_name varchar(80) COLLATE latin1_general_ci DEFAULT NULL,
  pn_shortname varchar(80) COLLATE latin1_general_ci DEFAULT NULL,
  pn_vorname varchar(80) COLLATE latin1_general_ci DEFAULT NULL,
  pn_typ int(11) DEFAULT NULL,
  pn_first_ausflug date DEFAULT NULL,
  pn_last_ausflug date DEFAULT NULL,
  pn_url varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  pn_desc text COLLATE latin1_general_ci,
  pn_flag_export int(11) DEFAULT NULL,
  PRIMARY KEY (pn_id),
  KEY idx_pn__pn_id (pn_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS playlist (
  p_id int(11) NOT NULL AUTO_INCREMENT,
  p_meta_desc text COLLATE latin1_general_ci,
  p_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (p_id),
  KEY idx_p__p_id (p_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS rates (
  r_id int(11) NOT NULL,
  r_fieldname varchar(80) COLLATE latin1_general_ci DEFAULT NULL,
  r_fieldvalue int(11) DEFAULT NULL,
  r_grade varchar(80) COLLATE latin1_general_ci DEFAULT NULL,
  r_grade_desc varchar(80) COLLATE latin1_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;


--
-- news-data
--
CREATE TABLE IF NOT EXISTS news (
  n_id int(11) NOT NULL AUTO_INCREMENT,
  w_id int(11) NOT NULL DEFAULT '0',
  n_date datetime DEFAULT NULL,
  n_message text,
  n_headline varchar(255) DEFAULT NULL,
  n_datevon date DEFAULT NULL,
  n_datebis date DEFAULT NULL,
  n_message_md text,
  n_message_html text,
  n_keywords text,
  PRIMARY KEY (n_id),
  KEY idx_n__n_id (n_id),
  KEY idx_n__w_id (w_id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- trip-data
--
CREATE TABLE IF NOT EXISTS trip (
  tr_id int(11) NOT NULL AUTO_INCREMENT,
  i_id int(11) DEFAULT NULL,
  tr_datebis datetime DEFAULT NULL,
  tr_datevon datetime DEFAULT NULL,
  tr_geo_poly text COLLATE latin1_general_ci,
  tr_katname_replace varchar(2000) COLLATE latin1_general_ci DEFAULT NULL,
  tr_l_ids varchar(2000) COLLATE latin1_general_ci DEFAULT NULL,
  tr_meta_desc text COLLATE latin1_general_ci,
  tr_meta_shortdesc text COLLATE latin1_general_ci,
  tr_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  tr_typ int(11) DEFAULT NULL,
  tr_url varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (tr_id),
  KEY idx_tr__tr_id (tr_id),
  KEY idx_tr__i_id (i_id),
  CONSTRAINT trip_ibfk_1 FOREIGN KEY (i_id) REFERENCES image (i_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;


--
-- location-data
--
CREATE TABLE IF NOT EXISTS location (
  l_id int(11) NOT NULL AUTO_INCREMENT,
  l_meta_desc text COLLATE latin1_general_ci,
  l_meta_shortdesc text COLLATE latin1_general_ci,
  l_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  l_parent_id int(11) DEFAULT NULL,
  l_typ int(11) DEFAULT NULL,
  l_map_urlparams varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  l_url_homepage varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  l_url_intern varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  l_geo_poly text COLLATE latin1_general_ci,
  m_id int(11) DEFAULT NULL,
  l_geo_longdeg float DEFAULT NULL,
  l_geo_latdeg float DEFAULT NULL,
  l_geo_ele float DEFAULT NULL,
  l_gpstracks_gpx mediumtext COLLATE latin1_general_ci,
  l_history mediumtext COLLATE latin1_general_ci,
  l_historie mediumtext COLLATE latin1_general_ci,
  l_geo_area mediumtext COLLATE latin1_general_ci,
  PRIMARY KEY (l_id),
  KEY idx_l__l_id (l_id),
  KEY idx_l__parent_l_id (l_parent_id),
  KEY idx_l__m_id (m_id),
  CONSTRAINT location_ibfk_1 FOREIGN KEY (l_parent_id) REFERENCES location (l_id),
  CONSTRAINT location_ibfk_2 FOREIGN KEY (m_id) REFERENCES map (m_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS location_keyword (
  lk_id int(11) NOT NULL AUTO_INCREMENT,
  l_id int(11) NOT NULL DEFAULT '0',
  kw_id int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (lk_id),
  KEY idx_lk__lk_id (lk_id),
  KEY idx_lk__l_id (l_id),
  KEY idx_lk__kw_id (kw_id),
  CONSTRAINT location_keyword_ibfk_1 FOREIGN KEY (l_id) REFERENCES location (l_id) ON DELETE CASCADE,
  CONSTRAINT location_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;


--
-- tour-data
--
CREATE TABLE IF NOT EXISTS tour (
  t_id int(11) NOT NULL AUTO_INCREMENT,
  l_id int(11),
  t_meta_desc text COLLATE latin1_general_ci,
  t_meta_shortdesc text COLLATE latin1_general_ci,
  t_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_datevon datetime DEFAULT NULL,
  t_datebis datetime DEFAULT NULL,
  t_gpstracks_txt mediumtext COLLATE latin1_general_ci,
  t_geo_poly text COLLATE latin1_general_ci,
  t_gpstracks_basefile char(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_gpstracks_gpx mediumtext COLLATE latin1_general_ci,
  t_gpstracks_jsgmap mediumtext COLLATE latin1_general_ci,
  t_ref varchar(8) COLLATE latin1_general_ci DEFAULT NULL,
  t_desc_gebiet varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_desc_talort varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_desc_ziel varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_route_aufstieg_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_route_abstieg_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_ele_max double DEFAULT NULL,
  t_rate varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_rate_ks varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_rate_firn varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_rate_gletscher varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_rate_klettern varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_rate_bergtour varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_rate_schneeschuh varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_typ int(11) DEFAULT NULL,
  t_route_huette_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
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
  t_desc_gefahren text COLLATE latin1_general_ci,
  t_desc_fuehrer text COLLATE latin1_general_ci,
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
  t_history mediumtext COLLATE latin1_general_ci,
  t_historie mediumtext COLLATE latin1_general_ci,
  t_state_trackcomplete int(11) DEFAULT '0',
  t_state_trackquality int(11) DEFAULT '0',
  t_state_tracksrc int(11) DEFAULT '0',
  t_state_trackdata int(11) DEFAULT '0',
  t_state_rate int(11) DEFAULT '0',
  t_state_desc int(11) DEFAULT '0',
  t_state_all int(11) DEFAULT '0',
  PRIMARY KEY (t_id),
  KEY idx_t__t_id (t_id),
  KEY idx_t__l_id (l_id),
  KEY k_id (k_id),
  CONSTRAINT tour_ibfk_1 FOREIGN KEY (l_id) REFERENCES location (l_id),
  CONSTRAINT tour_ibfk_2 FOREIGN KEY (k_id) REFERENCES kategorie (k_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS tour_keyword (
  tk_id int(11) NOT NULL AUTO_INCREMENT,
  t_id int(11) NOT NULL,
  kw_id int(11) NOT NULL,
  PRIMARY KEY (tk_id),
  KEY idx_tk__tk_id (tk_id),
  KEY idx_tk__t_id (t_id),
  KEY idx_tk__kw_id (kw_id),
  CONSTRAINT tour_keyword_ibfk_1 FOREIGN KEY (t_id) REFERENCES tour (t_id) ON DELETE CASCADE,
  CONSTRAINT tour_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS tourpoint (
  tp_id int(11) NOT NULL AUTO_INCREMENT,
  t_id int(11) DEFAULT NULL,
  l_id int(11) NOT NULL DEFAULT '1',
  tp_meta_desc text COLLATE latin1_general_ci,
  tp_meta_shortdesc text COLLATE latin1_general_ci,
  tp_name char(255) COLLATE latin1_general_ci DEFAULT NULL,
  tp_date datetime DEFAULT NULL,
  tp_lat float DEFAULT NULL,
  tp_lon float DEFAULT NULL,
  tp_ele float DEFAULT NULL,
  PRIMARY KEY (tp_id),
  KEY idx_tp__tp_id (tp_id),
  KEY idx_tp__t_id (t_id),
  KEY idx_tp__l_id (l_id),
  CONSTRAINT tourpoint_ibfk_1 FOREIGN KEY (t_id) REFERENCES tour (t_id) ON DELETE CASCADE,
  CONSTRAINT tourpoint_ibfk_2 FOREIGN KEY (l_id) REFERENCES location (l_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- track-data
--
CREATE TABLE IF NOT EXISTS kategorie (
  k_id int(11) NOT NULL AUTO_INCREMENT,
  parent_k_id int(11) DEFAULT NULL,
  k_extref varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  k_datebis datetime DEFAULT NULL,
  k_datevon datetime DEFAULT NULL,
  k_meta_desc text COLLATE latin1_general_ci,
  k_meta_shortdesc text COLLATE latin1_general_ci,
  k_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_id int(11),
  l_id int(11),
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
  k_gpstracks_txt mediumtext COLLATE latin1_general_ci,
  k_gpstracks_basefile char(255) COLLATE latin1_general_ci DEFAULT NULL,
  k_gpstracks_gpx mediumtext COLLATE latin1_general_ci,
  k_gpstracks_gpx_source mediumtext COLLATE latin1_general_ci,
  k_gpstracks_jsgmap mediumtext COLLATE latin1_general_ci,
  old_t_id int(11) DEFAULT NULL,
  k_gesperrt int(11) DEFAULT '0',
  k_idx_color int(11) DEFAULT NULL,
  k_history mediumtext COLLATE latin1_general_ci,
  k_historie mediumtext COLLATE latin1_general_ci,
  k_state_trackcomplete int(11) DEFAULT '0',
  k_state_trackquality int(11) DEFAULT '0',
  k_state_tracksrc int(11) DEFAULT '0',
  k_state_trackdata int(11) DEFAULT '0',
  k_state_rate int(11) DEFAULT '0',
  k_state_desc int(11) DEFAULT '0',
  k_state_all int(11) DEFAULT '0',
  k_gpstracks_gpx_timecorrector int(11) DEFAULT '0',
  tr_id int(11) DEFAULT NULL,
  k_name_full char(255) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (k_id),
  KEY idx_k__k_id (k_id),
  KEY idx_k__parent_k_id (parent_k_id),
  KEY idx_k__t_id (t_id),
  KEY idx_k__l_id (l_id),
  KEY idx_i__k_datebis (k_datebis),
  KEY idx_i__k_datevon (k_datevon),
  KEY idx_k__tr_id (tr_id),
  CONSTRAINT kategorie_ibfk_1 FOREIGN KEY (t_id) REFERENCES tour (t_id),
  CONSTRAINT kategorie_ibfk_2 FOREIGN KEY (l_id) REFERENCES location (l_id),
  CONSTRAINT kategorie_ibfk_3 FOREIGN KEY (tr_id) REFERENCES trip (tr_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS kategorie_keyword (
  kk_id int(11) NOT NULL AUTO_INCREMENT,
  k_id int(11) NOT NULL DEFAULT '0',
  kw_id int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (kk_id),
  KEY idx_kk__kk_id (kk_id),
  KEY idx_kk__k_id (k_id),
  KEY idx_kk__kw_id (kw_id),
  CONSTRAINT kategorie_keyword_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id) ON DELETE CASCADE,
  CONSTRAINT kategorie_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS kategorie_person (
  kpn_id int(11) NOT NULL AUTO_INCREMENT,
  k_id int(11) DEFAULT NULL,
  pn_id int(11) DEFAULT NULL,
  PRIMARY KEY (kpn_id),
  KEY idx_kpn__kpn_id (kpn_id),
  KEY idx_kpn__k_id (k_id),
  KEY idx_kpn__pn_id (pn_id),
  CONSTRAINT kategorie_person_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id) ON DELETE CASCADE,
  CONSTRAINT kategorie_person_ibfk_2 FOREIGN KEY (pn_id) REFERENCES person (pn_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS kategorie_tour (
  kt_id int(11) NOT NULL AUTO_INCREMENT,
  k_id int(11) NOT NULL,
  t_id int(11) NOT NULL,
  kt_full int(11) DEFAULT '0',
  PRIMARY KEY (kt_id),
  KEY idx_kt__kt_id (kt_id),
  KEY idx_kt__k_id (k_id),
  KEY idx_kt__t_id (t_id),
  CONSTRAINT kategorie_tour_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id) ON DELETE CASCADE,
  CONSTRAINT kategorie_tour_ibfk_2 FOREIGN KEY (t_id) REFERENCES tour (t_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS kategorie_tourpoint (
  ktp_id int(11) NOT NULL AUTO_INCREMENT,
  k_id int(11) DEFAULT NULL,
  l_id int(11) NOT NULL DEFAULT '1',
  ktp_meta_desc text COLLATE latin1_general_ci,
  ktp_meta_shortdesc text COLLATE latin1_general_ci,
  ktp_name char(255) COLLATE latin1_general_ci DEFAULT NULL,
  ktp_date datetime DEFAULT NULL,
  ktp_lat float DEFAULT NULL,
  ktp_lon float DEFAULT NULL,
  ktp_ele float DEFAULT NULL,
  PRIMARY KEY (ktp_id),
  KEY idx_ktp__ktp_id (ktp_id),
  KEY idx_ktp__k_id (k_id),
  KEY idx_ktp__l_id (l_id),
  KEY idx_ktp__ktp_date (ktp_date),
  CONSTRAINT kategorie_tourpoint_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id) ON DELETE CASCADE,
  CONSTRAINT kategorie_tourpoint_ibfk_2 FOREIGN KEY (l_id) REFERENCES location (l_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- image-data
--
CREATE TABLE IF NOT EXISTS image (
  i_id int(11) NOT NULL AUTO_INCREMENT,
  k_id int(11),
  i_date datetime DEFAULT NULL,
  i_origpath varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  i_file varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  i_dir varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  i_meta_desc text COLLATE latin1_general_ci,
  i_meta_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  i_meta_shortdesc varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  l_id int(11),
  i_gps_lat float DEFAULT NULL,
  i_gps_lon float DEFAULT NULL,
  i_gps_ele float DEFAULT NULL,
  i_rate int(11) DEFAULT '0',
  i_rate_motive int(11) DEFAULT '0',
  i_rate_wichtigkeit int(11) DEFAULT '0',
  i_indexed_date datetime DEFAULT NULL,
  i_history mediumtext COLLATE latin1_general_ci,
  i_historie mediumtext COLLATE latin1_general_ci,
  i_similar_i_ids longtext COLLATE latin1_general_ci,
  i_gesperrt tinyint(4) DEFAULT '0',
  PRIMARY KEY (i_id),
  KEY idx_i__i_id (i_id),
  KEY idx_i__k_id (k_id),
  KEY idx_i__l_id (l_id),
  KEY idx_i__i_date (i_date),
  KEY idx_i__i_gps_ele (i_gps_ele),
  KEY idx_i__i_gps_lon (i_gps_lon),
  KEY idx_i__i_gps_lat (i_gps_lat),
  CONSTRAINT image_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id),
  CONSTRAINT image_ibfk_2 FOREIGN KEY (l_id) REFERENCES location (l_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS image_keyword (
  ik_id int(11) NOT NULL AUTO_INCREMENT,
  i_id int(11) NOT NULL DEFAULT '0',
  kw_id int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (ik_id),
  KEY idx_ik__ik_id (ik_id),
  KEY idx_ik__i_id (i_id),
  KEY idx_ik__kw_id (kw_id),
  CONSTRAINT image_keyword_ibfk_1 FOREIGN KEY (i_id) REFERENCES image (i_id) ON DELETE CASCADE,
  CONSTRAINT image_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS image_object (
  io_id int(11) NOT NULL AUTO_INCREMENT,
  i_id int(11) NOT NULL,
  io_img_width int(11) DEFAULT NULL,
  io_img_height int(11) DEFAULT NULL,
  io_obj_type char(255) COLLATE latin1_general_ci DEFAULT NULL,
  io_obj_x1 int(11) DEFAULT NULL,
  io_obj_y1 int(11) DEFAULT NULL,
  io_obj_x2 int(11) DEFAULT NULL,
  io_obj_y2 int(11) DEFAULT NULL,
  io_obj_centerx int(11) DEFAULT NULL,
  io_obj_centery int(11) DEFAULT NULL,
  io_obj_width int(11) DEFAULT NULL,
  io_obj_height int(11) DEFAULT NULL,
  io_status int(11) DEFAULT '0',
  PRIMARY KEY (io_id),
  KEY idx_io__io_id (io_id),
  KEY idx_io__i_id (i_id),
  KEY io_obj_type (io_obj_type),
  CONSTRAINT image_object_ibfk_1 FOREIGN KEY (i_id) REFERENCES image (i_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS image_playlist (
  ip_id int(11) NOT NULL AUTO_INCREMENT,
  i_id int(11) NOT NULL DEFAULT '0',
  p_id int(11) NOT NULL DEFAULT '0',
  ip_pos int(11) DEFAULT NULL,
  PRIMARY KEY (ip_id),
  KEY idx_ip__ip_id (ip_id),
  KEY idx_ip__i_id (i_id),
  KEY idx_ik__p_id (p_id),
  CONSTRAINT image_playlist_ibfk_1 FOREIGN KEY (i_id) REFERENCES image (i_id) ON DELETE CASCADE,
  CONSTRAINT image_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- video-data
--
CREATE TABLE IF NOT EXISTS video (
  v_id int(11) NOT NULL AUTO_INCREMENT,
  k_id int(11),
  v_date datetime DEFAULT NULL,
  v_origpath varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  v_file varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  v_dir varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  v_meta_desc text COLLATE latin1_general_ci,
  v_meta_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  v_meta_shortdesc varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  l_id int(11),
  v_gps_lat float DEFAULT NULL,
  v_gps_lon float DEFAULT NULL,
  v_gps_ele float DEFAULT NULL,
  v_rate int(11) DEFAULT '0',
  v_rate_motive int(11) DEFAULT '0',
  v_rate_wichtigkeit int(11) DEFAULT '0',
  v_indexed_date datetime DEFAULT NULL,
  v_history mediumtext COLLATE latin1_general_ci,
  v_historie mediumtext COLLATE latin1_general_ci,
  v_similar_v_ids longtext COLLATE latin1_general_ci,
  v_gesperrt tinyint(4) DEFAULT '0',
  PRIMARY KEY (v_id),
  KEY idx_v__v_id (v_id),
  KEY idx_v__k_id (k_id),
  KEY idx_v__l_id (l_id),
  KEY idx_v__v_date (v_date),
  KEY idx_v__v_gps_ele (v_gps_ele),
  KEY idx_v__v_gps_lon (v_gps_lon),
  KEY idx_v__v_gps_lat (v_gps_lat),
  CONSTRAINT video_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id),
  CONSTRAINT video_ibfk_2 FOREIGN KEY (l_id) REFERENCES location (l_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS video_keyword (
  vk_id int(11) NOT NULL AUTO_INCREMENT,
  v_id int(11) NOT NULL DEFAULT '0',
  kw_id int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (vk_id),
  KEY idx_vk__vk_id (vk_id),
  KEY idx_vk__v_id (v_id),
  KEY idx_vk__kw_id (kw_id),
  CONSTRAINT video_keyword_ibfk_1 FOREIGN KEY (v_id) REFERENCES video (v_id) ON DELETE CASCADE,
  CONSTRAINT video_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS video_object (
  vo_id int(11) NOT NULL AUTO_INCREMENT,
  v_id int(11) NOT NULL,
  vo_img_width int(11) DEFAULT NULL,
  vo_img_height int(11) DEFAULT NULL,
  vo_obj_type char(255) COLLATE latin1_general_ci DEFAULT NULL,
  vo_obj_x1 int(11) DEFAULT NULL,
  vo_obj_y1 int(11) DEFAULT NULL,
  vo_obj_x2 int(11) DEFAULT NULL,
  vo_obj_y2 int(11) DEFAULT NULL,
  vo_obj_centerx int(11) DEFAULT NULL,
  vo_obj_centery int(11) DEFAULT NULL,
  vo_obj_width int(11) DEFAULT NULL,
  vo_obj_height int(11) DEFAULT NULL,
  vo_status int(11) DEFAULT '0',
  PRIMARY KEY (vo_id),
  KEY idx_vo__vo_id (vo_id),
  KEY idx_vo__v_id (v_id),
  KEY vo_obj_type (vo_obj_type),
  CONSTRAINT video_object_ibfk_1 FOREIGN KEY (v_id) REFERENCES video (v_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS video_playlist (
  vp_id int(11) NOT NULL AUTO_INCREMENT,
  v_id int(11) NOT NULL DEFAULT '0',
  p_id int(11) NOT NULL DEFAULT '0',
  vp_pos int(11) DEFAULT NULL,
  PRIMARY KEY (vp_id),
  KEY idx_vp__vp_id (vp_id),
  KEY idx_vp__v_id (v_id),
  KEY idx_vk__p_id (p_id),
  CONSTRAINT video_playlist_ibfk_1 FOREIGN KEY (v_id) REFERENCES video (v_id) ON DELETE CASCADE,
  CONSTRAINT video_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- info-data
--
CREATE TABLE IF NOT EXISTS info (
  if_id int(11) NOT NULL AUTO_INCREMENT,
  kw_id int(11) DEFAULT NULL,
  if_url varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  if_meta_desc text COLLATE latin1_general_ci,
  if_meta_shortdesc varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  if_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  if_typ int(11) DEFAULT NULL,
  PRIMARY KEY (if_id),
  KEY idx_if__if_id (if_id),
  KEY idx_if__kw_id (kw_id),
  CONSTRAINT info_ibfk_1 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS info_keyword (
  ifkw_id int(11) NOT NULL AUTO_INCREMENT,
  if_id int(11) NOT NULL DEFAULT '0',
  kw_id int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (ifkw_id),
  KEY idx_ifkw__ifkw_id (ifkw_id),
  KEY idx_ifkw__if_id (if_id),
  KEY idx_ifkw__kw_id (kw_id),
  CONSTRAINT info_keyword_ibfk_1 FOREIGN KEY (if_id) REFERENCES info (if_id) ON DELETE CASCADE,
  CONSTRAINT info_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

SET FOREIGN_KEY_CHECKS = 1;
