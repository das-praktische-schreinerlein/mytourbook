SELECT k_id, k_name FROM kategorie WHERE k_id NOT IN (SELECT k_id FROM image);
DELETE FROM kategorie WHERE k_id NOT IN (SELECT k_id FROM image);
