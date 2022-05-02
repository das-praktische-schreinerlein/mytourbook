/* #############
# add columns
############# */
ALTER TABLE tour DROP COLUMN IF EXISTS t_desc_sectionDetails;
ALTER TABLE tour DROP COLUMN IF EXISTS t_calced_sections;
DROP INDEX IF EXISTS idx_T__T_CALCED_SECTIONS ON tour;
