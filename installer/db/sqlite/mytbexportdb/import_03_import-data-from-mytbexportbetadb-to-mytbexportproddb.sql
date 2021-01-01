-- ##################
-- attach mytbexportbetadb-database
-- ##################
-- DETACH DATABASE importmytbexportbetadb;
ATTACH DATABASE 'F:/playground/mytb-test/mytbbase/import/mytbexportbetadb.sqlite' AS importmytbexportbetadb;

-- ##################
-- copy tables
-- ##################
TRUNCATE TABLE location;
INSERT INTO location SELECT * FROM importmytbexportbetadb.location;

TRUNCATE TABLE news;
INSERT INTO news SELECT * FROM importmytbexportbetadb.news;

TRUNCATE TABLE info;
INSERT INTO info SELECT * FROM importmytbexportbetadb.info;

TRUNCATE TABLE location_info;
INSERT INTO location_info SELECT * FROM importmytbexportbetadb.location_info;

TRUNCATE TABLE trip;
INSERT INTO trip SELECT * FROM importmytbexportbetadb.trip;

TRUNCATE TABLE kategorie_full;
INSERT INTO kategorie_full SELECT * FROM importmytbexportbetadb.kategorie_full;

TRUNCATE TABLE destination;
INSERT INTO destination SELECT * FROM importmytbexportbetadb.destination;

TRUNCATE TABLE tour;
INSERT INTO tour SELECT * FROM importmytbexportbetadb.tour;

TRUNCATE TABLE tour_info;
INSERT INTO tour_info SELECT * FROM importmytbexportbetadb.tour_info;

TRUNCATE TABLE image;
INSERT INTO image SELECT * FROM importmytbexportbetadb.image;

TRUNCATE TABLE video;
INSERT INTO video SELECT * FROM importmytbexportbetadb.video;

-- ##################
-- detach mytbexportbetadb-database
-- ##################
DETACH DATABASE importmytbexportbetadb;
