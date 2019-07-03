/*################
 # create facetcache
 #################*/
CREATE TABLE facetcache (
  fc_key VARCHAR(80) NOT NULL,
  fc_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fc_label VARCHAR(2000) COLLATE LATIN1_GENERAL_CI,
  fc_value_string VARCHAR(2000) COLLATE LATIN1_GENERAL_CI,
  fc_value_date date,
  fc_value_number numeric,
  fc_recid VARCHAR(2000) COLLATE LATIN1_GENERAL_CI,
  fc_count int(11),
  fc_order int(11)
) ENGINE=InnoDB DEFAULT CHARSET=LATIN1 COLLATE=LATIN1_GENERAL_CI;
CREATE INDEX idx_fc_fc_key ON facetcache (fc_key);

CREATE TABLE facetcacheconfig (
  fcc_usecache INT NOT NULL DEFAULT 0,
  fcc_key VARCHAR(80) COLLATE LATIN1_GENERAL_CI NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=LATIN1 COLLATE=LATIN1_GENERAL_CI;
CREATE INDEX idx_fcc_fcc_key ON facetcacheconfig (fcc_key);

CREATE TABLE facetcacheupdatetrigger (
  ft_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ft_key VARCHAR(80) COLLATE LATIN1_GENERAL_CI NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=LATIN1 COLLATE=LATIN1_GENERAL_CI;
CREATE INDEX idx_ft_ft_key ON facetcacheupdatetrigger (ft_key);
