-- ------------------------------------
-- create model
-- ------------------------------------

CREATE TABLE IF NOT EXISTS image_similar (
  i_id int(11) NOT NULL,
  i_similar_id int(11) NOT NULL,
  IS_MATCHING varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  IS_MATCHINGDETAILS varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  IS_MATCHINGSCORE double DEFAULT NULL,
  PRIMARY KEY (i_id, i_similar_id, IS_MATCHING, IS_MATCHINGDETAILS),
  KEY idx_is__i_id (i_id),
  KEY idx_is__i_similar_id (i_similar_id),
  KEY idx_is__IS_MATCHING (IS_MATCHING),
  KEY idx_is__IS_MATCHINGDETAILS (IS_MATCHINGDETAILS),
  CONSTRAINT i_similar_id_ibfk_1 FOREIGN KEY (i_id) REFERENCES image (i_id) ON DELETE CASCADE,
  CONSTRAINT i_similar_id_ibfk_2 FOREIGN KEY (i_similar_id) REFERENCES image (i_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
