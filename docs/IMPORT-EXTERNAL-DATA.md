# Import external data

## POI-data from OSM

### Export POI-data on osm
- Infos
    - Tags https://wiki.openstreetmap.org/wiki/Tag:natural%3Dglacier
    - select https://overpass-turbo.eu/
- Samples
    - Sample: https://forum.openstreetmap.org/viewtopic.php?id=18927
    - Sample: https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL#Sets
    - Sample: https://observablehq.com/@easz/overpass-api-for-openstreetmap
- save exported data to F:/playground/mytb-test/mytbbase/poi-import/poi_import.geojson 

### Import poi-data into mytb-database via admin-ui
- save exported data to F:/playground/mytb-test/mytbbase/poi-import/poi_import.geojson
- start import-Job on admin-area: "POIIMPORT: importDataFromPoiDatabase"
  - will convert poi-import/poi_import.geojson -> poi_import-dump.json
  - will import (insert only not already found records) poi_import-dump.json and rename it afterwards

### Import poi-data manually
- do it on cmd
```
for %%f in (F:\playground\mytb-tes\/mytbbase\poi-downloads\*.geojson) do (
    echo %%~nf
    node dist\backend\serverAdmin.js ^
        --debug ^
        --command convertTourDoc ^
        --action convertGeoJsonToTourDoc ^
        --adminclibackend config/adminCli.dev.json ^
        --backend config/backend.dev.json ^
        --srcFile %%~nf ^
        --mode RESPONSE ^
        --file F:/playground/mytb-test/mytbbase/import/poi_import-dump.json ^
        --renameFilIfExists true
    node dist\backend\serverAdmin.js ^
        --debug ^
        --command loadTourDoc ^
        --action loadDocs ^
        --adminclibackend config/adminCli.dev.json ^
        --backend config/backend.dev.json ^
        --file F:/playground/mytb-test/mytbbase/import/poi_import-dump.json ^
        --renameFileAfterSuccess true
)
```

### POI-data on osm
- data: town in sachsen
```
  [timeout:1800];
  area[name="Sachsen"][admin_level];
  node(area)[place~"city|town|suburb|village"];
  // print results
  out body;
>;
out skel qt;
```
- data: towns deutschland
```
  [out:json][timeout:240];
  area[name="Deutschland"][admin_level]->.selectedArea;
  nwr(area.selectedArea)["place"~"city|town|suburb|village"];
  out body center qt;
>;
out skel qt;
```
- Alpen huts
```
  [out:json][timeout:120];
  area(3602698607)->.Alps;
  nwr(area.Alps)["tourism"="alpine_hut"];
  out body center qt;
>;
out skel qt;
```
- Deutschland huts
```
  [out:json][timeout:120];
  area[name="Deutschland"][admin_level]->.selectedArea;
  nwr(area.selectedArea)["tourism"="alpine_hut"];
  out body center qt;
>;
out skel qt;
```
- Alpen cablecars
```
  [out:json][timeout:120];
  area(3602698607)->.Alps;
  nwr(area.Alps)["aerialway"];
  out body center qt;
>;
out skel qt;
```
- Alpen Sättel
```
  [out:json][timeout:120];
  area(3602698607)->.Alps;
  nwr(area.Alps)[natural=saddle];
  out body center qt;
>;
out skel qt;
```
- Alpen Pässe
```
  [out:json][timeout:120];
  area(3602698607)->.Alps;
  nwr(area.Alps)[mountain_pass=yes];
  out body center qt;
>;
out skel qt;
```
- more filter
```
natural=glacier
water=lake
water=reservoir
sport=climbing
```
