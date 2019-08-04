/* #############
# add l_id to trip
############# */
ALTER TABLE trip ADD COLUMN IF NOT EXISTS l_id int(11) DEFAULT NULL;
ALTER TABLE trip ADD CONSTRAINT trip_ibfk_1 FOREIGN KEY (l_id) REFERENCES location (l_id);
UPDATE trip toupdate,
  (SELECT tr_id, MIN(l_id) AS l_id
   FROM kategorie
    WHERE tr_id IS NOT NULL AND tr_id > 0
   GROUP BY tr_id ORDER BY tr_id DESC
  ) grouped
SET
  toupdate.l_id=grouped.l_id
WHERE toupdate.tr_id=grouped.tr_id AND toupdate.l_id IS NULL;
