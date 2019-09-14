--
-- manage persons
--
-- add Micha as default
UPDATE kategorie_full SET k_persons = CONCAT('Micha,', COALESCE(k_persons, ''));
