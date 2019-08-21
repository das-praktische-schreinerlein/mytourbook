-- ------------------------------------
-- create users
-- ------------------------------------
CREATE USER IF NOT EXISTS 'testmediadb@127.0.0.1' IDENTIFIED BY 'testmediadb';
GRANT ALL PRIVILEGES ON testmediadb.* TO 'testmediadb@127.0.0.1' IDENTIFIED BY 'testmediadb';
CREATE USER IF NOT EXISTS 'testmediadb@localhost' IDENTIFIED BY 'testmediadb';
GRANT ALL PRIVILEGES ON testmediadb.* TO 'testmediadb@localhost' IDENTIFIED BY 'testmediadb';
CREATE USER IF NOT EXISTS 'testmediadb@*' IDENTIFIED BY 'testmediadb';
GRANT ALL PRIVILEGES ON testmediadb.* TO 'testmediadb@*' IDENTIFIED BY 'testmediadb';
CREATE USER IF NOT EXISTS 'testmediadb' IDENTIFIED BY 'testmediadb';
GRANT ALL PRIVILEGES ON testmediadb.* TO 'testmediadb' IDENTIFIED BY 'testmediadb';

FLUSH PRIVILEGES;
