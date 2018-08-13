import {Injectable} from '@angular/core';
import {CommonDocRecord} from '../../search-commons/model/records/cdoc-entity-record';

@Injectable()
export class CommonDocAlbumService {
    protected CACHE_KEY = 'albumCache';
    protected albumCache = {};
    protected idCache = {};
    protected store;

    constructor() {
        this.initStorage();
        this.initCache();
    }

    public getDocIds(albumKey: string): string[] {
        const album = this.albumCache[albumKey];
        if (album !== undefined) {
            return album;
        }

        return [];
    }

    public removeDocIds(albumKey: string): void {
        const ids = [].concat(this.getDocIds(albumKey));
        for (const id of ids) {
            this.removeIdFromAlbum(albumKey, id);
        }
        this.albumCache[albumKey] = [];
    }

    public getAlbenByDocIds(cdocId: string): string[] {
        return this.idCache[cdocId];
    }

    public initAlbenForDocId(doc: CommonDocRecord) {
        doc['localalbum'] = this.getAlbenByDocIds(doc.id);
    }

    public addIdToAlbum(albumKey: string, docId: string): void {
        let album = this.albumCache[albumKey];
        if (album === undefined) {
            album = [];
        }
        const index = album.indexOf(docId);
        if (index >= 0) {
            return;
        }

        album.push(docId);
        this.albumCache[albumKey] = album;
        this.saveCache();

        let keys = this.idCache[docId];
        if (keys === undefined) {
            keys = [];
        }
        keys.push(albumKey);
        this.idCache[docId] = keys;
    }


    public removeIdFromAlbum(albumKey: string, docId: string): void {
        const album = this.albumCache[albumKey];
        if (album !== undefined) {
            let index = album.indexOf(docId);
            while (index >= 0) {
                album.splice(index, 1);
                index = album.indexOf(docId);

                const docAlben = this.idCache[docId];
                let index2 = docAlben.indexOf(albumKey);
                while (index2 >= 0) {
                    docAlben.splice(index2, 1);
                    index2 = docAlben.indexOf(albumKey);
                }
            }

            this.saveCache();
        }
    }

    public removeFromAlbum(albumKey: string, doc: CommonDocRecord): void {
        this.removeIdFromAlbum(albumKey, doc.id);
        this.initAlbenForDocId(doc);
    }

    public addToAlbum(albumKey: string, doc: CommonDocRecord): void {
        this.addIdToAlbum(albumKey, doc.id);
        this.initAlbenForDocId(doc);
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
        const item = this.store ? this.store.getItem(this.CACHE_KEY) : undefined;
        if (item !== undefined && item !== null && item !== '') {
            this.albumCache = JSON.parse(item);
            for (const albumKey in this.albumCache) {
                for (const docId of this.albumCache[albumKey]) {
                    let keys = this.idCache[docId];
                    if (keys === undefined) {
                        keys = [];
                    }
                    keys.push(albumKey);
                    this.idCache[docId] = keys;
                }
            }
        }
    }

    private saveCache(): void {
        if (!this.store) {
            return;
        }

        this.store.setItem(this.CACHE_KEY, JSON.stringify(this.albumCache));
    }
}
