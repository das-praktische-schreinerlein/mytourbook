# Changelog of MyTourBook
 
# Versions
 
## 6.0.0
- upgraded all dev-dependencies to latest
- upgraded to angular 7
- added media-export

### new features
- none

### improvements
- moved features to commons
- backend: use configuration-types
- backend: improved build to include all non-binary deps to build
- build: improved build
- build: added package-dist.json to install binary-deps on server
- backend: use extended security-features (blacklist, whitelists) per profile
- frontend: added download-link for images
- scripts: improved sbin-scripts
- backend: added media-export
- frontend: use player-events of commons
- backend: use default-implementation of extractTable
- use current deps in package-lock.version

### bug fixes
- none
 
### breaking changes
- build: upgraded all dev-dependencies to latest
- build: use angular-7
- configuration: removed default-config and renamed default-environment to dev

### known issues
- frontendserver: angularuniversal-support broken



## 5.0.0
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
run node dist/backend/serverAdmin.js --command imageManager --action scaleImages -c config/backend.dev.json --debug --parallel 10
```
- backend: dont map text to html-fields because markdown-fields should be rendered

### known issues
- frontendserver: angularuniversal-support broken



## 4.3.0
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


## 4.2.0
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


## 4.1.0
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


## 4.0.0
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


## 3.0.0
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


## 2.0.0
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


## 1.5.0
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
 
 
## 1.4.0
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
 
 
## 1.3.0
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
 
 
## 1.2.0
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
 
 
## 1.1.0
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
 
 
## 1.0.0
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
