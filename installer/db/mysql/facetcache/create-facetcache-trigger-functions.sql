/*################
 # create trigger to insert updatetrigger for facetcache
 #################*/
DROP PROCEDURE IF EXISTS InsertFacetCacheUpdateTriggerTableEntry $$
CREATE PROCEDURE `InsertFacetCacheUpdateTriggerTableEntry` (triggername CHAR(255))
DETERMINISTIC
BEGIN
    INSERT INTO facetcacheupdatetrigger (ft_key)
        SELECT triggername from dual
            WHERE NOT EXISTS (SELECT 1 FROM facetcacheupdatetrigger WHERE ft_key=triggername);
END $$
