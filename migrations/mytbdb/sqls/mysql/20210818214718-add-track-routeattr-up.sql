/* #############
# add columns for routeattributes
############# */
ALTER TABLE kategorie ADD COLUMN IF NOT EXISTS k_route_attr varchar(255) COLLATE latin1_general_ci DEFAULT NULL;
ALTER TABLE kategorie_tour ADD COLUMN IF NOT EXISTS kt_route_attr varchar(255) COLLATE latin1_general_ci DEFAULT NULL;
