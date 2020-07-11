# administration of mytourbook

## database-hints
- optimize mediadb
```
CHECK TABLE `appcache`, `appids`, `facetcache`, `facetcacheconfig`, `facetcacheupdatetrigger`, `image`, `image_playlist`, `info`, `info_keyword`, `kategorie`, `kategorie_keyword`, `kategorie_person`, `kategorie_tour`, `keyword`, `location`, `location_keyword`, `migrations`, `news`, `objects`, `objects_key`, `person`, `playlist`, `rates`, `tour`, `tour_keyword`, `trip`, `video`, `video_keyword`, `video_object`, `video_playlist`;
REPAIR TABLE `appcache`, `appids`, `facetcache`, `facetcacheconfig`, `facetcacheupdatetrigger`, `image`, `image_playlist`, `info`, `info_keyword`, `kategorie`, `kategorie_keyword`, `kategorie_person`, `kategorie_tour`, `keyword`, `location`, `location_keyword`, `migrations`, `news`, `objects`, `objects_key`, `person`, `playlist`, `rates`, `tour`, `tour_keyword`, `trip`, `video`, `video_keyword`, `video_object`, `video_playlist`;
OPTIMIZE TABLE `appcache`, `appids`, `facetcache`, `facetcacheconfig`, `facetcacheupdatetrigger`, `image`, `image_playlist`, `info`, `info_keyword`, `kategorie`, `kategorie_keyword`, `kategorie_person`, `kategorie_tour`, `keyword`, `location`, `location_keyword`, `migrations`, `news`, `objects`, `objects_key`, `person`, `playlist`, `rates`, `tour`, `tour_keyword`, `trip`, `video`, `video_keyword`, `video_object`, `video_playlist`;
CHECK TABLE `appcache`, `appids`, `facetcache`, `facetcacheconfig`, `facetcacheupdatetrigger`, `image`, `image_playlist`, `info`, `info_keyword`, `kategorie`, `kategorie_keyword`, `kategorie_person`, `kategorie_tour`, `keyword`, `location`, `location_keyword`, `migrations`, `news`, `objects`, `objects_key`, `person`, `playlist`, `rates`, `tour`, `tour_keyword`, `trip`, `video`, `video_keyword`, `video_object`, `video_playlist`;
```
