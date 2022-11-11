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

--
-- playlist-data
--
DROP TABLE IF EXISTS playlist;
CREATE TABLE playlist (
  p_id int(11) NOT NULL,
  p_meta_desc text DEFAULT NULL,
  p_name varchar(255) DEFAULT NULL,
  p_calced_id VARCHAR(50) DEFAULT NULL,
  countInfos int(11) DEFAULT 0,
  countImages int(11) DEFAULT 0,
  countLocations int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countTrips int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0
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
  n_gesperrt int(2) DEFAULT 1,
  n_calced_id VARCHAR(50) DEFAULT NULL,
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
  countPois int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countLocations int(11) DEFAULT 0,
  if_gesperrt int(2) DEFAULT 1,
  if_keywords text,
  if_meta_desc text,
  if_meta_shortdesc varchar(255) DEFAULT NULL,
  if_name varchar(255) DEFAULT NULL,
  if_publisher varchar(255) DEFAULT NULL,
  if_typ int(11) DEFAULT NULL,
  if_url varchar(255) NULL,
  if_calced_id VARCHAR(50) DEFAULT NULL,
  if_calced_subtype VARCHAR(50) DEFAULT NULL
);

DROP TABLE IF EXISTS info_playlist;
CREATE TABLE info_playlist
(
    ifp_id  int(11) PRIMARY KEY,
    if_id   int(11) NOT NULL DEFAULT '0',
    p_id    int(11) NOT NULL DEFAULT '0',
    ifp_pos int(11)          DEFAULT NULL,
    ifp_details varchar(1000) DEFAULT NULL,
    CONSTRAINT info_playlist_ibfk_1 FOREIGN KEY (if_id) REFERENCES info (if_id) ON DELETE CASCADE,
    CONSTRAINT info_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ;
CREATE INDEX IF NOT EXISTS idx_IFP__IFP_POS ON info_playlist (ifp_pos);

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
  tr_gesperrt int(2) DEFAULT 1,
  tr_calced_id VARCHAR(50) DEFAULT NULL,
  tr_calced_dur DECIMAL(11, 2) DEFAULT NULL,
  tr_calced_durFacet DECIMAL(11, 1) DEFAULT NULL,
  tr_calced_dateonly VARCHAR(20) DEFAULT NULL,
  tr_calced_week tinyint DEFAULT NULL,
  tr_calced_month tinyint DEFAULT NULL,
  tr_calced_year smallint DEFAULT NULL,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0
);

DROP TABLE IF EXISTS trip_playlist;
CREATE TABLE trip_playlist
(
    trp_id  int(11) PRIMARY KEY,
    tr_id   int(11) NOT NULL DEFAULT '0',
    p_id    int(11) NOT NULL DEFAULT '0',
    trp_pos int(11)          DEFAULT NULL,
    trp_details varchar(1000) DEFAULT NULL,
    CONSTRAINT trip_playlist_ibfk_1 FOREIGN KEY (tr_id) REFERENCES trip (tr_id) ON DELETE CASCADE,
    CONSTRAINT trip_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ;
CREATE INDEX IF NOT EXISTS idx_TRP__TRP_POS ON trip_playlist (trp_pos);

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
  l_geo_state TINYINT DEFAULT 0,
  l_typ int(11) DEFAULT NULL,
  l_katids text,
  l_tids text,
  l_dids text,
  l_meta_shortdesc_md text,
  l_meta_shortdesc_html text,
  l_keywords text,
  l_persons text,
  l_objects text,
  l_gesperrt int(2) DEFAULT 1,
  l_calced_id VARCHAR(50) DEFAULT NULL,
  l_calced_subtype VARCHAR(50) DEFAULT NULL,
  l_calced_gps_loc VARCHAR(50) DEFAULT NULL,
  l_calced_gps_lat VARCHAR(50) DEFAULT NULL,
  l_calced_gps_lon VARCHAR(50) DEFAULT NULL,
  l_calced_altMaxFacet DECIMAL UNSIGNED DEFAULT NULL,
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
CREATE TABLE location_info (
  lif_id int(11) PRIMARY KEY,
  if_id int(11) NOT NULL,
  l_id int(11) NOT NULL,
  lif_linked_details varchar(255) DEFAULT NULL
);

DROP TABLE IF EXISTS location_playlist;
CREATE TABLE location_playlist
(
    lp_id  int(11) PRIMARY KEY,
    l_id   int(11) NOT NULL DEFAULT '0',
    p_id   int(11) NOT NULL DEFAULT '0',
    lp_pos int(11)          DEFAULT NULL,
    lp_details varchar(1000) DEFAULT NULL,
    CONSTRAINT location_playlist_ibfk_1 FOREIGN KEY (l_id) REFERENCES location (l_id) ON DELETE CASCADE,
    CONSTRAINT location_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ;
CREATE INDEX IF NOT EXISTS idx_LP__LP_POS ON location_playlist (lp_pos);

-- ---------------
-- poi-data
-- ---------------
DROP TABLE IF EXISTS poi;
CREATE TABLE IF NOT EXISTS poi (
   poi_id int(11) PRIMARY KEY,
   poi_meta_desc text DEFAULT NULL,
   poi_name varchar(255) DEFAULT NULL,
   poi_reference varchar(255) DEFAULT NULL,
   poi_keywords text DEFAULT NULL,
   poi_geo_longdeg float DEFAULT NULL,
   poi_geo_latdeg float DEFAULT NULL,
   poi_geo_ele float DEFAULT NULL,
   poi_calced_id VARCHAR(50) DEFAULT NULL,
   poi_calced_gps_loc VARCHAR(50) DEFAULT NULL,
   poi_calced_gps_lat VARCHAR(50) DEFAULT NULL,
   poi_calced_gps_lon VARCHAR(50) DEFAULT NULL,
   poi_calced_altMaxFacet DECIMAL DEFAULT NULL,
   countRoutes int(11) DEFAULT 0,
   countTracks int(11) DEFAULT 0
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
  d_gesperrt int(2) DEFAULT 1,
  d_calced_id VARCHAR(50) DEFAULT NULL,
  d_calced_actiontype VARCHAR(50) DEFAULT NULL,
  d_calced_altAscFacet DECIMAL DEFAULT NULL,
  d_calced_altMaxFacet DECIMAL DEFAULT NULL,
  d_calced_distFacet DECIMAL(11, 1) DEFAULT NULL,
  d_calced_durFacet DECIMAL(11, 1) DEFAULT NULL,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countInfos int(11) DEFAULT 0,
  countNews int(11) DEFAULT 0,
  countPois int(11) DEFAULT 0,
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
  t_desc_sectionDetails varchar(255) DEFAULT NULL,
  t_meta_shortdesc mediumtext,
  t_keywords text,
  t_persons text,
  t_objects text,
  t_ele_max double DEFAULT NULL,
  t_gps_lat float DEFAULT NULL,
  t_gps_lon float DEFAULT NULL,
  t_gpstracks_basefile char(255) DEFAULT NULL,
  t_gpstracks_state TINYINT DEFAULT 0,
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
  t_gesperrt int(2) DEFAULT 1,
  t_calced_id VARCHAR(50) DEFAULT NULL,
  t_calced_d_id VARCHAR(255) DEFAULT NULL,
  t_calced_sections VARCHAR(255) DEFAULT NULL,
  t_calced_actiontype VARCHAR(50) DEFAULT NULL,
  t_calced_altAscFacet DECIMAL DEFAULT NULL,
  t_calced_altMaxFacet DECIMAL DEFAULT NULL,
  t_calced_distFacet DECIMAL(11, 1) DEFAULT NULL,
  t_calced_durFacet DECIMAL(11, 1) DEFAULT NULL,
  t_calced_dateonly VARCHAR(20) DEFAULT NULL,
  t_calced_week tinyint DEFAULT NULL,
  t_calced_month tinyint DEFAULT NULL,
  t_calced_year smallint DEFAULT NULL,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countInfos int(11) DEFAULT 0,
  countNews int(11) DEFAULT 0,
  countPois int(11) DEFAULT 0,
  countTrips int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0
);

DROP TABLE IF EXISTS tour_info;
CREATE TABLE tour_info (
  tif_id int(11) PRIMARY KEY,
  if_id int(11) NOT NULL,
  t_id int(11) NOT NULL,
  tif_linked_details varchar(255) DEFAULT NULL
);

DROP TABLE IF EXISTS tour_playlist;
CREATE TABLE tour_playlist
(
    tp_id  int(11) PRIMARY KEY,
    t_id   int(11) NOT NULL DEFAULT '0',
    p_id   int(11) NOT NULL DEFAULT '0',
    tp_pos int(11)          DEFAULT NULL,
    tp_details varchar(1000) DEFAULT NULL,
    CONSTRAINT tour_playlist_ibfk_1 FOREIGN KEY (t_id) REFERENCES tour (t_id) ON DELETE CASCADE,
    CONSTRAINT tour_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_TP__TP_POS ON tour_playlist (tp_pos);

CREATE TABLE IF NOT EXISTS tour_poi
(
    tpoi_id  int(11) PRIMARY KEY,
    t_id   int(11) NOT NULL DEFAULT '0',
    poi_id   int(11) NOT NULL DEFAULT '0',
    tpoi_pos int(11) NOT NULL,
    tpoi_type int(11) NOT NULL,
    CONSTRAINT tour_poi_ibfk_1 FOREIGN KEY (t_id) REFERENCES tour (t_id) ON DELETE CASCADE,
    CONSTRAINT tour_poi_ibfk_2 FOREIGN KEY (poi_id) REFERENCES poi (poi_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_TPOI__TPOI_POS ON tour_poi (tpoi_pos);

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
  k_gesperrt int(11) DEFAULT 1,
  k_datebis datetime DEFAULT NULL,
  k_datevon datetime DEFAULT NULL,
  k_gpstracks_basefile char(255) DEFAULT NULL,
  k_gpstracks_state TINYINT DEFAULT 0,
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
  k_route_attr VARCHAR(255) DEFAULT NULL,
  n_id int(11) DEFAULT NULL,
  k_dateshow date DEFAULT NULL,
  k_calced_id VARCHAR(50) DEFAULT NULL,
  k_calced_actiontype VARCHAR(50) DEFAULT NULL,
  k_calced_altAscFacet DECIMAL DEFAULT NULL,
  k_calced_altMaxFacet DECIMAL DEFAULT NULL,
  k_calced_distFacet DECIMAL(11, 1) DEFAULT NULL,
  k_calced_dur DECIMAL(11, 2) DEFAULT NULL,
  k_calced_durFacet DECIMAL(11, 1) DEFAULT NULL,
  k_calced_dateonly VARCHAR(20) DEFAULT NULL,
  k_calced_week tinyint DEFAULT NULL,
  k_calced_month tinyint DEFAULT NULL,
  k_calced_year smallint DEFAULT NULL,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countPois int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0
);

DROP TABLE IF EXISTS kategorie_tour;
CREATE TABLE kategorie_tour (
  t_id int(11) NOT NULL,
  k_id int(11) NOT NULL,
  kt_full int(11) DEFAULT '0',
  kt_route_attr VARCHAR(255) DEFAULT NULL
);

DROP TABLE IF EXISTS kategorie_playlist;
CREATE TABLE kategorie_playlist
(
    kp_id  int(11) PRIMARY KEY,
    k_id   int(11) NOT NULL DEFAULT '0',
    p_id   int(11) NOT NULL DEFAULT '0',
    kp_pos int(11)          DEFAULT NULL,
    kp_details varchar(1000) DEFAULT NULL,
    CONSTRAINT kategorie_playlist_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id) ON DELETE CASCADE,
    CONSTRAINT kategorie_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ;
CREATE INDEX IF NOT EXISTS idx_KP__KP_POS ON kategorie_playlist (kp_pos);

DROP TABLE IF EXISTS kategorie_poi;
CREATE TABLE IF NOT EXISTS kategorie_poi
(
    kpoi_id  int(11) PRIMARY KEY,
    k_id   int(11) NOT NULL DEFAULT '0',
    poi_id   int(11) NOT NULL DEFAULT '0',
    kpoi_pos int(11) NOT NULL,
    kpoi_type int(11) NOT NULL,
    CONSTRAINT kategorie_poi_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie_full (k_id) ON DELETE CASCADE,
    CONSTRAINT kategorie_poi_ibfk_2 FOREIGN KEY (poi_id) REFERENCES poi (poi_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_KPOI__KPOI_POS ON kategorie_poi (kpoi_pos);

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
  i_gesperrt int(11) DEFAULT 1,
  i_lochirarchie text,
  i_date datetime DEFAULT NULL,
  i_dir char(255) DEFAULT NULL,
  i_file char(255) DEFAULT NULL,
  i_keywords text,
  i_persons text,
  i_objects text,
  i_objectdetections text,
  i_gps_lat float DEFAULT NULL,
  i_gps_lon float DEFAULT NULL,
  i_gps_ele float DEFAULT NULL,
  i_rate int(11) DEFAULT NULL,
  i_rate_motive int(11) DEFAULT NULL,
  i_rate_wichtigkeit int(11) DEFAULT NULL,
  i_dateshow date DEFAULT NULL,
  i_calced_id VARCHAR(50) DEFAULT NULL,
  i_calced_path VARCHAR(255) DEFAULT NULL,
  i_calced_gps_loc VARCHAR(50) DEFAULT NULL,
  i_calced_gps_lat VARCHAR(50) DEFAULT NULL,
  i_calced_gps_lon VARCHAR(50) DEFAULT NULL,
  i_calced_altMaxFacet DECIMAL DEFAULT NULL,
  i_calced_dateonly VARCHAR(20) DEFAULT NULL,
  i_calced_week tinyint DEFAULT NULL,
  i_calced_month tinyint DEFAULT NULL,
  i_calced_year smallint DEFAULT NULL
);

DROP TABLE IF EXISTS image_playlist;
CREATE TABLE image_playlist (
  ip_id int(11) PRIMARY KEY,
  i_id int(11) NOT NULL DEFAULT '0',
  p_id int(11) NOT NULL DEFAULT '0',
  ip_pos int(11) DEFAULT NULL,
  ip_details varchar(1000) DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_IP__IP_POS ON image_playlist (ip_pos);

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
  v_gesperrt int(11) DEFAULT 1,
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
  v_dateshow date DEFAULT NULL,
  v_calced_id VARCHAR(50) DEFAULT NULL,
  v_calced_path VARCHAR(255) DEFAULT NULL,
  v_calced_gps_loc VARCHAR(50) DEFAULT NULL,
  v_calced_gps_lat VARCHAR(50) DEFAULT NULL,
  v_calced_gps_lon VARCHAR(50) DEFAULT NULL,
  v_calced_altMaxFacet DECIMAL DEFAULT NULL,
  v_calced_dateonly VARCHAR(20) DEFAULT NULL,
  v_calced_week tinyint DEFAULT NULL,
  v_calced_month tinyint DEFAULT NULL,
  v_calced_year smallint DEFAULT NULL
);

DROP TABLE IF EXISTS video_playlist;
CREATE TABLE video_playlist (
  vp_id int(11) PRIMARY KEY,
  v_id int(11) NOT NULL DEFAULT '0',
  p_id int(11) NOT NULL DEFAULT '0',
  vp_pos int(11) DEFAULT NULL,
  vp_details varchar(1000) DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_VP__VP_POS ON video_playlist (Vp_pos);
