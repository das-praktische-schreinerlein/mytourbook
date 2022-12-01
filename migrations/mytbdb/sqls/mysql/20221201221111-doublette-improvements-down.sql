-- ----------------
-- improve model
-- ----------------
ALTER TABLE info DROP COLUMN IF EXISTS if_key;
ALTER TABLE news DROP COLUMN IF EXISTS n_key;
ALTER TABLE trip DROP COLUMN IF EXISTS tr_key;
ALTER TABLE playlist DROP COLUMN IF EXISTS p_key;
