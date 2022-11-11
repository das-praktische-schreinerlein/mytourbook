-- ##################
-- attach master-database
-- ##################
ATTACH DATABASE 'F:/playground/mytb-test/mytbbase/import/mytbdb_import.sqlite' AS importmytbdb;

-- ##################
-- CREATE TEMP VIEW
-- ##################
DROP VIEW IF EXISTS importmytbdb_playlist;
CREATE TEMP VIEW importmytbdb_playlist AS SELECT * FROM importmytbdb.playlist;
DROP VIEW IF EXISTS importmytbdb_keyword;
CREATE TEMP VIEW importmytbdb_keyword AS SELECT * FROM importmytbdb.keyword;
DROP VIEW IF EXISTS importmytbdb_location;
CREATE TEMP VIEW importmytbdb_location AS SELECT * FROM importmytbdb.location_hirarchical;
DROP VIEW IF EXISTS importmytbdb_location_keyword;
CREATE TEMP VIEW importmytbdb_location_keyword AS SELECT * FROM importmytbdb.location_keyword;
DROP VIEW IF EXISTS importmytbdb_location_playlist;
CREATE TEMP VIEW importmytbdb_location_playlist AS SELECT * FROM importmytbdb.location_playlist;
DROP VIEW IF EXISTS importmytbdb_poi;
CREATE TEMP VIEW importmytbdb_poi AS SELECT * FROM importmytbdb.poi;
DROP VIEW IF EXISTS importmytbdb_poi_keyword;
CREATE TEMP VIEW importmytbdb_poi_keyword AS SELECT * FROM importmytbdb.poi_keyword;
DROP VIEW IF EXISTS importmytbdb_info;
CREATE TEMP VIEW importmytbdb_info AS SELECT * FROM importmytbdb.info;
DROP VIEW IF EXISTS importmytbdb_info_keyword;
CREATE TEMP VIEW importmytbdb_info_keyword AS SELECT * FROM importmytbdb.info_keyword;
DROP VIEW IF EXISTS importmytbdb_location_info;
CREATE TEMP VIEW importmytbdb_location_info AS SELECT * FROM importmytbdb.location_info;
DROP VIEW IF EXISTS importmytbdb_info_playlist;
CREATE TEMP VIEW importmytbdb_info_playlist AS SELECT * FROM importmytbdb.info_playlist;
DROP VIEW IF EXISTS importmytbdb_news;
CREATE TEMP VIEW importmytbdb_news AS SELECT * FROM importmytbdb.news;
DROP VIEW IF EXISTS importmytbdb_trip;
CREATE TEMP VIEW importmytbdb_trip AS SELECT * FROM importmytbdb.trip;
DROP VIEW IF EXISTS importmytbdb_trip_playlist;
CREATE TEMP VIEW importmytbdb_trip_playlist AS SELECT * FROM importmytbdb.trip_playlist;
DROP VIEW IF EXISTS importmytbdb_kategorie;
CREATE TEMP VIEW importmytbdb_kategorie AS SELECT * FROM importmytbdb.kategorie;
DROP VIEW IF EXISTS importmytbdb_kategorie_keyword;
CREATE TEMP VIEW importmytbdb_kategorie_keyword AS SELECT * FROM importmytbdb.kategorie_keyword;
DROP VIEW IF EXISTS importmytbdb_kategorie_playlist;
CREATE TEMP VIEW importmytbdb_kategorie_playlist AS SELECT * FROM importmytbdb.kategorie_playlist;
DROP VIEW IF EXISTS importmytbdb_kategorie_poi;
CREATE TEMP VIEW importmytbdb_kategorie_poi AS SELECT * FROM importmytbdb.kategorie_poi;
DROP VIEW IF EXISTS importmytbdb_tour;
CREATE TEMP VIEW importmytbdb_tour AS SELECT * FROM importmytbdb.tour;
DROP VIEW IF EXISTS importmytbdb_tour_keyword;
CREATE TEMP VIEW importmytbdb_tour_keyword AS SELECT * FROM importmytbdb.tour_keyword;
DROP VIEW IF EXISTS importmytbdb_kategorie_tour;
CREATE TEMP VIEW importmytbdb_kategorie_tour AS SELECT * FROM importmytbdb.kategorie_tour;
DROP VIEW IF EXISTS importmytbdb_tour_info;
CREATE TEMP VIEW importmytbdb_tour_info AS SELECT * FROM importmytbdb.tour_info;
DROP VIEW IF EXISTS importmytbdb_tour_playlist;
CREATE TEMP VIEW importmytbdb_tour_playlist AS SELECT * FROM importmytbdb.tour_playlist;
DROP VIEW IF EXISTS importmytbdb_tour_poi;
CREATE TEMP VIEW importmytbdb_tour_poi AS SELECT * FROM importmytbdb.tour_poi;
DROP VIEW IF EXISTS importmytbdb_destination;
CREATE TEMP VIEW importmytbdb_destination AS SELECT * FROM importmytbdb.destination;
DROP VIEW IF EXISTS importmytbdb_objects;
CREATE TEMP VIEW importmytbdb_objects AS SELECT * FROM importmytbdb.objects;
DROP VIEW IF EXISTS importmytbdb_person;
CREATE TEMP VIEW importmytbdb_person AS SELECT * FROM importmytbdb.person;
DROP VIEW IF EXISTS importmytbdb_objects_key;
CREATE TEMP VIEW importmytbdb_objects_key AS SELECT * FROM importmytbdb.objects_key;
DROP VIEW IF EXISTS importmytbdb_image;
CREATE TEMP VIEW importmytbdb_image AS SELECT * FROM importmytbdb.image;
DROP VIEW IF EXISTS importmytbdb_image_playlist;
CREATE TEMP VIEW importmytbdb_image_playlist AS SELECT * FROM importmytbdb.image_playlist;
DROP VIEW IF EXISTS importmytbdb_image_keyword;
CREATE TEMP VIEW importmytbdb_image_keyword AS SELECT * FROM importmytbdb.image_keyword;
DROP VIEW IF EXISTS importmytbdb_image_object;
CREATE TEMP VIEW importmytbdb_image_object AS SELECT * FROM importmytbdb.image_object;
DROP VIEW IF EXISTS importmytbdb_video;
CREATE TEMP VIEW importmytbdb_video AS SELECT * FROM importmytbdb.video;
DROP VIEW IF EXISTS importmytbdb_video_playlist;
CREATE TEMP VIEW importmytbdb_video_playlist AS SELECT * FROM importmytbdb.video_playlist;
DROP VIEW IF EXISTS importmytbdb_video_keyword;
CREATE TEMP VIEW importmytbdb_video_keyword AS SELECT * FROM importmytbdb.video_keyword;
DROP VIEW IF EXISTS importmytbdb_video_object;
CREATE TEMP VIEW importmytbdb_video_object AS SELECT * FROM importmytbdb.video_object;

