/* #############
# add columns for info
############# */
ALTER TABLE info ADD COLUMN IF NOT EXISTS l_id int(11) DEFAULT null;
ALTER TABLE info ADD KEY idx_if__l_id (l_id);
ALTER TABLE info ADD COLUMN IF NOT EXISTS if_gesperrt int(2) DEFAULT 0;
ALTER TABLE info ADD KEY idx_if__if_gesperrt (if_gesperrt);
ALTER TABLE info ADD COLUMN IF NOT EXISTS if_publisher varchar(255) COLLATE latin1_general_ci DEFAULT NULL;

/* #############
# add info-joins
############# */
CREATE TABLE IF NOT EXISTS tour_info (
  tif_id int(11) NOT NULL AUTO_INCREMENT,
  if_id int(11) NOT NULL,
  t_id int(11) NOT NULL,
  tif_reference_details varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (tif_id),
  KEY idx_tif__tif_id (tif_id),
  KEY idx_tif__if_id (if_id),
  KEY idx_tif__t_id (t_id),
  CONSTRAINT tour_info_ibfk_1 FOREIGN KEY (if_id) REFERENCES info (if_id) ON DELETE CASCADE,
  CONSTRAINT tour_info_ibfk_2 FOREIGN KEY (t_id) REFERENCES tour (t_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS location_info (
  lif_id int(11) NOT NULL AUTO_INCREMENT,
  if_id int(11) NOT NULL,
  l_id int(11) NOT NULL,
  lif_reference_details varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (lif_id),
  KEY idx_lif__lif_id (lif_id),
  KEY idx_lif__if_id (if_id),
  KEY idx_lif__l_id (l_id),
  CONSTRAINT location_info_ibfk_1 FOREIGN KEY (if_id) REFERENCES info (if_id) ON DELETE CASCADE,
  CONSTRAINT location_info_ibfk_2 FOREIGN KEY (l_id) REFERENCES location (l_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
