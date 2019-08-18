/*################
 # create facetcache
 #################*/
CREATE TABLE IF NOT EXISTS facetcache (
  fc_key VARCHAR(80) NOT NULL,
  fc_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fc_label VARCHAR(2000),
  fc_value_string VARCHAR(2000),
  fc_value_date date,
  fc_value_number numeric,
  fc_recid VARCHAR(2000),
  fc_count int(11),
  fc_order int(11)
);
CREATE INDEX IF NOT EXISTS idx_fc_fc_key ON facetcache (fc_key);

CREATE TABLE IF NOT EXISTS facetcacheconfig (
  fcc_usecache INT NOT NULL DEFAULT 0,
  fcc_key VARCHAR(80) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_fcc_fcc_key ON facetcacheconfig (fcc_key);

CREATE TABLE IF NOT EXISTS facetcacheupdatetrigger (
  ft_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ft_key VARCHAR(80) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ft_ft_key ON facetcacheupdatetrigger (ft_key);
