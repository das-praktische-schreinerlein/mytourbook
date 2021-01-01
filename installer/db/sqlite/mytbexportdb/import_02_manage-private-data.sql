--
-- manage persons
--
-- add Micha as default
UPDATE kategorie_full SET k_persons = 'Micha,' || COALESCE(k_persons, '');
