import {AppEnvironment} from './app-environment';
import {DataMode} from '../shared/tdoc-commons/model/datamode.enum';
import {PrintDialogPdfGenerator} from '@dps/mycms-frontend-commons/dist/angular-commons/services/print-dialog-pdf.generator';

export const environment: AppEnvironment = {
    production: true,
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    backendApiBaseUrl: 'http://localhost:4102/api/v1/',
    tracksBaseUrl: 'http://localhost:4102/api/assets/trackstore/',
    pdfsBaseUrl: 'http://localhost:4102/api/assets/pdfstore/',
    audioBaseUrl: 'http://localhost:4102/api/static/audiostore/',
    picsBaseUrl: 'http://localhost:4102/api/static/picturestore/',
    picsPreviewPathResolution: 'x300',
    videoBaseUrl: 'http://localhost:4102/api/static/videostore/',
    defaultSearchTypes: 'route,location,track,trip,news',
    emptyDefaultSearchTypes: 'route,location,track,trip,news,image,video,info',
    useAssetStoreUrls: true,
    useAudioAssetStoreUrls: false,
    useVideoAssetStoreUrls: false,
    pdocWritable: false,
    pdocActionTagWritable: false,
    pdocEmptyDefaultSearchTypes: 'page',
    tdocWritable: false,
    tdocActionTagWritable: false,
    allowAutoPlay: false,
    tdocMaxItemsPerAlbum: 1000,
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

// TODO if you want pdf replace PrintDialogPdfGenerator by JsPdfGenerator and move jspdf in package.json from optional to dep
export class EnvironmentPdfGenerator extends PrintDialogPdfGenerator {}

