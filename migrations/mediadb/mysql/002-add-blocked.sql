/* #############
# add columns for blocked
############# */
ALTER TABLE tour ADD COLUMN t_gesperrt int(2) DEFAULT 0;
ALTER TABLE location ADD COLUMN l_gesperrt int(2) DEFAULT 0;
ALTER TABLE trip ADD COLUMN tr_gesperrt int(2) DEFAULT 0;
ALTER TABLE news ADD COLUMN n_gesperrt int(2) DEFAULT 0;
