-- ----------------
-- drop mediameta-fields
-- ----------------
ALTER TABLE image DROP COLUMN IF EXISTS i_datefile;
ALTER TABLE image DROP COLUMN IF EXISTS i_daterecording;
ALTER TABLE image DROP COLUMN IF EXISTS i_filesize;
ALTER TABLE image DROP COLUMN IF EXISTS i_metadata;
ALTER TABLE image DROP COLUMN IF EXISTS i_resolution;

ALTER TABLE video DROP COLUMN IF EXISTS v_datefile;
ALTER TABLE video DROP COLUMN IF EXISTS v_daterecording;
ALTER TABLE video DROP COLUMN IF EXISTS v_duration;
ALTER TABLE video DROP COLUMN IF EXISTS v_filesize;
ALTER TABLE video DROP COLUMN IF EXISTS v_metadata;
ALTER TABLE video DROP COLUMN IF EXISTS v_resolution;
