/* #############
# add columns for caching
############# */
ALTER TABLE image ADD COLUMN i_calced_path VARCHAR(255) GENERATED ALWAYS AS (LOWER(I_dir || "/" || i_file)) VIRTUAL;
CREATE INDEX IF NOT EXISTS idx_I__I_CALCED_PATH ON image (i_calced_path);
ALTER TABLE image ADD COLUMN i_calced_path2 VARCHAR(255) GENERATED ALWAYS AS (LOWER(I_dir || "_" || i_file)) VIRTUAL;
CREATE INDEX IF NOT EXISTS idx_I__I_CALCED_PATH2 ON image (i_calced_path2);
ALTER TABLE image ADD COLUMN i_calced_file VARCHAR(255) GENERATED ALWAYS AS (LOWER(i_file)) VIRTUAL;
CREATE INDEX IF NOT EXISTS idx_I__I_CALCED_FILE ON image (i_calced_file);
CREATE INDEX IF NOT EXISTS idx_I__I_FILE ON image (i_file);

ALTER TABLE video ADD COLUMN v_calced_path VARCHAR(255) GENERATED ALWAYS AS (LOWER(v_dir || "/" || v_file)) VIRTUAL;
CREATE INDEX IF NOT EXISTS idx_V__V_CALCED_PATH ON video (v_calced_path);
ALTER TABLE video ADD COLUMN v_calced_path2 VARCHAR(255) GENERATED ALWAYS AS (LOWER(v_dir || "_" || v_file)) VIRTUAL;
CREATE INDEX IF NOT EXISTS idx_V__V_CALCED_PATH2 ON video (v_calced_path2);
ALTER TABLE video ADD COLUMN v_calced_file VARCHAR(255) GENERATED ALWAYS AS (LOWER(v_file)) VIRTUAL;
CREATE INDEX IF NOT EXISTS idx_V__V_CALCED_FILE ON video (v_calced_file);
CREATE INDEX IF NOT EXISTS idx_V__V_FILE ON video (V_FILE);
