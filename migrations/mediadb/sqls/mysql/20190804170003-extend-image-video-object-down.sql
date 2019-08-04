/* #############
# drop io_state to image_object
############# */
DROP INDEX IF EXISTS idx_io__io_state ON image_object;
DROP INDEX IF EXISTS idx_io__io_detector ON image_object;
DROP INDEX IF EXISTS idx_vo__vo_state ON video_object;
DROP INDEX IF EXISTS idx_vo__vo_detector ON video_object;
ALTER TABLE image_object DROP COLUMN IF EXISTS io_state;
ALTER TABLE image_object DROP COLUMN IF EXISTS io_precision;
ALTER TABLE image_object DROP COLUMN IF EXISTS io_detector;
ALTER TABLE video_object DROP COLUMN IF EXISTS vo_state;
ALTER TABLE video_object DROP COLUMN IF EXISTS vo_precision;
ALTER TABLE video_object DROP COLUMN IF EXISTS vo_detector;

/* #############
# drop index to objects_key
############# */
DROP INDEX IF EXISTS idx_objects_O_KEY_DETECTOR_pk ON objects_key;

/* #############
# drop objects_key to manage different key for one object
############# */
DROP TABLE IF EXISTS objects_key;

/* #############
# drop object.type
############# */
DROP INDEX IF EXISTS idx_objects_O_CATEGORY ON objects;
ALTER TABLE objects DROP COLUMN IF EXISTS o_category;
