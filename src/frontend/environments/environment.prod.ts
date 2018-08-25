import {Angulartics2Piwik} from 'angulartics2/piwik';
import {AppEnvironment} from './app-environment';

export const environment: AppEnvironment = {
    production: true,
    backendApiBaseUrl: 'http://localhost:4102/api/v1/',
    tracksBaseUrl: 'http://localhost:4102/api/assets/trackstore/',
    audioBaseUrl: 'http://localhost:4102/api/static/audiostore/',
    picsBaseUrl: 'http://localhost:4102/api/static/picturestore/',
    videoBaseUrl: 'http://localhost:4102/api/static/videostore/',
    defaultSearchTypes: 'route,location,track,trip,news',
    emptyDefaultSearchTypes: 'route,location,track,trip,news,image,video',
    useAssetStoreUrls: true,
    useAudioAssetStoreUrls: false,
    useVideoAssetStoreUrls: false,
    sdocWritable: false,
    sdocActionTagWritable: false,
    allowAutoPlay: false,
    sdocMaxItemsPerAlbum: -1,
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [Angulartics2Piwik]
};

// unset logger
console.trace = function() {};
console.debug = function() {};
console.log = function() {};
console.warn = function() {};
console.error = function() {};

