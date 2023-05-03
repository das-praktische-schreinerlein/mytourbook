// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

import {AppEnvironment} from './app-environment';
import {DataMode} from '../shared/tdoc-commons/model/datamode.enum';

export const environment: AppEnvironment = {
    hideCopyrightFooter: true,
    production: false,
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    backendApiBaseUrl: 'http://localhost:4100/api/v1/',
    tracksBaseUrl: 'http://localhost:4100/api/assets/trackstore/',
    audioBaseUrl: 'http://localhost:4100/api/static/audiostore/',
    picsBaseUrl: 'http://localhost:4100/api/static/picturestore/',
    picsPreviewPathResolution: 'x300',
    videoBaseUrl: 'http://localhost:4100/api/static/videos/',
    defaultSearchTypes: 'route,location,track,trip,news',
    emptyDefaultSearchTypes: 'route,location,track,trip,news,image,video,info',
    useAssetStoreUrls: true,
    useAudioAssetStoreUrls: false,
    useVideoAssetStoreUrls: false,
    skipMediaCheck: false,
    pdocWritable: true,
    pdocActionTagWritable: true,
    pdocEmptyDefaultSearchTypes: 'page',
    tdocWritable: true,
    tdocActionTagWritable: true,
    allowAutoPlay: true,
    tdocMaxItemsPerAlbum: 20000,
    m3uAvailable: true,
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [], // Angulartics2Piwik
    adminBackendApiBaseUrl: 'http://localhost:4900/adminapi/v1/',
    adminWritable: true,
    hideInternalDescLinks: false,
    hideInternalImages: false,
    startDataMode: DataMode.BACKEND,
    availableDataModes: [DataMode.BACKEND, DataMode.STATIC]
};
