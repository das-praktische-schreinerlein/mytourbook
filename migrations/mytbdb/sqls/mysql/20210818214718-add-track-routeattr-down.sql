/* #############
# add columns for routeattributes
############# */
ALTER TABLE kategorie DROP COLUMN IF EXISTS k_route_attr;
ALTER TABLE kategorie_tour DROP COLUMN IF EXISTS kt_route_attr;
