-- ##################
-- attach master-database
-- ##################
ATTACH DATABASE 'F:/playground/mytb-test/mytbbase/import/mytbdb_import.sqlite' AS importmytbdb;

-- ##################
-- CREATE TEMP VIEW
-- ##################
DROP VIEW IF EXISTS importmytbdb_location;
CREATE TEMP VIEW importmytbdb_location AS SELECT * FROM importmytbdb.location;
DROP VIEW IF EXISTS importmytbdb_info;
CREATE TEMP VIEW importmytbdb_info AS SELECT * FROM importmytbdb.info;
DROP VIEW IF EXISTS importmytbdb_location_info;
CREATE TEMP VIEW importmytbdb_location_info AS SELECT * FROM importmytbdb.location_info;
DROP VIEW IF EXISTS importmytbdb_news;
CREATE TEMP VIEW importmytbdb_news AS SELECT * FROM importmytbdb.news;
DROP VIEW IF EXISTS importmytbdb_trip;
CREATE TEMP VIEW importmytbdb_trip AS SELECT * FROM importmytbdb.trip;
DROP VIEW IF EXISTS importmytbdb_kategorie;
CREATE TEMP VIEW importmytbdb_kategorie AS SELECT * FROM importmytbdb.kategorie;
DROP VIEW IF EXISTS importmytbdb_tour;
CREATE TEMP VIEW importmytbdb_tour AS SELECT * FROM importmytbdb.tour;
DROP VIEW IF EXISTS importmytbdb_kategorie_tour;
CREATE TEMP VIEW importmytbdb_kategorie_tour AS SELECT * FROM importmytbdb.kategorie_tour;
DROP VIEW IF EXISTS importmytbdb_tour_info;
CREATE TEMP VIEW importmytbdb_tour_info AS SELECT * FROM importmytbdb.tour_info;
DROP VIEW IF EXISTS importmytbdb_destination;
CREATE TEMP VIEW importmytbdb_destination AS SELECT * FROM importmytbdb.destination;
DROP VIEW IF EXISTS importmytbdb_image;
CREATE TEMP VIEW importmytbdb_image AS SELECT * FROM importmytbdb.image;
DROP VIEW IF EXISTS importmytbdb_image_playlist;
CREATE TEMP VIEW importmytbdb_image_playlist AS SELECT * FROM importmytbdb.image_playlist;
DROP VIEW IF EXISTS importmytbdb_video;
CREATE TEMP VIEW importmytbdb_video AS SELECT * FROM importmytbdb.video;
DROP VIEW IF EXISTS importmytbdb_video_playlist;
CREATE TEMP VIEW importmytbdb_video_playlist AS SELECT * FROM importmytbdb.video_playlist;

