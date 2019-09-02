SELECT k_id FROM kategorie WHERE t_id is null;
UPDATE kategorie SET t_id=1 WHERE t_id is null;
