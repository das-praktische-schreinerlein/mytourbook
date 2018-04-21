import {Angulartics2Piwik} from 'angulartics2/piwik';

export const environment = {
    production: true,
    backendApiBaseUrl: 'http://www.michas-ausflugstipps.de/mytb/api/v1/',
    tracksBaseUrl: 'http://www.michas-ausflugstipps.de/api/assets/trackstore/',
    picsBaseUrl: 'http://www.michas-ausflugstipps.de/api/static/picturestore/',
    videoBaseUrl: 'http://www.michas-ausflugstipps.de/api/static/videostore/',
    defaultSearchTypes: 'route,location,track,trip,news',
    emptyDefaultSearchTypes: 'route,location,track,trip,news,image,video',
    useAssetStoreUrls: true,
    useVideoAssetStoreUrls: false,
    sdocWritable: false,
    sdocActionTagWritable: false,
    allowAutoPlay: false,
    sdocMaxItemsPerAlbum: -1,
    trackingProviders: [Angulartics2Piwik]
};

// unset logger
console.trace = function() {};
console.debug = function() {};
console.log = function() {};
console.warn = function() {};
console.error = function() {};

