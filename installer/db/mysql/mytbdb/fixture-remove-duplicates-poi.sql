-- delete duplicated pois;

-- ------------------------------------;
-- ----- pois;
-- ------------------------------------;
CREATE TEMPORARY TABLE IF NOT EXISTS tmp_poi AS (SELECT *
                                                          FROM poi
                                                          where true = false);
INSERT INTO tmp_poi (poi_id, poi_name, poi_reference)
SELECT MIN(poi_id), poi_name, poi_reference
    FROM poi
    GROUP BY poi_name, poi_reference
    HAVING COUNT(*) > 1;
DELETE poi
    FROM poi, tmp_poi
    WHERE poi.poi_name = tmp_poi.poi_name
        AND poi.poi_reference = tmp_poi.poi_reference
        AND poi.poi_id > tmp_poi.poi_id;
DROP TABLE tmp_poi;
