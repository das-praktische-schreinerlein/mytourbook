--
-- merge all
--

-- track merge persons
UPDATE kategorie_full toupdate,
(SELECT groupedSrc.k_id, GROUP_CONCAT(DISTINCT strippedRes.person ORDER BY strippedRes.person SEPARATOR ',') AS persons
  FROM kategorie_full groupedSrc LEFT JOIN
      (SELECT distinct strippedSrc.k_id,
          SUBSTRING_INDEX(SUBSTRING_INDEX(strippedSrc.k_persons, ',', numbers.id), ',', -1) person
        FROM
          numbers INNER JOIN kategorie_full strippedSrc
          ON (CHAR_LENGTH(strippedSrc.k_persons) - CHAR_LENGTH(REPLACE(strippedSrc.k_persons, ',', ''))) >= numbers.id - 1
        GROUP BY strippedSrc.k_id, person
        HAVING LENGTH(person) > 0
        ORDER BY strippedSrc.k_id desc, person
        ) strippedRes ON strippedRes.k_id = groupedSrc.k_id
  GROUP BY groupedSrc.k_id) grouped
SET toupdate.k_persons=grouped.persons
WHERE toupdate.k_id=grouped.k_id;

-- track merge objects
UPDATE kategorie_full toupdate,
(SELECT groupedSrc.k_id, GROUP_CONCAT(DISTINCT strippedRes.object ORDER BY strippedRes.object SEPARATOR ',') AS objects
  FROM kategorie_full groupedSrc LEFT JOIN
      (SELECT distinct strippedSrc.k_id,
          SUBSTRING_INDEX(SUBSTRING_INDEX(strippedSrc.k_objects, ',', numbers.id), ',', -1) object
        FROM
          numbers INNER JOIN kategorie_full strippedSrc
          ON (CHAR_LENGTH(strippedSrc.k_objects) - CHAR_LENGTH(REPLACE(strippedSrc.k_objects, ',', ''))) >= numbers.id - 1
        GROUP BY strippedSrc.k_id, object
        HAVING LENGTH(object) > 0
        ORDER BY strippedSrc.k_id desc, object
        ) strippedRes ON strippedRes.k_id = groupedSrc.k_id
  GROUP BY groupedSrc.k_id) grouped
SET toupdate.k_objects=grouped.objects
WHERE toupdate.k_id=grouped.k_id;

-- route merge persons
UPDATE tour toupdate,
(SELECT groupedSrc.t_id, GROUP_CONCAT(DISTINCT strippedRes.person ORDER BY strippedRes.person SEPARATOR ',') AS persons
  FROM kategorie_full groupedSrc LEFT JOIN
      (SELECT distinct strippedSrc.k_id,
          SUBSTRING_INDEX(SUBSTRING_INDEX(strippedSrc.k_persons, ',', numbers.id), ',', -1) person
        FROM
          numbers INNER JOIN kategorie_full strippedSrc
          ON (CHAR_LENGTH(strippedSrc.k_persons) - CHAR_LENGTH(REPLACE(strippedSrc.k_persons, ',', ''))) >= numbers.id - 1
        GROUP BY strippedSrc.k_id, person
        HAVING LENGTH(person) > 0
        ORDER BY strippedSrc.k_id desc, person
        ) strippedRes ON strippedRes.k_id = groupedSrc.k_id
  GROUP BY groupedSrc.t_id) grouped
SET toupdate.t_persons=grouped.persons
WHERE toupdate.t_id=grouped.t_id;

-- route merge objects
UPDATE tour toupdate,
(SELECT groupedSrc.t_id, GROUP_CONCAT(DISTINCT strippedRes.object ORDER BY strippedRes.object SEPARATOR ',') AS objects
  FROM kategorie_full groupedSrc LEFT JOIN
      (SELECT distinct strippedSrc.k_id,
          SUBSTRING_INDEX(SUBSTRING_INDEX(strippedSrc.k_objects, ',', numbers.id), ',', -1) object
        FROM
          numbers INNER JOIN kategorie_full strippedSrc
          ON (CHAR_LENGTH(strippedSrc.k_objects) - CHAR_LENGTH(REPLACE(strippedSrc.k_objects, ',', ''))) >= numbers.id - 1
        GROUP BY strippedSrc.k_id, object
        HAVING LENGTH(object) > 0
        ORDER BY strippedSrc.k_id desc, object
        ) strippedRes ON strippedRes.k_id = groupedSrc.k_id
  GROUP BY groupedSrc.t_id) grouped
SET toupdate.t_objects=grouped.objects
WHERE toupdate.t_id=grouped.t_id;

-- trip merge persons
UPDATE trip toupdate,
(SELECT groupedSrc.tr_id, GROUP_CONCAT(DISTINCT strippedRes.person ORDER BY strippedRes.person SEPARATOR ',') AS persons
  FROM kategorie_full groupedSrc LEFT JOIN
      (SELECT distinct strippedSrc.k_id,
          SUBSTRING_INDEX(SUBSTRING_INDEX(strippedSrc.k_persons, ',', numbers.id), ',', -1) person
        FROM
          numbers INNER JOIN kategorie_full strippedSrc
          ON (CHAR_LENGTH(strippedSrc.k_persons) - CHAR_LENGTH(REPLACE(strippedSrc.k_persons, ',', ''))) >= numbers.id - 1
        GROUP BY strippedSrc.k_id, person
        HAVING LENGTH(person) > 0
        ORDER BY strippedSrc.k_id desc, person
        ) strippedRes ON strippedRes.k_id = groupedSrc.k_id
  GROUP BY groupedSrc.tr_id) grouped
SET toupdate.tr_persons=grouped.persons
WHERE toupdate.tr_id=grouped.tr_id;

-- trip merge objects
UPDATE trip toupdate,
(SELECT groupedSrc.tr_id, GROUP_CONCAT(DISTINCT strippedRes.object ORDER BY strippedRes.object SEPARATOR ',') AS objects
  FROM kategorie_full groupedSrc LEFT JOIN
      (SELECT distinct strippedSrc.k_id,
          SUBSTRING_INDEX(SUBSTRING_INDEX(strippedSrc.k_objects, ',', numbers.id), ',', -1) object
        FROM
          numbers INNER JOIN kategorie_full strippedSrc
          ON (CHAR_LENGTH(strippedSrc.k_objects) - CHAR_LENGTH(REPLACE(strippedSrc.k_objects, ',', ''))) >= numbers.id - 1
        GROUP BY strippedSrc.k_id, object
        HAVING LENGTH(object) > 0
        ORDER BY strippedSrc.k_id desc, object
        ) strippedRes ON strippedRes.k_id = groupedSrc.k_id
  GROUP BY groupedSrc.tr_id) grouped
SET toupdate.tr_objects=grouped.objects
WHERE toupdate.tr_id=grouped.tr_id;

-- news merge persons
UPDATE news toupdate,
(SELECT groupedSrc.n_id, GROUP_CONCAT(DISTINCT strippedRes.person ORDER BY strippedRes.person SEPARATOR ',') AS persons
  FROM kategorie_full groupedSrc LEFT JOIN
      (SELECT distinct strippedSrc.k_id,
          SUBSTRING_INDEX(SUBSTRING_INDEX(strippedSrc.k_persons, ',', numbers.id), ',', -1) person
        FROM
          numbers INNER JOIN kategorie_full strippedSrc
          ON (CHAR_LENGTH(strippedSrc.k_persons) - CHAR_LENGTH(REPLACE(strippedSrc.k_persons, ',', ''))) >= numbers.id - 1
        GROUP BY strippedSrc.k_id, person
        HAVING LENGTH(person) > 0
        ORDER BY strippedSrc.k_id desc, person
        ) strippedRes ON strippedRes.k_id = groupedSrc.k_id
  GROUP BY groupedSrc.n_id) grouped
SET toupdate.n_persons=grouped.persons
WHERE toupdate.n_id=grouped.n_id;

-- news merge objects
UPDATE news toupdate,
(SELECT groupedSrc.n_id, GROUP_CONCAT(DISTINCT strippedRes.object ORDER BY strippedRes.object SEPARATOR ',') AS objects
  FROM kategorie_full groupedSrc LEFT JOIN
      (SELECT distinct strippedSrc.k_id,
          SUBSTRING_INDEX(SUBSTRING_INDEX(strippedSrc.k_objects, ',', numbers.id), ',', -1) object
        FROM
          numbers INNER JOIN kategorie_full strippedSrc
          ON (CHAR_LENGTH(strippedSrc.k_objects) - CHAR_LENGTH(REPLACE(strippedSrc.k_objects, ',', ''))) >= numbers.id - 1
        GROUP BY strippedSrc.k_id, object
        HAVING LENGTH(object) > 0
        ORDER BY strippedSrc.k_id desc, object
        ) strippedRes ON strippedRes.k_id = groupedSrc.k_id
  GROUP BY groupedSrc.n_id) grouped
SET toupdate.n_objects=grouped.objects
WHERE toupdate.n_id=grouped.n_id;

-- location merge persons
UPDATE location toupdate,
(SELECT groupedSrc.l_id, GROUP_CONCAT(DISTINCT strippedRes.person ORDER BY strippedRes.person SEPARATOR ',') AS persons
  FROM kategorie_full groupedSrc LEFT JOIN
      (SELECT distinct strippedSrc.k_id,
          SUBSTRING_INDEX(SUBSTRING_INDEX(strippedSrc.k_persons, ',', numbers.id), ',', -1) person
        FROM
          numbers INNER JOIN kategorie_full strippedSrc
          ON (CHAR_LENGTH(strippedSrc.k_persons) - CHAR_LENGTH(REPLACE(strippedSrc.k_persons, ',', ''))) >= numbers.id - 1
        GROUP BY strippedSrc.k_id, person
        HAVING LENGTH(person) > 0
        ORDER BY strippedSrc.k_id desc, person
        ) strippedRes ON strippedRes.k_id = groupedSrc.k_id
  GROUP BY groupedSrc.l_id) grouped
SET toupdate.l_persons=grouped.persons
WHERE toupdate.l_id=grouped.l_id;

-- location merge objects
UPDATE location toupdate,
(SELECT groupedSrc.l_id, GROUP_CONCAT(DISTINCT strippedRes.object ORDER BY strippedRes.object SEPARATOR ',') AS objects
  FROM kategorie_full groupedSrc LEFT JOIN
      (SELECT distinct strippedSrc.k_id,
          SUBSTRING_INDEX(SUBSTRING_INDEX(strippedSrc.k_objects, ',', numbers.id), ',', -1) object
        FROM
          numbers INNER JOIN kategorie_full strippedSrc
          ON (CHAR_LENGTH(strippedSrc.k_objects) - CHAR_LENGTH(REPLACE(strippedSrc.k_objects, ',', ''))) >= numbers.id - 1
        GROUP BY strippedSrc.k_id, object
        HAVING LENGTH(object) > 0
        ORDER BY strippedSrc.k_id desc, object
        ) strippedRes ON strippedRes.k_id = groupedSrc.k_id
  GROUP BY groupedSrc.l_id) grouped
SET toupdate.l_objects=grouped.objects
WHERE toupdate.l_id=grouped.l_id;
