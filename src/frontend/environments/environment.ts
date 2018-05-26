// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

import {Angulartics2Piwik} from 'angulartics2/piwik';

export const environment = {
    production: false,
    backendApiBaseUrl: 'http://localhost:4100/api/v1/',
    tracksBaseUrl: 'http://localhost:4100/api/assets/trackstore/',
    picsBaseUrl: 'http://localhost:4100/api/static/picturestore/',
    videoBaseUrl: 'http://localhost:4100/api/static/videos/',
    defaultSearchTypes: 'route,location,track,trip,news',
    emptyDefaultSearchTypes: 'route,location,track,trip,news,image,video',
    useAssetStoreUrls: true,
    useVideoAssetStoreUrls: false,
    sdocWritable: true,
    sdocActionTagWritable: true,
    allowAutoPlay: true,
    sdocMaxItemsPerAlbum: 20000,
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [Angulartics2Piwik]
};
