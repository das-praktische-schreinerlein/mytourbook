-- ##################
-- attach mytbexportbetadb-database
-- ##################
ATTACH DATABASE 'F:/playground/mytb-test/mytbbase/import/mytbexportbetadb.sqlite' AS importmytbexportbetadb;

-- ##################
-- copy tables
-- ##################
DELETE FROM location;
INSERT INTO location SELECT * FROM importmytbexportbetadb.location;

DELETE FROM news;
INSERT INTO news SELECT * FROM importmytbexportbetadb.news;

DELETE FROM info;
INSERT INTO info SELECT * FROM importmytbexportbetadb.info;

DELETE FROM location_info;
INSERT INTO location_info SELECT * FROM importmytbexportbetadb.location_info;

DELETE FROM trip;
INSERT INTO trip SELECT * FROM importmytbexportbetadb.trip;

DELETE FROM kategorie_full;
INSERT INTO kategorie_full SELECT * FROM importmytbexportbetadb.kategorie_full;

DELETE FROM destination;
INSERT INTO destination SELECT * FROM importmytbexportbetadb.destination;

DELETE FROM tour;
INSERT INTO tour SELECT * FROM importmytbexportbetadb.tour;

DELETE FROM tour_info;
INSERT INTO tour_info SELECT * FROM importmytbexportbetadb.tour_info;

DELETE FROM image;
INSERT INTO image SELECT * FROM importmytbexportbetadb.image;

DELETE FROM video;
INSERT INTO video SELECT * FROM importmytbexportbetadb.video;

-- ##################
-- detach mytbexportbetadb-database
-- ##################
DETACH DATABASE importmytbexportbetadb;
