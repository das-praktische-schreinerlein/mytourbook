import {Injectable} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {CommonDocRoutingService} from './cdoc-routing.service';
import {FilterUtils, SimpleFilter} from '../../../shared/commons/utils/filter.utils';
import {BaseVideoRecord} from '../../../shared/search-commons/model/records/basevideo-record';
import {BaseImageRecord} from '../../../shared/search-commons/model/records/baseimage-record';
import {CommonDocRecord} from '../../../shared/search-commons/model/records/cdoc-entity-record';

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
    image: BaseImageRecord;
    video: BaseVideoRecord;
    thumbnailUrl: SafeUrl;
    previewUrl: SafeUrl;
    fullUrl: SafeUrl;
}

@Injectable()
export class CDocContentUtils {

    constructor(protected sanitizer: DomSanitizer, protected cdocRoutingService: CommonDocRoutingService,
                protected appService: GenericAppService) {
    }

    getThumbnail(image: BaseImageRecord): string {
        return this.getImageUrl(image, 'x100');
    }

    getVideoThumbnail(image: BaseVideoRecord): string {
        return this.getVideoUrl(image, 'screenshot', '.jpg');
    }

    getThumbnailUrl(image: BaseImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getThumbnail(image));
    }

    getVideoThumbnailUrl(image: BaseVideoRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoThumbnail(image));
    }

    getPreview(image: BaseImageRecord): string {
        return this.getImageUrl(image, 'x600');
    }

    getVideoPreview(image: BaseVideoRecord): string {
        return this.getVideoUrl(image, 'thumbnail', '.gif.mp4');
    }

    getPreviewUrl(image: BaseImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getPreview(image));
    }

    getVideoPreviewUrl(image: BaseVideoRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoPreview(image));
    }

    getFullUrl(image: BaseImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getImageUrl(image, 'x600'));
    }

    getFullVideoUrl(video: BaseVideoRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoUrl(video, 'x600'));
    }

    getImageUrl(image: BaseImageRecord, resolution: string): string {
        if (image === undefined) {
            return 'not found';
        }

        if (this.appService.getAppConfig()['useAssetStoreUrls'] === true) {
            return this.appService.getAppConfig()['picsBaseUrl'] + resolution + '/' + image['sdoc_id'];
        } else {
            return this.appService.getAppConfig()['picsBaseUrl'] + 'pics_' + resolution + '/' + image.fileName;
        }
    }
    getVideoUrl(video: BaseVideoRecord, resolution: string, suffix?: string): string {
        if (video === undefined) {
            return 'not found';
        }

        if (this.appService.getAppConfig()['useVideoAssetStoreUrls'] === true) {
            return this.appService.getAppConfig()['videoBaseUrl'] + resolution + '/' + video['sdoc_id'];
        } else {
            return this.appService.getAppConfig()['videoBaseUrl'] + 'video_' + resolution + '/' + video.fileName + (suffix ? suffix : '');
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
                keywordKats.push({ name: keywordKat.name, keywords: keywordFound});
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
            keywordKats.push({ name: keywordKat.name, keywords: keywordFound});
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
        if (record === undefined) {
            itemData.currentRecord = undefined;
            itemData.styleClassFor = undefined;
            itemData.urlShow = undefined;
            itemData.image = undefined;
            itemData.video = undefined;
            itemData.thumbnailUrl = undefined;
            itemData.previewUrl = undefined;
            itemData.fullUrl = undefined;
            return false;
        }

        itemData.currentRecord = record;
        itemData.urlShow = this.getShowUrl(itemData.currentRecord);
        itemData.image = undefined;
        itemData.video = undefined;
        itemData.thumbnailUrl = undefined;
        itemData.previewUrl = undefined;
        itemData.fullUrl = undefined;

        if (itemData.currentRecord['sdocimages'] !== undefined && itemData.currentRecord['sdocimages'].length > 0) {
            itemData.image = itemData.currentRecord['sdocimages'][0];
            itemData.thumbnailUrl = this.getThumbnailUrl(itemData.image);
            itemData.previewUrl = this.getPreviewUrl(itemData.image);
            itemData.fullUrl = this.getFullUrl(itemData.image);
        } else if (itemData.currentRecord['sdocvideos'] !== undefined && itemData.currentRecord['sdocvideos'].length > 0) {
            itemData.video = itemData.currentRecord['sdocvideos'][0];
            itemData.thumbnailUrl = this.getVideoThumbnailUrl(itemData.video);
            itemData.previewUrl = this.getVideoPreviewUrl(itemData.video);
            itemData.fullUrl = this.getFullVideoUrl(itemData.video);
        }
    }

}
