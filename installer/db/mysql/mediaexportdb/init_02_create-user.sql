-- ------------------------------------
-- create user
-- ------------------------------------
CREATE USER IF NOT EXISTS 'mediaexportdb@127.0.0.1' IDENTIFIED BY 'mediaexportdb';
GRANT ALL PRIVILEGES ON mediaexportdb.* TO 'mediaexportdb@127.0.0.1' IDENTIFIED BY 'mediaexportdb';
CREATE USER IF NOT EXISTS 'mediaexportdb@*' IDENTIFIED BY 'mediaexportdb';
GRANT ALL PRIVILEGES ON mediaexportdb.* TO 'mediaexportdb@*' IDENTIFIED BY 'mediaexportdb';
CREATE USER IF NOT EXISTS 'mediaexportdb' IDENTIFIED BY 'mediaexportdb';
GRANT ALL PRIVILEGES ON mediaexportdb.* TO 'mediaexportdb' IDENTIFIED BY 'mediaexportdb';

FLUSH PRIVILEGES;
