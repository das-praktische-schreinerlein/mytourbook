import {AppEnvironment} from './app-environment';
import {DataMode} from '../shared/tdoc-commons/model/datamode.enum';

export const environment: AppEnvironment = {
    production: true,
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    backendApiBaseUrl: 'http://localhost:4102/api/v1/',
    tracksBaseUrl: 'http://localhost:4102/api/assets/trackstore/',
    audioBaseUrl: 'http://localhost:4102/api/static/audiostore/',
    picsBaseUrl: 'http://localhost:4102/api/static/picturestore/',
    picsPreviewPathResolution: 'x300',
    videoBaseUrl: 'http://localhost:4102/api/static/videostore/',
    defaultSearchTypes: 'route,location,track,trip,news',
    emptyDefaultSearchTypes: 'route,location,track,trip,news,image,video,info',
    useAssetStoreUrls: true,
    useAudioAssetStoreUrls: false,
    useVideoAssetStoreUrls: false,
    tdocWritable: false,
    tdocActionTagWritable: false,
    allowAutoPlay: false,
    tdocMaxItemsPerAlbum: -1,
    m3uAvailable: false,
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [], // Angulartics2Piwik
    hideInternalDescLinks: false,
    hideInternalImages: false,
    startDataMode: DataMode.BACKEND,
    availableDataModes: [DataMode.BACKEND]
};

// unset logger
console.trace = function() {};
console.debug = function() {};
console.log = function() {};
console.warn = function() {};
console.error = function() {};

