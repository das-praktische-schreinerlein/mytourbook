-- ------------------------------------
-- create model
-- ------------------------------------

CREATE TABLE IF NOT EXISTS image_similar (
  i_id int(11) NOT NULL,
  i_similar_id int(11) NOT NULL,
  IS_MATCHING varchar(50) DEFAULT NULL,
  IS_MATCHINGDETAILS varchar(50) DEFAULT NULL,
  IS_MATCHINGSCORE double DEFAULT NULL,
  CONSTRAINT i_similar_id_ibfk_1 FOREIGN KEY (i_id) REFERENCES image (i_id) ON DELETE CASCADE,
  CONSTRAINT i_similar_id_ibfk_2 FOREIGN KEY (i_similar_id) REFERENCES image (i_id) ON DELETE CASCADE
);
