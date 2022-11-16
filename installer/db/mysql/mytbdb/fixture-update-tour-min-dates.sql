SELECT toupdate.t_id, t_name, t_datefirst, datevon
FROM tour toupdate,
(SELECT t_id, MIN(datevon) AS datevon
   FROM
    (
     (SELECT
       t_id,
       MIN(k_datevon) AS datevon
      FROM kategorie
      GROUP BY t_id
     )
     UNION
     (SELECT
       mkt.t_id,
       MIN(mk.k_datevon) AS datevon
      FROM kategorie_tour mkt LEFT JOIN kategorie mk ON mkt.k_id = mk.k_id
      GROUP BY t_id
     )
    ) getTours
  GROUP BY t_id ORDER BY t_id DESC
  ) grouped
WHERE toupdate.t_id=grouped.t_id AND (toupdate.t_datefirst IS NULL OR toupdate.t_datefirst > datevon);


UPDATE tour toupdate,
  (SELECT t_id, MIN(datevon) AS datevon
   FROM
    (
     (SELECT
       t_id,
       MIN(k_datevon) AS datevon
      FROM kategorie
      GROUP BY t_id
     )
     UNION
     (SELECT
       mkt.t_id,
       MIN(mk.k_datevon) AS datevon
      FROM kategorie_tour mkt LEFT JOIN kategorie mk ON mkt.k_id = mk.k_id
      GROUP BY t_id
     )
    ) getTours
  GROUP BY t_id ORDER BY t_id DESC
  ) grouped
SET
  toupdate.t_datefirst=grouped.datevon
WHERE toupdate.t_id=grouped.t_id AND (toupdate.t_datefirst IS NULL OR toupdate.t_datefirst > datevon);

-- TODO updatelocation (min-date from kategorie and tour)
-- TODO update poi (mindate from kategorie_poi and tour_poi)
