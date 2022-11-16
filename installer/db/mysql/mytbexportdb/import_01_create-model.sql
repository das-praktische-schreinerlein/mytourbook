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

-- ---------------
-- configuration-tables
-- ---------------
DROP TABLE IF EXISTS rates;
CREATE TABLE rates (
  r_id int(11) NOT NULL,
  r_fieldname varchar(80) COLLATE utf8_general_ci DEFAULT NULL,
  r_fieldvalue int(11) DEFAULT NULL,
  r_grade varchar(80) COLLATE utf8_general_ci DEFAULT NULL,
  r_grade_desc varchar(80) COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- playlist-data
--
DROP TABLE IF EXISTS playlist;
CREATE TABLE IF NOT EXISTS playlist (
  p_id int(11) NOT NULL,
  p_meta_desc text COLLATE utf8_general_ci,
  p_name varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  p_calced_id VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  p_calced_navigation_objects VARCHAR(2000) DEFAULT NULL,
  p_calced_extended_object_properties VARCHAR(2000) DEFAULT NULL,
  countInfos int(11) DEFAULT 0,
  countImages int(11) DEFAULT 0,
  countLocations int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countTrips int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0,
  PRIMARY KEY (p_id),
  KEY idx_p__p_id (p_id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ---------------
-- news-data
-- ---------------
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
  n_calced_id VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  n_calced_linkedplaylists VARCHAR(2000) DEFAULT NULL,
  n_calced_navigation_objects VARCHAR(2000) DEFAULT NULL,
  n_calced_extended_object_properties VARCHAR(2000) DEFAULT NULL,
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

-- ---------------
-- info-data
-- ---------------
DROP TABLE IF EXISTS info;
CREATE TABLE IF NOT EXISTS info (
  if_id int(11) NOT NULL AUTO_INCREMENT,
  l_id int(11) DEFAULT null,
  kw_id int(11) DEFAULT NULL,
  countPois int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countLocations int(11) DEFAULT 0,
  if_gesperrt int(2) DEFAULT 1,
  if_keywords text COLLATE utf8_general_ci,
  if_meta_desc text COLLATE utf8_general_ci,
  if_meta_shortdesc varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  if_name varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  if_publisher varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  if_typ int(11) DEFAULT NULL,
  if_url varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  if_calced_id VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  if_calced_linkedplaylists VARCHAR(2000) DEFAULT NULL,
  if_calced_navigation_objects VARCHAR(2000) DEFAULT NULL,
  if_calced_extended_object_properties VARCHAR(2000) DEFAULT NULL,
  if_calced_subtype VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (if_id),
  KEY idx_if__if_id (if_id),
  KEY idx_if__kw_id (kw_id),
  KEY idx_if__l_id (l_id),
  KEY idx_if__if_gesperrt (if_gesperrt)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS info_playlist;
CREATE TABLE info_playlist
(
    ifp_id  int(11) NOT NULL AUTO_INCREMENT,
    if_id   int(11) NOT NULL DEFAULT '0',
    p_id    int(11) NOT NULL DEFAULT '0',
    ifp_pos int(11)          DEFAULT NULL,
    ifp_details varchar(1000) COLLATE utf8_general_ci DEFAULT NULL,
    PRIMARY KEY (ifp_id),
    KEY idx_ifp__ifp_id (ifp_id),
    KEY idx_ifp__t_id (if_id),
    KEY idx_ifp__p_id (p_id),
    CONSTRAINT info_playlist_ibfk_1 FOREIGN KEY (if_id) REFERENCES info (if_id) ON DELETE CASCADE,
    CONSTRAINT info_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
CREATE INDEX IF NOT EXISTS idx_IFP__IFP_POS ON info_playlist (ifp_pos);

-- ---------------
-- trip-data
-- ---------------
DROP TABLE IF EXISTS trip;
CREATE TABLE trip (
  tr_id int(11) NOT NULL AUTO_INCREMENT,
  i_id int(11) DEFAULT NULL,
  l_id int(11) DEFAULT NULL,
  tr_datebis datetime DEFAULT NULL,
  tr_datevon datetime DEFAULT NULL,
  tr_geo_poly text COLLATE utf8_general_ci,
  tr_katname_replace varchar(2000) COLLATE utf8_general_ci DEFAULT NULL,
  tr_l_ids varchar(2000) COLLATE utf8_general_ci DEFAULT NULL,
  tr_meta_desc text COLLATE utf8_general_ci,
  tr_meta_shortdesc text COLLATE utf8_general_ci,
  tr_name varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  tr_typ int(11) DEFAULT NULL,
  tr_url varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  tr_meta_shortdesc_md text COLLATE utf8_general_ci,
  tr_meta_shortdesc_html text COLLATE utf8_general_ci,
  tr_keywords text COLLATE utf8_general_ci,
  tr_persons text COLLATE utf8_general_ci,
  tr_objects text COLLATE utf8_general_ci,
  tr_dateshow date DEFAULT NULL,
  tr_gesperrt int(2) DEFAULT 1,
  tr_calced_id VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  tr_calced_linkedplaylists VARCHAR(2000) DEFAULT NULL,
  tr_calced_navigation_objects VARCHAR(2000) DEFAULT NULL,
  tr_calced_extended_object_properties VARCHAR(2000) DEFAULT NULL,
  tr_calced_dur DECIMAL(11, 2) DEFAULT NULL,
  tr_calced_durFacet DECIMAL(11, 1) DEFAULT NULL,
  tr_calced_dateonly VARCHAR(20) COLLATE utf8_general_ci DEFAULT NULL,
  tr_calced_week tinyint DEFAULT NULL,
  tr_calced_month tinyint DEFAULT NULL,
  tr_calced_year smallint DEFAULT NULL,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0,
  PRIMARY KEY (tr_id),
  KEY idx_tr__tr_id (tr_id),
  KEY idx_tr__l_id (l_id),
  KEY idx_tr__i_id (i_id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS trip_playlist;
CREATE TABLE trip_playlist
(
    trp_id  int(11) NOT NULL AUTO_INCREMENT,
    tr_id   int(11) NOT NULL DEFAULT '0',
    p_id    int(11) NOT NULL DEFAULT '0',
    trp_pos int(11)          DEFAULT NULL,
    trp_details varchar(1000) COLLATE utf8_general_ci DEFAULT NULL,
    PRIMARY KEY (trp_id),
    KEY idx_trp__trp_id (trp_id),
    KEY idx_trp__tr_id (tr_id),
    KEY idx_trp__p_id (p_id),
    CONSTRAINT trip_playlist_ibfk_1 FOREIGN KEY (tr_id) REFERENCES trip (tr_id) ON DELETE CASCADE,
    CONSTRAINT trip_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
CREATE INDEX IF NOT EXISTS idx_TRP__TRP_POS ON trip_playlist (trp_pos);

-- ---------------
-- location-data
-- ---------------
DROP TABLE IF EXISTS location;
CREATE TABLE location (
  l_id int(11) DEFAULT NULL,
  l_lochirarchie text COLLATE utf8_general_ci,
  l_lochirarchieids text COLLATE utf8_general_ci,
  l_lochirarchietxt text COLLATE utf8_general_ci,
  l_meta_shortdesc text COLLATE utf8_general_ci,
  l_name char(255) COLLATE utf8_general_ci DEFAULT NULL,
  l_url_homepage varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  l_html mediumtext COLLATE utf8_general_ci,
  l_parent_id int(11) DEFAULT NULL,
  l_gps_lat float DEFAULT NULL,
  l_gps_lon float DEFAULT NULL,
  l_geo_area text COLLATE utf8_general_ci,
  l_geo_state TINYINT DEFAULT 0,
  l_typ int(11) DEFAULT NULL,
  l_katids text COLLATE utf8_general_ci,
  l_tids text COLLATE utf8_general_ci,
  l_dids text COLLATE utf8_general_ci,
  l_meta_shortdesc_md text COLLATE utf8_general_ci,
  l_meta_shortdesc_html text COLLATE utf8_general_ci,
  l_keywords text COLLATE utf8_general_ci,
  l_persons text COLLATE utf8_general_ci,
  l_objects text COLLATE utf8_general_ci,
  l_gesperrt int(2) DEFAULT 1,
  l_datefirst date DEFAULT NULL,
  l_dateshow date DEFAULT NULL,
  l_calced_id VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  l_calced_linkedplaylists VARCHAR(2000) DEFAULT NULL,
  l_calced_linkedinfos VARCHAR(2000) DEFAULT NULL,
  l_calced_navigation_objects VARCHAR(2000) DEFAULT NULL,
  l_calced_extended_object_properties VARCHAR(2000) DEFAULT NULL,
  l_calced_subtype VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  l_calced_gps_loc VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  l_calced_gps_lat VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  l_calced_gps_lon VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  l_calced_altMaxFacet DECIMAL UNSIGNED DEFAULT NULL,
  l_calced_dateonly VARCHAR(20) COLLATE utf8_general_ci DEFAULT NULL,
  l_calced_week tinyint DEFAULT NULL,
  l_calced_month tinyint DEFAULT NULL,
  l_calced_year smallint DEFAULT NULL,
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
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS location_info;
CREATE TABLE location_info (
  lif_id int(11) NOT NULL AUTO_INCREMENT,
  if_id int(11) NOT NULL,
  l_id int(11) NOT NULL,
  lif_linked_details varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (lif_id),
  KEY idx_lif__lif_id (lif_id),
  KEY idx_lif__if_id (if_id),
  KEY idx_lif__l_id (l_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS location_playlist;
CREATE TABLE location_playlist
(
    lp_id  int(11) NOT NULL AUTO_INCREMENT,
    l_id   int(11) NOT NULL DEFAULT '0',
    p_id   int(11) NOT NULL DEFAULT '0',
    lp_pos int(11)          DEFAULT NULL,
    lp_details varchar(1000) COLLATE utf8_general_ci DEFAULT NULL,
    PRIMARY KEY (lp_id),
    KEY idx_lp__lp_id (lp_id),
    KEY idx_lp__l_id (l_id),
    KEY idx_lp__p_id (p_id),
    CONSTRAINT location_playlist_ibfk_1 FOREIGN KEY (l_id) REFERENCES location (l_id) ON DELETE CASCADE,
    CONSTRAINT location_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
CREATE INDEX IF NOT EXISTS idx_LP__LP_POS ON location_playlist (lp_pos);

-- ---------------
-- poi-data
-- ---------------
DROP TABLE IF EXISTS poi;
CREATE TABLE IF NOT EXISTS poi (
   poi_id int(11) NOT NULL AUTO_INCREMENT,
   l_id int(11) DEFAULT NULL,
   poi_meta_desc text COLLATE utf8_general_ci,
   poi_name varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
   poi_reference varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
   poi_keywords text COLLATE utf8_general_ci,
   poi_geo_longdeg float DEFAULT NULL,
   poi_geo_latdeg float DEFAULT NULL,
   poi_geo_ele float DEFAULT NULL,
   poi_type int(11) DEFAULT NULL,
   poi_datefirst date DEFAULT NULL,
   poi_dateshow date DEFAULT NULL,
   poi_calced_id VARCHAR(50),
   poi_calced_subtype VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
   poi_calced_linkedplaylists VARCHAR(2000) DEFAULT NULL,
   poi_calced_linkedinfos VARCHAR(2000) DEFAULT NULL,
   poi_calced_navigation_objects VARCHAR(2000) DEFAULT NULL,
   poi_calced_extended_object_properties VARCHAR(2000) DEFAULT NULL,
   poi_calced_gps_loc VARCHAR(50),
   poi_calced_gps_lat VARCHAR(50),
   poi_calced_gps_lon VARCHAR(50),
   poi_calced_altMaxFacet DECIMAL,
   poi_calced_dateonly VARCHAR(20) COLLATE utf8_general_ci DEFAULT NULL,
   poi_calced_week tinyint DEFAULT NULL,
   poi_calced_month tinyint DEFAULT NULL,
   poi_calced_year smallint DEFAULT NULL,
   countRoutes int(11) DEFAULT 0,
   countTracks int(11) DEFAULT 0,
   PRIMARY KEY (poi_id),
   KEY idx_poi__poi_id (poi_id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS poi_info;
CREATE TABLE poi_info (
   poiif_id int(11) NOT NULL AUTO_INCREMENT,
   if_id int(11) NOT NULL,
   poi_id int(11) NOT NULL,
   poiif_linked_details varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
   PRIMARY KEY (poiif_id),
   KEY idx_poiif__poiif_id (poiif_id),
   KEY idx_poiif__if_id (if_id),
   KEY idx_poiif__poi_id (poi_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


-- ---------------
-- destination-data
-- ---------------
DROP TABLE IF EXISTS destination;
CREATE TABLE destination (
  d_id VARCHAR(80),
  l_id int(11),
  d_k_ids varchar(2000) COLLATE utf8_general_ci DEFAULT NULL,
  d_t_ids varchar(2000) COLLATE utf8_general_ci DEFAULT NULL,
  d_datefirst date DEFAULT NULL,
  d_name char(255) COLLATE utf8_general_ci DEFAULT NULL,
  d_desc_gebiet varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  d_desc_ziel varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  d_keywords text COLLATE utf8_general_ci,
  d_persons text COLLATE utf8_general_ci,
  d_objects text COLLATE utf8_general_ci,
  d_ele_max double DEFAULT NULL,
  d_gps_lat float DEFAULT NULL,
  d_gps_lon float DEFAULT NULL,
  d_html_list mediumtext COLLATE utf8_general_ci,
  d_rate varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  d_rate_ks varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  d_rate_firn varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  d_rate_gletscher varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  d_rate_klettern varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  d_rate_bergtour varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  d_rate_schneeschuh varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
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
  d_calced_id VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  d_calced_linkedplaylists VARCHAR(2000) DEFAULT NULL,
  d_calced_linkedinfos VARCHAR(2000) DEFAULT NULL,
  d_calced_navigation_objects VARCHAR(2000) DEFAULT NULL,
  d_calced_extended_object_properties VARCHAR(2000) DEFAULT NULL,
  d_calced_actiontype VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  d_calced_altAscFacet DECIMAL UNSIGNED DEFAULT NULL,
  d_calced_altMaxFacet DECIMAL UNSIGNED DEFAULT NULL,
  d_calced_distFacet DECIMAL(11, 1) UNSIGNED DEFAULT NULL,
  d_calced_durFacet DECIMAL(11, 1) DEFAULT NULL,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countInfos int(11) DEFAULT 0,
  countNews int(11) DEFAULT 0,
  countPois int(11) DEFAULT 0,
  countRoutes int(11) DEFAULT 0,
  countTrips int(11) DEFAULT 0,
  countTracks int(11) DEFAULT 0,
  countVideos int(11) DEFAULT 0,
  PRIMARY KEY (d_id),
  KEY idx_d__d_id (d_id),
  KEY idx_d__l_id (l_id),
  KEY d_gps_lat (d_gps_lat),
  KEY d_gps_lon (d_gps_lon)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ---------------
-- tour-data
-- ---------------
DROP TABLE IF EXISTS tour;
CREATE TABLE tour (
  t_id int(11) NOT NULL AUTO_INCREMENT,
  l_id int(11),
  k_id int(11) DEFAULT NULL,
  d_id VARCHAR(80),
  t_k_ids varchar(2000) COLLATE utf8_general_ci DEFAULT NULL,
  t_datefirst date DEFAULT NULL,
  t_name char(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_desc_gefahren text COLLATE utf8_general_ci,
  t_desc_fuehrer text COLLATE utf8_general_ci,
  t_desc_fuehrer_full text COLLATE utf8_general_ci,
  t_desc_gebiet varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_desc_talort varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_desc_ziel varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_desc_sectionDetails varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_meta_shortdesc mediumtext COLLATE utf8_general_ci,
  t_keywords text COLLATE utf8_general_ci,
  t_persons text COLLATE utf8_general_ci,
  t_objects text COLLATE utf8_general_ci,
  t_ele_max double DEFAULT NULL,
  t_gps_lat float DEFAULT NULL,
  t_gps_lon float DEFAULT NULL,
  t_gpstracks_basefile char(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_gpstracks_state TINYINT DEFAULT 0,
  t_html_list mediumtext COLLATE utf8_general_ci,
  t_rate varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_rate_ks varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_rate_firn varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_rate_gletscher varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_rate_klettern varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_rate_bergtour varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_rate_schneeschuh varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_rate_ausdauer int(11) DEFAULT '0',
  t_rate_bildung int(11) DEFAULT '0',
  t_rate_gesamt int(11) DEFAULT '0',
  t_rate_kraft int(11) DEFAULT '0',
  t_rate_mental int(11) DEFAULT '0',
  t_rate_motive int(11) DEFAULT '0',
  t_rate_schwierigkeit int(11) DEFAULT '0',
  t_rate_wichtigkeit int(11) DEFAULT '0',
  t_route_aufstieg_name varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_route_aufstieg_dauer double DEFAULT NULL,
  t_route_aufstieg_hm double DEFAULT NULL,
  t_route_aufstieg_km double DEFAULT NULL,
  t_route_aufstieg_sl double DEFAULT NULL,
  t_route_aufstieg_m double DEFAULT NULL,
  t_route_abstieg_name varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_route_abstieg_dauer double DEFAULT NULL,
  t_route_abstieg_hm double DEFAULT NULL,
  t_route_abstieg_m double DEFAULT NULL,
  t_route_huette_name varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
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
  t_meta_shortdesc_md text COLLATE utf8_general_ci,
  t_meta_shortdesc_html text COLLATE utf8_general_ci,
  t_dateshow date DEFAULT NULL,
  t_gesperrt int(2) DEFAULT 1,
  t_calced_id VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  t_calced_linkedplaylists VARCHAR(2000) DEFAULT NULL,
  t_calced_linkedinfos VARCHAR(2000) DEFAULT NULL,
  t_calced_linkedpois VARCHAR(2000) DEFAULT NULL,
  t_calced_navigation_objects VARCHAR(2000) DEFAULT NULL,
  t_calced_extended_object_properties VARCHAR(2000) DEFAULT NULL,
  t_calced_d_id VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  t_calced_sections VARCHAR(255) COLLATE utf8_general_ci DEFAULT NULL,
  t_calced_actiontype VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  t_calced_altAscFacet DECIMAL UNSIGNED DEFAULT NULL,
  t_calced_altMaxFacet DECIMAL UNSIGNED DEFAULT NULL,
  t_calced_distFacet DECIMAL(11, 1) UNSIGNED DEFAULT NULL,
  t_calced_durFacet DECIMAL(11, 1) DEFAULT NULL,
  t_calced_dateonly VARCHAR(20) COLLATE utf8_general_ci DEFAULT NULL,
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
  countVideos int(11) DEFAULT 0,
  PRIMARY KEY (t_id),
  KEY idx_t__t_id (t_id),
  KEY idx_t__d_id (d_id),
  KEY idx_t__l_id (l_id),
  KEY t_gps_lat (t_gps_lat),
  KEY t_gps_lon (t_gps_lon)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS tour_info;
CREATE TABLE tour_info (
  tif_id int(11) NOT NULL AUTO_INCREMENT,
  if_id int(11) NOT NULL,
  t_id int(11) NOT NULL,
  tif_linked_details varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (tif_id),
  KEY idx_tif__tif_id (tif_id),
  KEY idx_tif__if_id (if_id),
  KEY idx_tif__t_id (t_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS tour_playlist;
CREATE TABLE tour_playlist
(
    tp_id  int(11) NOT NULL AUTO_INCREMENT,
    t_id   int(11) NOT NULL DEFAULT '0',
    p_id   int(11) NOT NULL DEFAULT '0',
    tp_pos int(11)          DEFAULT NULL,
    tp_details varchar(1000) COLLATE utf8_general_ci DEFAULT NULL,
    PRIMARY KEY (tp_id),
    KEY idx_tp__tp_id (tp_id),
    KEY idx_tp__t_id (t_id),
    KEY idx_tp__p_id (p_id),
    CONSTRAINT tour_playlist_ibfk_1 FOREIGN KEY (t_id) REFERENCES tour (t_id) ON DELETE CASCADE,
    CONSTRAINT tour_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
CREATE INDEX IF NOT EXISTS idx_TP__TP_POS ON tour_playlist (tp_pos);

DROP TABLE IF EXISTS tour_poi;
CREATE TABLE IF NOT EXISTS tour_poi
(
    tpoi_id  int(11) NOT NULL AUTO_INCREMENT,
    t_id   int(11) NOT NULL DEFAULT '0',
    poi_id   int(11) NOT NULL DEFAULT '0',
    tpoi_pos int(11) NOT NULL,
    tpoi_type int(11) NOT NULL,
    PRIMARY KEY (tpoi_id),
    KEY idx_tpoi__tpoi_id (tpoi_id),
    KEY idx_tpoi__t_id (t_id),
    KEY idx_tpoi__poi_id (poi_id),
    CONSTRAINT tour_poi_ibfk_1 FOREIGN KEY (t_id) REFERENCES tour (t_id) ON DELETE CASCADE,
    CONSTRAINT tour_poi_ibfk_2 FOREIGN KEY (poi_id) REFERENCES poi (poi_id) ON DELETE CASCADE
) ENGINE = MyISAM AUTO_INCREMENT = 1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
CREATE INDEX IF NOT EXISTS idx_TPOI__TPOI_POS ON tour_poi (tpoi_pos);

-- ---------------
-- track-data
-- ---------------
DROP TABLE IF EXISTS kategorie_full;
CREATE TABLE kategorie_full (
  k_id int(11) NOT NULL AUTO_INCREMENT,
  t_id int(11),
  d_id VARCHAR(80) DEFAULT NULL,
  k_t_ids varchar(2000) COLLATE utf8_general_ci DEFAULT NULL,
  k_t_ids_full varchar(2000) COLLATE utf8_general_ci DEFAULT NULL,
  k_d_ids varchar(2000) COLLATE utf8_general_ci DEFAULT NULL,
  k_d_ids_full varchar(2000) COLLATE utf8_general_ci DEFAULT NULL,
  i_id int(11) DEFAULT NULL,
  l_id int(11),
  tr_id int(11),
  k_gesperrt int(11) DEFAULT 1,
  k_datebis datetime DEFAULT NULL,
  k_datevon datetime DEFAULT NULL,
  k_gpstracks_basefile char(255) COLLATE utf8_general_ci DEFAULT NULL,
  k_gpstracks_state TINYINT DEFAULT 0,
  k_gps_lat float DEFAULT NULL,
  k_gps_lon float DEFAULT NULL,
  k_meta_shortdesc mediumtext COLLATE utf8_general_ci,
  k_name char(255) COLLATE utf8_general_ci DEFAULT NULL,
  k_html mediumtext COLLATE utf8_general_ci,
  k_keywords mediumtext COLLATE utf8_general_ci,
  k_persons mediumtext COLLATE utf8_general_ci,
  k_objects mediumtext COLLATE utf8_general_ci,
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
  k_meta_shortdesc_md text COLLATE utf8_general_ci,
  k_meta_shortdesc_html text COLLATE utf8_general_ci,
  k_route_attr VARCHAR(255) COLLATE utf8_general_ci DEFAULT NULL,
  n_id int(11) DEFAULT NULL,
  k_dateshow date DEFAULT NULL,
  k_calced_id VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  k_calced_linkedplaylists VARCHAR(2000) DEFAULT NULL,
  k_calced_linkedroutes VARCHAR(2000) DEFAULT NULL,
  k_calced_linkedpois VARCHAR(2000) DEFAULT NULL,
  k_calced_navigation_objects VARCHAR(2000) DEFAULT NULL,
  k_calced_extended_object_properties VARCHAR(2000) DEFAULT NULL,
  k_calced_actiontype VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  k_calced_altAscFacet DECIMAL UNSIGNED DEFAULT NULL,
  k_calced_altMaxFacet DECIMAL UNSIGNED DEFAULT NULL,
  k_calced_distFacet DECIMAL(11, 1) DEFAULT NULL,
  k_calced_dur DECIMAL(11, 2) DEFAULT NULL,
  k_calced_durFacet DECIMAL(11, 1) DEFAULT NULL,
  k_calced_dateonly VARCHAR(20) COLLATE utf8_general_ci DEFAULT NULL,
  k_calced_week tinyint DEFAULT NULL,
  k_calced_month tinyint DEFAULT NULL,
  k_calced_year SMALLINT  DEFAULT NULL,
  countImages int(11) DEFAULT 0,
  countImagesTop int(11) DEFAULT 0,
  countPois int(11) DEFAULT 0,
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
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS kategorie_tour;
CREATE TABLE kategorie_tour (
  t_id int(11) NOT NULL,
  k_id int(11) NOT NULL,
  kt_full int(11) DEFAULT '0',
  kt_route_attr VARCHAR(255) COLLATE utf8_general_ci DEFAULT NULL,
  KEY t_id (t_id),
  KEY k_id (k_id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS kategorie_playlist;
CREATE TABLE kategorie_playlist
(
    kp_id  int(11) NOT NULL AUTO_INCREMENT,
    k_id   int(11) NOT NULL DEFAULT '0',
    p_id   int(11) NOT NULL DEFAULT '0',
    kp_pos int(11)          DEFAULT NULL,
    kp_details varchar(1000) COLLATE utf8_general_ci DEFAULT NULL,
    PRIMARY KEY (kp_id),
    KEY idx_kp__kp_id (kp_id),
    KEY idx_kp__k_id (k_id),
    KEY idx_kp__p_id (p_id),
    CONSTRAINT kategorie_playlist_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie_full (k_id) ON DELETE CASCADE,
    CONSTRAINT kategorie_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
CREATE INDEX IF NOT EXISTS idx_KP__KP_POS ON kategorie_playlist (kp_pos);

DROP TABLE IF EXISTS kategorie_poi;
CREATE TABLE IF NOT EXISTS kategorie_poi
(
    kpoi_id  int(11) NOT NULL AUTO_INCREMENT,
    k_id   int(11) NOT NULL DEFAULT '0',
    poi_id   int(11) NOT NULL DEFAULT '0',
    kpoi_pos int(11) NOT NULL,
    kpoi_type int(11) NOT NULL,
    PRIMARY KEY (kpoi_id),
    KEY idx_kpoi__kpoi_id (kpoi_id),
    KEY idx_kpoi__k_id (k_id),
    KEY idx_kpoi__poi_id (poi_id),
    CONSTRAINT kategorie_poi_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie_full (k_id) ON DELETE CASCADE,
    CONSTRAINT kategorie_poi_ibfk_2 FOREIGN KEY (poi_id) REFERENCES poi (poi_id) ON DELETE CASCADE
) ENGINE = MyISAM AUTO_INCREMENT = 1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
CREATE INDEX IF NOT EXISTS idx_KPOI__KPOI_POS ON kategorie_poi (kpoi_pos);

-- ---------------
-- image-data
-- ---------------
DROP TABLE IF EXISTS image;
CREATE TABLE image (
  i_id int(11) NOT NULL AUTO_INCREMENT,
  k_id int(11) NOT NULL,
  t_id int(11) DEFAULT NULL,
  d_id VARCHAR(80) DEFAULT NULL,
  i_katname text COLLATE utf8_general_ci,
  i_katdesc text COLLATE utf8_general_ci,
  i_gesperrt int(11) DEFAULT 1,
  i_lochirarchie text COLLATE utf8_general_ci,
  i_date datetime DEFAULT NULL,
  i_dir char(255) COLLATE utf8_general_ci DEFAULT NULL,
  i_file char(255) COLLATE utf8_general_ci DEFAULT NULL,
  i_keywords text COLLATE utf8_general_ci,
  i_persons mediumtext COLLATE utf8_general_ci,
  i_objects mediumtext COLLATE utf8_general_ci,
  i_objectdetections text COLLATE utf8_general_ci,
  i_gps_lat float DEFAULT NULL,
  i_gps_lon float DEFAULT NULL,
  i_gps_ele float DEFAULT NULL,
  i_rate int(11) DEFAULT NULL,
  i_rate_motive int(11) DEFAULT NULL,
  i_rate_wichtigkeit int(11) DEFAULT NULL,
  i_dateshow date DEFAULT NULL,
  i_calced_id VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  i_calced_linkedplaylists VARCHAR(2000) DEFAULT NULL,
  i_calced_navigation_objects VARCHAR(2000) DEFAULT NULL,
  i_calced_extended_object_properties VARCHAR(2000) DEFAULT NULL,
  i_calced_path VARCHAR(255) COLLATE utf8_general_ci DEFAULT NULL,
  i_calced_gps_loc VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  i_calced_gps_lat VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  i_calced_gps_lon VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  i_calced_altMaxFacet DECIMAL UNSIGNED DEFAULT NULL,
  i_calced_dateonly VARCHAR(20) COLLATE utf8_general_ci DEFAULT NULL,
  i_calced_week tinyint DEFAULT NULL,
  i_calced_month tinyint DEFAULT NULL,
  i_calced_year smallint DEFAULT NULL,
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
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS image_playlist;
CREATE TABLE image_playlist (
  ip_id int(11) NOT NULL AUTO_INCREMENT,
  i_id int(11) NOT NULL DEFAULT '0',
  p_id int(11) NOT NULL DEFAULT '0',
  ip_pos int(11) DEFAULT NULL,
  ip_details varchar(1000) COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (ip_id),
  KEY idx_ip__ip_id (ip_id),
  KEY idx_ip__i_id (i_id),
  KEY idx_ik__p_id (p_id),
  CONSTRAINT image_playlist_ibfk_1 FOREIGN KEY (i_id) REFERENCES image (i_id) ON DELETE CASCADE,
  CONSTRAINT image_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
CREATE INDEX IF NOT EXISTS idx_IP__IP_POS ON image_playlist (ip_pos);

-- ---------------
-- video-data
-- ---------------
DROP TABLE IF EXISTS video;
CREATE TABLE video (
  v_id int(11) NOT NULL AUTO_INCREMENT,
  k_id int(11) NOT NULL,
  t_id int(11) DEFAULT NULL,
  d_id VARCHAR(80) DEFAULT NULL,
  v_katname text COLLATE utf8_general_ci,
  v_katdesc text COLLATE utf8_general_ci,
  v_gesperrt int(11) DEFAULT 1,
  v_lochirarchie text COLLATE utf8_general_ci,
  v_date datetime DEFAULT NULL,
  v_dir char(255) COLLATE utf8_general_ci DEFAULT NULL,
  v_file char(255) COLLATE utf8_general_ci DEFAULT NULL,
  v_keywords text COLLATE utf8_general_ci,
  v_persons mediumtext COLLATE utf8_general_ci,
  v_objects mediumtext COLLATE utf8_general_ci,
  v_gps_lat float DEFAULT NULL,
  v_gps_lon float DEFAULT NULL,
  v_gps_ele float DEFAULT NULL,
  v_rate int(11) DEFAULT NULL,
  v_rate_motive int(11) DEFAULT NULL,
  v_rate_wichtigkeit int(11) DEFAULT NULL,
  v_objectdetections text COLLATE utf8_general_ci,
  v_dateshow date DEFAULT NULL,
  v_calced_id VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  v_calced_linkedplaylists VARCHAR(2000) DEFAULT NULL,
  v_calced_navigation_objects VARCHAR(2000) DEFAULT NULL,
  v_calced_extended_object_properties VARCHAR(2000) DEFAULT NULL,
  v_calced_path VARCHAR(255) COLLATE utf8_general_ci DEFAULT NULL,
  v_calced_gps_loc VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  v_calced_gps_lat VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  v_calced_gps_lon VARCHAR(50) COLLATE utf8_general_ci DEFAULT NULL,
  v_calced_altMaxFacet DECIMAL UNSIGNED DEFAULT NULL,
  v_calced_dateonly VARCHAR(20) COLLATE utf8_general_ci DEFAULT NULL,
  v_calced_week tinyint DEFAULT NULL,
  v_calced_month tinyint DEFAULT NULL,
  v_calced_year smallint DEFAULT NULL,
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
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS video_playlist;
CREATE TABLE video_playlist (
  vp_id int(11) NOT NULL AUTO_INCREMENT,
  v_id int(11) NOT NULL DEFAULT '0',
  p_id int(11) NOT NULL DEFAULT '0',
  vp_pos int(11) DEFAULT NULL,
  vp_details varchar(1000) COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (vp_id),
  KEY idx_vp__vp_id (vp_id),
  KEY idx_vp__v_id (v_id),
  KEY idx_vk__p_id (p_id),
  CONSTRAINT video_playlist_ibfk_1 FOREIGN KEY (v_id) REFERENCES video (v_id) ON DELETE CASCADE,
  CONSTRAINT video_playlist_ibfk_2 FOREIGN KEY (p_id) REFERENCES playlist (p_id) ON DELETE CASCADE
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
CREATE INDEX IF NOT EXISTS idx_VP__VP_POS ON video_playlist (Vp_pos);

