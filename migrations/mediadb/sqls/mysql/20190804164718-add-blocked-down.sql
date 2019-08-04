/* #############
# add columns for blocked
############# */
ALTER TABLE tour DROP COLUMN t_gesperrt;
ALTER TABLE location DROP COLUMN l_gesperrt;
ALTER TABLE trip DROP COLUMN tr_gesperrt;
ALTER TABLE news DROP COLUMN n_gesperrt;
