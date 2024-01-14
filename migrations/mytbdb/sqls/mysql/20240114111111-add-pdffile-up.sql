-- ----------------
-- add pdffile-fields
-- ----------------
ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_pdffile VARCHAR(250) DEFAULT NULL;
ALTER TABLE image ADD COLUMN IF NOT EXISTS i_pdffile VARCHAR(250) DEFAULT NULL;
ALTER TABLE info ADD COLUMN IF NOT EXISTS if_pdffile VARCHAR(250) DEFAULT NULL;
ALTER TABLE location ADD COLUMN IF NOT EXISTS l_pdffile VARCHAR(250) DEFAULT NULL;
ALTER TABLE news ADD COLUMN IF NOT EXISTS n_pdffile VARCHAR(250) DEFAULT NULL;
ALTER TABLE poi ADD COLUMN IF NOT EXISTS poi_pdffile VARCHAR(250) DEFAULT NULL;
ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_pdffile VARCHAR(250) DEFAULT NULL;
ALTER TABLE trip ADD COLUMN IF NOT EXISTS tr_pdffile VARCHAR(250) DEFAULT NULL;
