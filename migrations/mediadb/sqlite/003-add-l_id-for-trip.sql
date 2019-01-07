/*
#############
# add l_id to trip
#############
*/
ALTER TABLE trip ADD COLUMN l_id int(11) DEFAULT NULL REFERENCES location (l_id);
