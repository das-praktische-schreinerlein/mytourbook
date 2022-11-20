-- -------------------------
-- update first/last-dates
-- -------------------------

-- update tour
SELECT toupdate.t_id, t_name, t_datefirst, t_datelast, min_datevon, max_datevon
FROM tour toupdate,
(SELECT t_id, MIN(min_datevon) AS min_datevon, MAX(max_datevon) AS max_datevon
   FROM
    (
     (SELECT
       t_id,
       MIN(k_datevon) AS min_datevon,
       MAX(k_datevon) AS max_datevon
      FROM kategorie
      GROUP BY t_id
     )
     UNION
     (SELECT
       mkt.t_id,
       MIN(mk.k_datevon) AS min_datevon,
       MAX(mk.k_datevon) AS max_datevon
      FROM kategorie_tour mkt LEFT JOIN kategorie mk ON mkt.k_id = mk.k_id
      GROUP BY t_id
     )
    ) getTours
  GROUP BY t_id ORDER BY t_id DESC
  ) grouped
WHERE toupdate.t_id=grouped.t_id;


UPDATE tour toupdate,
  (SELECT t_id, MIN(min_datevon) AS min_datevon, MAX(max_datevon) AS max_datevon
   FROM
    (
     (SELECT
       t_id,
       MIN(k_datevon) AS min_datevon,
       MAX(k_datevon) AS max_datevon
      FROM kategorie
      GROUP BY t_id
     )
     UNION
     (SELECT
       mkt.t_id,
       MIN(mk.k_datevon) AS min_datevon,
       MAX(mk.k_datevon) AS max_datevon
      FROM kategorie_tour mkt LEFT JOIN kategorie mk ON mkt.k_id = mk.k_id
      GROUP BY t_id
     )
    ) getTours
  GROUP BY t_id ORDER BY t_id DESC
  ) grouped
SET
  toupdate.t_datefirst=grouped.min_datevon,
  toupdate.t_datelast=grouped.max_datevon
WHERE toupdate.t_id=grouped.t_id;

-- update poi
SELECT toupdate.poi_id, poi_name, poi_datefirst, poi_datelast, min_datevon, max_datevon
FROM poi toupdate,
     (SELECT poi_id, MIN(min_datevon) AS min_datevon,  MAX(max_datevon) AS max_datevon
      FROM
          (
              (SELECT
                   poi_id,
                   MIN(k_datevon) AS min_datevon,
                   MAX(k_datevon) AS max_datevon
               FROM kategorie INNER JOIN kategorie_poi ON kategorie.k_id = kategorie_poi.k_id
               GROUP BY poi_id
              )
              UNION
              (SELECT
                   poi_id,
                   MIN(t_datefirst) AS min_datevon,
                   MAX(t_datelast) AS max_datevon
               FROM tour INNER JOIN tour_poi ON tour.t_id = tour_poi.t_id
               GROUP BY poi_id
              )
          ) getPois
      GROUP BY poi_id ORDER BY poi_id DESC
     ) grouped
WHERE toupdate.poi_id=grouped.poi_id;


UPDATE poi toupdate,
     (SELECT poi_id, MIN(min_datevon) AS min_datevon,  MAX(max_datevon) AS max_datevon
      FROM
          (
              (SELECT
                   poi_id,
                   MIN(k_datevon) AS min_datevon,
                   MAX(k_datevon) AS max_datevon
               FROM kategorie INNER JOIN kategorie_poi ON kategorie.k_id = kategorie_poi.k_id
               GROUP BY poi_id
              )
              UNION
              (SELECT
                   poi_id,
                   MIN(t_datefirst) AS min_datevon,
                   MAX(t_datelast) AS max_datevon
               FROM tour INNER JOIN tour_poi ON tour.t_id = tour_poi.t_id
               GROUP BY poi_id
              )
          ) getPois
      GROUP BY poi_id ORDER BY poi_id DESC
     ) grouped
SET
    toupdate.poi_datefirst=grouped.min_datevon,
    toupdate.poi_datelast=grouped.max_datevon
WHERE toupdate.poi_id=grouped.poi_id;

-- update location
SELECT toupdate.l_id, toupdate. l_name, toupdate.l_datefirst, toupdate. l_datelast, min_datevon, max_datevon
FROM location toupdate, location_hirarchical lh,
     (SELECT lh.l_lochirarchietxt, MIN(min_datevon) AS min_datevon, MAX(max_datevon) AS max_datevon
      FROM location_hirarchical lh INNER JOIN
          (
                  SELECT
                       l_lochirarchietxt,
                       MIN(k_datevon) AS min_datevon,
                       MAX(k_datevon) AS max_datevon
                   FROM kategorie INNER JOIN location_hirarchical lh ON kategorie.L_ID = lh.l_id
                   GROUP BY l_lochirarchietxt, lh.l_id
                UNION
                  SELECT
                       l_lochirarchietxt,
                       MIN(t_datefirst) AS min_datevon,
                       MAX(t_datelast) AS max_datevon
                   FROM tour INNER JOIN location_hirarchical lh ON tour.L_ID = lh.l_id
                   GROUP BY l_lochirarchietxt, lh.l_id
          ) getLocs on LOCATE(lh.l_lochirarchietxt, getLocs.l_lochirarchietxt) > 0
      GROUP BY l_lochirarchietxt ORDER BY l_lochirarchietxt DESC
     ) grouped
WHERE toupdate.l_id=lh.l_id AND grouped.l_lochirarchietxt = lh.l_lochirarchietxt;


UPDATE location toupdate, location_hirarchical lh,
     (SELECT lh.l_lochirarchietxt, MIN(min_datevon) AS min_datevon, MAX(max_datevon) AS max_datevon
      FROM location_hirarchical lh INNER JOIN
          (
                  SELECT
                       l_lochirarchietxt,
                       MIN(k_datevon) AS min_datevon,
                       MAX(k_datevon) AS max_datevon
                   FROM kategorie INNER JOIN location_hirarchical lh ON kategorie.L_ID = lh.l_id
                   GROUP BY l_lochirarchietxt, lh.l_id
                UNION
                  SELECT
                       l_lochirarchietxt,
                       MIN(t_datefirst) AS min_datevon,
                       MAX(t_datelast) AS max_datevon
                   FROM tour INNER JOIN location_hirarchical lh ON tour.L_ID = lh.l_id
                   GROUP BY l_lochirarchietxt, lh.l_id
          ) getLocs on LOCATE(lh.l_lochirarchietxt, getLocs.l_lochirarchietxt) > 0
      GROUP BY l_lochirarchietxt ORDER BY l_lochirarchietxt DESC
     ) grouped
SET
    toupdate.l_datefirst=grouped.min_datevon,
    toupdate.l_datelast=grouped.max_datevon
WHERE toupdate.l_id=lh.l_id AND grouped.l_lochirarchietxt = lh.l_lochirarchietxt;
