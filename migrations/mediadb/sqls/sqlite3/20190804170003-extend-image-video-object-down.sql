/* #############
# drop io_state to image_object
############# */
DROP INDEX idx_io__io_state;
DROP INDEX idx_io__io_detector;
DROP INDEX idx_vo__vo_state;
DROP INDEX idx_vo__vo_detector;
ALTER TABLE image_object DROP COLUMN io_state VARCHAR(50) DEFAULT 'UNKNOWN';
ALTER TABLE image_object DROP COLUMN io_precision FLOAT DEFAULT 1;
ALTER TABLE image_object DROP COLUMN io_detector VARCHAR(50) DEFAULT 'UNKNOWN';
ALTER TABLE video_object DROP COLUMN vo_state VARCHAR(50) DEFAULT 'UNKNOWN';
ALTER TABLE video_object DROP COLUMN vo_precision FLOAT DEFAULT 1;
ALTER TABLE video_object DROP COLUMN vo_detector VARCHAR(50) DEFAULT 'UNKNOWN';

/* #############
# drop index to objects_key
############# */
DROP INDEX idx_objects_O_KEY_DETECTOR_pk;

/* #############
# drop objects_key to manage different key for one object
############# */
DROP TABLE IF EXISTS objects_key;

/* #############
# drop object.type
############# */
DROP INDEX idx_objects_O_CATEGORY;
ALTER TABLE objects DROP COLUMN o_category;
