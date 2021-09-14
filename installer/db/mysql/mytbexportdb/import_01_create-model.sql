-- ------------------------------------
-- create model
-- ------------------------------------

--
-- a helper table of about 4k consecutive ints
--
DROP TABLE IF EXISTS numbers;
CREATE TABLE numbers (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    thing int null
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

insert numbers (thing) values (null),(null),(null),(null),(null),(null),(null),(null),(null);
insert numbers (thing) select thing from numbers;
insert numbers (thing) select thing from numbers;
insert numbers (thing) select thing from numbers;
insert numbers (thing) select thing from numbers;
insert numbers (thing) select thing from numbers;
insert numbers (thing) select thing from numbers;
insert numbers (thing) select thing from numbers;
insert numbers (thing) select thing from numbers;
insert numbers (thing) select thing from numbers;

--
-- configuration-tables
--
DROP TABLE IF EXISTS rates;
CREATE TABLE rates (
  r_id int(11) NOT NULL,
  r_fieldname varchar(80) COLLATE latin1_general_ci DEFAULT NULL,
  r_fieldvalue int(11) DEFAULT NULL,
  r_grade varchar(80) COLLATE latin1_general_ci DEFAULT NULL,
  r_grade_desc varchar(80) COLLATE latin1_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- news-data
--
DROP TABLE IF EXISTS news;
CREATE TABLE news (
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
  n_persons text,
  n_objects text,
  n_gesperrt int(2) DEFAULT 1,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countTrips int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0,
  PRIMARY KEY (n_id),
  KEY idx_n__n_id (n_id),
  KEY idx_n__w_id (w_id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- info-data
--
DROP TABLE IF EXISTS info;
CREATE TABLE IF NOT EXISTS info (
  if_id int(11) NOT NULL AUTO_INCREMENT,
  l_id int(11) DEFAULT null,
  kw_id int(11) DEFAULT NULL,
  countRoutes int(11) DEFAULT 0,
  countLocations int(11) DEFAULT 0,
  if_gesperrt int(2) DEFAULT 1,
  if_keywords text COLLATE latin1_general_ci,
  if_meta_desc text COLLATE latin1_general_ci,
  if_meta_shortdesc varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  if_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  if_publisher varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  if_typ int(11) DEFAULT NULL,
  if_url varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (if_id),
  KEY idx_if__if_id (if_id),
  KEY idx_if__kw_id (kw_id),
  KEY idx_if__l_id (l_id),
  KEY idx_if__if_gesperrt (if_gesperrt)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- trip-data
--
DROP TABLE IF EXISTS trip;
CREATE TABLE trip (
  tr_id int(11) NOT NULL AUTO_INCREMENT,
  i_id int(11) DEFAULT NULL,
  l_id int(11) DEFAULT NULL,
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
  tr_meta_shortdesc_md text COLLATE latin1_general_ci,
  tr_meta_shortdesc_html text COLLATE latin1_general_ci,
  tr_keywords text COLLATE latin1_general_ci,
  tr_persons text COLLATE latin1_general_ci,
  tr_objects text COLLATE latin1_general_ci,
  tr_dateshow date DEFAULT NULL,
  tr_gesperrt int(2) DEFAULT 1,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0,
  PRIMARY KEY (tr_id),
  KEY idx_tr__tr_id (tr_id),
  KEY idx_tr__l_id (l_id),
  KEY idx_tr__i_id (i_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- location-data
--
DROP TABLE IF EXISTS location;
CREATE TABLE location (
  l_id int(11) DEFAULT NULL,
  l_lochirarchie text COLLATE latin1_general_ci,
  l_lochirarchieids text COLLATE latin1_general_ci,
  l_lochirarchietxt text COLLATE latin1_general_ci,
  l_meta_shortdesc text COLLATE latin1_general_ci,
  l_name char(255) COLLATE latin1_general_ci DEFAULT NULL,
  l_url_homepage varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  l_html mediumtext COLLATE latin1_general_ci,
  l_parent_id int(11) DEFAULT NULL,
  l_gps_lat float DEFAULT NULL,
  l_gps_lon float DEFAULT NULL,
  l_geo_area text COLLATE latin1_general_ci,
  l_typ int(11) DEFAULT NULL,
  l_katids text COLLATE latin1_general_ci,
  l_tids text COLLATE latin1_general_ci,
  l_dids text COLLATE latin1_general_ci,
  l_meta_shortdesc_md text COLLATE latin1_general_ci,
  l_meta_shortdesc_html text COLLATE latin1_general_ci,
  l_keywords text COLLATE latin1_general_ci,
  l_persons text COLLATE latin1_general_ci,
  l_objects text COLLATE latin1_general_ci,
  l_gesperrt int(2) DEFAULT 1,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countInfos int(11) DEFAULT 0,
  countNews int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countTrips int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0,
  KEY l_id (l_id),
  KEY l_gps_lat (l_gps_lat),
  KEY l_gps_lon (l_gps_lon)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

DROP TABLE IF EXISTS location_info;
CREATE TABLE IF NOT EXISTS location_info (
  lif_id int(11) NOT NULL AUTO_INCREMENT,
  if_id int(11) NOT NULL,
  l_id int(11) NOT NULL,
  lif_linked_details varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (lif_id),
  KEY idx_lif__lif_id (lif_id),
  KEY idx_lif__if_id (if_id),
  KEY idx_lif__l_id (l_id)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- destination-data
--
DROP TABLE IF EXISTS destination;
CREATE TABLE destination (
  d_id VARCHAR(80),
  l_id int(11),
  d_k_ids varchar(2000) COLLATE latin1_general_ci DEFAULT NULL,
  d_t_ids varchar(2000) COLLATE latin1_general_ci DEFAULT NULL,
  d_datevon date DEFAULT NULL,
  d_name char(255) COLLATE latin1_general_ci DEFAULT NULL,
  d_desc_gebiet varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  d_desc_ziel varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  d_keywords text COLLATE latin1_general_ci,
  d_persons text COLLATE latin1_general_ci,
  d_objects text COLLATE latin1_general_ci,
  d_ele_max double DEFAULT NULL,
  d_gps_lat float DEFAULT NULL,
  d_gps_lon float DEFAULT NULL,
  d_html_list mediumtext COLLATE latin1_general_ci,
  d_rate varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  d_rate_ks varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  d_rate_firn varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  d_rate_gletscher varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  d_rate_klettern varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  d_rate_bergtour varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  d_rate_schneeschuh varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  d_rate_ausdauer int(11) DEFAULT '0',
  d_rate_bildung int(11) DEFAULT '0',
  d_rate_gesamt int(11) DEFAULT '0',
  d_rate_kraft int(11) DEFAULT '0',
  d_rate_mental int(11) DEFAULT '0',
  d_rate_motive int(11) DEFAULT '0',
  d_rate_schwierigkeit int(11) DEFAULT '0',
  d_rate_wichtigkeit int(11) DEFAULT '0',
  d_route_dauer double DEFAULT NULL,
  d_route_hm double DEFAULT NULL,
  d_route_m double DEFAULT NULL,
  d_typ int(11) DEFAULT NULL,
  d_dateshow date DEFAULT NULL,
  d_gesperrt int(2) DEFAULT 1,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countInfos int(11) DEFAULT 0,
  countNews int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countTrips int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0,
  PRIMARY KEY (d_id),
  KEY idx_d__d_id (d_id),
  KEY idx_d__l_id (l_id),
  KEY d_gps_lat (d_gps_lat),
  KEY d_gps_lon (d_gps_lon)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- tour-data
--
DROP TABLE IF EXISTS tour;
CREATE TABLE tour (
  t_id int(11) NOT NULL AUTO_INCREMENT,
  l_id int(11),
  k_id int(11) DEFAULT NULL,
  d_id VARCHAR(80),
  t_k_ids varchar(2000) COLLATE latin1_general_ci DEFAULT NULL,
  t_datevon date DEFAULT NULL,
  t_name char(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_desc_gefahren text COLLATE latin1_general_ci,
  t_desc_fuehrer text COLLATE latin1_general_ci,
  t_desc_fuehrer_full text COLLATE latin1_general_ci,
  t_desc_gebiet varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_desc_talort varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_desc_ziel varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_meta_shortdesc mediumtext COLLATE latin1_general_ci,
  t_keywords text COLLATE latin1_general_ci,
  t_persons text COLLATE latin1_general_ci,
  t_objects text COLLATE latin1_general_ci,
  t_ele_max double DEFAULT NULL,
  t_gps_lat float DEFAULT NULL,
  t_gps_lon float DEFAULT NULL,
  t_gpstracks_basefile char(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_html_list mediumtext COLLATE latin1_general_ci,
  t_rate varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_rate_ks varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_rate_firn varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_rate_gletscher varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_rate_klettern varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_rate_bergtour varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_rate_schneeschuh varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_rate_ausdauer int(11) DEFAULT '0',
  t_rate_bildung int(11) DEFAULT '0',
  t_rate_gesamt int(11) DEFAULT '0',
  t_rate_kraft int(11) DEFAULT '0',
  t_rate_mental int(11) DEFAULT '0',
  t_rate_motive int(11) DEFAULT '0',
  t_rate_schwierigkeit int(11) DEFAULT '0',
  t_rate_wichtigkeit int(11) DEFAULT '0',
  t_route_aufstieg_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_route_aufstieg_dauer double DEFAULT NULL,
  t_route_aufstieg_hm double DEFAULT NULL,
  t_route_aufstieg_km double DEFAULT NULL,
  t_route_aufstieg_sl double DEFAULT NULL,
  t_route_aufstieg_m double DEFAULT NULL,
  t_route_abstieg_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_route_abstieg_dauer double DEFAULT NULL,
  t_route_abstieg_hm double DEFAULT NULL,
  t_route_abstieg_m double DEFAULT NULL,
  t_route_huette_name varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  t_route_huette_dauer double DEFAULT NULL,
  t_route_huette_hm double DEFAULT NULL,
  t_route_huette_m double DEFAULT NULL,
  t_route_zustieg_dauer double DEFAULT NULL,
  t_route_zustieg_hm double DEFAULT NULL,
  t_route_zustieg_m double DEFAULT NULL,
  t_route_dauer double DEFAULT NULL,
  t_route_hm double DEFAULT NULL,
  t_route_m double DEFAULT NULL,
  t_typ int(11) DEFAULT NULL,
  t_meta_shortdesc_md text COLLATE latin1_general_ci,
  t_meta_shortdesc_html text COLLATE latin1_general_ci,
  t_dateshow date DEFAULT NULL,
  t_gesperrt int(2) DEFAULT 1,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countInfos int(11) DEFAULT 0,
  countNews int(11) DEFAULT 0,
  countTrips int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0,
  PRIMARY KEY (t_id),
  KEY idx_t__t_id (t_id),
  KEY idx_t__d_id (d_id),
  KEY idx_t__l_id (l_id),
  KEY t_gps_lat (t_gps_lat),
  KEY t_gps_lon (t_gps_lon)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

DROP TABLE IF EXISTS tour_info;
CREATE TABLE IF NOT EXISTS tour_info (
  tif_id int(11) NOT NULL AUTO_INCREMENT,
  if_id int(11) NOT NULL,
  t_id int(11) NOT NULL,
  tif_linked_details varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (tif_id),
  KEY idx_tif__tif_id (tif_id),
  KEY idx_tif__if_id (if_id),
  KEY idx_tif__t_id (t_id)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- track-data
--
DROP TABLE IF EXISTS kategorie_full;
CREATE TABLE kategorie_full (
  k_id int(11) NOT NULL AUTO_INCREMENT,
  t_id int(11),
  d_id VARCHAR(80) DEFAULT NULL,
  k_t_ids varchar(2000) COLLATE latin1_general_ci DEFAULT NULL,
  k_t_ids_full varchar(2000) COLLATE latin1_general_ci DEFAULT NULL,
  k_d_ids varchar(2000) COLLATE latin1_general_ci DEFAULT NULL,
  k_d_ids_full varchar(2000) COLLATE latin1_general_ci DEFAULT NULL,
  i_id int(11) DEFAULT NULL,
  l_id int(11),
  tr_id int(11),
  k_gesperrt int(11) DEFAULT 1,
  k_datebis datetime DEFAULT NULL,
  k_datevon datetime DEFAULT NULL,
  k_gpstracks_basefile char(255) COLLATE latin1_general_ci DEFAULT NULL,
  k_gps_lat float DEFAULT NULL,
  k_gps_lon float DEFAULT NULL,
  k_meta_shortdesc mediumtext COLLATE latin1_general_ci,
  k_name char(255) COLLATE latin1_general_ci DEFAULT NULL,
  k_html mediumtext COLLATE latin1_general_ci,
  k_keywords mediumtext COLLATE latin1_general_ci,
  k_persons mediumtext COLLATE latin1_general_ci,
  k_objects mediumtext COLLATE latin1_general_ci,
  k_distance float DEFAULT NULL,
  k_altitude_asc float DEFAULT NULL,
  k_altitude_desc float DEFAULT NULL,
  k_altitude_min float DEFAULT NULL,
  k_altitude_max float DEFAULT NULL,
  k_rate_schwierigkeit int(11) DEFAULT NULL,
  k_rate_ausdauer int(11) DEFAULT NULL,
  k_rate_kraft int(11) DEFAULT NULL,
  k_rate_mental int(11) DEFAULT NULL,
  k_rate_bildung int(11) DEFAULT NULL,
  k_rate_motive int(11) DEFAULT NULL,
  k_rate_wichtigkeit int(11) DEFAULT NULL,
  k_rate_gesamt int(11) DEFAULT NULL,
  k_type int(11) DEFAULT NULL,
  k_meta_shortdesc_md text COLLATE latin1_general_ci,
  k_meta_shortdesc_html text COLLATE latin1_general_ci,
  k_route_attr VARCHAR(255) COLLATE latin1_general_ci DEFAULT NULL,
  n_id int(11) DEFAULT NULL,
  k_dateshow date DEFAULT NULL,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0,
  PRIMARY KEY (k_id),
  KEY idx_k__k_id (k_id),
  KEY idx_k__t_id (t_id),
  KEY idx_k__d_id (d_id),
  KEY idx_k__l_id (l_id),
  KEY k_gps_lat (k_gps_lat),
  KEY k_gps_lon (k_gps_lon),
  KEY k_rate_schwierigkeit (k_rate_schwierigkeit),
  KEY k_rate_ausdauer (k_rate_ausdauer),
  KEY k_rate_kraft (k_rate_kraft),
  KEY k_rate_mental (k_rate_mental),
  KEY k_rate_bildung (k_rate_bildung),
  KEY k_rate_motive (k_rate_motive),
  KEY k_rate_wichtigkeit (k_rate_wichtigkeit),
  KEY k_rate_gesamt (k_rate_gesamt),
  KEY k_type (k_type),
  KEY k_datevon (k_datevon),
  KEY k_datebis (k_datebis)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

DROP TABLE IF EXISTS kategorie_tour;
CREATE TABLE kategorie_tour (
  t_id int(11) NOT NULL,
  k_id int(11) NOT NULL,
  kt_full int(11) DEFAULT '0',
  kt_route_attr VARCHAR(255) COLLATE latin1_general_ci DEFAULT NULL,
  KEY t_id (t_id),
  KEY k_id (k_id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- image-data
--
DROP TABLE IF EXISTS image;
CREATE TABLE image (
  i_id int(11) NOT NULL AUTO_INCREMENT,
  k_id int(11) NOT NULL,
  t_id int(11) DEFAULT NULL,
  d_id VARCHAR(80) DEFAULT NULL,
  i_katname text COLLATE latin1_general_ci,
  i_katdesc text COLLATE latin1_general_ci,
  i_gesperrt int(11) DEFAULT 1,
  i_lochirarchie text COLLATE latin1_general_ci,
  i_date datetime DEFAULT NULL,
  i_dir char(255) COLLATE latin1_general_ci DEFAULT NULL,
  i_file char(255) COLLATE latin1_general_ci DEFAULT NULL,
  i_keywords text COLLATE latin1_general_ci,
  i_persons mediumtext COLLATE latin1_general_ci,
  i_objects mediumtext COLLATE latin1_general_ci,
  i_gps_lat float DEFAULT NULL,
  i_gps_lon float DEFAULT NULL,
  i_gps_ele float DEFAULT NULL,
  i_rate int(11) DEFAULT NULL,
  i_rate_motive int(11) DEFAULT NULL,
  i_rate_wichtigkeit int(11) DEFAULT NULL,
  i_image_objects text COLLATE latin1_general_ci,
  i_dateshow date DEFAULT NULL,
  PRIMARY KEY (i_id),
  KEY idx_i__i_id (i_id),
  KEY idx_i__k_id (k_id),
  KEY idx_i__t_id (t_id),
  KEY idx_i__d_id (d_id),
  KEY i_gps_lat (i_gps_lat),
  KEY i_gps_lon (i_gps_lon),
  KEY i_date (i_date),
  KEY i_rate (i_rate),
  KEY i_rate_motive (i_rate_motive),
  KEY i_rate_wichtigkeit (i_rate_wichtigkeit)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- video-data
--
DROP TABLE IF EXISTS video;
CREATE TABLE video (
  v_id int(11) NOT NULL AUTO_INCREMENT,
  k_id int(11) NOT NULL,
  t_id int(11) DEFAULT NULL,
  d_id VARCHAR(80) DEFAULT NULL,
  v_katname text COLLATE latin1_general_ci,
  v_katdesc text COLLATE latin1_general_ci,
  v_gesperrt int(11) DEFAULT 1,
  v_lochirarchie text COLLATE latin1_general_ci,
  v_date datetime DEFAULT NULL,
  v_dir char(255) COLLATE latin1_general_ci DEFAULT NULL,
  v_file char(255) COLLATE latin1_general_ci DEFAULT NULL,
  v_keywords text COLLATE latin1_general_ci,
  v_persons mediumtext COLLATE latin1_general_ci,
  v_objects mediumtext COLLATE latin1_general_ci,
  v_gps_lat float DEFAULT NULL,
  v_gps_lon float DEFAULT NULL,
  v_gps_ele float DEFAULT NULL,
  v_rate int(11) DEFAULT NULL,
  v_rate_motive int(11) DEFAULT NULL,
  v_rate_wichtigkeit int(11) DEFAULT NULL,
  v_video_objects text COLLATE latin1_general_ci,
  v_dateshow date DEFAULT NULL,
  PRIMARY KEY (v_id),
  KEY idx_v__v_id (v_id),
  KEY idx_v__k_id (k_id),
  KEY idx_v__t_id (t_id),
  KEY idx_v__d_id (d_id),
  KEY v_gps_lat (v_gps_lat),
  KEY v_gps_lon (v_gps_lon),
  KEY v_date (v_date),
  KEY v_rate (v_rate),
  KEY v_rate_motive (v_rate_motive),
  KEY v_rate_wichtigkeit (v_rate_wichtigkeit)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

