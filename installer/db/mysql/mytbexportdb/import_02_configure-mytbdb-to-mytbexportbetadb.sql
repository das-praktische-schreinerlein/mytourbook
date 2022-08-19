-- ##################
-- CREATE TEMP VIEW
-- ##################
DROP VIEW IF EXISTS importmytbdb_playlist;
CREATE VIEW importmytbdb_playlist AS SELECT * FROM testmytbdb.playlist;
DROP VIEW IF EXISTS importmytbdb_keyword;
CREATE VIEW importmytbdb_keyword AS SELECT * FROM testmytbdb.keyword;
DROP VIEW IF EXISTS importmytbdb_location;
CREATE VIEW importmytbdb_location AS SELECT * FROM testmytbdb.location_hirarchical;
DROP VIEW IF EXISTS importmytbdb_location_keyword;
CREATE VIEW importmytbdb_location_keyword AS SELECT * FROM testmytbdb.location_keyword;
DROP VIEW IF EXISTS importmytbdb_location_playlist;
CREATE VIEW importmytbdb_location_playlist AS SELECT * FROM testmytbdb.location_playlist;
DROP VIEW IF EXISTS importmytbdb_info;
CREATE VIEW importmytbdb_info AS SELECT * FROM testmytbdb.info;
DROP VIEW IF EXISTS importmytbdb_info_keyword;
CREATE VIEW importmytbdb_info_keyword AS SELECT * FROM testmytbdb.info_keyword;
DROP VIEW IF EXISTS importmytbdb_location_info;
CREATE VIEW importmytbdb_location_info AS SELECT * FROM testmytbdb.location_info;
DROP VIEW IF EXISTS importmytbdb_info_playlist;
CREATE VIEW importmytbdb_info_playlist AS SELECT * FROM testmytbdb.info_playlist;
DROP VIEW IF EXISTS importmytbdb_news;
CREATE VIEW importmytbdb_news AS SELECT * FROM testmytbdb.news;
DROP VIEW IF EXISTS importmytbdb_trip;
CREATE VIEW importmytbdb_trip AS SELECT * FROM testmytbdb.trip;
DROP VIEW IF EXISTS importmytbdb_trip_playlist;
CREATE VIEW importmytbdb_trip_playlist AS SELECT * FROM testmytbdb.trip_playlist;
DROP VIEW IF EXISTS importmytbdb_kategorie;
CREATE VIEW importmytbdb_kategorie AS SELECT * FROM testmytbdb.kategorie;
DROP VIEW IF EXISTS importmytbdb_kategorie_keyword;
CREATE VIEW importmytbdb_kategorie_keyword AS SELECT * FROM testmytbdb.kategorie_keyword;
DROP VIEW IF EXISTS importmytbdb_kategorie_playlist;
CREATE VIEW importmytbdb_kategorie_playlist AS SELECT * FROM testmytbdb.kategorie_playlist;
DROP VIEW IF EXISTS importmytbdb_tour;
CREATE VIEW importmytbdb_tour AS SELECT * FROM testmytbdb.tour;
DROP VIEW IF EXISTS importmytbdb_tour_keyword;
CREATE VIEW importmytbdb_tour_keyword AS SELECT * FROM testmytbdb.tour_keyword;
DROP VIEW IF EXISTS importmytbdb_kategorie_tour;
CREATE VIEW importmytbdb_kategorie_tour AS SELECT * FROM testmytbdb.kategorie_tour;
DROP VIEW IF EXISTS importmytbdb_tour_info;
CREATE VIEW importmytbdb_tour_info AS SELECT * FROM testmytbdb.tour_info;
DROP VIEW IF EXISTS importmytbdb_tour_playlist;
CREATE VIEW importmytbdb_tour_playlist AS SELECT * FROM testmytbdb.tour_playlist;
DROP VIEW IF EXISTS importmytbdb_destination;
CREATE VIEW importmytbdb_destination AS SELECT * FROM testmytbdb.destination;
DROP VIEW IF EXISTS importmytbdb_objects;
CREATE VIEW importmytbdb_objects AS SELECT * FROM testmytbdb.objects;
DROP VIEW IF EXISTS importmytbdb_person;
CREATE VIEW importmytbdb_person AS SELECT * FROM testmytbdb.person;
DROP VIEW IF EXISTS importmytbdb_objects_key;
CREATE VIEW importmytbdb_objects_key AS SELECT * FROM testmytbdb.objects_key;
DROP VIEW IF EXISTS importmytbdb_image;
CREATE VIEW importmytbdb_image AS SELECT * FROM testmytbdb.image;
DROP VIEW IF EXISTS importmytbdb_image_playlist;
CREATE VIEW importmytbdb_image_playlist AS SELECT * FROM testmytbdb.image_playlist;
DROP VIEW IF EXISTS importmytbdb_image_keyword;
CREATE VIEW importmytbdb_image_keyword AS SELECT * FROM testmytbdb.image_keyword;
DROP VIEW IF EXISTS importmytbdb_image_object;
CREATE VIEW importmytbdb_image_object AS SELECT * FROM testmytbdb.image_object;
DROP VIEW IF EXISTS importmytbdb_video;
CREATE VIEW importmytbdb_video AS SELECT * FROM testmytbdb.video;
DROP VIEW IF EXISTS importmytbdb_video_playlist;
CREATE VIEW importmytbdb_video_playlist AS SELECT * FROM testmytbdb.video_playlist;
DROP VIEW IF EXISTS importmytbdb_video_keyword;
CREATE VIEW importmytbdb_video_keyword AS SELECT * FROM testmytbdb.video_keyword;
DROP VIEW IF EXISTS importmytbdb_video_object;
CREATE VIEW importmytbdb_video_object AS SELECT * FROM testmytbdb.video_object;

