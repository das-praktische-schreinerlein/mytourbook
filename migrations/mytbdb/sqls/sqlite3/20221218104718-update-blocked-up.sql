/* #############
# update blocked-values
############# */
/* #############
# update blocked-values
############# */
UPDATE image SET i_gesperrt = i_gesperrt * 5 - 2  where i_gesperrt > 0;
UPDATE video SET v_gesperrt = v_gesperrt * 5 - 2 where v_gesperrt > 0;
UPDATE kategorie SET k_gesperrt = k_gesperrt * 5 - 2 where k_gesperrt > 0;
UPDATE tour SET t_gesperrt = t_gesperrt * 5 - 2 where t_gesperrt > 0;
UPDATE location SET l_gesperrt = l_gesperrt * 5 - 2 where l_gesperrt > 0;
UPDATE trip SET tr_gesperrt = tr_gesperrt * 5 - 2 where tr_gesperrt > 0;
UPDATE news SET n_gesperrt = n_gesperrt * 5 - 2 where n_gesperrt > 0;
