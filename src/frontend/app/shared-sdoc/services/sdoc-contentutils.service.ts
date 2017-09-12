import {Injectable} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SDocImageRecord} from '../../../shared/sdoc-commons/model/records/sdocimage-record';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {GenericAppService} from '../../../shared/search-commons/services/generic-app.service';

export interface StructuredKeyword {
    name: string;
    keywords: string[];
}

@Injectable()
export class SDocContentUtils {

    constructor(private sanitizer: DomSanitizer, private appService: GenericAppService) {
    }

    getLastElementLocationHierarchy(record: SDocRecord): string {
        if (record.locHirarchie === undefined) {
            return '';
        }

        const hierarchy = record.locHirarchie.split(' -> ');
        if (record.type === 'LOCATION' && hierarchy.length > 1) {
            return hierarchy[hierarchy.length - 2];
        }

        return hierarchy[hierarchy.length - 1];
    }

    getLocationHierarchy(record: SDocRecord, lastOnly: boolean): any[] {
        if (record.locHirarchie === undefined || record.locHirarchieIds === undefined) {
            return [];
        }

        const hierarchyTexts = record.locHirarchie.split(' -> ');
        const hierarchyIds = record.locHirarchieIds.split(',');
        if (hierarchyIds.length !== hierarchyTexts.length) {
            return [];
        }

        const hierarchy = [];
        let lastIndex = hierarchyTexts.length - 1;
        if (record.type === 'LOCATION' && hierarchy.length > 1) {
            lastIndex--;
        }

        for (let i = lastOnly ? lastIndex : 0; i < hierarchyTexts.length; i++) {
            if (hierarchyIds[i] !== undefined && hierarchyTexts[i] != undefined && hierarchyTexts[i].length > 0) {
                hierarchy.push(['LOCATION_' + hierarchyIds[i], hierarchyTexts[i]]);
            }
        }

        return hierarchy;
    }

    getThumbnails(record: SDocRecord): SDocImageRecord[] {
        return record['sdocimages'].filter((item, index) => index < 10);
    }

    getThumbnail(image: SDocImageRecord): string {
        return this.appService.getAppConfig()['picsBaseUrl'] + '/pics_x100/' + image.fileName;
    }

    getThumbnailUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getThumbnail(image));
    }

    getPreview(image: SDocImageRecord): string {
        return this.appService.getAppConfig()['picsBaseUrl'] + '/pics_x600/' + image.fileName;
    }

    getPreviewUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getPreview(image));
    }

    getFullUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            this.appService.getAppConfig()['picsBaseUrl'] + '/pics_x600/' + image.fileName);
    }

    getStyleClassForRecord(record: SDocRecord, layout: string): string[] {
        const value = record['sdocratepers'] || {gesamt: 0};
        const rate = Math.round(((value['gesamt'] || 0) / 3) + 0.5);
        return ['list-item-persrate-' + rate, 'list-item-' + layout + '-persrate-' + rate];
    }

    getStructuredKeywords(config: StructuredKeyword[], keywords: string[], blacklist: string[]): StructuredKeyword[] {
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
                if (keywords.indexOf(keyword) > -1) {
                    // TODO remove
                    keywordFound.push(keyword);
                }
            }
            if (keywordFound.length > 0) {
                keywordKats.push({ name: keywordKat.name, keywords: keywordFound});
            }
        }

        return keywordKats;
    }
}
