/* #############
# drop l_id to trip
############# */
ALTER TABLE trip DROP CONSTRAINT trip_ibfk_1;
ALTER TABLE trip DROP COLUMN l_id;
