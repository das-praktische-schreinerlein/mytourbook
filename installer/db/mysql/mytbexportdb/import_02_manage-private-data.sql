--
-- manage persons
--
-- add Micha as default
UPDATE kategorie_full SET k_persons = CONCAT('Micha,', COALESCE(k_persons, ''));

--
-- disable update of calced field to prevent long-running sqls
--
-- image needs 5h per 100.000 records
-- update image set i_calced_navigation_objects = '';
