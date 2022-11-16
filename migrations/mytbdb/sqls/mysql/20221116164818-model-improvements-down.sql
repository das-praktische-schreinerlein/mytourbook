-- ----------------
-- improve model
-- ----------------
ALTER TABLE poi DROP COLUMN IF EXISTS poi_calced_subtype;
ALTER TABLE poi DROP COLUMN IF EXISTS l_id int(11) DEFAULT NULL;
ALTER TABLE poi DROP CONSTRAINT poi_ibfk_l;

