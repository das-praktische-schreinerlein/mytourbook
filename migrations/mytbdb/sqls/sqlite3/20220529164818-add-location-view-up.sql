-- ----------------
-- add location-view with hierarchical fields
-- ----------------
DROP VIEW IF EXISTS location_hirarchical;
CREATE VIEW location_hirarchical
    AS
    WITH RECURSIVE loc_hierarchy(
                                 l_id,
                                 l_parent_id,
                                 l_name,
                                 hirarchy,
                                 idhirarchy)
                       AS
                       (SELECT l_id,
                               l_parent_id,
                               l_name,
                               l_name,
                               CAST(l_id AS CHAR(255))
                        FROM location
                        WHERE l_parent_id IS NULL
                        UNION ALL
                        SELECT l.l_id,
                               l.l_parent_id,
                               l.l_name,
                               lh.hirarchy || ' -> ' || l.l_name,
                               lh.idhirarchy || ',' || CAST(l.l_id AS CHAR(255))
                        FROM location l
                                 JOIN loc_hierarchy lh
                                      ON l.l_parent_id = lh.l_id
                       )
    SELECT location.*, loc_hierarchy.hirarchy AS l_lochirarchietxt, loc_hierarchy.idhirarchy AS l_lochirarchieids
    FROM location INNER JOIN loc_hierarchy ON location.l_id = loc_hierarchy.l_id
    ORDER BY l_id;
