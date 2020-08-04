/* #############
# add columns for info
############# */
ALTER TABLE info ADD COLUMN IF NOT EXISTS l_id int(11) DEFAULT null;
ALTER TABLE info ADD KEY idx_if__l_id (l_id);
ALTER TABLE info ADD COLUMN IF NOT EXISTS if_gesperrt int(2) DEFAULT 0;
ALTER TABLE info ADD KEY idx_if__if_gesperrt (if_gesperrt);
ALTER TABLE info ADD COLUMN IF NOT EXISTS if_publisher varchar(255) COLLATE latin1_general_ci DEFAULT NULL;
