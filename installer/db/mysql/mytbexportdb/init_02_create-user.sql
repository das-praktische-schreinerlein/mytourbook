-- ------------------------------------
-- create user
-- ------------------------------------
CREATE USER IF NOT EXISTS 'mytbexportdb@127.0.0.1' IDENTIFIED BY 'mytbexportdb';
GRANT ALL PRIVILEGES ON mytbexportdb.* TO 'mytbexportdb@127.0.0.1' IDENTIFIED BY 'mytbexportdb';
CREATE USER IF NOT EXISTS 'mytbexportdb@*' IDENTIFIED BY 'mytbexportdb';
GRANT ALL PRIVILEGES ON mytbexportdb.* TO 'mytbexportdb@*' IDENTIFIED BY 'mytbexportdb';
CREATE USER IF NOT EXISTS 'mytbexportdb' IDENTIFIED BY 'mytbexportdb';
GRANT ALL PRIVILEGES ON mytbexportdb.* TO 'mytbexportdb' IDENTIFIED BY 'mytbexportdb';

FLUSH PRIVILEGES;
