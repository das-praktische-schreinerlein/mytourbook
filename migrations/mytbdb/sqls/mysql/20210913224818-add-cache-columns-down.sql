/* #############
# add columns for caching
############# */
ALTER TABLE image DROP COLUMN IF EXISTS i_calced_path;
DROP INDEX IF EXISTS idx_I__I_CALCED_PATH ON image;
ALTER TABLE image DROP COLUMN IF EXISTS i_calced_path2;
DROP INDEX IF EXISTS idx_I__I_CALCED_PATH2 ON image;
ALTER TABLE image DROP COLUMN IF EXISTS i_calced_file;
DROP INDEX IF EXISTS idx_I__I_CALCED_FILE ON image;
DROP INDEX IF EXISTS idx_I__I_FILE ON image;

ALTER TABLE video DROP COLUMN IF EXISTS v_calced_path;
DROP INDEX IF EXISTS idx_V__V_CALCED_PATH ON video;
ALTER TABLE video DROP COLUMN IF EXISTS v_calced_path2;
DROP INDEX IF EXISTS idx_V__V_CALCED_PATH2 ON video;
ALTER TABLE video DROP COLUMN IF EXISTS v_calced_file;
DROP INDEX IF EXISTS idx_V__V_CALCED_FILE ON video;
DROP INDEX IF EXISTS idx_V__V_FILE ON video;
