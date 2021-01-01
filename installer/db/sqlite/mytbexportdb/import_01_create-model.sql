-- ---------------
-- configuration-tables
-- ---------------
DROP TABLE IF EXISTS rates;
CREATE TABLE rates (
  r_id int(11) NOT NULL,
  r_fieldname varchar(80) DEFAULT NULL,
  r_fieldvalue int(11) DEFAULT NULL,
  r_grade varchar(80) DEFAULT NULL,
  r_grade_desc varchar(80) DEFAULT NULL
);

-- ---------------
-- news-data
-- ---------------
DROP TABLE IF EXISTS news;
CREATE TABLE news (
  n_id int(11) NOT NULL PRIMARY KEY,
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
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countTrips int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0
);

-- ---------------
-- info-data
-- ---------------
DROP TABLE IF EXISTS info;
CREATE TABLE info (
  if_id int(11) NOT NULL PRIMARY KEY,
  l_id int(11) DEFAULT null,
  kw_id int(11) DEFAULT NULL,
  countRoutes int(11) DEFAULT 0,
  countLocations int(11) DEFAULT 0,
  if_gesperrt int(2) DEFAULT 0,
  if_keywords text,
  if_meta_desc text,
  if_meta_shortdesc varchar(255) DEFAULT NULL,
  if_name varchar(255) DEFAULT NULL,
  if_publisher varchar(255) DEFAULT NULL,
  if_typ int(11) DEFAULT NULL,
  if_url varchar(255) NULL
);

-- ---------------
-- trip-data
-- ---------------
DROP TABLE IF EXISTS trip;
CREATE TABLE trip (
  tr_id int(11) NOT NULL PRIMARY KEY,
  i_id int(11) DEFAULT NULL,
  l_id int(11) DEFAULT NULL,
  tr_datebis datetime DEFAULT NULL,
  tr_datevon datetime DEFAULT NULL,
  tr_geo_poly text,
  tr_katname_replace varchar(2000) DEFAULT NULL,
  tr_l_ids varchar(2000) DEFAULT NULL,
  tr_meta_desc text,
  tr_meta_shortdesc text,
  tr_name varchar(255) DEFAULT NULL,
  tr_typ int(11) DEFAULT NULL,
  tr_url varchar(255) DEFAULT NULL,
  tr_meta_shortdesc_md text,
  tr_meta_shortdesc_html text,
  tr_keywords text,
  tr_persons text,
  tr_objects text,
  tr_dateshow date DEFAULT NULL,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0
);

-- ---------------
-- location-data
-- ---------------
DROP TABLE IF EXISTS location;
CREATE TABLE location (
  l_id int(11) DEFAULT NULL PRIMARY KEY,
  l_lochirarchie text,
  l_lochirarchieids text,
  l_lochirarchietxt text,
  l_meta_shortdesc text,
  l_name char(255) DEFAULT NULL,
  l_url_homepage varchar(255) DEFAULT NULL,
  l_html mediumtext,
  l_parent_id int(11) DEFAULT NULL,
  l_gps_lat float DEFAULT NULL,
  l_gps_lon float DEFAULT NULL,
  l_geo_area text,
  l_typ int(11) DEFAULT NULL,
  l_katids text,
  l_tids text,
  l_dids text,
  l_meta_shortdesc_md text,
  l_meta_shortdesc_html text,
  l_keywords text,
  l_persons text,
  l_objects text,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countInfos int(11) DEFAULT 0,
  countNews int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countTrips int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0
);

DROP TABLE IF EXISTS location_info;
CREATE TABLE IF NOT EXISTS location_info (
  lif_id int(11) NOT NULL PRIMARY KEY,
  if_id int(11) NOT NULL,
  l_id int(11) NOT NULL,
  lif_linked_details varchar(255) DEFAULT NULL
);

-- ---------------
-- destination-data
-- ---------------
DROP TABLE IF EXISTS destination;
CREATE TABLE destination (
  d_id VARCHAR(80) PRIMARY KEY,
  l_id int(11),
  d_k_ids varchar(2000) DEFAULT NULL,
  d_t_ids varchar(2000) DEFAULT NULL,
  d_datevon date DEFAULT NULL,
  d_name char(255) DEFAULT NULL,
  d_desc_gebiet varchar(255) DEFAULT NULL,
  d_desc_ziel varchar(255) DEFAULT NULL,
  d_keywords text,
  d_persons text,
  d_objects text,
  d_ele_max double DEFAULT NULL,
  d_gps_lat float DEFAULT NULL,
  d_gps_lon float DEFAULT NULL,
  d_html_list mediumtext,
  d_rate varchar(255) DEFAULT NULL,
  d_rate_ks varchar(255) DEFAULT NULL,
  d_rate_firn varchar(255) DEFAULT NULL,
  d_rate_gletscher varchar(255) DEFAULT NULL,
  d_rate_klettern varchar(255) DEFAULT NULL,
  d_rate_bergtour varchar(255) DEFAULT NULL,
  d_rate_schneeschuh varchar(255) DEFAULT NULL,
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
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countInfos int(11) DEFAULT 0,
  countNews int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countTrips int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0
);

-- ---------------
-- tour-data
-- ---------------
DROP TABLE IF EXISTS tour;
CREATE TABLE tour (
  t_id int(11) NOT NULL PRIMARY KEY,
  l_id int(11),
  k_id int(11) DEFAULT NULL,
  d_id VARCHAR(80),
  t_k_ids varchar(2000) DEFAULT NULL,
  t_datevon date DEFAULT NULL,
  t_name char(255) DEFAULT NULL,
  t_desc_gefahren text,
  t_desc_fuehrer text,
  t_desc_fuehrer_full text,
  t_desc_gebiet varchar(255) DEFAULT NULL,
  t_desc_talort varchar(255) DEFAULT NULL,
  t_desc_ziel varchar(255) DEFAULT NULL,
  t_meta_shortdesc mediumtext,
  t_keywords text,
  t_persons text,
  t_objects text,
  t_ele_max double DEFAULT NULL,
  t_gps_lat float DEFAULT NULL,
  t_gps_lon float DEFAULT NULL,
  t_gpstracks_basefile char(255) DEFAULT NULL,
  t_html_list mediumtext,
  t_rate varchar(255) DEFAULT NULL,
  t_rate_ks varchar(255) DEFAULT NULL,
  t_rate_firn varchar(255) DEFAULT NULL,
  t_rate_gletscher varchar(255) DEFAULT NULL,
  t_rate_klettern varchar(255) DEFAULT NULL,
  t_rate_bergtour varchar(255) DEFAULT NULL,
  t_rate_schneeschuh varchar(255) DEFAULT NULL,
  t_rate_ausdauer int(11) DEFAULT '0',
  t_rate_bildung int(11) DEFAULT '0',
  t_rate_gesamt int(11) DEFAULT '0',
  t_rate_kraft int(11) DEFAULT '0',
  t_rate_mental int(11) DEFAULT '0',
  t_rate_motive int(11) DEFAULT '0',
  t_rate_schwierigkeit int(11) DEFAULT '0',
  t_rate_wichtigkeit int(11) DEFAULT '0',
  t_route_aufstieg_name varchar(255) DEFAULT NULL,
  t_route_aufstieg_dauer double DEFAULT NULL,
  t_route_aufstieg_hm double DEFAULT NULL,
  t_route_aufstieg_km double DEFAULT NULL,
  t_route_aufstieg_sl double DEFAULT NULL,
  t_route_aufstieg_m double DEFAULT NULL,
  t_route_abstieg_name varchar(255) DEFAULT NULL,
  t_route_abstieg_dauer double DEFAULT NULL,
  t_route_abstieg_hm double DEFAULT NULL,
  t_route_abstieg_m double DEFAULT NULL,
  t_route_huette_name varchar(255) DEFAULT NULL,
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
  t_meta_shortdesc_md text,
  t_meta_shortdesc_html text,
  t_dateshow date DEFAULT NULL,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countInfos int(11) DEFAULT 0,
  countNews int(11) DEFAULT 0,
  countTrips int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0
);

DROP TABLE IF EXISTS tour_info;
CREATE TABLE IF NOT EXISTS tour_info (
  tif_id int(11) NOT NULL PRIMARY KEY,
  if_id int(11) NOT NULL,
  t_id int(11) NOT NULL,
  tif_linked_details varchar(255) DEFAULT NULL
);

-- ---------------
-- track-data
-- ---------------
DROP TABLE IF EXISTS kategorie_full;
CREATE TABLE kategorie_full (
  k_id int(11) NOT NULL PRIMARY KEY,
  t_id int(11),
  d_id VARCHAR(80) DEFAULT NULL,
  k_t_ids varchar(2000) DEFAULT NULL,
  k_t_ids_full varchar(2000) DEFAULT NULL,
  k_d_ids varchar(2000) DEFAULT NULL,
  k_d_ids_full varchar(2000) DEFAULT NULL,
  i_id int(11) DEFAULT NULL,
  l_id int(11),
  tr_id int(11),
  k_gesperrt int(11) DEFAULT NULL,
  k_datebis datetime DEFAULT NULL,
  k_datevon datetime DEFAULT NULL,
  k_gpstracks_basefile char(255) DEFAULT NULL,
  k_gps_lat float DEFAULT NULL,
  k_gps_lon float DEFAULT NULL,
  k_meta_shortdesc mediumtext,
  k_name char(255) DEFAULT NULL,
  k_html mediumtext,
  k_keywords mediumtext,
  k_persons mediumtext,
  k_objects mediumtext,
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
  k_meta_shortdesc_md text,
  k_meta_shortdesc_html text,
  n_id int(11) DEFAULT NULL,
  k_dateshow date DEFAULT NULL,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0
);

DROP TABLE IF EXISTS kategorie_tour;
CREATE TABLE kategorie_tour (
  t_id int(11) NOT NULL,
  k_id int(11) NOT NULL
);

-- ---------------
-- image-data
-- ---------------
DROP TABLE IF EXISTS image;
CREATE TABLE image (
  i_id int(11) NOT NULL PRIMARY KEY,
  k_id int(11) NOT NULL,
  t_id int(11) DEFAULT NULL,
  d_id VARCHAR(80) DEFAULT NULL,
  i_katname text,
  i_katdesc text,
  i_gesperrt int(11) DEFAULT NULL,
  i_lochirarchie text,
  i_date datetime DEFAULT NULL,
  i_dir char(255) DEFAULT NULL,
  i_file char(255) DEFAULT NULL,
  i_keywords text,
  i_persons text,
  i_objects text,
  i_gps_lat float DEFAULT NULL,
  i_gps_lon float DEFAULT NULL,
  i_gps_ele float DEFAULT NULL,
  i_rate int(11) DEFAULT NULL,
  i_rate_motive int(11) DEFAULT NULL,
  i_rate_wichtigkeit int(11) DEFAULT NULL,
  i_image_objects text,
  i_dateshow date DEFAULT NULL
);

-- ---------------
-- video-data
-- ---------------
DROP TABLE IF EXISTS video;
CREATE TABLE video (
  v_id int(11) NOT NULL PRIMARY KEY,
  k_id int(11) NOT NULL,
  t_id int(11) DEFAULT NULL,
  d_id VARCHAR(80) DEFAULT NULL,
  v_katname text,
  v_katdesc text,
  v_gesperrt int(11) DEFAULT NULL,
  v_lochirarchie text,
  v_date datetime DEFAULT NULL,
  v_dir char(255) DEFAULT NULL,
  v_file char(255) DEFAULT NULL,
  v_keywords text,
  v_persons text,
  v_objects text,
  v_gps_lat float DEFAULT NULL,
  v_gps_lon float DEFAULT NULL,
  v_gps_ele float DEFAULT NULL,
  v_rate int(11) DEFAULT NULL,
  v_rate_motive int(11) DEFAULT NULL,
  v_rate_wichtigkeit int(11) DEFAULT NULL,
  v_video_objects text,
  v_dateshow date DEFAULT NULL
);
