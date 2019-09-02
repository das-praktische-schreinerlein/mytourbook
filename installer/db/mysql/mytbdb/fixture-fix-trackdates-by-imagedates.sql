SELECT i_id, i_dir, i_file FROM image WHERE i_date IS NULL;

SELECT k_id, LEAST(k_datevon, i_datevon) AS calced_datevon, k_datevon, i_datevon,
             GREATEST(k_datebis, i_datebis) AS calced_datebis, k_datebis, i_datebis
FROM (
  SELECT
    kategorie.k_id,
    k_datevon,
    MIN(i_date) AS i_datevon,
    k_datebis,
    MAX(i_date) AS i_datebis
  FROM kategorie, image
  WHERE image.k_id = kategorie.k_id and kategorie.k_id > 2598
  GROUP BY kategorie.k_id, k_datevon, k_datebis
) grouped
WHERE k_datevon > i_datevon OR k_datebis < i_datebis and k_id > 2598
ORDER BY k_id DESC

UPDATE kategorie toupdate,
  (SELECT k_id, LEAST(k_datevon, i_datevon) AS calced_datevon, k_datevon, i_datevon,
                GREATEST(k_datebis, i_datebis) AS calced_datebis , k_datebis, i_datebis
   FROM
      (SELECT
        kategorie.k_id,
        k_datevon,
        MIN(i_date) AS i_datevon,
        k_datebis,
        MAX(i_date) AS i_datebis
      FROM kategorie, image
      WHERE image.k_id = kategorie.k_id and kategorie.k_id > 2598
      GROUP BY kategorie.k_id, k_datevon, k_datebis
      ) getMinMax WHERE k_datevon > i_datevon OR k_datebis < i_datebis
  ) grouped
SET
  toupdate.k_datevon=grouped.calced_datevon,
  toupdate.k_datebis=grouped.calced_datebis
WHERE toupdate.k_id=grouped.k_id and toupdate.k_id > 2598;
