import {Angulartics2Piwik} from 'angulartics2';

export const environment = {
    production: true,
    backendApiBaseUrl: 'http://www.michas-ausflugstipps.de/mytbbeta/api/v1/',
    tracksBaseUrl: 'http://www.michas-ausflugstipps.de/mytbbeta/api/assets/tracks/',
    picsBaseUrl: 'http://www.michas-ausflugstipps.de/mytbbeta/api/static/pictures/',
    trackingProviders: [Angulartics2Piwik]
};
