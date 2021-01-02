-- ##################
-- create views
-- ##################
DROP VIEW IF EXISTS importmytbdb_kategorie_tour;
CREATE VIEW importmytbdb_kategorie_tour AS SELECT * FROM testmytbdb.kategorie_tour;

-- ##################
-- copy tables
-- ##################
TRUNCATE TABLE location;
INSERT INTO location SELECT * FROM testmytbexportbetadb.location;

TRUNCATE TABLE news;
INSERT INTO news SELECT * FROM testmytbexportbetadb.news;

TRUNCATE TABLE info;
INSERT INTO info SELECT * FROM testmytbexportbetadb.info;

TRUNCATE TABLE location_info;
INSERT INTO location_info SELECT * FROM testmytbexportbetadb.location_info;

TRUNCATE TABLE trip;
INSERT INTO trip SELECT * FROM testmytbexportbetadb.trip;

TRUNCATE TABLE kategorie_full;
INSERT INTO kategorie_full SELECT * FROM testmytbexportbetadb.kategorie_full;

TRUNCATE TABLE destination;
INSERT INTO destination SELECT * FROM testmytbexportbetadb.destination;

TRUNCATE TABLE tour;
INSERT INTO tour SELECT * FROM testmytbexportbetadb.tour;

TRUNCATE TABLE tour_info;
INSERT INTO tour_info SELECT * FROM testmytbexportbetadb.tour_info;

TRUNCATE TABLE image;
INSERT INTO image SELECT * FROM testmytbexportbetadb.image;

TRUNCATE TABLE video;
INSERT INTO video SELECT * FROM testmytbexportbetadb.video;

-- ##################
-- optimize tables
-- ##################
ANALYZE TABLE destination, image, kategorie_full, location, news, numbers, tour, trip, video;
REPAIR TABLE destination, image, kategorie_full, location, news, numbers, tour, trip, video;
OPTIMIZE TABLE destination, image, kategorie_full, location, news, numbers, tour, trip, video;
ANALYZE TABLE destination, image, kategorie_full, location, news, numbers, tour, trip, video;
