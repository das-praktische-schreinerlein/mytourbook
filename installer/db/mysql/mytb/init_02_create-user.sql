-- ------------------------------------
-- create user
-- ------------------------------------
CREATE USER IF NOT EXISTS 'mytb@127.0.0.1' IDENTIFIED BY 'mytb';
GRANT ALL PRIVILEGES ON mytb.* TO 'mytb@127.0.0.1' IDENTIFIED BY 'mytb';
CREATE USER IF NOT EXISTS 'mytb@*' IDENTIFIED BY 'mytb';
GRANT ALL PRIVILEGES ON mytb.* TO 'mytb@*' IDENTIFIED BY 'mytb';
CREATE USER IF NOT EXISTS 'mytb' IDENTIFIED BY 'mytb';
GRANT ALL PRIVILEGES ON mytb.* TO 'mytb' IDENTIFIED BY 'mytb';

FLUSH PRIVILEGES;
