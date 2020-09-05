# administration of mytourbook

## database-hints
- optimize mediadb
```
CHECK TABLE `appcache`, `map`, `migrations`, `appids`, `playlist`, `facetcacheupdatetrigger`, `facetcacheconfig`, `person`, `news`, `rates`, `info`, `trip`, `video_keyword`, `import_tour`, `location_keyword`, `info_keyword`, `kategorie_tour`, `video`, `video_playlist`, `video_object`, `tour`, `objects`, `location`, `kategorie`, `keyword`, `kategorie_person`, `objects_key`, `facetcache`, `tour_keyword`, `image_playlist`, `kategorie_keyword`, `image`;
REPAIR TABLE `appcache`, `map`, `migrations`, `appids`, `playlist`, `facetcacheupdatetrigger`, `facetcacheconfig`, `person`, `news`, `rates`, `info`, `trip`, `video_keyword`, `import_tour`, `location_keyword`, `info_keyword`, `kategorie_tour`, `video`, `video_playlist`, `video_object`, `tour`, `objects`, `location`, `kategorie`, `keyword`, `kategorie_person`, `objects_key`, `facetcache`, `tour_keyword`, `image_playlist`, `kategorie_keyword`, `image`;
OPTIMIZE TABLE `appcache`, `map`, `migrations`, `appids`, `playlist`, `facetcacheupdatetrigger`, `facetcacheconfig`, `person`, `news`, `rates`, `info`, `trip`, `video_keyword`, `import_tour`, `location_keyword`, `info_keyword`, `kategorie_tour`, `video`, `video_playlist`, `video_object`, `tour`, `objects`, `location`, `kategorie`, `keyword`, `kategorie_person`, `objects_key`, `facetcache`, `tour_keyword`, `image_playlist`, `kategorie_keyword`, `image`;
CHECK TABLE `appcache`, `map`, `migrations`, `appids`, `playlist`, `facetcacheupdatetrigger`, `facetcacheconfig`, `person`, `news`, `rates`, `info`, `trip`, `video_keyword`, `import_tour`, `location_keyword`, `info_keyword`, `kategorie_tour`, `video`, `video_playlist`, `video_object`, `tour`, `objects`, `location`, `kategorie`, `keyword`, `kategorie_person`, `objects_key`, `facetcache`, `tour_keyword`, `image_playlist`, `kategorie_keyword`, `image`;

CHECK TABLE `image_object`, `tourpoint`, `kategorie_tourpoint`, `image_keyword`;
REPAIR TABLE `image_object`, `tourpoint`, `kategorie_tourpoint`, `image_keyword`;
OPTIMIZE TABLE `image_object`, `tourpoint`, `kategorie_tourpoint`, `image_keyword`;
CHECK TABLE `image_object`, `tourpoint`, `kategorie_tourpoint`, `image_keyword`;
```

