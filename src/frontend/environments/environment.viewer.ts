import {AppEnvironment} from './app-environment';
import {DataMode} from '../shared/tdoc-commons/model/datamode.enum';

export const environment: AppEnvironment = {
    hideCopyrightFooter: true,
    production: false, // TODO set this to false for development
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    backendApiBaseUrl: undefined,
    tracksBaseUrl: undefined,
    audioBaseUrl: undefined,
    picsBaseUrl: undefined,
    picsPreviewPathResolution: 'x300',
    videoBaseUrl: undefined,
    defaultSearchTypes: 'route,location,track,trip,news',
    emptyDefaultSearchTypes: 'route,location,track,trip,news,image,video,info',
    useAssetStoreUrls: false,
    useAudioAssetStoreUrls: false,
    useVideoAssetStoreUrls: false,
    skipMediaCheck: false,
    pdocWritable: false,
    pdocActionTagWritable: false,
    pdocEmptyDefaultSearchTypes: 'page',
    tdocWritable: false,
    tdocActionTagWritable: false,
    allowAutoPlay: true,
    tdocMaxItemsPerAlbum: -1,
    m3uAvailable: false,
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [], // Angulartics2Piwik
    staticPDocsFile: 'assets/staticdata/static.mytbpdocs.js',
    staticTDocsFiles: ['assets/staticdata/static.mytbtdocs.js'],
    hideInternalDescLinks: true,
    hideInternalImages: true,
    startDataMode: DataMode.STATIC,
    availableDataModes: [DataMode.STATIC]
};

// unset logger
if (environment.production) {
    console.trace = function() {};
    console.debug = function() {};
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
}

