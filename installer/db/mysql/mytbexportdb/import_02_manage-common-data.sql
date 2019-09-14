--
-- clean data
--

-- remove location OFFEN
UPDATE location SET l_parent_id = NULL WHERE l_parent_id = 1;
UPDATE trip SET l_id = NULL WHERE l_id = 1;
UPDATE tour SET l_id = NULL WHERE l_id = 1;
UPDATE kategorie_full SET l_id = NULL WHERE l_id = 1;

-- remove tour OFFEN, Keine Tour
UPDATE tour SET l_id = NULL WHERE l_id = 1;
UPDATE kategorie_full SET t_id = NULL WHERE t_id EXISTS (SELECT t_id FROM tour WHERE lower(t_name) LIKE '%keine tour%');
UPDATE kategorie_full SET t_id = NULL WHERE t_id EXISTS (SELECT t_id FROM tour WHERE lower(t_name) LIKE 'offen');

-- remove person: Unbekannt
UPDATE kategorie_full SET k_persons=REGEXP_REPLACE(k_persons, '^Unbekannt,,', '');
UPDATE kategorie_full SET k_persons=REGEXP_REPLACE(k_persons, '^Unbekannt,', '');
UPDATE kategorie_full SET k_persons=REGEXP_REPLACE(k_persons, ',,Unbekannt,,', ',,');
UPDATE kategorie_full SET k_persons=REGEXP_REPLACE(k_persons, ',Unbekannt,', ',');
UPDATE kategorie_full SET k_persons=REGEXP_REPLACE(k_persons, ',,Unbekannt$', '');
UPDATE kategorie_full SET k_persons=REGEXP_REPLACE(k_persons, ',Unbekannt$', '');

-- clear objects: Default, CommonFace
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, '^Default,,', '');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, '^Default,', '');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',,Default,,', ',,');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',Default,', ',');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',,Default', '');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',Default', '');

UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, '^CommonFace,,', '');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, '^CommonFace,', '');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',,CommonFace,,', ',,');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',CommonFace,', ',');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',,CommonFace', '');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',CommonFace', '');
