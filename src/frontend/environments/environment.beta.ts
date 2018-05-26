import {Angulartics2Piwik} from 'angulartics2/piwik';

export const environment = {
    production: true,
    backendApiBaseUrl: 'http://localhost:4101/api/v1/',
    tracksBaseUrl: 'http://localhost:4101/api/assets/trackstore/',
    picsBaseUrl: 'http://localhost:4101/api/static/picturestore/',
    videoBaseUrl: 'http://localhost:4101/api/static/videostore/',
    defaultSearchTypes: 'route,location,track,trip,news',
    emptyDefaultSearchTypes: 'route,location,track,trip,news,image,video',
    useAssetStoreUrls: true,
    useVideoAssetStoreUrls: false,
    sdocWritable: false,
    sdocActionTagWritable: false,
    allowAutoPlay: false,
    sdocMaxItemsPerAlbum: -1,
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [Angulartics2Piwik]
};
