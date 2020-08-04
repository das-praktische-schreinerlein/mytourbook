/* #############
# add columns for info
############# */
ALTER TABLE info ADD COLUMN l_id int(11) DEFAULT NULL REFERENCES location (l_id);
ALTER TABLE info ADD COLUMN if_gesperrt int(2) DEFAULT 0;
ALTER TABLE info ADD COLUMN if_publisher varchar(255) DEFAULT NULL;
