-- ------------------
-- clean private data
-- ------------------
DELETE FROM trip WHERE tr_gesperrt > 0;
DELETE FROM news WHERE n_gesperrt > 0;
DELETE FROM tour WHERE t_gesperrt > 0;
DELETE FROM image WHERE I_GESPERRT > 0;
DELETE FROM image WHERE  K_ID IN (SELECT K_ID FROM kategorie_full WHERE  K_GESPERRT > 0);
DELETE FROM video WHERE  V_GESPERRT > 0;
DELETE FROM video WHERE  K_ID IN (SELECT K_ID FROM kategorie_full WHERE  K_GESPERRT > 0);
DELETE FROM kategorie_full WHERE K_GESPERRT > 0;

-- DELETE blocked locations AND locations without parent
DELETE FROM location WHERE l_id IN (SELECT l_id FROM location where l_gesperrt > 0);
DELETE l FROM location l JOIN
    (SELECT l_id FROM location WHERE  l_parent_id IS NOT NULL AND l_parent_id > 1 AND l_parent_id NOT IN (SELECT l_id FROM location)) ll
  ON l.l_id = ll.l_id;
DELETE l FROM location l JOIN
    (SELECT l_id FROM location WHERE  l_parent_id IS NOT NULL AND l_parent_id > 1 AND l_parent_id NOT IN (SELECT l_id FROM location)) ll
  ON l.l_id = ll.l_id;
DELETE l FROM location l JOIN
    (SELECT l_id FROM location WHERE  l_parent_id IS NOT NULL AND l_parent_id > 1 AND l_parent_id NOT IN (SELECT l_id FROM location)) ll
  ON l.l_id = ll.l_id;
DELETE l FROM location l JOIN
    (SELECT l_id FROM location WHERE  l_parent_id IS NOT NULL AND l_parent_id > 1 AND l_parent_id NOT IN (SELECT l_id FROM location)) ll
  ON l.l_id = ll.l_id;
DELETE l FROM location l JOIN
    (SELECT l_id FROM location WHERE  l_parent_id IS NOT NULL AND l_parent_id > 1 AND l_parent_id NOT IN (SELECT l_id FROM location)) ll
  ON l.l_id = ll.l_id;
DELETE l FROM location l JOIN
    (SELECT l_id FROM location WHERE  l_parent_id IS NOT NULL AND l_parent_id > 1 AND l_parent_id NOT IN (SELECT l_id FROM location)) ll
  ON l.l_id = ll.l_id;
DELETE l FROM location l JOIN
    (SELECT l_id FROM location WHERE  l_parent_id IS NOT NULL AND l_parent_id > 1 AND l_parent_id NOT IN (SELECT l_id FROM location)) ll
  ON l.l_id = ll.l_id;
DELETE l FROM location l JOIN
    (SELECT l_id FROM location WHERE  l_parent_id IS NOT NULL AND l_parent_id > 1 AND l_parent_id NOT IN (SELECT l_id FROM location)) ll
  ON l.l_id = ll.l_id;

-- DELETE subitems FROM not existing locations
DELETE FROM tour WHERE  l_id NOT IN (SELECT l_id FROM location);
DELETE FROM trip WHERE  l_id NOT IN (SELECT l_id FROM location);
DELETE FROM kategorie_full WHERE  l_id NOT IN (SELECT l_id FROM location);
DELETE FROM image WHERE  K_ID NOT IN (SELECT K_ID FROM kategorie_full);
DELETE FROM video WHERE  K_ID NOT IN (SELECT K_ID FROM kategorie_full);

DELETE l FROM location l JOIN
    (SELECT l_id FROM location WHERE  l_id NOT IN (SELECT l_parent_id FROM location WHERE  l_parent_id IS NOT NULL)
     AND l_id NOT IN (
    SELECT l_id FROM kategorie_full WHERE  kategorie_full.l_id IS NOT NULL
        UNION
    SELECT l_id FROM tour WHERE  tour.l_id IS NOT NULL
        UNION
    SELECT l_id FROM trip WHERE  trip.l_id IS NOT NULL
        UNION
    SELECT l_parent_id as l_id FROM location WHERE  l_parent_id IS NOT NULL
    )) ll
  ON l.l_id = ll.l_id;
DELETE l FROM location l JOIN
    (SELECT l_id FROM location WHERE  l_id NOT IN (SELECT l_parent_id FROM location WHERE  l_parent_id IS NOT NULL)
     AND l_id NOT IN (
    SELECT l_id FROM kategorie_full WHERE  kategorie_full.l_id IS NOT NULL
        UNION
    SELECT l_id FROM tour WHERE  tour.l_id IS NOT NULL
        UNION
    SELECT l_id FROM trip WHERE  trip.l_id IS NOT NULL
        UNION
    SELECT l_parent_id as l_id FROM location WHERE  l_parent_id IS NOT NULL
    )) ll
  ON l.l_id = ll.l_id;
DELETE l FROM location l JOIN
    (SELECT l_id FROM location WHERE  l_id NOT IN (SELECT l_parent_id FROM location WHERE  l_parent_id IS NOT NULL)
     AND l_id NOT IN (
    SELECT l_id FROM kategorie_full WHERE  kategorie_full.l_id IS NOT NULL
        UNION
    SELECT l_id FROM tour WHERE  tour.l_id IS NOT NULL
        UNION
    SELECT l_id FROM trip WHERE  trip.l_id IS NOT NULL
        UNION
    SELECT l_parent_id as l_id FROM location WHERE  l_parent_id IS NOT NULL
    )) ll
  ON l.l_id = ll.l_id;

ANALYZE TABLE destination, image, kategorie_full, location, news, numbers, tour, trip, video;
