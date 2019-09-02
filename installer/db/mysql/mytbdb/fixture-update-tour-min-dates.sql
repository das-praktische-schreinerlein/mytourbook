SELECT toupdate.t_id, t_name, t_datevon, datevon
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
WHERE toupdate.t_id=grouped.t_id AND (toupdate.T_DATEVON IS NULL OR toupdate.T_DATEVON > datevon);


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
  toupdate.t_datevon=grouped.datevon
WHERE toupdate.t_id=grouped.t_id AND (toupdate.T_DATEVON IS NULL OR toupdate.T_DATEVON > datevon);
