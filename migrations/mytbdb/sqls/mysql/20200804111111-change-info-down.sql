/* #############
# add columns for info
############# */
ALTER TABLE info DROP COLUMN IF EXISTS l_id;
ALTER TABLE info DROP COLUMN IF EXISTS if_gesperrt;
ALTER TABLE info ROP COLUMN IF EXISTS if_name;

