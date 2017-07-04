create user 'mytb@172.22.0.3' identified by 'mytb';
GRANT ALL PRIVILEGES ON mytb.* TO 'mytb@172.22.0.3' IDENTIFIED BY 'mytb';
create user 'mytb@*' identified by 'mytb';
GRANT ALL PRIVILEGES ON mytb.* TO 'mytb@*' IDENTIFIED BY 'mytb';
create user 'mytb' identified by 'mytb';
GRANT ALL PRIVILEGES ON mytb.* TO 'mytb' IDENTIFIED BY 'mytb';
flush privileges;
