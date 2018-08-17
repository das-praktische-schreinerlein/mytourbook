import {Injectable} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {GenericAppService} from '../../commons/services/generic-app.service';
import {CommonDocRoutingService} from './cdoc-routing.service';
import {FilterUtils, SimpleFilter} from '../../commons/utils/filter.utils';
import {BaseVideoRecord} from '../../search-commons/model/records/basevideo-record';
import {BaseImageRecord} from '../../search-commons/model/records/baseimage-record';
import {CommonDocRecord} from '../../search-commons/model/records/cdoc-entity-record';
import {BaseAudioRecord} from '../../search-commons/model/records/baseaudio-record';

export enum KeywordsState {
    SET, NOTSET, SUGGESTED
}

export interface StructuredKeyword {
    name: string;
    keywords: string[];
}

export interface StructuredKeywordState {
    name: string;
    keywords: { keyword: string; state: KeywordsState}[];
}

export interface KeywordSuggestion {
    name: string;
    filters: SimpleFilter[];
    keywords: string[];
}

export interface CommonItemData {
    currentRecord: CommonDocRecord;
    styleClassFor: string[];
    urlShow: SafeUrl;
    audio?: BaseAudioRecord;
    image?: BaseImageRecord;
    video?: BaseVideoRecord;
    thumbnailUrl: SafeUrl;
    previewUrl: SafeUrl;
    fullUrl: SafeUrl;
}

export interface CommonDocContentUtilsConfig {
    cdocRecordRefIdField: string;
    cdocAudiosKey: string;
    cdocImagesKey: string;
    cdocVideosKey: string;
}

@Injectable()
export class CommonDocContentUtils {
    protected cdocRecordRefIdField = 'cdoc_id';
    protected cdocAudiosKey = 'cdocaudios';
    protected cdocImagesKey = 'cdocimages';
    protected cdocVideosKey = 'cdocvideos';

    constructor(protected sanitizer: DomSanitizer, protected cdocRoutingService: CommonDocRoutingService,
                protected appService: GenericAppService) {
        this.configureService();
    }

    getImages(cdocRecord: CommonDocRecord): BaseImageRecord[] {
        return cdocRecord[this.cdocImagesKey];
    }

    getVideos(cdocRecord: CommonDocRecord): BaseVideoRecord[] {
        return cdocRecord[this.cdocVideosKey];
    }

    getAudios(cdocRecord: CommonDocRecord): BaseAudioRecord[] {
        return cdocRecord[this.cdocAudiosKey];
    }

    getThumbnail(image: BaseImageRecord): string {
        return this.getImageUrl(image, 'x100');
    }

    getVideoThumbnail(video: BaseVideoRecord): string {
        return this.getVideoUrl(video, 'screenshot', '.jpg');
    }

    getAudioThumbnail(audio: BaseAudioRecord): string {
        return this.getAudioUrl(audio, 'thumbnail', '');
    }

    getThumbnailUrl(image: BaseImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getThumbnail(image));
    }

    getVideoThumbnailUrl(video: BaseVideoRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoThumbnail(video));
    }

    getAudioThumbnailUrl(audio: BaseAudioRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getAudioThumbnail(audio));
    }

    getPreview(image: BaseImageRecord): string {
        return this.getImageUrl(image, 'x600');
    }

    getVideoPreview(video: BaseVideoRecord): string {
        return this.getVideoUrl(video, 'thumbnail', '.gif.mp4');
    }

    getAudioPreview(audio: BaseAudioRecord): string {
        return this.getAudioUrl(audio, 'thumbnail', '');
    }

    getPreviewUrl(image: BaseImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getPreview(image));
    }

    getVideoPreviewUrl(video: BaseVideoRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoPreview(video));
    }

    getAudioPreviewUrl(audio: BaseAudioRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getAudioPreview(audio));
    }

    getFullUrl(image: BaseImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getImageUrl(image, 'x600'));
    }

    getFullVideoUrl(video: BaseVideoRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoUrl(video, 'x600'));
    }

    getFullAudioUrl(audio: BaseAudioRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getAudioUrl(audio, 'x600'));
    }

    getImageUrl(image: BaseImageRecord, resolution: string): string {
        if (image === undefined) {
            return 'not found';
        }

        if (this.appService.getAppConfig()['useAssetStoreUrls'] === true) {
            return this.appService.getAppConfig()['picsBaseUrl'] + resolution + '/' + image[this.cdocRecordRefIdField];
        } else {
            return this.appService.getAppConfig()['picsBaseUrl'] + 'pics_' + resolution + '/' + image.fileName;
        }
    }

    getVideoUrl(video: BaseVideoRecord, resolution: string, suffix?: string): string {
        if (video === undefined) {
            return 'not found';
        }

        if (this.appService.getAppConfig()['useVideoAssetStoreUrls'] === true) {
            return this.appService.getAppConfig()['videoBaseUrl'] + resolution + '/' + video[this.cdocRecordRefIdField];
        } else {
            return this.appService.getAppConfig()['videoBaseUrl'] + 'video_' + resolution + '/' + video.fileName + (suffix ? suffix : '');
        }
    }

    getAudioUrl(audio: BaseAudioRecord, resolution: string, suffix?: string): string {
        if (audio === undefined) {
            return 'not found';
        }

        if (this.appService.getAppConfig()['useAudioAssetStoreUrls'] === true) {
            return this.appService.getAppConfig()['audioBaseUrl'] + resolution + '/' + audio[this.cdocRecordRefIdField];
        } else {
            return this.appService.getAppConfig()['audioBaseUrl'] + 'audio_' + resolution + '/' + audio.fileName + (suffix ? suffix : '');
        }
    }

    getSuggestedKeywords(suggestionConfigs: KeywordSuggestion[], prefix: string, values: any): string[] {
        let suggestions = [];
        for (const suggestionConfig of suggestionConfigs) {
            if (FilterUtils.checkFilters(suggestionConfig.filters, values)) {
                suggestions = suggestions.concat(suggestionConfig.keywords);
            }
        }

        if (prefix !== undefined && prefix.length > 0) {
            for (let i = 0; i < suggestions.length; i++) {
                suggestions[i] = prefix + suggestions[i];
            }
        }

        return suggestions;
    }

    getStructuredKeywords(config: StructuredKeyword[], keywords: string[], blacklist: string[], possiblePrefixes: string[]):
        StructuredKeyword[] {
        const keywordKats: StructuredKeyword[] = [];
        if (keywords === undefined || keywords.length < 1) {
            return keywordKats;
        }
        for (const keyword of blacklist) {
            if (keywords.indexOf(keyword) > -1) {
                // TODO remove
            }
        }

        for (const keywordKat of config) {
            const keywordFound = [];
            for (const keyword of keywordKat.keywords) {
                for (const prefix of (possiblePrefixes || [])) {
                    const searchPrefix = prefix + keyword;
                    if (keywords.indexOf(searchPrefix) > -1) {
                        keywordFound.push(keyword);
                        break;
                    }
                }
            }
            if (keywordFound.length > 0) {
                keywordKats.push({name: keywordKat.name, keywords: keywordFound});
            }
        }

        return keywordKats;
    }

    getStructuredKeywordsState(config: StructuredKeyword[], keywords: string[], suggested: string[], possiblePrefixes: string[]):
        StructuredKeywordState[] {
        const keywordKats: StructuredKeywordState[] = [];
        if (keywords === undefined || keywords.length < 1) {
            keywords = [];
        }

        for (const keywordKat of config) {
            const keywordFound = [];
            for (const keyword of keywordKat.keywords) {
                let found = false;
                for (const prefix of (possiblePrefixes || [])) {
                    const searchPrefix = prefix + keyword;
                    if (keywords.indexOf(searchPrefix) > -1) {
                        keywordFound.push({keyword: keyword, state: KeywordsState.SET});
                        found = true;
                        break;
                    } else if (suggested.indexOf(searchPrefix) > -1) {
                        found = true;
                        keywordFound.push({keyword: keyword, state: KeywordsState.SUGGESTED});
                        break;
                    }
                }

                if (!found) {
                    keywordFound.push({keyword: keyword, state: KeywordsState.NOTSET});
                }

            }
            keywordKats.push({name: keywordKat.name, keywords: keywordFound});
        }

        return keywordKats;
    }

    calcRate(rate: number, max: number): number {
        return Math.round((rate / 15 * max) + 0.5);
    }

    getShowUrl(record: CommonDocRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.cdocRoutingService.getShowUrl(record, ''));
    }

    updateItemData(itemData: CommonItemData, record: CommonDocRecord, layout: string): boolean {
        itemData.audio = undefined;
        itemData.image = undefined;
        itemData.video = undefined;
        itemData.thumbnailUrl = undefined;
        itemData.previewUrl = undefined;
        itemData.fullUrl = undefined;

        if (record === undefined) {
            itemData.currentRecord = undefined;
            itemData.styleClassFor = undefined;
            itemData.urlShow = undefined;
            return false;
        }

        itemData.currentRecord = record;
        itemData.urlShow = this.getShowUrl(itemData.currentRecord);
        if (itemData.currentRecord[this.cdocAudiosKey] !== undefined && itemData.currentRecord[this.cdocAudiosKey].length > 0) {
            itemData.audio = itemData.currentRecord[this.cdocAudiosKey][0];
            itemData.thumbnailUrl = this.getAudioThumbnailUrl(itemData.audio);
            itemData.previewUrl = this.getAudioPreviewUrl(itemData.audio);
            itemData.fullUrl = this.getFullAudioUrl(itemData.audio);
        } else if (itemData.currentRecord[this.cdocImagesKey] !== undefined && itemData.currentRecord[this.cdocImagesKey].length > 0) {
            itemData.image = itemData.currentRecord[this.cdocImagesKey][0];
            itemData.thumbnailUrl = this.getThumbnailUrl(itemData.image);
            itemData.previewUrl = this.getPreviewUrl(itemData.image);
            itemData.fullUrl = this.getFullUrl(itemData.image);
        } else if (itemData.currentRecord[this.cdocVideosKey] !== undefined && itemData.currentRecord[this.cdocVideosKey].length > 0) {
            itemData.video = itemData.currentRecord[this.cdocVideosKey][0];
            itemData.thumbnailUrl = this.getVideoThumbnailUrl(itemData.video);
            itemData.previewUrl = this.getVideoPreviewUrl(itemData.video);
            itemData.fullUrl = this.getFullVideoUrl(itemData.video);
        }
    }

    protected getServiceConfig(): CommonDocContentUtilsConfig {
        return {
            cdocRecordRefIdField: 'cdoc_id',
            cdocAudiosKey: 'cdocaudios',
            cdocImagesKey: 'cdocimages',
            cdocVideosKey: 'cdocvideos'
        };
    }

    protected configureService(): void {
        const serviceConfig = this.getServiceConfig();

        this.cdocRecordRefIdField = serviceConfig.cdocRecordRefIdField;
        this.cdocAudiosKey = serviceConfig.cdocAudiosKey;
        this.cdocImagesKey = serviceConfig.cdocImagesKey;
        this.cdocVideosKey = serviceConfig.cdocVideosKey;
    }
}
