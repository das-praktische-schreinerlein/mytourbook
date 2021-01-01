-- ------------------------------------
-- create functions
-- ------------------------------------

--
-- functions
--
DELIMITER $$
DROP FUNCTION IF EXISTS `GetLocationIdAncestry` $$
CREATE FUNCTION `GetLocationIdAncestry` (GivenID INT, pJoiner CHAR(20)) RETURNS VARCHAR(2000)
DETERMINISTIC
BEGIN
    DECLARE path VARCHAR(2000);
    DECLARE joiner CHAR(20);
    DECLARE id INT;

    SET id = GivenID;
    SET path = concat('', id);
    SET joiner = '';

    WHILE id > 0 DO
        SELECT IFNULL(l_parent_id,-1) INTO id FROM
        (SELECT l_parent_id FROM location WHERE l_id = id) A;
        IF id > 0 THEN
            SET joiner = pJoiner;
            SET path = CONCAT(id, joiner, path);
        END IF;
    END WHILE;
    RETURN TRIM(path);
END $$
DELIMITER ;

DELIMITER $$
DROP FUNCTION IF EXISTS `GetLocationNameAncestry` $$
CREATE FUNCTION `GetLocationNameAncestry` (GivenID INT, defaultName CHAR(200), pJoiner CHAR(20)) RETURNS VARCHAR(2000)
DETERMINISTIC
BEGIN
    DECLARE path VARCHAR(2000);
    DECLARE name VARCHAR(100);
    DECLARE joiner CHAR(20);
    DECLARE id INT;

    SET id = GivenID;
    SET path = '';
    SET joiner = '';
    SET name = '';

    WHILE id > 0 DO
        SELECT l_name INTO name FROM
        (SELECT l_name FROM location WHERE l_id = id) A;
        IF id > 0 THEN
            SET path = CONCAT(name, joiner, ' ', path);
            SET joiner = pJoiner;
        END IF;
        SELECT IFNULL(l_parent_id,-1) INTO id FROM
        (SELECT l_parent_id FROM location WHERE l_id = id) A;
    END WHILE;
    RETURN TRIM(path);
END $$
DELIMITER ;

DELIMITER $$
DROP FUNCTION IF EXISTS `GetLocationChildIds` $$
CREATE FUNCTION GetLocationChildIds(GivenID INT) RETURNS VARCHAR(2000)
  DETERMINISTIC
  BEGIN
    DECLARE subIds VARCHAR(2000);
    DECLARE Ids  VARCHAR(2000);
    SET subIds = '';
    SET SESSION group_concat_max_len = 20000000;

      SELECT GROUP_CONCAT(Level SEPARATOR ',,') into subIds FROM (
         SELECT @Ids := (
             SELECT GROUP_CONCAT(l_id SEPARATOR ',,')
             FROM location
             WHERE FIND_IN_SET(l_parent_id, @Ids)
         ) Level
         FROM location
         JOIN (SELECT @Ids := GivenID) temp1
      ) temp2;


    RETURN subIds;
END $$
DELIMITER ;

DELIMITER $$
DROP FUNCTION IF EXISTS `GetTechName` $$
  CREATE FUNCTION GetTechName(pName TEXT) RETURNS VARCHAR(2000)
  DETERMINISTIC
  BEGIN
    RETURN TRIM(LOWER(REGEXP_REPLACE(pName, '[- /()+;.]', '_')));
END $$
DELIMITER ;

