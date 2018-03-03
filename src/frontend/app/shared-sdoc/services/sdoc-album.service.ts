import {Injectable} from '@angular/core';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';

@Injectable()
export class SDocAlbumService {
    private static CACHE_KEY = 'albumCache';
    private albumCache = {};
    private idCache = {};
    private store;

    constructor() {
        this.initStorage();
        this.initCache();
    }

    public getSdocIds(albumKey: string): string[] {
        const album = this.albumCache[albumKey];
        if (album !== undefined) {
            return album;
        }

        return [];
    }

    public removeSdocIds(albumKey: string): void {
        const ids = [].concat(this.getSdocIds(albumKey));
        for (const id of ids) {
            this.removeIdFromAlbum(albumKey, id);
        }
        this.albumCache[albumKey] = [];
    }

    public getAlbenBySdocIds(sdocId: string): string[] {
        return this.idCache[sdocId];
    }

    public initAlbenForSDocId(sdoc: SDocRecord) {
        sdoc['localalbum'] = this.getAlbenBySdocIds(sdoc.id);
    }

    public addIdToAlbum(albumKey: string, sdocId: string): void {
        let album = this.albumCache[albumKey];
        if (album === undefined) {
            album = [];
        }
        const index = album.indexOf(sdocId);
        if (index >= 0) {
            return;
        }

        album.push(sdocId);
        this.albumCache[albumKey] = album;
        this.saveCache();

        let keys = this.idCache[sdocId];
        if (keys === undefined) {
            keys = [];
        }
        keys.push(albumKey);
        this.idCache[sdocId] = keys;
    }


    public removeIdFromAlbum(albumKey: string, sdocId: string): void {
        const album = this.albumCache[albumKey];
        if (album !== undefined) {
            let index = album.indexOf(sdocId);
            while (index >= 0) {
                album.splice(index, 1);
                index = album.indexOf(sdocId);

                const sdocAlben = this.idCache[sdocId];
                let index2 = sdocAlben.indexOf(albumKey);
                while (index2 >= 0) {
                    sdocAlben.splice(index2, 1);
                    index2 = sdocAlben.indexOf(albumKey);
                }
            }

            this.saveCache();
        }
    }

    public removeFromAlbum(albumKey: string, sdoc: SDocRecord): void {
        this.removeIdFromAlbum(albumKey, sdoc.id);
        this.initAlbenForSDocId(sdoc);
    }

    public addToAlbum(albumKey: string, sdoc: SDocRecord): void {
        this.addIdToAlbum(albumKey, sdoc.id);
        this.initAlbenForSDocId(sdoc);
    }

    private initStorage() {
        try {
            if (typeof window === 'undefined') {
                return;
            }
            if (typeof window.localStorage === 'undefined') {
                return;
            }
            if (typeof localStorage === 'undefined') {
                return;
            }
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            this.store = localStorage;
        } catch (e) {
            return;
        }
    }

    private initCache(): void {
        const item = this.store ? this.store.getItem(SDocAlbumService.CACHE_KEY) : undefined;
        if (item !== undefined && item !== null && item !== '') {
            this.albumCache = JSON.parse(item);
            for (const albumKey in this.albumCache) {
                for (const sdocId of this.albumCache[albumKey]) {
                    let keys = this.idCache[sdocId];
                    if (keys === undefined) {
                        keys = [];
                    }
                    keys.push(albumKey);
                    this.idCache[sdocId] = keys;
                }
            }
        }
    }

    private saveCache(): void {
        if (!this.store) {
            return;
        }

        this.store.setItem(SDocAlbumService.CACHE_KEY, JSON.stringify(this.albumCache));
    }
}
