/* #############
# add columns for blocked
############# */
ALTER TABLE tour DROP COLUMN IF EXISTS t_gesperrt;
ALTER TABLE location DROP COLUMN IF EXISTS l_gesperrt;
ALTER TABLE trip DROP COLUMN IF EXISTS tr_gesperrt;
ALTER TABLE news DROP COLUMN IF EXISTS n_gesperrt;
