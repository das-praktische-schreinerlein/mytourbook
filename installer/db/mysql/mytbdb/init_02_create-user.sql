-- ------------------------------------
-- create users
-- ------------------------------------
CREATE USER IF NOT EXISTS testmytbdb@127.0.0.1 IDENTIFIED BY 'testmytbdb';
GRANT ALL PRIVILEGES ON testmytbdb.* TO testmytbdb@127.0.0.1 IDENTIFIED BY 'testmytbdb';
CREATE USER IF NOT EXISTS testmytbdb@localhost IDENTIFIED BY 'testmytbdb';
GRANT ALL PRIVILEGES ON testmytbdb.* TO testmytbdb@localhost IDENTIFIED BY 'testmytbdb';
-- CREATE USER IF NOT EXISTS testmytbdb@'%' IDENTIFIED BY 'testmytbdb';
-- GRANT ALL PRIVILEGES ON testmytbdb.* TO testmytbdb@'%' IDENTIFIED BY 'testmytbdb';
CREATE USER IF NOT EXISTS testmytbdb IDENTIFIED BY 'testmytbdb';
GRANT ALL PRIVILEGES ON testmytbdb.* TO testmytbdb IDENTIFIED BY 'testmytbdb';

FLUSH PRIVILEGES;
