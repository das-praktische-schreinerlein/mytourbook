import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {CommonDocPlaylistService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-playlist.service';
import {BaseAudioRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseaudio-record';
import {BaseImageRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseimage-record';
import {BaseVideoRecord} from '@dps/mycms-commons/dist/search-commons/model/records/basevideo-record';

export interface TourDocServerPlaylistServiceConfig {
    useAudioAssetStoreUrls: boolean;
    useImageAssetStoreUrls: boolean;
    useVideoAssetStoreUrls: boolean;
    audioBaseUrl: string;
    imageBaseUrl: string;
    videoBaseUrl: string;
}
export class TourDocServerPlaylistService extends CommonDocPlaylistService<TourDocRecord> {

    constructor(protected config: TourDocServerPlaylistServiceConfig) {
        super();
    }

    generateM3uEntityPath(pathPrefix: string, record: TourDocRecord): string {
        if (record['tdocvideos'] && record['tdocvideos'].length > 0) {
            return this.getVideoUrl(record['tdocvideos'][0], 'x600', '');
        } else if (record['tdocaudios'] && record['tdocaudios'].length > 0) {
            return this.getAudioUrl(record['tdocaudios'][0], 'full', '');
        } else if (record['tdocimages'] && record['tdocimages'].length > 0) {
            return this.getImageUrl(record['tdocimages'][0], 'x600', '');
        }

        return undefined;
    }

    getAudioUrl(audio: BaseAudioRecord, resolution: string, suffix?: string): string {
        if (audio === undefined) {
            return undefined;
        }

        if (this.config['useAudioAssetStoreUrls'] === true) {
            return this.config['audioBaseUrl'] + resolution + '/' + audio['tdoc_id'];
        } else {
            return this.config['audioBaseUrl'] + audio.fileName + (suffix ? suffix : '');
        }
    }

    getImageUrl(image: BaseImageRecord, resolution: string, suffix?: string): string {
        if (image === undefined) {
            return undefined;
        }

        if (this.config['useImageAssetStoreUrls'] === true) {
            return this.config['imageBaseUrl'] + resolution + '/' + image['tdoc_id'];
        } else {
            return this.config['imageBaseUrl'] + 'pics_' + resolution + '/' + image.fileName + (suffix ? suffix : '');
        }
    }

    getVideoUrl(video: BaseVideoRecord, resolution: string, suffix?: string): string {
        if (video === undefined) {
            return undefined;
        }

        if (this.config['useVideoAssetStoreUrls'] === true) {
            return this.config['videoBaseUrl'] + resolution + '/' + video['tdoc_id'];
        } else {
            return this.config['videoBaseUrl'] + 'video_' + resolution + '/' + video.fileName + (suffix ? suffix : '');
        }
    }

    public generateM3uEntityInfo(record: TourDocRecord): string {
        if (!record || !record.name) {
            return undefined;
        }

        return '#EXTINF:-1,' + record.name;
    }
}
