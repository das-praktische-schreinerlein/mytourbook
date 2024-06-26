import {CommonEnvironment} from '@dps/mycms-frontend-commons/dist/frontend-section-commons/common-environment';
import {DataMode} from '../shared/tdoc-commons/model/datamode.enum';

export interface AppEnvironment extends CommonEnvironment {
    tracksBaseUrl: string;
    pdfsBaseUrl?: string;
    audioBaseUrl: string;
    picsBaseUrl: string;
    picsPreviewPathResolution: string;
    videoBaseUrl: string;
    useVideoAssetStoreUrls: boolean;
    useAudioAssetStoreUrls: boolean;
    skipMediaCheck?: boolean,
    pdocWritable?: boolean;
    pdocActionTagWritable?: boolean;
    pdocEmptyDefaultSearchTypes?: string,
    tdocWritable: boolean;
    tdocActionTagWritable: boolean;
    tdocMaxItemsPerAlbum: number;
    m3uAvailable: boolean;
    hideInternalDescLinks?: boolean;
    hideInternalImages?: boolean,
    currentDataMode?: DataMode;
    startDataMode?: DataMode;
    availableDataModes?: DataMode[];
    staticPDocsFile?: string;
    staticTDocsFiles?: string[];
    tourDocDateFormatPipePattern?: string;
    tourDocFacetsFiltered?: boolean;
}
