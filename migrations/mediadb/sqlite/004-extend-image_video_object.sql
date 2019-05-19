/* #############
# add io_state to image_object
############# */
ALTER TABLE image_object ADD COLUMN io_state VARCHAR(50) DEFAULT 'UNKNOWN';
ALTER TABLE image_object ADD COLUMN io_precision FLOAT DEFAULT 1;
ALTER TABLE image_object ADD COLUMN io_detector VARCHAR(50) DEFAULT 'UNKNOWN';
ALTER TABLE video_object ADD COLUMN vo_state VARCHAR(50) DEFAULT 'UNKNOWN';
ALTER TABLE video_object ADD COLUMN vo_precision FLOAT DEFAULT 1;
ALTER TABLE video_object ADD COLUMN vo_detector VARCHAR(50) DEFAULT 'UNKNOWN';
CREATE INDEX idx_io__io_state ON image_object (io_state);
CREATE INDEX idx_io__io_detector ON image_object (io_detector);
CREATE INDEX idx_vo__vo_state ON video_object (vo_state);
CREATE INDEX idx_vo__vo_detector ON video_object (vo_detector);

/* #############
# auto increment objects
############# */
ALTER TABLE objects RENAME TO objects_old;
CREATE TABLE objects (
    O_ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    O_PICASA_KEY varchar(50) NOT NULL,
    O_NAME varchar(100) NULL,
    P_ID int NULL,
    O_KEY varchar(100) NULL,
    CONSTRAINT objects_O_KEY_pk UNIQUE (O_KEY)
);
INSERT INTO objects
    SELECT * from objects_old;
DROP TABLE objects_old;

/* #############
# added objects_key to manage different key for one object
############# */
DROP TABLE IF EXISTS objects_key;
CREATE TABLE objects_key (
    o_id int NOT NULL,
    ok_key varchar(100) NOT NULL,
    ok_detector varchar(100) NOT NULL
);
INSERT INTO objects (o_name, o_picasa_key, o_key)
        SELECT 'Default', 'Default', 'Default'
            WHERE NOT EXISTS (SELECT 1 FROM objects WHERE o_name='Default' and o_key='Default');
INSERT INTO objects_key(ok_detector, ok_key, o_id)
    SELECT distinct io_detector, IO_OBJ_TYPE, (select MAX(o_id) as newId FROM objects WHERE o_name='Default') as o_id  from image_object where IO_OBJ_TYPE is not null;

/** will not run
UPDATE objects_key toupdate,
 (SELECT ok_key, ok_detector, objects_key.o_id, objects.o_id as newId
  FROM objects_key INNER JOIN objects ON ok_key=o_key) grouped
SET toupdate.o_id=grouped.newId
WHERE toupdate.o_id=grouped.o_id and toupdate.ok_key=grouped.ok_key and toupdate.ok_detector=grouped.ok_detector and newId is not null;
**/

delete from objects where O_KEY like '%haarcascade_%';
delete from image_object where IO_OBJ_TYPE like '%haarcascade_%';

update image_object set io_detector='picasa' where IO_OBJ_TYPE like '%picasa%';
update image_object set io_detector='playlist' where IO_OBJ_TYPE like '%Playlist%';
update image_object set io_precision=1 where IO_OBJ_TYPE like '%picasa%' or IO_OBJ_TYPE like '%Playlist%';
update video_object set vo_detector='picasa' where VO_OBJ_TYPE like '%picasa%';
update video_object set vo_detector='playlist' where VO_OBJ_TYPE like '%Playlist%';
update video_object set vo_precision=1 where VO_OBJ_TYPE like '%picasa%' or VO_OBJ_TYPE like '%Playlist%';
update video_object set vo_precision=0.5 where not (VO_OBJ_TYPE like '%picasa%' or VO_OBJ_TYPE like '%Playlist%');

update image_object set io_state='RUNNING_SUGGESTED' where image_object.io_detector like 'picasafile';
update image_object set io_state='RUNNING_MANUAL_APPROVED' where io_detector like 'picasa' or IO_OBJ_TYPE like '%Playlist%';

/* #############
# add index to objects_key
############# */
CREATE INDEX idx_objects_O_KEY_DETECTOR_pk ON objects_key (ok_detector, ok_key);

/* #############
# add object.type
############# */
ALTER TABLE objects ADD COLUMN o_category VARCHAR(50) DEFAULT 'Default';
CREATE INDEX idx_objects_O_CATEGORY ON objects (o_category);
