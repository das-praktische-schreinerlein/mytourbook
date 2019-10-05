SELECT i_date, date_add(i_date, interval +60 minute) AS date2, i_origpath FROM image WHERE k_id > 999999999 AND i_dir LIKE '%-imgagedatefalse';
UPDATE image SET i_date=date_add(i_date, interval +60 minute) WHERE k_id > 999999999 AND i_dir LIKE '%-imgagedatefalse';

SELECT v_date, date_add(v_date, interval +60 minute) AS date2, v_origpath FROM video WHERE k_id > 999999999 AND v_dir LIKE '%-imgagedatefalse';
UPDATE video SET v_date=date_add(v_date, interval +60 minute) WHERE k_id > 999999999 AND v_dir LIKE '%-imgagedatefalse';


SELECT i_date, date_add(i_date, interval +60 minute) AS date2, i_origpath FROM image WHERE k_id in (999999999);
UPDATE image SET i_date=date_add(i_date, interval +60 minute) WHERE k_id in (999999999);

SELECT v_date, date_add(v_date, interval +60 minute) AS date2, v_origpath FROM video WHERE k_id in (999999999);
UPDATE video SET v_date=date_add(v_date, interval +60 minute) WHERE k_id in (999999999);

-- check for imagesdates: run readImageDates till no more found
    select 'handy' as type, rownumfile, ifile.i_id, ifile.i_date, ifile.i_file, rownumdate, idate.i_id, idate.i_date, idate.i_file from (
     (select @i:=@i+1 as rownumfile, i_id, i_date, i_file from image, (SELECT @i:=0) AS temp where i_file like '20%' order by i_file ) ifile
    inner join
    (select @i2:=@2i+1 as rownumdate, i_id, i_date, i_file from image, (SELECT @i2:=0) AS temp2 where i_file like '20%' order by i_date) idate
    on ifile.i_id = idate.i_id
    )
    where rownumfile<>rownumdate
UNION
    select 'camera' as type, rownumfile, ifile.i_id, ifile.i_date, ifile.i_file, rownumdate, idate.i_id, idate.i_date, idate.i_file from (
     (select @i3:=@i3+1 as rownumfile, i_id, i_date, i_file from image, (SELECT @i3:=0) AS temp3 where i_file like 'P%' order by i_file ) ifile
    inner join
    (select @i4:=@i4+1 as rownumdate, i_id, i_date, i_file from image, (SELECT @i4:=0) AS temp4 where i_file like 'P%' order by i_date) idate
    on ifile.i_id = idate.i_id
    )
    where rownumfile<>rownumdate
