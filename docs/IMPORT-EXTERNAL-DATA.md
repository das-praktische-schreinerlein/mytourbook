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
- select available tags [available osm-tags](https://taginfo.openstreetmap.org/tags/natural=peak#overview)
- get data export as geojson  [git via overpass-turbo](http://overpass-turbo.eu/#)
```
/*
This query looks for nodes, ways and relations 
with the given key/value combination.
Choose your region and hit the Run button above!
*/
[out:json][timeout:1200];
// gather results
(
  // query part for: “natural=peak”
  nwr["place"~"city|town|suburb|village"]({{bbox}});
  nwr["water"~"reservoir|lake"]({{bbox}});

  nwr["natural"~"peak|saddle|glacier"]({{bbox}});
  nwr["water"~"reservoir|lake"]({{bbox}});
  nwr["mountain_pass"="yes"]({{bbox}});
  nwr["tourism"="alpine_hut"]({{bbox}});
  nwr["aerialway"]({{bbox}});
  nwr["sport"~"climbing|via_ferrata"]({{bbox}});
  nwr["via_ferrata"]({{bbox}});
  nwr["climbing"]({{bbox}});
  
  nwr["building"~"cathedral|chapel|church|monastery"]({{bbox}});
  nwr["building"~"castle"]({{bbox}}); // sometimes this gets timing problems
  nwr["building"~"mosque|shrine|temple|ruins"]({{bbox}});
  nwr["leisure"="park"]({{bbox}});
  nwr["tourism"="museum"]({{bbox}});
  nwr["historic"~"castle"]({{bbox}});
);
// print results
out body;
>;
out skel qt;
```

### Import poi-data into mytb-database via admin-ui
- save exported data to F:/playground/mytb-test/mytbbase/poi-import/poi_import.geojson
- start import-Job on admin-area: "POIIMPORT: importDataFromPoiDatabase"
  - will convert poi-import/poi_import.geojson -> poi_import-dump.json
  - will import (insert only not already found records) poi_import-dump.json and rename it afterwards

### do it per scripts
- convert geojson files via windows cmd
```cmd
sbin\osm-geojson-convert.bat
```
- create viewer-files for directory-entries via bash
```bash
sbin/osm-geojson-generate-viewer.sh
```
- import files via windows cmd
```cmd
sbin\osm-geojson-import.bat
```

### do it manually
- convert geojson files via windows cmd
```cmd
OSMDIR=F:\playground\osm-poi-geojson
for %f in (%OSMDIR%\*.geojson) do (
    echo %~nf
    node dist\backend\serverAdmin.js ^
        --debug ^
        --command convertTourDoc ^
        --action convertGeoJsonToTourDoc ^
        --adminclibackend config/adminCli.dev.json ^
        --backend config/backend.dev.json ^
        --srcFile %OSMDIR%\%~nf.geojson ^
        --mode RESPONSE ^
        --file %OSMDIR%\%~nf.tdoc.json ^
        --renameFileIfExists true
)
```
- create viewer-files for directory-entries via bash
```bash
OSMDIR=F:/playground/osm-poi-geojson
FILTER=$OSMDIR/*.tdoc.json
FILES=`echo $FILTER | sed "s/ /,/g"`
echo $FILES
sbin/generateViewerFileForStaticData.sh $OSMDIR/ $FILES mytb-pois
```
- import files via windows cmd
```cmd
OSMDIR=F:\playground\osm-poi-geojson
for %f in (%OSMDIR%\*.tdoc.json) do (
    echo %~nf
    node dist\backend\serverAdmin.js ^
        --debug ^
        --command loadTourDoc ^
        --action loadDocs ^
        --adminclibackend config/adminCli.dev.json ^
        --backend config/backend.dev.json ^
        --file %OSMDIR%\%~nf.json ^
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
  nwr["place"~"city|town|suburb|village"]({{bbox}});
  nwr["water"~"reservoir|lake"]({{bbox}});

  nwr["natural"~"peak|saddle|glacier"]({{bbox}});
  nwr["water"~"reservoir|lake"]({{bbox}});
  nwr["mountain_pass"="yes"]({{bbox}});
  nwr["tourism"="alpine_hut"]({{bbox}});
  nwr["aerialway"]({{bbox}});
  nwr["sport"~"climbing|via_ferrata"]({{bbox}});
  nwr["via_ferrata"]({{bbox}});
  nwr["climbing"]({{bbox}});
  
  nwr["building"~"cathedral|chapel|church|monastery"]({{bbox}});
  nwr["building"~"castle"]({{bbox}}); // sometimes this gets timing problems
  nwr["building"~"mosque|shrine|temple|ruins"]({{bbox}});
  nwr["leisure"="park"]({{bbox}});
  nwr["tourism"="museum"]({{bbox}});
  nwr["historic"~"castle"]({{bbox}});
```
