
-- -----------------------
-- start with images+videos
-- -----------------------
--check for importdate in i_dir patterns
--    -import-20240107_20220727-blum: import-(\d{4}\d{2}\d{2})_.* -> '\1-\2-\3 00:00:00'
--    -import-20240107-003042-1659306642_20220724-aaa:  import-(\d{4}\d{2}\d{2}-\d{2}\d{2}\d{2}-\d*)_.*  -> '\1-\2-\3 \4-\5-\6'
UPDATE image SET i_createdat='2024-01-07 10:00:00' WHERE i_dir LIKE 'import-20240107\_%' ESCAPE '\' AND i_createdat IS NULL;
UPDATE video SET v_createdat='2024-01-07 10:00:00' WHERE v_dir LIKE 'import-20240107\_%' ESCAPE '\' AND v_createdat IS NULL;

UPDATE image SET i_createdat='2024-01-07 00:30:42' WHERE i_dir LIKE 'import-20240107-003042-1659306642%'  AND i_createdat IS NULL;
UPDATE video SET v_createdat='2024-01-07 00:30:42' WHERE v_dir LIKE 'import-20240107-003042-1659306642%' AND v_createdat IS NULL;

--fallback: check by import news.n_datebis + 1day
UPDATE image
  SET i_createdat=DATE(MAX(children.n_datebis), '+1 day')
  FROM (
    SELECT n_datevon as n_datevon, n_datebis as n_datebis FROM news
  ) AS children
WHERE i_createdat IS NULL AND image.i_date >= children.n_datevon AND image.i_date <= children.n_datebis;

UPDATE video
  SET v_createdat=DATE(MAX(children.n_datebis), '+1 day')
  FROM (
    SELECT n_datevon as n_datevon, n_datebis as n_datebis FROM news
  ) AS children
WHERE v_createdat IS NULL AND video.v_date >= children.n_datevon AND video.v_date <= children.n_datebis;

        
--fallback: use k_datebis + 1day group by k_id
UPDATE image
  SET i_createdat=children.createdat
  FROM (
    SELECT DATE(MAX(createdat), '+1 day') AS createdat, k_id FROM (
        SELECT MAX(k_datebis) AS createdat, k_id FROM kategorie GROUP BY k_id
    ) GROUP BY k_id
  ) AS children
WHERE i_createdat IS NULL AND image.k_id = children.k_id;

UPDATE video
  SET v_createdat=children.createdat
  FROM (
    SELECT DATE(MAX(createdat), '+1 day') AS createdat, k_id FROM (
        SELECT MAX(k_datebis) AS createdat, k_id FROM kategorie GROUP BY k_id
    ) GROUP BY k_id
  ) AS children
WHERE v_createdat IS NULL AND video.k_id = children.k_id;

--set updatedate
UPDATE image SET i_updatedat=i_createdat, i_updateversion=1 WHERE i_updatedat is null;
UPDATE video SET v_updatedat=v_createdat, v_updateversion=1 WHERE v_updatedat is null;

        
-- -----------------------
-- track
-- -----------------------
--use created=min(i_createdat, v_createdat), updated=max(i_createdat, v_createdat)
UPDATE kategorie
  SET k_createdat=children.createdat
  FROM (
    SELECT MIN(createdat) AS createdat, k_id FROM (
        SELECT MIN(i_createdat) AS createdat, k_id FROM image GROUP BY k_id
        UNION
        SELECT MIN(v_createdat) AS createdat, k_id FROM video GROUP BY k_id
    ) GROUP BY k_id
  ) AS children
WHERE k_createdat IS NULL AND kategorie.k_id = children.k_id;

UPDATE kategorie
  SET k_updatedat=children.createdat,
  k_updateversion=1
  FROM (
    SELECT MAX(createdat) AS createdat, k_id FROM (
        SELECT MAX(i_createdat) AS createdat, k_id FROM image GROUP BY k_id
        UNION
        SELECT MAX(v_updatedat) AS createdat, k_id FROM video GROUP BY k_id
    ) GROUP BY k_id
  ) AS children
WHERE k_updatedat IS NULL AND kategorie.k_id = children.k_id;


-- -----------------------
-- news
-- -----------------------
--use created=max(i_createdat), updated=max(i_createdat)
UPDATE news
  SET n_createdat=createdat
  FROM (
    SELECT MAX(i_createdat) AS createdat, i_date FROM image WHERE i_createdat IS NOT NULL GROUP BY i_date
  ) AS children
WHERE n_createdat IS NULL AND children.i_date >= news.n_datevon AND children.i_date <= news.n_datebis;
UPDATE news SET n_updatedat=n_createdat, n_updateversion=1 WHERE n_updatedat is null;

--fallback: use default-value
UPDATE news SET n_createdat='2024-01-07 10:00:00' WHERE n_createdat IS NULL;
UPDATE news SET n_updatedat=n_createdat, n_updateversion=1 WHERE n_updatedat is null;


-- -----------------------
-- trip
-- -----------------------
--use created=max(k_createdat), updated=max(k_createdat)
UPDATE trip
  SET tr_createdat=children.createdat
  FROM (
    SELECT MIN(createdat) AS createdat, tr_id FROM (
        SELECT MIN(k_createdat) AS createdat, tr_id FROM kategorie GROUP BY tr_id
    ) GROUP BY tr_id
  ) AS children
WHERE tr_createdat IS NULL AND trip.tr_id = children.tr_id;

UPDATE trip
  SET tr_updatedat=children.createdat,
  tr_updateversion=1
  FROM (
    SELECT MAX(createdat) AS createdat, tr_id FROM (
        SELECT MAX(k_createdat) AS createdat, tr_id FROM kategorie GROUP BY tr_id
    ) GROUP BY tr_id
  ) AS children
WHERE tr_updatedat IS NULL AND trip.tr_id = children.tr_id;

--fallback: use default-value
UPDATE trip SET tr_createdat='2024-01-07 10:00:00' WHERE tr_createdat IS NULL;
UPDATE trip SET tr_updatedat=tr_createdat, tr_updateversion=1 WHERE tr_updatedat is null;


-- -----------------------
-- route
-- -----------------------
--use master-track created=min(k_createdat), updated=max(k_createdat)
UPDATE tour
  SET t_createdat=children.createdat
  FROM (
    SELECT MIN(createdat) AS createdat, k_id FROM (
        SELECT MIN(k_createdat) AS createdat, k_id FROM kategorie GROUP BY k_id
    ) GROUP BY k_id
  ) AS children
WHERE t_createdat IS NULL AND tour.k_id = children.k_id;

UPDATE tour
  SET t_updatedat=children.createdat,
  t_updateversion=1
  FROM (
    SELECT MAX(createdat) AS createdat, k_id FROM (
        SELECT MAX(k_createdat) AS createdat, k_id FROM kategorie GROUP BY k_id
    ) GROUP BY k_id
  ) AS children
WHERE t_updatedat IS NULL AND tour.k_id = children.k_id;

--use main-track created=min(k_createdat), updated=max(k_createdat)
UPDATE tour
  SET t_createdat=children.createdat
  FROM (
    SELECT MIN(createdat) AS createdat, t_id FROM (
        SELECT MIN(k_createdat) AS createdat, t_id FROM kategorie GROUP BY t_id
    ) GROUP BY t_id
  ) AS children
WHERE t_createdat IS NULL AND tour.t_id = children.t_id;

UPDATE tour
  SET t_updatedat=children.createdat,
  t_updateversion=1
  FROM (
    SELECT MAX(createdat) AS createdat, t_id FROM (
        SELECT MAX(k_createdat) AS createdat, t_id FROM kategorie GROUP BY t_id
    ) GROUP BY t_id
  ) AS children
WHERE t_updatedat IS NULL AND tour.t_id = children.t_id;

--fallback: use joined created=min(k_createdat), updated=max(k_createdat)
UPDATE tour
  SET t_createdat=children.createdat
  FROM (
    SELECT MIN(createdat) AS createdat, t_id FROM (
        SELECT MIN(k_createdat) AS createdat, kategorie_tour.t_id FROM kategorie INNER JOIN kategorie_tour ON kategorie.k_id = kategorie_tour.k_id GROUP BY kategorie_tour.t_id
    ) GROUP BY t_id
  ) AS children
WHERE t_createdat IS NULL AND tour.t_id = children.t_id;

UPDATE tour
  SET t_updatedat=children.createdat,
  t_updateversion=1
  FROM (
    SELECT MAX(createdat) AS createdat, t_id FROM (
        SELECT MAX(k_createdat) AS createdat, kategorie_tour.t_id FROM kategorie INNER JOIN kategorie_tour ON kategorie.k_id = kategorie_tour.k_id GROUP BY kategorie_tour.t_id
    ) GROUP BY t_id
  ) AS children
WHERE t_updatedat IS NULL AND tour.t_id = children.t_id;

--fallback: use default-value
UPDATE tour SET t_createdat='2024-01-07 10:00:00' WHERE t_createdat IS NULL;
UPDATE tour SET t_updatedat=t_createdat, t_updateversion=1 WHERE t_updatedat is null;


-- -----------------------
-- location
-- -----------------------
--use created=min(k_createdat, t_createdat, l_createdat), updated=l_createdat
UPDATE location
  SET l_createdat=children.createdat
  FROM (
    SELECT MIN(createdat) AS createdat, l_id FROM (
        SELECT MIN(k_createdat) AS createdat, l_id FROM kategorie GROUP BY l_id
        UNION
        SELECT MIN(t_createdat) AS createdat, l_id FROM tour GROUP BY l_id
        UNION
        SELECT MIN(l_createdat) AS createdat, l_parent_id FROM location GROUP BY l_parent_id
    ) GROUP BY l_id
  ) AS children
WHERE l_createdat IS NULL AND location.l_id = children.l_id;

UPDATE location
  SET l_updatedat=children.createdat,
  l_updateversion=1
  FROM (
    SELECT MAX(createdat) AS createdat, l_id FROM (
        SELECT MAX(k_createdat) AS createdat, l_id FROM kategorie GROUP BY l_id
        UNION
        SELECT MAX(t_createdat) AS createdat, l_id FROM tour GROUP BY l_id
        UNION
        SELECT MAX(l_createdat) AS createdat, l_parent_id FROM location GROUP BY l_parent_id
    ) GROUP BY l_id
  ) AS children
WHERE l_updatedat IS NULL AND location.l_id = children.l_id;

--do multiple (10 to get all levels) with  order by lochirarchy desc
--fallback: use parent-values
UPDATE location
  SET l_createdat=children.createdat
  FROM (
    SELECT MIN(createdat) AS createdat, l_id FROM (
        SELECT MIN(l_createdat) AS createdat, l_id FROM location GROUP BY l_id
    ) GROUP BY l_id
  ) AS children
WHERE l_createdat IS NULL AND location.l_parent_id = children.l_id;

UPDATE location
  SET l_updatedat=children.createdat,
  l_updateversion=1
  FROM (
    SELECT MAX(createdat) AS createdat, l_id FROM (
        SELECT MAX(l_createdat) AS createdat, l_id FROM location GROUP BY l_id
    ) GROUP BY l_id
  ) AS children
WHERE l_updatedat IS NULL AND location.l_parent_id = children.l_id;

--fallback: use default-value
UPDATE location SET l_createdat='2024-01-07 10:00:00' WHERE l_createdat IS NULL;
UPDATE location SET l_updatedat=l_createdat, l_updateversion=1 WHERE l_updatedat is null;


-- -----------------------
-- poi
-- -----------------------
--check for import-date in importfile-pattern
UPDATE poi SET poi_createdat='2024-01-07 10:00:00' WHERE poi_createdat IS NULL;

--fallback: use default-value
UPDATE poi SET poi_createdat='2024-01-07 10:00:00' WHERE poi_createdat IS NULL;
UPDATE poi SET poi_updatedat=poi_createdat, poi_updateversion=1 WHERE poi_updatedat is null;


-- -----------------------
-- info
-- -----------------------
--use created=min(poi_createdat, t_createdat, l_createdat), updated=max(poi_createdat, t_createdat, l_createdat)
UPDATE info
  SET if_createdat=children.createdat
  FROM (
    SELECT MIN(createdat) AS createdat, if_id FROM (
        SELECT MIN(poi_createdat) AS createdat, if_id FROM poi INNER JOIN poi_info ON poi.poi_id=poi_info.poi_id GROUP BY if_id
        UNION
        SELECT MIN(t_createdat) AS createdat, if_id FROM tour INNER JOIN tour_info ON tour.t_id=tour_info.t_id GROUP BY if_id
        UNION
        SELECT MIN(l_createdat) AS createdat, if_id FROM location INNER JOIN location_info ON location.l_id=location_info.l_id GROUP BY if_id
    ) GROUP BY if_id
  ) AS children
WHERE if_createdat IS NULL AND info.if_id = children.if_id;

UPDATE info
  SET if_updatedat=children.createdat,
  if_updateversion=1
  FROM (
    SELECT MAX(createdat) AS createdat, if_id FROM (
        SELECT MAX(poi_createdat) AS createdat, if_id FROM poi INNER JOIN poi_info ON poi.poi_id=poi_info.poi_id GROUP BY if_id
        UNION
        SELECT MAX(t_createdat) AS createdat, if_id FROM tour INNER JOIN tour_info ON tour.t_id=tour_info.t_id GROUP BY if_id
        UNION
        SELECT MAX(l_createdat) AS createdat, if_id FROM location INNER JOIN location_info ON location.l_id=location_info.l_id GROUP BY if_id
    ) GROUP BY if_id
  ) AS children
WHERE if_updatedat IS NULL AND info.if_id = children.if_id;

--fallback: use default-value
UPDATE info SET if_createdat='2024-01-07 10:00:00' WHERE if_createdat IS NULL;
UPDATE info SET if_updatedat=if_createdat, if_updateversion=1 WHERE if_updatedat is null;


-- -----------------------
-- playlist
-- -----------------------
--use created=min(i_createdat, v_createdat, k_createdat, poi_createdat, t_createdat, l_createdat, if_createdat, tr_createdat), updated=max(i_createdat, v_createdat, k_createdat, poi_createdat, t_createdat, l_createdat, if_createdat, tr_createdat)
UPDATE playlist
  SET p_createdat=children.createdat
  FROM (
    SELECT MIN(createdat) AS createdat, p_id FROM (
        SELECT MIN(i_createdat) AS createdat, p_id FROM image INNER JOIN image_playlist ON image.i_id=image_playlist.i_id GROUP BY p_id
        UNION
        SELECT MIN(if_createdat) AS createdat, p_id FROM info INNER JOIN info_playlist ON info.if_id=info_playlist.if_id GROUP BY p_id
        UNION
        SELECT MIN(k_createdat) AS createdat, p_id FROM kategorie INNER JOIN kategorie_playlist ON kategorie.k_id=kategorie_playlist.k_id GROUP BY p_id
        UNION
        SELECT MIN(l_createdat) AS createdat, p_id FROM location INNER JOIN location_playlist ON location.l_id=location_playlist.l_id GROUP BY p_id
        UNION
        SELECT MIN(t_createdat) AS createdat, p_id FROM tour INNER JOIN tour_playlist ON tour.t_id=tour_playlist.t_id GROUP BY p_id
        UNION
        SELECT MIN(tr_createdat) AS createdat, p_id FROM trip INNER JOIN trip_playlist ON trip.tr_id=trip_playlist.tr_id GROUP BY p_id
        UNION
        SELECT MIN(v_createdat) AS createdat, p_id FROM video INNER JOIN video_playlist ON video.v_id=video_playlist.v_id GROUP BY p_id
    ) GROUP BY p_id
  ) AS children
WHERE p_createdat IS NULL AND playlist.p_id = children.p_id;

UPDATE playlist
  SET p_updatedat=children.createdat,
  p_updateversion=1
  FROM (
    SELECT MAX(createdat) AS createdat, p_id FROM (
        SELECT MAX(i_createdat) AS createdat, p_id FROM image INNER JOIN image_playlist ON image.i_id=image_playlist.i_id GROUP BY p_id
        UNION
        SELECT MAX(if_createdat) AS createdat, p_id FROM info INNER JOIN info_playlist ON info.if_id=info_playlist.if_id GROUP BY p_id
        UNION
        SELECT MAX(k_createdat) AS createdat, p_id FROM kategorie INNER JOIN kategorie_playlist ON kategorie.k_id=kategorie_playlist.k_id GROUP BY p_id
        UNION
        SELECT MAX(l_createdat) AS createdat, p_id FROM location INNER JOIN location_playlist ON location.l_id=location_playlist.l_id GROUP BY p_id
        UNION
        SELECT MAX(t_createdat) AS createdat, p_id FROM tour INNER JOIN tour_playlist ON tour.t_id=tour_playlist.t_id GROUP BY p_id
        UNION
        SELECT MAX(tr_createdat) AS createdat, p_id FROM trip INNER JOIN trip_playlist ON trip.tr_id=trip_playlist.tr_id GROUP BY p_id
        UNION
        SELECT MAX(v_createdat) AS createdat, p_id FROM video INNER JOIN video_playlist ON video.v_id=video_playlist.v_id GROUP BY p_id
    ) GROUP BY p_id
  ) AS children
WHERE p_updatedat IS NULL AND playlist.p_id = children.p_id;

--fallback: use default-value
UPDATE playlist SET p_createdat='2024-01-07 10:00:00' WHERE p_createdat IS NULL;
UPDATE playlist SET p_updatedat=p_createdat, p_updateversion=1 WHERE p_updatedat is null;


