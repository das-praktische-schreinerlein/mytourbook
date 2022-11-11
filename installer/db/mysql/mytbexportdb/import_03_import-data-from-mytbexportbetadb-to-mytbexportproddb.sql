-- ##################
-- create views
-- ##################
DROP VIEW IF EXISTS importmytbdb_kategorie_tour;
CREATE VIEW importmytbdb_kategorie_tour AS SELECT * FROM testmytbdb.kategorie_tour;

DROP VIEW IF EXISTS importmytbdb_kategorie_poi;
CREATE VIEW importmytbdb_kategorie_poi AS SELECT * FROM testmytbdb.kategorie_poi;

DROP VIEW IF EXISTS importmytbdb_tour_poi;
CREATE VIEW importmytbdb_tour_poi AS SELECT * FROM testmytbdb.tour_poi;

DROP VIEW IF EXISTS importmytbdb_poi_info;
CREATE VIEW importmytbdb_poi_info AS SELECT * FROM testmytbdb.poi_info;

-- ##################
-- copy tables
-- ##################
TRUNCATE TABLE playlist;
INSERT INTO playlist SELECT * FROM testmytbexportbetadb.playlist;

TRUNCATE TABLE location;
INSERT INTO location SELECT * FROM testmytbexportbetadb.location;

TRUNCATE TABLE poi;
INSERT INTO poi SELECT * FROM testmytbexportbetadb.poi;

TRUNCATE TABLE news;
INSERT INTO news SELECT * FROM testmytbexportbetadb.news;

TRUNCATE TABLE info;
INSERT INTO info SELECT * FROM testmytbexportbetadb.info;

TRUNCATE TABLE info_playlist;
INSERT INTO info_playlist SELECT * FROM testmytbexportbetadb.info_playlist;

TRUNCATE TABLE location_info;
INSERT INTO location_info SELECT * FROM testmytbexportbetadb.location_info;

TRUNCATE TABLE location_playlist;
INSERT INTO location_playlist SELECT * FROM testmytbexportbetadb.location_playlist;

TRUNCATE TABLE trip;
INSERT INTO trip SELECT * FROM testmytbexportbetadb.trip;

TRUNCATE TABLE trip_playlist;
INSERT INTO trip_playlist SELECT * FROM testmytbexportbetadb.trip_playlist;

TRUNCATE TABLE kategorie_full;
INSERT INTO kategorie_full SELECT * FROM testmytbexportbetadb.kategorie_full;

TRUNCATE TABLE kategorie_tour;
INSERT INTO kategorie_tour SELECT * FROM testmytbexportbetadb.kategorie_tour;

TRUNCATE TABLE kategorie_playlist;
INSERT INTO kategorie_playlist SELECT * FROM testmytbexportbetadb.kategorie_playlist;

TRUNCATE TABLE kategorie_poi;
INSERT INTO kategorie_poi SELECT * FROM testmytbexportbetadb.kategorie_poi;

TRUNCATE TABLE destination;
INSERT INTO destination SELECT * FROM testmytbexportbetadb.destination;

TRUNCATE TABLE tour;
INSERT INTO tour SELECT * FROM testmytbexportbetadb.tour;

TRUNCATE TABLE tour_info;
INSERT INTO tour_info SELECT * FROM testmytbexportbetadb.tour_info;

TRUNCATE TABLE tour_playlist;
INSERT INTO tour_playlist SELECT * FROM testmytbexportbetadb.tour_playlist;

TRUNCATE TABLE tour_poi;
INSERT INTO tour_poi SELECT * FROM testmytbexportbetadb.tour_poi;

TRUNCATE TABLE image;
INSERT INTO image SELECT * FROM testmytbexportbetadb.image;

TRUNCATE TABLE image_playlist;
INSERT INTO image_playlist SELECT * FROM testmytbexportbetadb.image_playlist;

TRUNCATE TABLE video;
INSERT INTO video SELECT * FROM testmytbexportbetadb.video;

TRUNCATE TABLE video_playlist;
INSERT INTO video_playlist SELECT * FROM testmytbexportbetadb.video_playlist;

-- ##################
-- optimize tables
-- ##################
ANALYZE TABLE destination, image, kategorie_full, location, news, numbers, tour, trip, video;
REPAIR TABLE destination, image, kategorie_full, location, news, numbers, tour, trip, video;
OPTIMIZE TABLE destination, image, kategorie_full, location, news, numbers, tour, trip, video;
ANALYZE TABLE destination, image, kategorie_full, location, news, numbers, tour, trip, video;
