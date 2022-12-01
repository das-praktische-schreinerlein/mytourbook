-- ------------------------------------
-- improve doublette-model
-- ------------------------------------
ALTER TABLE info ADD COLUMN IF NOT EXISTS if_key VARCHAR(255) NOT NULL DEFAULT '';
UPDATE info SET if_key=REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(if_name), "ß", "ss"), "ö", "oe"), "ü", "ue"), "ä", "ae"), "[^a-z0-9]", "");
DROP INDEX IF EXISTS idx_if__if_key ON info;
CREATE INDEX idx_if__if_key ON info (if_key);

ALTER TABLE news ADD COLUMN IF NOT EXISTS n_key VARCHAR(255) NOT NULL DEFAULT '';
UPDATE news SET n_key=REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(n_headline), "ß", "ss"), "ö", "oe"), "ü", "ue"), "ä", "ae"), "[^a-z0-9]", "");
DROP INDEX IF EXISTS idx_n__n_key ON news;
CREATE INDEX idx_n__n_key ON news (n_key);

ALTER TABLE trip ADD COLUMN IF NOT EXISTS tr_key VARCHAR(255) NOT NULL DEFAULT '';
UPDATE trip SET tr_key=REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(tr_name), "ß", "ss"), "ö", "oe"), "ü", "ue"), "ä", "ae"), "[^a-z0-9]", "");
DROP INDEX IF EXISTS idx_tr__tr_key ON trip;
CREATE INDEX idx_tr__tr_key ON trip (tr_key);

ALTER TABLE playlist ADD COLUMN IF NOT EXISTS p_key VARCHAR(255) NOT NULL DEFAULT '';
UPDATE playlist SET p_key=REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(p_name), "ß", "ss"), "ö", "oe"), "ü", "ue"), "ä", "ae"), "[^a-z0-9]", "");
DROP INDEX IF EXISTS idx_p__p_key ON playlist;
CREATE INDEX idx_p__p_key ON playlist (p_key);
