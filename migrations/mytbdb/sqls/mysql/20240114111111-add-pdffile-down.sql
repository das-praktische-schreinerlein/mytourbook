-- ----------------
-- drop pdffile-fields
-- ----------------
ALTER TABLE kategorie DROP COLUMN IF EXISTS k_pdffile;
ALTER TABLE image DROP COLUMN IF EXISTS i_pdffile;
ALTER TABLE info DROP COLUMN IF EXISTS if_pdffile;
ALTER TABLE location DROP COLUMN IF EXISTS l_pdffile;
ALTER TABLE news DROP COLUMN IF EXISTS n_pdffile;
ALTER TABLE poi DROP COLUMN IF EXISTS poi_pdffile;
ALTER TABLE tour DROP COLUMN IF EXISTS t_pdffile;
ALTER TABLE trip DROP COLUMN IF EXISTS tr_pdffile;
