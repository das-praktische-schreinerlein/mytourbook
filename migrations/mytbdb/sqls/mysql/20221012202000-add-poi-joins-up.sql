-- ----------------
-- add poi-join-tables
-- ----------------

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
    ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
CREATE INDEX IF NOT EXISTS idx_TPOI__TPOI_POS ON tour_poi (tpoi_pos);

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
    CONSTRAINT kategorie_poi_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id) ON DELETE CASCADE,
    CONSTRAINT kategorie_poi_ibfk_2 FOREIGN KEY (poi_id) REFERENCES poi (poi_id) ON DELETE CASCADE
    ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
CREATE INDEX IF NOT EXISTS idx_KPOI__KPOI_POS ON kategorie_poi (kpoi_pos);

