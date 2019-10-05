-- sqlite
SELECT i_date, strftime('%Y-%m-%dT%H:%M:%S', i_date, '-60 minutes') AS datenew, i_dir FROM image WHERE k_id > 999999999 AND i_dir LIKE '%-imgagedatefalse';
UPDATE image SET i_date=strftime('%Y-%m-%dT%H:%M:%S', i_date, '-60 minutes') WHERE k_id > 999999999 AND i_dir LIKE '%-imgagedatefalse';

-- check for imagesdates: run readImageDates till no more found
    select 'handy' as type, * from (
        select row_number() over (order by ifile.i_file) as rownumfile, ifile.i_id, ifile.i_date, ifile.i_file,
               row_number() over (order by idate.i_date) as rownumdate, idate.i_id, idate.i_date, idate.i_file
        from image ifile inner join image idate on ifile.i_id=idate.i_id
        where ifile.i_file like '20%' and idate.i_file like '20%')
    where rownumfile<>rownumdate;
UNION
    select 'camera' as type, * from (
        select row_number() over (order by ifile.i_file) as rownumfile, ifile.i_id, ifile.i_date, ifile.i_file,
               row_number() over (order by idate.i_date) as rownumdate, idate.i_id, idate.i_date, idate.i_file
        from image ifile inner join image idate on ifile.i_id=idate.i_id
        where ifile.i_file not like '20%' and idate.i_file not like '20%')
    where rownumfile<>rownumdate;
