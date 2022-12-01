-- ----------------
-- improve model
-- ----------------
ALTER TABLE poi ADD COLUMN poi_calced_identifier VARCHAR(255) GENERATED ALWAYS AS (poi_name || " " || COALESCE(poi_reference, "")) VIRTUAL;
