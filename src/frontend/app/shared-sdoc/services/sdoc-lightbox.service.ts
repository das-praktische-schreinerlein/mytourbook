import {Injectable} from '@angular/core';
import {Lightbox} from 'angular2-lightbox';
import {SDocContentUtils} from './sdoc-contentutils.service';
import {SDocSearchResult} from '../../../shared/sdoc-commons/model/container/sdoc-searchresult';

export interface SDocLightboxAlbumConfig {
    album: any[];
    idPos: {};
}

@Injectable()
export class SDocLightBoxService {
    constructor(private contentUtils: SDocContentUtils, private lightbox: Lightbox) {
    }

    createAlbumConfig(searchResult: SDocSearchResult): SDocLightboxAlbumConfig {
        const lightboxConfig: SDocLightboxAlbumConfig = {
            album: [],
            idPos: {}
        };

        for (let i = 0; i <= searchResult.currentRecords.length; i++) {
            const record = searchResult.currentRecords[i];
            if (record && record.type === 'IMAGE') {
                const src = this.contentUtils.getPreview(record['sdocimages'][0]);
                const caption = record.name;
                const thumb = this.contentUtils.getThumbnail(record['sdocimages'][0]);
                const image = {
                    src: src,
                    caption: caption,
                    thumb: thumb,
                    id: record.id
                };
                lightboxConfig.album.push(image);
                lightboxConfig.idPos[record.id] = lightboxConfig.album.length - 1;
            }
        }
        return lightboxConfig;
    }

    openId(config: SDocLightboxAlbumConfig, id: any): void {
        this.openPos(config, config.idPos[id]);
    }

    openPos(config: SDocLightboxAlbumConfig, pos: number): void {
        this.lightbox.open(config.album, pos || 0);
    }
}
