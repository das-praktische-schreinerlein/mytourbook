/* #############
# add io_state to image_object
############# */
ALTER TABLE image_object ADD COLUMN io_state VARCHAR(50) DEFAULT 'UNKNOWN';

