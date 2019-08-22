/* #############
# add columns for blocked
############# */
ALTER TABLE tour ADD COLUMN IF NOT EXISTS t_gesperrt int(2) DEFAULT 0;
ALTER TABLE location ADD COLUMN IF NOT EXISTS l_gesperrt int(2) DEFAULT 0;
ALTER TABLE trip ADD COLUMN IF NOT EXISTS tr_gesperrt int(2) DEFAULT 0;
ALTER TABLE news ADD COLUMN IF NOT EXISTS n_gesperrt int(2) DEFAULT 0;
