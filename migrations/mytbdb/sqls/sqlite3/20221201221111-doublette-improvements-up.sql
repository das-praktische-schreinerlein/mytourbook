-- ------------------------------------
-- improve doublette-model
-- ------------------------------------

ALTER TABLE info ADD COLUMN if_key VARCHAR(255) NOT NULL DEFAULT '';
UPDATE info SET if_key=REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(if_name), "ß", "ss"), "ö", "oe"), "ü", "ue"), "ä", "ae"), "[^a-z0-9]", "");
DROP INDEX IF EXISTS idx_if__if_ke;
CREATE INDEX idx_if__if_key ON info (if_key);

ALTER TABLE news ADD COLUMN n_key VARCHAR(255) NOT NULL DEFAULT '';
UPDATE news SET n_key=REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(n_headline), "ß", "ss"), "ö", "oe"), "ü", "ue"), "ä", "ae"), "[^a-z0-9]", "");
DROP INDEX IF EXISTS idx_n__n_ke;
CREATE INDEX idx_n__n_key ON news (n_key);

ALTER TABLE trip ADD COLUMN tr_key VARCHAR(255) NOT NULL DEFAULT '';
UPDATE trip SET tr_key=REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(tr_name), "ß", "ss"), "ö", "oe"), "ü", "ue"), "ä", "ae"), "[^a-z0-9]", "");
DROP INDEX IF EXISTS idx_tr__tr_key;
CREATE INDEX idx_tr__tr_key ON trip (tr_key);

ALTER TABLE playlist ADD COLUMN p_key VARCHAR(255) NOT NULL DEFAULT '';
UPDATE playlist SET p_key=REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(p_name), "ß", "ss"), "ö", "oe"), "ü", "ue"), "ä", "ae"), "[^a-z0-9]", "");
DROP INDEX IF EXISTS idx_p__p_ke;
CREATE INDEX idx_p__p_key ON playlist (p_key);
