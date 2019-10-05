SELECT i_id, i_dir, i_file FROM image WHERE i_date IS NULL;
SELECT v_id, v_dir, v_file FROM video WHERE v_date IS NULL;

SELECT k_id, MIN(k_datevon, i_datevon) AS calced_datevon, k_datevon, i_datevon,
             MAX(k_datebis, i_datebis) AS calced_datebis, k_datebis, i_datebis
FROM (
  SELECT
    kategorie.k_id,
    k_datevon,
    MIN(i_date) AS i_datevon,
    k_datebis,
    MAX(i_date) AS i_datebis
  FROM kategorie, image
  WHERE image.k_id = kategorie.k_id
  GROUP BY kategorie.k_id, k_datevon, k_datebis
) grouped WHERE k_datevon > i_datevon OR k_datebis < i_datebis
ORDER BY k_id DESC;

update kategorie set
  k_datevon=(select min(i_date) from kategorie k2 inner join image on image.k_id=k2.k_id where k2.k_id=kategorie.k_id),
  k_datebis=(select max(i_date) from kategorie k2 inner join image on image.k_id=k2.k_id where k2.k_id=kategorie.k_id)
where k_id 9999999 > 0 and k_id in (select k_id from image)
;

SELECT k_id, MIN(k_datevon, v_datevon) AS calced_datevon, k_datevon, v_datevon,
             MAX(k_datebis, v_datebis) AS calced_datebis, k_datebis, v_datebis
FROM (
  SELECT
    kategorie.k_id,
    k_datevon,
    MIN(v_date) AS v_datevon,
    k_datebis,
    MAX(v_date) AS v_datebis
  FROM kategorie, video
  WHERE video.k_id = kategorie.k_id
  GROUP BY kategorie.k_id, k_datevon, k_datebis
) grouped WHERE k_datevon > v_datevon OR k_datebis < v_datebis
ORDER BY k_id DESC;

-- update kategorie set
--  k_datevon=(select min(v_date) from kategorie k2 inner join video on video.k_id=k2.k_id where k2.k_id=kategorie.k_id),
--  k_datebis=(select max(v_date) from kategorie k2 inner join video on video.k_id=k2.k_id where k2.k_id=kategorie.k_id)
-- where k_id > 0 and k_id in (select k_id from video)
--;
