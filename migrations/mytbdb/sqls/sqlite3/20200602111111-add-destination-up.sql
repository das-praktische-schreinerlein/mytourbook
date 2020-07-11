-- ------------------------------------
-- add destination
-- ------------------------------------
DROP VIEW IF EXISTS DESTINATION;
CREATE VIEW  DESTINATION AS
SELECT MD5(tour.l_id || "_" || t_desc_gebiet || "_" || t_desc_ziel || "_" || t_typ)                    AS d_id,
       tour.l_id,
       t_desc_gebiet AS d_desc_gebiet,
       t_desc_ziel AS d_desc_ziel,
       t_desc_ziel AS d_name,
       t_typ AS d_typ,
       min(t_datevon)                                                  AS d_datevon,
       max(t_datebis)                                                  AS d_datebis,
       min(t_route_hm)                                                 AS d_route_hm,
       min(t_ele_max)                                                  AS d_ele_max,
       min(t_route_m)                                                  AS d_route_m,
       min(t_rate_ausdauer)                                            AS d_rate_ausdauer,
       max(t_rate_bildung)                                             AS d_rate_bildung,
       max(t_rate_gesamt)                                              AS d_rate_gesamt,
       min(t_rate_kraft)                                               AS d_rate_kraft,
       min(t_rate_mental)                                              AS d_rate_mental,
       max(t_rate_motive)                                              AS d_rate_motive,
       min(t_rate_schwierigkeit)                                       AS d_rate_schwierigkeit,
       max(t_rate_wichtigkeit)                                         AS d_rate_wichtigkeit,
       min(t_rate)                                                     AS d_rate,
       min(t_rate_ks)                                                  AS d_rate_ks,
       min(t_rate_firn)                                                AS d_rate_firn,
       min(t_rate_gletscher)                                           AS d_rate_gletscher,
       min(t_rate_klettern)                                            AS d_rate_klettern,
       min(t_rate_bergtour)                                            AS d_rate_bergtour,
       min(t_rate_schneeschuh)                                         AS d_rate_schneeschuh,
       min(t_route_dauer)                                              AS d_route_dauer
FROM tour
         LEFT JOIN location ON tour.l_id = location.l_id
GROUP BY d_id;
