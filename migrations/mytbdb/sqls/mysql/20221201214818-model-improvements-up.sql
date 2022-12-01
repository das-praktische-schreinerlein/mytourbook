-- ----------------
-- improve model
-- ----------------
ALTER TABLE poi ADD COLUMN IF NOT EXISTS poi_calced_identifier VARCHAR(255) GENERATED ALWAYS AS (CONCAT(poi_name, " ", COALESCE(poi_reference, ""))) STORED;
