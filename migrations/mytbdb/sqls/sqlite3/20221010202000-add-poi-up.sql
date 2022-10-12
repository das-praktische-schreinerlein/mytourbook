-- ----------------
-- add poi-tables
-- ----------------

CREATE TABLE IF NOT EXISTS poi (
    poi_id integer PRIMARY KEY,
    poi_meta_desc text,
    poi_name varchar(255) DEFAULT NULL,
    poi_reference varchar(255) DEFAULT NULL,
    poi_geo_longdeg float DEFAULT NULL,
    poi_geo_latdeg float DEFAULT NULL,
    poi_geo_ele float DEFAULT NULL,
    poi_calced_gps_loc VARCHAR(50) GENERATED ALWAYS AS (poi_GEO_LATDEG || ',' || poi_GEO_LONGDEG) STORED,
    poi_calced_gps_lat VARCHAR(50) GENERATED ALWAYS AS (CAST(poi_GEO_LATDEG AS CHAR(50))) STORED,
    poi_calced_gps_lon VARCHAR(50) GENERATED ALWAYS AS (CAST(poi_GEO_LONGDEG AS CHAR(50))) STORED,
    poi_calced_altMaxFacet DECIMAL UNSIGNED GENERATED ALWAYS AS (ROUND((poi_geo_ele / 500)) * 500) STORED
    );

CREATE TABLE IF NOT EXISTS poi_keyword (
    poik_id integer PRIMARY KEY,
    poi_id integer NOT NULL DEFAULT '0',
    kw_id integer NOT NULL DEFAULT '0',
    CONSTRAINT poi_keyword_ibfk_1 FOREIGN KEY (poi_id) REFERENCES poi (poi_id) ON DELETE CASCADE,
    CONSTRAINT poi_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword (kw_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS poi_info (
    poiif_id integer PRIMARY KEY,
    if_id  integer NOT NULL,
    poi_id integer NOT NULL,
    poiif_linked_details varchar(255) DEFAULT NULL,
    CONSTRAINT poi_info_ibfk_1 FOREIGN KEY (if_id) REFERENCES info (if_id) ON DELETE CASCADE,
    CONSTRAINT poi_info_ibfk_2 FOREIGN KEY (poi_id) REFERENCES poi (poi_id) ON DELETE CASCADE
    );
