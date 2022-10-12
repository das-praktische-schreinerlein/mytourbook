-- fix encoding of your tables to utf8
SELECT CONCAT(
               'ALTER TABLE ',  table_name, ' CHARACTER SET utf8 COLLATE utf8_general_ci;  ',
               'ALTER TABLE ',  table_name, ' CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;  ')
FROM information_schema.TABLES AS T, information_schema.`COLLATION_CHARACTER_SET_APPLICABILITY` AS C
WHERE C.collation_name = T.table_collation
  AND T.table_schema = 'testmytbdb'
  AND (C.CHARACTER_SET_NAME != 'utf8' OR C.COLLATION_NAME not like 'utf8%');
