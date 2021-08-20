/* #############
# add columns for routeattributes
############# */
ALTER TABLE kategorie ADD COLUMN k_route_attr varchar(255) DEFAULT NULL;
ALTER TABLE kategorie_tour ADD COLUMN kt_route_attr varchar(255) DEFAULT NULL;
