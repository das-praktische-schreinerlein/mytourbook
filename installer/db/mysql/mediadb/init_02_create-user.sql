-- ------------------------------------
-- create users
-- ------------------------------------
CREATE USER IF NOT EXISTS 'mediadb@127.0.0.1' IDENTIFIED BY 'mediadb';
GRANT ALL PRIVILEGES ON mediadb.* TO 'mediadb@127.0.0.1' IDENTIFIED BY 'mediadb';
CREATE USER IF NOT EXISTS 'mediadb@localhost' IDENTIFIED BY 'mediadb';
GRANT ALL PRIVILEGES ON mediadb.* TO 'mediadb@localhost' IDENTIFIED BY 'mediadb';
CREATE USER IF NOT EXISTS 'mediadb@*' IDENTIFIED BY 'mediadb';
GRANT ALL PRIVILEGES ON mediadb.* TO 'mediadb@*' IDENTIFIED BY 'mediadb';
CREATE USER IF NOT EXISTS 'mediadb' IDENTIFIED BY 'mediadb';
GRANT ALL PRIVILEGES ON mediadb.* TO 'mediadb' IDENTIFIED BY 'mediadb';

FLUSH PRIVILEGES;
