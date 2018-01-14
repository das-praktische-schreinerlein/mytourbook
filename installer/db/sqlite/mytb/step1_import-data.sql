-----------------
--- configuration-tables
-----------------
DROP TABLE IF EXISTS rates;
CREATE TABLE rates (
  r_id int(11) NOT NULL,
  r_fieldname varchar(80) DEFAULT NULL,
  r_fieldvalue int(11) DEFAULT NULL,
  r_grade varchar(80) DEFAULT NULL,
  r_grade_desc varchar(80) DEFAULT NULL
);

-----------------
--- news-data
-----------------
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
  n_keywords text
);

-----------------
--- trip-data
-----------------
DROP TABLE IF EXISTS trip;
CREATE TABLE trip (
  tr_id int(11) NOT NULL PRIMARY KEY,
  i_id int(11) DEFAULT NULL,
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
  tr_dateshow date DEFAULT NULL
);

-----------------
--- location-data
-----------------
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
  l_meta_shortdesc_md text,
  l_meta_shortdesc_html text,
  l_keywords text
);

-----------------
--- tour-data
-----------------
DROP TABLE IF EXISTS tour;
CREATE TABLE tour (
  t_id int(11) NOT NULL PRIMARY KEY,
  l_id int(11) NOT NULL,
  k_id int(11) DEFAULT NULL,
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
  t_dateshow date DEFAULT NULL
);

-----------------
--- track-data
-----------------
DROP TABLE IF EXISTS kategorie_full;
CREATE TABLE kategorie_full (
  k_id int(11) NOT NULL PRIMARY KEY,
  t_id int(11) NOT NULL,
  k_t_ids varchar(2000) DEFAULT NULL,
  k_t_ids_full varchar(2000) DEFAULT NULL,
  i_id int(11) DEFAULT NULL,
  l_id int(11) NOT NULL,
  tr_id int(11) NOT NULL,
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
  k_dateshow date DEFAULT NULL
);

-----------------
--- image-data
-----------------
DROP TABLE IF EXISTS image;
CREATE TABLE image (
  i_id int(11) NOT NULL PRIMARY KEY,
  k_id int(11) NOT NULL,
  t_id int(11) DEFAULT NULL,
  i_katname text,
  i_katdesc text,
  i_gesperrt int(11) DEFAULT NULL,
  i_lochirarchie text,
  i_date datetime DEFAULT NULL,
  i_dir char(255) DEFAULT NULL,
  i_file char(255) DEFAULT NULL,
  i_keywords text,
  i_gps_lat float DEFAULT NULL,
  i_gps_lon float DEFAULT NULL,
  i_gps_ele float DEFAULT NULL,
  i_rate int(11) DEFAULT NULL,
  i_rate_motive int(11) DEFAULT NULL,
  i_rate_wichtigkeit int(11) DEFAULT NULL,
  i_image_objects text,
  i_dateshow date DEFAULT NULL
);

