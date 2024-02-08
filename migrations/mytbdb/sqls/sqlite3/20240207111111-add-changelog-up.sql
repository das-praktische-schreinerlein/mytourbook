-- ------------------------------------
-- add changelog
-- ------------------------------------

ALTER TABLE image ADD COLUMN i_createdat DATE;
ALTER TABLE image ADD COLUMN i_updatedat DATE;
ALTER TABLE image ADD COLUMN i_updateversion INTEGER;

ALTER TABLE info ADD COLUMN if_createdat DATE;
ALTER TABLE info ADD COLUMN if_updatedat DATE;
ALTER TABLE info ADD COLUMN if_updateversion INTEGER;

ALTER TABLE kategorie ADD COLUMN k_createdat DATE;
ALTER TABLE kategorie ADD COLUMN k_updatedat DATE;
ALTER TABLE kategorie ADD COLUMN k_updateversion INTEGER;

ALTER TABLE location ADD COLUMN l_createdat DATE;
ALTER TABLE location ADD COLUMN l_updatedat DATE;
ALTER TABLE location ADD COLUMN l_updateversion INTEGER;

ALTER TABLE news ADD COLUMN n_createdat DATE;
ALTER TABLE news ADD COLUMN n_updatedat DATE;
ALTER TABLE news ADD COLUMN n_updateversion INTEGER;

ALTER TABLE playlist ADD COLUMN p_createdat DATE;
ALTER TABLE playlist ADD COLUMN p_updatedat DATE;
ALTER TABLE playlist ADD COLUMN p_updateversion INTEGER;

ALTER TABLE poi ADD COLUMN poi_createdat DATE;
ALTER TABLE poi ADD COLUMN poi_updatedat DATE;
ALTER TABLE poi ADD COLUMN poi_updateversion INTEGER;

ALTER TABLE tour ADD COLUMN t_createdat DATE;
ALTER TABLE tour ADD COLUMN t_updatedat DATE;
ALTER TABLE tour ADD COLUMN t_updateversion INTEGER;

ALTER TABLE trip ADD COLUMN tr_createdat DATE;
ALTER TABLE trip ADD COLUMN tr_updatedat DATE;
ALTER TABLE trip ADD COLUMN tr_updateversion INTEGER;

ALTER TABLE video ADD COLUMN v_createdat DATE;
ALTER TABLE video ADD COLUMN v_updatedat DATE;
ALTER TABLE video ADD COLUMN v_updateversion INTEGER;
