/* #############
# add columns for info
############# */
ALTER TABLE info ADD COLUMN l_id int(11) DEFAULT NULL REFERENCES location (l_id);
ALTER TABLE info ADD COLUMN if_gesperrt int(2) DEFAULT 0;
ALTER TABLE info ADD COLUMN if_publisher varchar(255) DEFAULT NULL;

/* #############
# add info-joins
############# */
CREATE TABLE IF NOT EXISTS tour_info (
  tif_id int(11) PRIMARY KEY,
  if_id int(11) NOT NULL,
  t_id int(11) NOT NULL,
  tif_linked_details varchar(255) DEFAULT NULL,
  CONSTRAINT tour_info_ibfk_1 FOREIGN KEY (if_id) REFERENCES info (if_id) ON DELETE CASCADE,
  CONSTRAINT tour_info_ibfk_2 FOREIGN KEY (t_id) REFERENCES tour (t_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS location_info (
  lif_id int(11) PRIMARY KEY,
  if_id int(11) NOT NULL,
  l_id int(11) NOT NULL,
  lif_linked_details varchar(255) DEFAULT NULL,
  CONSTRAINT location_info_ibfk_1 FOREIGN KEY (if_id) REFERENCES info (if_id) ON DELETE CASCADE,
  CONSTRAINT location_info_ibfk_2 FOREIGN KEY (l_id) REFERENCES location (l_id) ON DELETE CASCADE
);
