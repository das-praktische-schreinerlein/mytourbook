import {CommonEnvironment} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-commons/common-environment';

export interface AppEnvironment extends CommonEnvironment {
    tracksBaseUrl: string;
    audioBaseUrl: string;
    picsBaseUrl: string;
    videoBaseUrl: string;
    useVideoAssetStoreUrls: boolean;
    useAudioAssetStoreUrls: boolean;
    tdocWritable: boolean;
    tdocActionTagWritable: boolean;
    tdocMaxItemsPerAlbum: number;
    m3uAvailable: boolean;
}
