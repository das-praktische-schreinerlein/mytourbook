create user 'mediadb@172.22.0.3' identified by 'mediadb';
GRANT ALL PRIVILEGES ON mediadb.* TO 'mediadb@172.22.0.3' IDENTIFIED BY 'mediadb';
create user 'mediadb@*' identified by 'mediadb';
GRANT ALL PRIVILEGES ON mediadb.* TO 'mediadb@*' IDENTIFIED BY 'mediadb';
create user 'mediadb' identified by 'mediadb';
GRANT ALL PRIVILEGES ON mediadb.* TO 'mediadb' IDENTIFIED BY 'mediadb';
flush privileges;
