# Changelog of MyTourBook
 
# Versions

## 8.0.0
- use commons 6.0.0
- bumped up deps
- added optional password-encryption of static-viewer-version
- frontend: improved filter-suggestion for poi-search
- frontend: open modal view on maps + lists
- frontend/backend: added joins to resolver and possibility to add joins on create
- backend/frontend: move generic page-modules to commons
- backend/frontend: add page-management
- frontend: improved table-layout
- improved sync-viewer for offline-usage
- removed legacy pdoc-editor
- frontend: improved/fixed desc-rendering
- improve imageInlineLoader
- added support for automatic nearby track pois
- backend/frontend: use new fully featured markdown-support with extensions


### new features
- added optional password-encryption of static-viewer-version
- frontend: open modal view on maps + lists
- backend/frontend: add page-management
- improve imageInlineLoader
- added support for automatic nearby track pois
- backend/frontend: use new fully featured markdown-support with extensions

### improvements
- frontend: improved filter-suggestion for poi-search
- use commons 6.0.0
- bumped up deps
- backend/frontend: move generic page-modules to commons
- frontend: improved table-layout
- frontend: moved track-colors, TextEditorComponent, FormUtils and GeoParserDeterminer to commons
- improved sync-viewer for offline-usage
- removed legacy pdoc-editor

### bug fixes
- frontend/backend: added joins to resolver and possibility to add joins on create

### breaking changes
- use commons-6.0.0
- bumped up deps
- use new config
- use new pdoc-config -> see [Migration-instructions](MIGRATION.md)
- TextEditor, TDoc-Module, Page-Module: improve usage of desc_txt, desc_md...
- frontend: improved/fixed desc-rendering


## 7.5.0 (2023-03-18)
- database: removed unused fields
- add mediameta-components
- fix gpx-editor
- bumped up sqlite3 to 5.1.4
- added support to generate geo-json-files
- fix solr-password-initialisation

### new features
- backend/frontend: add mediameta-components
- backend: added support to generate geo-json-files
- backend: fix solr-password-initialisation

### improvements
- database: removed unused fields
- database: added important sql-fixtures for sqlite
- deps: bumped up sqlite3 to 5.1.4 (sqlite v3.40.0)

### bug fixes
- frontend: fix gpx-editor

### breaking changes
- none


## 7.4.0 (2023-01-19)
- use commons 5.6.0
- added viewer as separate environment to view static data without backend
- fixed media-export of dependent records
- extend image-export with more filter
- remove duplicates from lists
- add list-layout to url
- extend mediaexport for additional types and add optional viewer for mediaexport
- admin: added fixtures to remove duplicates from database to admin-ui
- frontend: improved desc-recommendation
- improve handling of destinations
- improved gpx-track-edit - use dynamic defaults
- backend+frontend: added geo-state to filter for with or without map
- added clone-functionality to copy entities
- added new entity-type: POI
- added converter to import POIs from geojson-files
- database: added optional fix to change collation to utf8
- backend: fix remap of basejoins on import
- frontend: improved gpx-geoloc-edit - use separate component
- frontend: improved form-handing with util-classes
- frontend: inline-searchpage -> added own maps
- frontend+backend: use fulltext as LIKEIN with OR-splitter
- backend: fixed sql for ODIMGOBJECT, POI
- backend+frontend: added support to edit ODIMGOBJECT
- frontend: moved functionality to new component text-editor
- frontend: moved functionality to new component tdoc-selectsearch
- frontend: added new component odimage-editor
- backend: fixed sql/solr for all entities
- frontend: split components and build for smaller optimized readonly-version
- backend: improved sql/solr for all entities
- commons: improved and generalized itemsjs-adapter
- backend: improved export/import-scripts
- common: added generation of viewer to admin-server
- common: improved visibility-filter
- backend: added fulltext-search-query-modifier to limit fulltext-search for name-fields only
- frontend: made section-page-elements configurable
- frontend: improved leaflet-imports
- frontend: improved imports for bootstrap-modules
- build: added goals for modules-statistics
- frontend: hide copyright-footer if configured
- frontend: improved map-handling on maps and map-editor
- frontend+backend: added gpx-export, gpx-track-handling
- backend: improved logging-config

### new features
- viewer: added viewer as separate environment to view static data without backend
- export: extend mediaexport for additional types and add optional viewer for mediaexport
- admin: added fixtures to remove duplicates from database to admin-ui
- backend+frontend: added geo-state to filter for with or without map
- frontend: added clone-functionality to copy entities
- backend+frontend: added new entity-type: POI
- backend: added converter to import POIs from geojson-files
- backend+frontend: added support to edit ODIMGOBJECT
- frontend: added new component odimage-editor
- common: added generation of viewer to admin-server
- frontend: made section-page-elements configurable
- build: added goals for modules-statistics
- frontend+backend: added gpx-export, gpx-track-handling

### improvements
- backend: extend image-export with more filter
- frontend: add list-layout to url
- frontend: improved desc-recommendation
- backend+frontend: improve handling of destinations
- frontend: improved gpx-track-edit - use dynamic defaults
- frontend: improved gpx-geoloc-edit - use separate component
- frontend: improved form-handing with util-classes
- frontend: inline-searchpage -> added own maps
- frontend+backend: use fulltext as LIKEIN with OR-splitter
- frontend: moved functionality to new component text-editor
- frontend: moved functionality to new component tdoc-selectsearch
- backend: fixed sql for ODIMGOBJECT, POI
- backend: fixed sql/solr for all entities
- frontend: split components and build for smaller optimized readonly-version
- backend: improved sql/solr for all entities
- commons: improved and generalized itemsjs-adapter
- backend: improved export/import-scripts
- common: improved visibility-filter
- backend: added fulltext-search-query-modifier to limit fulltext-search for name-fields only
- frontend: improved imports for bootstrap-modules
- frontend: hide copyright-footer if configured
- frontend: improved map-handling on maps and map-editor 
- backend: improved logging-config

### bug fixes
- backend: fixed media-export of dependent records
- shared: remove duplicates from lists
- backend: fix remap of basejoins on import
- backend+frontend: added support to edit ODIMGOBJECT

### breaking changes
- database: added optional fix to change collation to utf8


## 7.3.0 (2022-08-29)
- added additional groupby track+trip+location for image/track/trip/video/route-list
- added layoutOptions noCount, noHeader
- improved selection of teaser-image
- added sectionDetails
- use location-view to get optimized hierarchical-data
- optimized model
- improved import-scripts
- added gpx-track-edit
- added admin-db-commands
- fixed import for mysql
- use commons 5.5.0
- added media-import-commands
- frontend: added simple markdown-editor

### new features
- frontend/backend: added sectionDetails
- backend: added admin-db-command
- backend: added media-import-commands
- frontend: added simple markdown-editor

### improvements
- frontend: added additional groupby track+trip+location for image/track/trip/video/route-list
- frontend: added layoutOptions noCount, noHeader
- frontend: config - show download-icon only in popup
- solr: improved selection of teaser-image, data-import
- backend: improved sql-filter
- backend: added imagemagic-installer
- backend: use location-view to get optimized hierarchical-data
- backend: optimized model
- scripts: improved import-scripts
- frontend: added gpx-track-edit
- backend: added admin-commands to config

### bug fixes
- backend: fixed track-filter for route
- frontend: fixed admin-area display of result-messages 
- backend: fixed import for mysql

### breaking changes
- none


## 7.2.0 (2021-11-25)
- added statistics-section
- added linked route-attributes for track-routes
- added modal window to create new entries and append them to selectbox
- added modal window to show entries short in popup
- added support to change/order by playlist-pos
- added playlist as entity
- improved sql for similarity-search
- added groupby trip for track-list, region for routes
- fixed solr-import
- show details in list+show-view
- improved layout
- use commons 5.4.0
- added view all_entries to show all entries (especially from database) in one searchresult  
- added initial-name filter

### new features
- backend/frontend: added statistics-section
- backend/frontend: added linked route-attributes for track-routes
- frontend: added modal window to create new entries and append them to selectbox
- frontend: added modal window to show entries short in popup
- backend/frontend: added groupby trip for track-list, region for routes
- frontend: show details in list+show-view
- backend/frontend: added support to change/order by playlist-pos
- backend/frontend: added to append details to playlist-entry
- backend/frontend: added playlist as entity
- backend/frontend: added view all_entries to show all entries (especially from database) in one searchresult
- backend/frontend: added initial-name filter
- 
### improvements
- backend: added sort by name
- backend: improved sql for similarity-search
- frontend: improved layout

### bug fixes
- backend: fixed invalid argument-check in cli
- backend: fixed solr-import
- backend: fix solr header-limit

### breaking changes
- none


## 7.1.0 (2021-05-13)
- improved security with tools to reset service-passwords

### new features
- config: run ConfigInitializerCommand to reset service-passwords

### improvements
- none

### bug fixes
- backend: use fixed facetcache 

### breaking changes
- none


## 7.0.0 (2021-02-05)
- improved security
- run db-migrations, db-publish from serverAdmin
- added admin-server

### new features
- backend: run db-publish from serverAdmin
- backend: run db-migrations from serverAdmin
- backend: added admin-server
- frontend: added admin-area
 
### improvements
- security: bind on localhost only by default
- config: improved db-config
- backend: improved structure
- backend: improved error-handling
- export: improved sql
- export: introduced sqlite-export
- install: use local solr
- backend: added parameter-validation and configurable command-restrictions to serverAdmin
- backend: added and use scaleVideos to serverAdmin instead generating by directory
- backend: improved commands to optionally rename existing outputfiles
- backend: improved mediafile-importer to optionally check if file already exists in database
- backend: added scripts to prepare app-environment on startup

### bug fixes
- scripts: fixed start-scripts
- frontend: fixed imagesize in list-page

### breaking changes
- backend: removed short-parameters for configfiles -c -> --backend, -f -> --firewall or --file, -s -> --sitemap 
- backend: serverAdmin requires action-parameters
- backend: removed imageManager-command



## 6.0.0 (2020-12-20)
- upgraded all dev-dependencies to latest
- upgraded to angular 7
- added media-export

### new features
- frontend: added download-link for images
- backend: added media-export
- backend: use extended security-features (blacklist, whitelists) per profile
- backend: added import of similar images-rating 
- frontend: added similar images to image-show-page

### improvements
- moved features to commons
- backend: use configuration-types
- backend: improved build to include all non-binary deps to build
- build: improved build
- build: added package-dist.json to install binary-deps on server
- scripts: improved sbin-scripts
- frontend: use player-events of commons
- backend: use default-implementation of extractTable
- use current deps in package-lock.version
- added multi-playlist-tag

### bug fixes
- frontendserver: fixed angular-universal-support
 
### breaking changes
- build: upgraded all dev-dependencies to latest
- build: use angular-7
- configuration: removed default-config and renamed default-environment to dev

### known issues
- none



## 5.0.0 (2020-09-05)
- upgraded all dev-dependencies to latest
- upgraded to angular 6
- build: use peerDependencies
- added a action to rate all media of a track
- improved list-layout
- added possibility to edit multiroutes
- added new tourdoc-type: info
- improved dashboard-layout and added columns for news+trip
- edit-form - introduced suggester for name+desc, added desc-preview

### new features
- common: added a action to rate all media of a track
- common: added possibility to edit multiroutes
- common: added new tourdoc-type: info
- frontend: edit-form - introduced suggester for name+desc, added desc-preview

### improvements
- build: upgraded all dev-dependencies to latest
- frontend: upgraded to angular 6
- frontend: improved list-layout 
- backend: removed doublette-facet for imageobjects - its to slow
- backend: improved mapper, model, decoupled functionality and configurations
- common: improved dashboard-layout and added columns for news+trip
- backend: improved media-manager, logging, dont read facets from db, do scaling parallel

### bug fixes
- frontend: IE now functional
- backend: dont map text to html-fields because markdown-fields should be rendered
 
### breaking changes
- build: upgraded all dev-dependencies to latest
- build: use peerDependencies
- frontend: configure preview-resolution in environment
- common: used x300 instead of x600 for image-preview -> run scaleImages to create non-existing images
```
run node dist/backend/serverAdmin.js --command mediaManager --action scaleImages -c config/backend.dev.json --debug --parallel 10
```
- backend: dont map text to html-fields because markdown-fields should be rendered

### known issues
- frontendserver: angularuniversal-support broken



## 4.3.0 (2020-07-11)
- added new tourdoc-type: destination
- improved create-doc-handling
- common: added new field for entity-flags

### new features
- common: added new type: destination
- common: added new field for entity-flags

### improvements
- documentation: added admin-hints
- frontend: improved create-doc-handling
- frontend: improved create-doc-handling
- frontend: suggest routes
- frontend: added new tour-types and keywords
- frontend: improved labels and keywords
- frontend: use internal templates

### bug fixes
- none
 
### breaking changes
- none

### known issues
- frontend: IE till 11 not functional (can block rendering sometimes)
- frontendserver: angularuniversal-support broken


## 4.2.0 (2020-05-24)
- improved and fixed charts, maps and dashboard

### new features
- frontend: improved and added new charts
- frontend: added additional dashboard-filter

### improvements
- common: improved dashboard - use concrete filter+facets
- common: improved naming
- backend: added facets and filter for dashboard-filter

### bug fixes
- frontend: use maps-fixes from commons
- common: fixed codeStyle-issue
 
### breaking changes
- none

### known issues
- frontend: IE till 11 not functional (can block rendering sometimes)
- frontendserver: angularuniversal-support broken


## 4.1.0 (2020-04-04)
- moved facetcache to commons
- improved search, dashboard and data-management
- improved data-import and documentation
- improved build-process - activated tests+coverage
- moved common action-tag-components and navigation-components from mytourbook to frontend-commons
- moved full implementation of actions and actiontags to commons
- bumped up deps

### new features
- backend: added job to find corresponding TourDocRecords for media

### improvements
- common: improved search for persons and objects
- documentation: improved data-import and documentation
- frontend: improved dashboard
- frontend: improved tag-actions
- frontend: added commands to create new entities
- frontend: improved icons
- frontend: added location-edit-area
- frontend: added timeline-navigation and search-navigation to show-page
- development: improved build-process - activated tests+coverage
- common: improved naming of object-detection-modules
- backend: use parameter-substitution for sql
- common: added timeline-navigation
- backend: decoupled and improved package-structure
- backend: extracted configurable common-functionality
- frontend: moved common action-tag-components and navigation-components from mytourbook to frontend-commons
- common: moved full implementation of actions and actiontags to commons
- development: bumped up deps
- frontend: added nearby-list for showpage of location, image, route

### bug fixes
- backend: fixed reimport of exif-dates from images
- backend: fix performance-issue - do not read details when filtering by id
 
### breaking changes
- backend: moved facetcache to commons

### known issues
- frontend: IE till 11 not functional (can block rendering sometimes)
- frontendserver: angularuniversal-support broken


## 4.0.0 (2019-09-07)
- added new type+features for managing object-detection image-objects
- improved trackmanagement and added dashboard
- improved performance by adding facetcaching
- improved installation by using database-migrations

### new features
- common: added new type+features for managing object-detection image-objects
- frontend: added dashboard for data-management
- backend: added facetcaching for database

### improvements
- frontend: improved trackmanagement
- installation: added database-migrations
- common: improved code-quality (types, promises, unused code, relicts...)
- development: improved build-process with overrides
- added import-scripts for automatic import

### bug fixes
- none
 
### breaking changes
- backend: renamed TourDocSqlMytbAdapter to TourDocSqlMytbExportDbAdapter, TourDocSqlMediadbAdapter to TourDocSqlMytbDbAdapter
- datastore: renamed database mediadb to testmytbdb and mytb to mytbexportdb

### known issues
- frontend: IE till 11 not functional (can block rendering sometimes)
- frontendserver: angularuniversal-support broken


## 3.0.0 (2019-02-11)
- upgraded packages to be angular5/6-compatible
- moved common layout-styles to commons
- improved naming
- fixed minor nav-bugs
- use mycms-frontend-devtools
- improved build-process
- improved maps
- improved location-filtering

### new features
- devtools: added devtools (synced-preview...)
- model+frontend: added loc_id for trip and blocked for additional types
- build: improved build-process
- frontend: link and shortcode for listitems to center map on item

### improvements
- frontendserver: improved naming
- database: updated model-scripts
- backend: improved link-normalisation
- model+frontend-backend: use technical name for location-filter

### bug fixes
- frontend: fixed nav-bar  
- frontend: fixed trigger for rendering on navigation/layout-changes
 
### breaking changes
- upgraded packages to be angular5/6-compatible
- migrated packages (ngx-lightbox, ngx-toastr)
- migrated usage of Http to use HttpClient
- moved common layout-styles to commons
- itemnames in links are now lowercase

### known issues
- frontend: IE till 11 not functional (can block rendering sometimes)
- frontendserver: angularuniversal-support broken


## 2.0.0 (2018-10-10)
- changed namespace
- moved functionality to external mycms-modules
- bumped dependency-versions
- added m3u-Export
- improvements on validation
- versioning of asset-urls

### new features
- frontend: added m3u-Export to albumpage
- frontend: added PlaylistService
- frontend: added multiaction-header for lists
- frontend: added version-snippets for asset-urls
- frontendserver: remove versionsnippets for assets as fallback if file not found

### improvements
- commons: improved validation
- commons: improved sql
- frontend: improved layout

### bug fixes
- commons: fixed sql for sqlite3
 
### breaking changes
- moved functionality to external mycms-modules
- bumped dependency-versions
- changed namespace from SDoc=sdoc to TourDoc=tdoc over all components, configs, pathes...
- changed some component configuration
```
components.cdoc-listheader...
components.cdoc-persontags...
```
- commons: changed validation

### known issues
- frontend: IE till 11 not functional (can block rendering sometimes)


## 1.5.0 (2018-09-02)
- layout-improvements 
 
### new features
- frontend: added import/export of album-files
- backend: added persons to solr
 
### improvements
- backend: anonymize media-pathes
- frontend: improved liability/impress-links
- frontend: improved tagcloud, timetable, typetable-links
- frontend: configurable cookiename for cookie-law
- frontend: improved list-layout (select-box -> links)
- frontend: improved albumlayout/show in navbar
 
### bug fixes
- frontend: fixed layoutbugs in mobile-version (cookielaw-width)
- frontend: fixed current value of search-configuration
 
### breaking changes
- none
 
### known issues
- frontend: IE till 11 not functional (can block rendering sometimes)
 
 
## 1.4.0 (2018-05-02)
- added video-support and many layout-improvements
 
### new features
- common: added support for new type: video in frontend, video-server, backend, media-manager
- frontend: show maps for trips on diashow
 
### improvements
- solr: improved data-import
- frontend: configure availability of tabs on section-page 
- frontend: configure types to search on section-page 
- frontend: configure default types to search if none is selected
- frontend: improved list-layout
- frontend: improved news-layout
 
### bug fixes
- frontend: fixed tests
 
### breaking changes
- backend: needs video-tables from ```installer/db/*```
 
### known issues
- frontend: IE till 11 not functional (can block rendering sometimes)
 
 
## 1.3.0 (2018-04-14)
- many improvements on layout, usability, code
 
### new features
- backend: added more facets/filters/fields to mediadb-adapter
- backend: generate redirect-list for frontendserver
- common: added ability to facet by year (for mytb, mediadb, solr)
- common: added actiontag to block items for public
- frontend: highlight labels of form-inputs which are set
- frontend: added "save and back to search"-button on edit-form
- frontend: added function to fix nonstandard gpx in edit-form
- frontend: added datalist for text-input-fields with suggestions from facets
- frontend: added name-recommendation to edit-form
- frontend: added gpx-file-dropzone to edit-form
- frontend: jump to last shown element when back to list 
- frontend: set perPage=10 elements on search-link in inlinesearch
- frontend: added backToTop-link
- frontend: added parameters for configuring show-layout via url-parameter 
- frontendserver: check static redirect-list if url not cached
- frontendserver: added static-server for usage without without angular 
- installer: added sql-script to copy data from mediadb to mytb and prepare for import to solr
 
### improvements
- backend: improved sdoc-loader/exporter
- backend: improved search-adapter to load details depending on mode
- common: use xregexp for validation with unicode-classes
- common: improved code
- frontend: improved list/mobile-layout
- solr: improved fulltext-search
 
### bug fixes
- backend: fixed sql-adataper (max, greatest, IN_CSV)  
- common: fixed validation -> was to restrictive
- common: fixed date-handling - convert all to ISO-Date (not perfect but ....)
- frontend: scroll to top of page on routechange, of element when pagenumchange
- frontend: fixed encodeUri for angular-http-client
- frontend: fixed some issues - added distance to list-layouts, set pageNum=1 if filter changes on searchpage, show no location for news)
 
### breaking changes
- none
 
### known issues
- frontend: IE till 11 not functional (can block rendering sometimes)
 
 
## 1.2.0 (2018-03-19)
- added admin-ui to manage data, data-exporter, image-manager
- added many new features like tagclouds, topimages, persontags, more responsive layouts
- many improvements on layout, performance, code
 
### new features
- frontend: added create/edit-pages and routes with maps, selections, facets
- frontend: added tagclouds to section/search/show-page
- frontend: added responsive stacked-layout for section/search/show-page
- frontend: added topimages to show-page
- frontend: added clickable typetable to search-page
- frontend: added album-page
- frontend: added persontags to show-page
- frontend: added profilemap to search-page
- frontend: added actiontags depending on config and itemdata
- frontend: add cookie-law
- backend: implemented functionality to create/edit items
- backend: added endpoints and actions on dataservice for actiontags (rate, playlist, objects...)
- backend: new job json-exporter
- backend: new job image-manager to resize/reimport-images
- common: dataservices with functionality to create/update/doMultiSearch
 
### improvements
- frontend: do responsive-layout while rendering not only via css
- frontend: added legends to forms and use unicode-icons
- frontend: many layout-improvements on lists, show-page, data-tables
- frontend: load more than 1 tracks to profilemap
- frontend: improved map/profile-map-loading
- frontend: improved keyword-tagging and created common tag-components
- frontend: make timetable clickable on search-page
- frontend: added browser-switch with message for IE
- frontend: improved print-layout
- frontend: changed list-page-layout to diashow
- backend: improved mapper, sql/solr-adapter
- common: use more restrictive validators to validate values
- common: improved logging (sanitize messages)
- common: more functionality is configurable
- common: added several utils: MathUtils, BeanUtils....
- model: new fields
 
### bug fixes
- frontend: fixed css for responsive layouts
- frontend: gpx-loader more error-tolerant
- backend: fixed error-handler
- data: fixed sorting
 
### breaking changes
- none
 
### known issues
- frontend: IE till 11 not functional (can block rendering sometimes)
 
 
## 1.1.0 (2018-01-14)
- added database-support, data-importer, frontendserver with page-cache
- many improvements on layout, performance, code
 
### new features
- frontendserver: added own frontendserver with angular-universal
- frontendserver: new admin-job to initialize angular-universal-cache
- backend: new job json-loader
- backend: new adapter mediadb on mysql/sqlite3
- backend: new adapter mytb on mysql/sqlite3
- datastore: new fields
- datastore: added mytb on mysql
- datastore: added mediadb on mysql- datastore: added
 
### improvements
- frontend: many layout-improvements (show subtypes, number/date-formats...)
- common: improved mapper, factories, validators, code-structure, naming, packages
- common: use promises, observables everywhere
- frontend/backend: use more restrictive validators to validate form-values
- model: new fields persons, playlists
 
### bug fixes
- backend: fixed sitemap-generator
 
### breaking changes
- none
 
 
## 1.0.0 (2017-12-07)
- initial version with frontend, backend, datastore and many features
 
### new features
- model: fields for itemtypes: trips, tracks, images, routes, locations, news
- frontend: section-page with intro, subsections, latest news, short overview with all item-types and favorites
- frontend: search/list-page with search-form, faceting,  maps for itemtypes
- frontend: show-page with item-data, images, maps, profilemap and connected item-types
- backend: rest-api to search/show items
- backend: rest-api to load gpx/geojson-tracks, images in different resolutions
- backend: adapter for solr
- backend: sitemap-generator
- backend: cache and cache-initializer
- datastore: solr with data-import from mytb on mysql
 
### improvements
- initial version: everything is a improvement
 
### bug fixes
- initial version: none
 
### breaking changes
- initial version: none
