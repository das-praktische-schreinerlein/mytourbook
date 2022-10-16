-- ----------------
-- add poi-join-tables
-- ----------------

CREATE TABLE IF NOT EXISTS tour_poi
(
    tpoi_id  integer PRIMARY KEY,
    t_id   integer NOT NULL DEFAULT '0',
    poi_id   integer NOT NULL DEFAULT '0',
    tpoi_pos integer NOT NULL,
    tpoi_type integer NOT NULL,
    CONSTRAINT tour_poi_ibfk_1 FOREIGN KEY (t_id) REFERENCES tour (t_id) ON DELETE CASCADE,
    CONSTRAINT tour_poi_ibfk_2 FOREIGN KEY (poi_id) REFERENCES poi (poi_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS kategorie_poi
(
    kpoi_id  integer PRIMARY KEY,
    k_id   integer NOT NULL DEFAULT '0',
    poi_id   integer NOT NULL DEFAULT '0',
    kpoi_pos integer NOT NULL,
    kpoi_type integer NOT NULL,
    CONSTRAINT kategorie_poi_ibfk_1 FOREIGN KEY (k_id) REFERENCES kategorie (k_id) ON DELETE CASCADE,
    CONSTRAINT kategorie_poi_ibfk_2 FOREIGN KEY (poi_id) REFERENCES poi (poi_id) ON DELETE CASCADE
    );

