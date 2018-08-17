import {Injectable} from '@angular/core';
import {Lightbox} from 'angular2-lightbox';
import {CommonDocContentUtils} from './cdoc-contentutils.service';
import {CommonDocRecord} from '../../search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../../search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '../../search-commons/model/container/cdoc-searchresult';

export interface CommonDocLightboxAlbumConfig {
    album: any[];
    idPos: {};
}

@Injectable()
export class CommonDocLightBoxService <R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>> {
    constructor(protected contentUtils: CommonDocContentUtils, protected lightbox: Lightbox) {
    }

    createAlbumConfig(searchResult: S): CommonDocLightboxAlbumConfig {
        const lightboxConfig: CommonDocLightboxAlbumConfig = {
            album: [],
            idPos: {}
        };

        for (let i = 0; i <= searchResult.currentRecords.length; i++) {
            const record = searchResult.currentRecords[i];
            if (this.hasImage(record)) {
                const src = this.contentUtils.getPreview(this.contentUtils.getImages(record)[0]);
                const caption = record.name;
                const thumb = this.contentUtils.getThumbnail(this.contentUtils.getImages(record)[0]);
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

    openId(config: CommonDocLightboxAlbumConfig, id: any): void {
        this.openPos(config, config.idPos[id]);
    }

    openPos(config: CommonDocLightboxAlbumConfig, pos: number): void {
        this.lightbox.open(config.album, pos || 0);
    }

    protected hasImage(record: R): boolean {
        return record && record.type === 'IMAGE' && this.contentUtils.getImages(record).length > 0;
    }
}
