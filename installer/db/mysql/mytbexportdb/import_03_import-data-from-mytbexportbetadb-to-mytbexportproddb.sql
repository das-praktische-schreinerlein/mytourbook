--
-- copy tables
--
DROP TABLE IF EXISTS location;
CREATE TABLE location SELECT * FROM testmytbexportbetadb.location;

DROP TABLE IF EXISTS news;
CREATE TABLE news SELECT * FROM testmytbexportbetadb.news;

DROP TABLE IF EXISTS trip;
CREATE TABLE trip SELECT * FROM testmytbexportbetadb.trip;

DROP TABLE IF EXISTS kategorie_full;
CREATE TABLE kategorie_full SELECT * FROM testmytbexportbetadb.kategorie_full;

DROP TABLE IF EXISTS tour;
CREATE TABLE tour SELECT * FROM testmytbexportbetadb.tour;

DROP TABLE IF EXISTS image;
CREATE TABLE image SELECT * FROM testmytbexportbetadb.image;

DROP TABLE IF EXISTS video;
CREATE TABLE video SELECT * FROM testmytbexportbetadb.video;
