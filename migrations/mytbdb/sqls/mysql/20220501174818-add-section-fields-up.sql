/* #############
# add sections and columns for caching
############# */
ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_desc_sectionDetails VARCHAR(500);
ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_calced_sections VARCHAR(255) GENERATED ALWAYS AS (SUBSTRING_INDEX( t_desc_sectionDetails, ' ', 1 )) STORED;
CREATE INDEX IF NOT EXISTS idx_T__T_CALCED_SECTIONS ON tour (t_calced_sections);
UPDATE tour SET t_desc_sectionDetails=CONCAT(LPAD(T_ROUTE_AUFSTIEG_SL, 2, 0), 'SL') WHERE T_ROUTE_AUFSTIEG_SL > 0;
