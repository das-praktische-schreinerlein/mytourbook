-- ------------------------------------
-- doublette functions
-- ------------------------------------
select 1;

-- ------------------------------------
-- doublette indexes
-- ------------------------------------
DROP INDEX IF EXISTS idx_I__I_DIR_FILE;
CREATE INDEX idx_I__I_DIR_FILE ON image (I_DIR, I_FILE) ;
DROP INDEX IF EXISTS idx_io__io_precision;
CREATE INDEX idx_io__io_precision ON image_object (io_precision) ;

-- ------------------------------------
-- fields
-- ------------------------------------

ALTER TABLE tour ADD COLUMN t_key VARCHAR(255) NOT NULL DEFAULT '' ;
UPDATE tour SET t_key=REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(t_name), "ß", "ss"), "ö", "oe"), "ü", "ue"), "ä", "ae"), "[^a-z0-9]", "") ;
DROP INDEX IF EXISTS idx_t__t_key;
CREATE INDEX idx_t__t_key ON tour (t_key);

ALTER TABLE location ADD COLUMN l_key VARCHAR(255) NOT NULL DEFAULT '' ;
UPDATE location SET l_key=REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(l_name), "ß", "ss"), "ö", "oe"), "ü", "ue"), "ä", "ae"), "[^a-z0-9]", "") ;
DROP INDEX IF EXISTS idx_l__l_key;
CREATE INDEX idx_l__l_key ON location (l_key);
