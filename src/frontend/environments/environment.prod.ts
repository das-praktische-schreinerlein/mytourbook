import {Angulartics2Piwik} from 'angulartics2/piwik';

export const environment = {
    production: true,
    backendApiBaseUrl: 'http://www.michas-ausflugstipps.de/mytb/api/v1/',
    tracksBaseUrl: 'http://www.michas-ausflugstipps.de/api/assets/trackstore/',
    picsBaseUrl: 'http://www.michas-ausflugstipps.de/api/static/picturestore/',
    useAssetStoreUrls: true,
    trackingProviders: [Angulartics2Piwik]
};
