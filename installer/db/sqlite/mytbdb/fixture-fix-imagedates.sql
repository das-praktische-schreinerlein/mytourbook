-- sqlite
SELECT i_date, strftime('%Y-%m-%dT%H:%M:%S', i_date, '-60 minutes') AS datenew, i_dir FROM image WHERE k_id > 999999999 AND i_dir LIKE '%-imgagedatefalse';
UPDATE image SET i_date=strftime('%Y-%m-%dT%H:%M:%S', i_date, '-60 minutes') WHERE k_id > 999999999 AND i_dir LIKE '%-imgagedatefalse';
