-- ##################
-- attach mytbexportbetadb-database
-- ##################
ATTACH DATABASE 'F:/playground/mytb-test/mytbbase/import/mytbexportbetadb.sqlite' AS importmytbexportbetadb;

-- ##################
-- copy tables
-- ##################
DELETE FROM playlist;
INSERT INTO playlist SELECT * FROM importmytbexportbetadb.playlist;

DELETE FROM location;
INSERT INTO location SELECT * FROM importmytbexportbetadb.location;

DELETE FROM poi;
INSERT INTO poi SELECT * FROM importmytbexportbetadb.poi;

DELETE FROM news;
INSERT INTO news SELECT * FROM importmytbexportbetadb.news;

DELETE FROM info;
INSERT INTO info SELECT * FROM importmytbexportbetadb.info;

DELETE FROM info_playlist;
INSERT INTO info_playlist SELECT * FROM importmytbexportbetadb.info_playlist;

DELETE FROM location_info;
INSERT INTO location_info SELECT * FROM importmytbexportbetadb.location_info;

DELETE FROM location_playlist;
INSERT INTO location_playlist SELECT * FROM importmytbexportbetadb.location_playlist;

DELETE FROM trip;
INSERT INTO trip SELECT * FROM importmytbexportbetadb.trip;

DELETE FROM trip_playlist;
INSERT INTO trip_playlist SELECT * FROM importmytbexportbetadb.trip_playlist;

DELETE FROM kategorie_full;
INSERT INTO kategorie_full SELECT * FROM importmytbexportbetadb.kategorie_full;

DELETE FROM kategorie_tour;
INSERT INTO kategorie_tour SELECT * FROM importmytbexportbetadb.kategorie_tour;

DELETE FROM kategorie_playlist;
INSERT INTO kategorie_playlist SELECT * FROM importmytbexportbetadb.kategorie_playlist;

DELETE FROM kategorie_poi;
INSERT INTO kategorie_poi SELECT * FROM importmytbexportbetadb.kategorie_poi;

DELETE FROM destination;
INSERT INTO destination SELECT * FROM importmytbexportbetadb.destination;

DELETE FROM tour;
INSERT INTO tour SELECT * FROM importmytbexportbetadb.tour;

DELETE FROM tour_info;
INSERT INTO tour_info SELECT * FROM importmytbexportbetadb.tour_info;

DELETE FROM tour_playlist;
INSERT INTO tour_playlist SELECT * FROM importmytbexportbetadb.tour_playlist;

DELETE FROM tour_poi;
INSERT INTO tour_poi SELECT * FROM importmytbexportbetadb.tour_poi;

DELETE FROM image;
INSERT INTO image SELECT * FROM importmytbexportbetadb.image;

DELETE FROM image_playlist;
INSERT INTO image_playlist SELECT * FROM importmytbexportbetadb.image_playlist;

DELETE FROM video;
INSERT INTO video SELECT * FROM importmytbexportbetadb.video;

DELETE FROM video_playlist;
INSERT INTO video_playlist SELECT * FROM importmytbexportbetadb.video_playlist;

-- ##################
-- detach mytbexportbetadb-database
-- ##################
DETACH DATABASE importmytbexportbetadb;
