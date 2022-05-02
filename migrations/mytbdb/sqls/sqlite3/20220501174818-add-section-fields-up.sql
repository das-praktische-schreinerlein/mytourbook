/* #############
# add sections and columns for caching
############# */
ALTER TABLE tour ADD COLUMN t_desc_sectionDetails VARCHAR(500);
ALTER TABLE tour ADD COLUMN t_calced_sections VARCHAR(255) GENERATED ALWAYS AS (SUBSTR(TRIM(t_desc_sectionDetails), 1, INSTR(TRIM(t_desc_sectionDetails) || ' ', ' ') - 1)) VIRTUAL;
CREATE INDEX IF NOT EXISTS idx_T__T_CALCED_SECTIONS ON tour (t_calced_sections);
UPDATE tour SET t_desc_sectionDetails=PRINTF('%02d', T_ROUTE_AUFSTIEG_SL) || 'SL' WHERE T_ROUTE_AUFSTIEG_SL > 0;
