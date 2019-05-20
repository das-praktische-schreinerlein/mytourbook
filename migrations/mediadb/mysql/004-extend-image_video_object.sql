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
ALTER TABLE objects MODIFY o_id INT AUTO_INCREMENT;

/* #############
# added objects_key to manage different key for one object
############# */
DROP TABLE IF EXISTS objects_key;
CREATE TABLE objects_key (
    o_id int NOT NULL,
    ok_key varchar(100) NOT NULL,
    ok_detector varchar(100) NOT NULL,
    CONSTRAINT objects_O_KEY_pk UNIQUE (ok_detector, o_id, ok_key)
);
INSERT INTO objects (o_name, o_picasa_key, o_key)
        SELECT 'Default', 'Default', 'Default' FROM dual
            WHERE NOT EXISTS (SELECT 1 FROM objects WHERE o_name='Default' and o_key='Default');
INSERT INTO objects_key(ok_detector, ok_key, o_id)
    SELECT distinct io_detector, IO_OBJ_TYPE, (select MAX(o_id) as newId FROM objects WHERE o_name='Default') as o_id  from image_object where IO_OBJ_TYPE is not null;

UPDATE objects_key toupdate,
 (SELECT ok_key, ok_detector, objects_key.o_id, objects.o_id as newId
  FROM objects_key INNER JOIN objects ON ok_key=o_key) grouped
SET toupdate.o_id=grouped.newId
WHERE toupdate.o_id=grouped.o_id and toupdate.ok_key=grouped.ok_key and toupdate.ok_detector=grouped.ok_detector and newId is not null;

delete from objects where O_KEY like '%haarcascade_%';
delete from image_object where IO_OBJ_TYPE like '%haarcascade_%';

update image_object set io_detector='picasa' where IO_OBJ_TYPE like '%picasa%';
update image_object set io_detector='playlist' where IO_OBJ_TYPE like '%Playlist%';
update image_object set image_object.io_precision=1 where IO_OBJ_TYPE like '%picasa%' or IO_OBJ_TYPE like '%Playlist%';
update video_object set vo_detector='picasa' where VO_OBJ_TYPE like '%picasa%';
update video_object set vo_detector='playlist' where VO_OBJ_TYPE like '%Playlist%';
update video_object set video_object.vo_precision=1 where VO_OBJ_TYPE like '%picasa%' or VO_OBJ_TYPE like '%Playlist%';
update video_object set video_object.vo_precision=rand()*0.5 where not (VO_OBJ_TYPE like '%picasa%' or VO_OBJ_TYPE like '%Playlist%');

update image_object set image_object.io_state='RUNNING_SUGGESTED' where image_object.io_detector like 'picasafile';
update image_object set image_object.io_state='RUNNING_MANUAL_APPROVED' where io_detector like 'picasa' or IO_OBJ_TYPE like '%Playlist%';

/* #############
# add index to objects_key
############# */
CREATE INDEX idx_objects_O_KEY_DETECTOR_pk ON objects_key (ok_detector, ok_key);

/* #############
# add object.type
############# */
ALTER TABLE objects ADD COLUMN o_category VARCHAR(50) DEFAULT 'Default';
CREATE INDEX idx_objects_O_CATEGORY ON objects (o_category);

/* #############
# clean objects
############# */
update objects set o_name = regexp_replace(regexp_replace(regexp_replace(o_key, '^faces_picasaobj_RealName\\[(.*?)\\].*$', '\\1'), '\\.', '_'), ',', '.') where O_KEY like '%faces_picasaobj_RealName%';
update objects set o_key = regexp_replace(o_key, '^faces_picasaobj_.*PicasaId\\[(.*)\\]$', 'faces_\\1') where O_KEY like '%PicasaId%';
update objects_key set ok_key = regexp_replace(ok_key, '^faces_picasaobj_.*PicasaId\\[(.*)\\]$', 'faces_\\1') where ok_key like '%PicasaId%';
update image_object set IO_OBJ_TYPE = regexp_replace(IO_OBJ_TYPE, '^faces_picasaobj_.*PicasaId\\[(.*)\\]$', 'faces_\\1') where IO_OBJ_TYPE like '%PicasaId%';
update video_object set VO_OBJ_TYPE = regexp_replace(VO_OBJ_TYPE, '^faces_picasaobj_.*PicasaId\\[(.*)\\]$', 'faces_\\1') where VO_OBJ_TYPE like '%PicasaId%';
delete from objects_key where o_id not in (select o_id from objects) and ok_detector in ('picasa');
UPDATE objects_key set o_id=(select min(o_id) from objects where ok_key=o_key) where o_id in (select o_id from objects where ok_key=o_key);
update objects set o_category='Person' where objects.O_KEY like '%faces%' or objects.O_KEY like '%Playlist_%';

/* #############
# insert default-objects
# source '../../installer/db/mysql/mediadb/xxxx-insert_default-objects.sql';
############# */


/* #############
# insert copies
############# */
INSERT INTO objects_key(ok_detector, ok_key, o_id) SELECT 'tfjs_cocossd_mobilenet_v1', ok_key, o_id FROM objects_key WHERE ok_detector='tfjs_cocossd_lite_mobilenet_v2' and ok_key not in (select ok_key from objects_key where ok_detector = 'tfjs_cocossd_mobilenet_v1');
INSERT INTO objects_key(ok_detector, ok_key, o_id) SELECT 'tfjs_cocossd_mobilenet_v2', ok_key, o_id FROM objects_key WHERE ok_detector='tfjs_cocossd_lite_mobilenet_v2' and ok_key not in (select ok_key from objects_key where ok_detector = 'tfjs_cocossd_mobilenet_v2');
INSERT INTO objects_key(ok_detector, ok_key, o_id) SELECT 'tfjs_mobilenet_v1', ok_key, o_id FROM objects_key WHERE ok_detector='tfjs_cocossd_lite_mobilenet_v2' and ok_key not in (select ok_key from objects_key where ok_detector = 'tfjs_mobilenet_v1');

