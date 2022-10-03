-- ----------------
-- add and set fields for state of gpx-data
-- ----------------

-- drop fields
ALTER TABLE kategorie DROP COLUMN k_gpstracks_state;
ALTER TABLE tour DROP COLUMN t_gpstracks_state;
ALTER TABLE location DROP COLUMN l_geo_state;
