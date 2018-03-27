# Changelog of MyTourBook
 
# Versions
 
## 1.3.0-alpha
- many improvements on layout, usability, code
 
### new features
- installer: added sql-script to copy data from mediadb to mytb and prepare for import to solr
 
### improvements
- common: use xregexp for validation with unicode-classes
- common: added ability to facet by year (for mytb, mediadb)
- common: added actiontag to block items for public
- frontend: improved list/mobile-layout
- frontend: highlight labels of form-inputs which are set
- frontend: added "save and back to search"-button on edit-form
- frontend: added function to fix nonstandard gpx in edit-form
- frontend: added datalist for text-input-fields with suggestions from facets
- frontend: added name-recommendation to edit-form
- frontend: improved code
- backend: added more facets/filters/fields to mediadb-adapter
- backend: improved sdoc-loader/exporter
- backend: improved search-adapter to load details depending on mode
 
### bug fixes
- common: fixed validation -> was to restrictive
- frontend: scroll to top of page on routechange, of element when pagenumchange
- frontend: fixed encodeUri for angular-http-client
- backend: fixed sql-adataper (max, greatest, IN_CSV)  
 
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
