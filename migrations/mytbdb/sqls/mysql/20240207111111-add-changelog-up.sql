-- ------------------------------------
-- add changelog
-- ------------------------------------

ALTER TABLE image ADD COLUMN IF NOT EXISTS i_createdat DATE;
ALTER TABLE image ADD COLUMN IF NOT EXISTS i_updatedat DATE;
ALTER TABLE image ADD COLUMN IF NOT EXISTS i_updateversion INTEGER;

ALTER TABLE info ADD COLUMN IF NOT EXISTS if_createdat DATE;
ALTER TABLE info ADD COLUMN IF NOT EXISTS if_updatedat DATE;
ALTER TABLE info ADD COLUMN IF NOT EXISTS if_updateversion INTEGER;

ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_createdat DATE;
ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_updatedat DATE;
ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_updateversion INTEGER;

ALTER TABLE location ADD COLUMN IF NOT EXISTS l_createdat DATE;
ALTER TABLE location ADD COLUMN IF NOT EXISTS l_updatedat DATE;
ALTER TABLE location ADD COLUMN IF NOT EXISTS l_updateversion INTEGER;

ALTER TABLE news ADD COLUMN IF NOT EXISTS n_createdat DATE;
ALTER TABLE news ADD COLUMN IF NOT EXISTS n_updatedat DATE;
ALTER TABLE news ADD COLUMN IF NOT EXISTS n_updateversion INTEGER;

ALTER TABLE playlist ADD COLUMN IF NOT EXISTS p_createdat DATE;
ALTER TABLE playlist ADD COLUMN IF NOT EXISTS p_updatedat DATE;
ALTER TABLE playlist ADD COLUMN IF NOT EXISTS p_updateversion INTEGER;

ALTER TABLE poi ADD COLUMN IF NOT EXISTS poi_createdat DATE;
ALTER TABLE poi ADD COLUMN IF NOT EXISTS poi_updatedat DATE;
ALTER TABLE poi ADD COLUMN IF NOT EXISTS poi_updateversion INTEGER;

ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_createdat DATE;
ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_updatedat DATE;
ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_updateversion INTEGER;

ALTER TABLE trip ADD COLUMN IF NOT EXISTS tr_createdat DATE;
ALTER TABLE trip ADD COLUMN IF NOT EXISTS tr_updatedat DATE;
ALTER TABLE trip ADD COLUMN IF NOT EXISTS tr_updateversion INTEGER;

ALTER TABLE video ADD COLUMN IF NOT EXISTS v_createdat DATE;
ALTER TABLE video ADD COLUMN IF NOT EXISTS v_updatedat DATE;
ALTER TABLE video ADD COLUMN IF NOT EXISTS v_updateversion INTEGER;
