SELECT count(*) FROM image WHERE i_gesperrt IS NULL;
UPDATE image SET i_gesperrt=0 WHERE i_gesperrt IS NULL;

SELECT count(*) FROM video WHERE v_gesperrt IS NULL;
UPDATE video SET v_gesperrt=0 WHERE v_gesperrt IS NULL;

SELECT count(*) FROM kategorie WHERE k_gesperrt IS NULL;
UPDATE kategorie SET k_gesperrt=0 WHERE k_gesperrt IS NULL;

SELECT count(*) FROM tour WHERE t_gesperrt IS NULL;
UPDATE tour SET t_gesperrt=0 WHERE t_gesperrt IS NULL;

SELECT count(*) FROM location WHERE l_gesperrt IS NULL;
UPDATE location SET l_gesperrt=0 WHERE l_gesperrt IS NULL;

SELECT count(*) FROM trip WHERE tr_gesperrt IS NULL;
UPDATE trip SET tr_gesperrt=0 WHERE tr_gesperrt IS NULL;

SELECT count(*) FROM news WHERE n_gesperrt IS NULL;
UPDATE news SET n_gesperrt=0 WHERE n_gesperrt IS NULL;
