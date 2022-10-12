-- ----------------
-- add poi-tables
-- ----------------

CREATE TABLE IF NOT EXISTS poi (
    poi_id int(11) NOT NULL AUTO_INCREMENT,
    poi_meta_desc text COLLATE utf8_general_ci,
    poi_name varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
    poi_reference varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
    poi_geo_longdeg float DEFAULT NULL,
    poi_geo_latdeg float DEFAULT NULL,
    poi_geo_ele float DEFAULT NULL,
    poi_calced_gps_loc VARCHAR(50) GENERATED ALWAYS AS (CONCAT(poi_GEO_LATDEG, ',', poi_GEO_LONGDEG)) STORED,
    poi_calced_gps_lat VARCHAR(50) GENERATED ALWAYS AS (CAST(poi_GEO_LATDEG AS CHAR(50))) STORED,
    poi_calced_gps_lon VARCHAR(50) GENERATED ALWAYS AS (CAST(poi_GEO_LONGDEG AS CHAR(50))) STORED,
    poi_calced_altMaxFacet DECIMAL UNSIGNED GENERATED ALWAYS AS (ROUND((poi_geo_ele / 500)) * 500) STORED,
    PRIMARY KEY (poi_id),
    KEY idx_poi__poi_id (poi_id)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS poi_keyword (
    poik_id int(11) NOT NULL AUTO_INCREMENT,
    poi_id int(11) NOT NULL DEFAULT '0',
    kw_id int(11) NOT NULL DEFAULT '0',
    PRIMARY KEY (poik_id),
    KEY idx_poik__poik_id (poik_id),
    KEY idx_poik__poi_id (poi_id),
    KEY idx_poik__kw_id (kw_id),
    CONSTRAINT poi_keyword_ibfk_1 FOREIGN KEY (poi_id) REFERENCES poi (poi_id) ON DELETE CASCADE,
    CONSTRAINT poi_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id) ON DELETE CASCADE
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS poi_info (
    poiif_id int(11) NOT NULL AUTO_INCREMENT,
    if_id int(11) NOT NULL,
    poi_id int(11) NOT NULL,
    poiif_linked_details varchar(255) COLLATE utf8_general_ci DEFAULT NULL,
    PRIMARY KEY (poiif_id),
    KEY idx_poiif__poiif_id (poiif_id),
    KEY idx_poiif__if_id (if_id),
    KEY idx_poiif__poi_id (poi_id),
    CONSTRAINT poi_info_ibfk_1 FOREIGN KEY (if_id) REFERENCES info (if_id) ON DELETE CASCADE,
    CONSTRAINT poi_info_ibfk_2 FOREIGN KEY (poi_id) REFERENCES poi (poi_id) ON DELETE CASCADE
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
