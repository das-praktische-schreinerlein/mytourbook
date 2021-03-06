import {AppEnvironment} from './app-environment';

export const environment: AppEnvironment = {
    production: true,
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    backendApiBaseUrl: 'http://localhost:4101/api/v1/',
    tracksBaseUrl: 'http://localhost:4101/api/assets/trackstore/',
    audioBaseUrl: 'http://localhost:4101/api/static/audiostore/',
    picsBaseUrl: 'http://localhost:4101/api/static/picturestore/',
    picsPreviewPathResolution: 'x300',
    videoBaseUrl: 'http://localhost:4101/api/static/videostore/',
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
    trackingProviders: [] // Angulartics2Piwik
};
