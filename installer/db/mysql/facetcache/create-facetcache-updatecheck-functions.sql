/*################
 # create triggercheck to insert updatetrigger for facetcache
 #################*/
DROP PROCEDURE IF EXISTS CheckFacetCacheUpdateTriggerTableAndExceuteSql $$
CREATE PROCEDURE `CheckFacetCacheUpdateTriggerTableAndExceuteSql` (triggername CHAR(255), triggeredsql TEXT)
    DETERMINISTIC
    BEGIN
          DECLARE triggercount INT;
          SET triggercount = 0;

          SELECT count(*) FROM facetcacheupdatetrigger where ft_key in (triggername) INTO triggercount;
          DELETE FROM facetcacheupdatetrigger where ft_key in (triggername);
          IF triggercount > 0 THEN
              DELETE FROM facetcache where fc_key in (triggername);
              SET @s = triggeredsql;
              PREPARE stmt FROM @s;
              EXECUTE stmt;
              DEALLOCATE PREPARE stmt;
          END IF;
    END $$
