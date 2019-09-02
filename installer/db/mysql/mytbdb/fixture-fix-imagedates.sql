SELECT i_date, date_add(i_date, interval +60 minute) AS date2, i_origpath FROM image WHERE k_id > 999999999 AND i_dir LIKE '%-imgagedatefalse';
UPDATE image SET i_date=date_add(i_date, interval +60 minute) WHERE k_id > 999999999 AND i_dir LIKE '%-imgagedatefalse';

SELECT v_date, date_add(v_date, interval +60 minute) AS date2, v_origpath FROM video WHERE k_id > 999999999 AND v_dir LIKE '%-imgagedatefalse';
UPDATE video SET v_date=date_add(v_date, interval +60 minute) WHERE k_id > 999999999 AND v_dir LIKE '%-imgagedatefalse';


SELECT i_date, date_add(i_date, interval +60 minute) AS date2, i_origpath FROM image WHERE k_id in (999999999);
UPDATE image SET i_date=date_add(i_date, interval +60 minute) WHERE k_id in (999999999);

SELECT v_date, date_add(v_date, interval +60 minute) AS date2, v_origpath FROM video WHERE k_id in (999999999);
UPDATE video SET v_date=date_add(v_date, interval +60 minute) WHERE k_id in (999999999);

