-- remove unused fields

alter table kategorie drop column if exists old_t_id;
alter table kategorie drop column if exists k_history;
alter table kategorie drop column if exists k_historie;
alter table kategorie drop column if exists k_state_trackcomplete;
alter table kategorie drop column if exists k_state_trackquality;
alter table kategorie drop column if exists k_state_tracksrc;
alter table kategorie drop column if exists k_state_trackdata;
alter table kategorie drop column if exists k_state_rate;
alter table kategorie drop column if exists k_state_desc;
alter table kategorie drop column if exists k_state_all;
alter table kategorie drop column if exists k_name_full;
alter table kategorie drop column if exists k_gpstracks_gpx;
alter table kategorie drop column if exists k_idx_color;

alter table kategorie_tourpoint drop column if exists ktp_name;
alter table kategorie_tourpoint drop column if exists ktp_meta_desc;
alter table kategorie_tourpoint drop column if exists ktp_meta_shortdesc;

alter table location drop column if exists l_history;
alter table location drop column if exists l_historie;
alter table location drop column if exists l_map_urlparams;
alter table location drop column if exists l_url_homepage;
alter table location drop column if exists l_url_intern;

alter table tour drop column if exists t_ref;
alter table tour drop column if exists t_history;
alter table tour drop column if exists t_historie;
alter table tour drop column if exists t_state_trackcomplete;
alter table tour drop column if exists t_state_trackquality;
alter table tour drop column if exists t_state_tracksrc;
alter table tour drop column if exists t_state_trackdata;
alter table tour drop column if exists t_state_rate;
alter table tour drop column if exists t_state_desc;
alter table tour drop column if exists t_state_all;
alter table tour drop column if exists t_geo_poly;
alter table tour drop column if exists t_gpstracks_jsgmap;
alter table tour drop column if exists t_done;
alter table tour drop column if exists t_idx_color;

alter table tourpoint drop column if exists tp_meta_desc;
alter table tourpoint drop column if exists tp_meta_shortdesc;
alter table tourpoint drop column if exists tp_name;

alter table trip drop column if exists tr_url;

alter table image drop column if exists i_history;
alter table image drop column if exists i_historie;
alter table image drop column if exists i_indexed_date;


alter table video drop column if exists v_history;
alter table video drop column if exists v_historie;
alter table video drop column if exists v_indexed_date;

-- renew views
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
                           CONCAT(lh.hirarchy, ' -> ', l.l_name),
                           CONCAT(lh.idhirarchy, ',', CAST(l.l_id AS CHAR(255)))
                    FROM location l
                             JOIN loc_hierarchy lh
                                  ON l.l_parent_id = lh.l_id
                   )
SELECT location.*, loc_hierarchy.hirarchy AS l_lochirarchietxt, loc_hierarchy.idhirarchy AS l_lochirarchieids
FROM location INNER JOIN loc_hierarchy on location.l_id = loc_hierarchy.l_id
ORDER BY l_id;
