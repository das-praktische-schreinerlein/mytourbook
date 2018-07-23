import {CommonEnvironment} from '../shared/frontend-cdoc-commons/common-environment';

export interface AppEnvironment extends CommonEnvironment {
    tracksBaseUrl: string;
    picsBaseUrl: string;
    videoBaseUrl: string;
    useVideoAssetStoreUrls: boolean;
    sdocWritable: boolean;
    sdocActionTagWritable: boolean;
    sdocMaxItemsPerAlbum: number;
}
