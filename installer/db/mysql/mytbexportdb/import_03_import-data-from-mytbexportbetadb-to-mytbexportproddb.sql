--
-- copy tables
--
TRUNCATE TABLE location;
INSERT INTO location SELECT * FROM testmytbexportbetadb.location;

TRUNCATE TABLE news;
INSERT INTO news SELECT * FROM testmytbexportbetadb.news;

TRUNCATE TABLE trip;
INSERT INTO trip SELECT * FROM testmytbexportbetadb.trip;

TRUNCATE TABLE kategorie_full;
INSERT INTO kategorie_full SELECT * FROM testmytbexportbetadb.kategorie_full;

TRUNCATE TABLE destianation;
INSERT INTO destianation SELECT * FROM testmytbexportbetadb.destianation;

TRUNCATE TABLE tour;
INSERT INTO tour SELECT * FROM testmytbexportbetadb.tour;

TRUNCATE TABLE image;
INSERT INTO image SELECT * FROM testmytbexportbetadb.image;

TRUNCATE TABLE video;
INSERT INTO video SELECT * FROM testmytbexportbetadb.video;
