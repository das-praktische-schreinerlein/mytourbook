import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Injectable()
export class FallbackHttpClient {
    private fileJsonContainer = {}

    constructor(@Inject(DOCUMENT) private document: Document) {
    }

    public loadJsonPData(scriptUrl: string, varName: string, dataName: string): Promise<{}> {
        const me = this;
        return new Promise<{}>((resolve, reject) => {
            let cachedJsonpSrc = this.getFromCache(scriptUrl);
            if (cachedJsonpSrc) {
                console.debug('SKIPPPED - loaded aleady done dataName/scriptUrl/varName from cache',
                    dataName, scriptUrl, varName, cachedJsonpSrc);
                try {
                    return resolve(JSON.parse(cachedJsonpSrc));
                } catch (error) {
                    console.warn('SKIPPED cache - Exception while parsing ' +
                        'jsonPData: ' + dataName + ' ' +
                        'from ' + varName + ' ' +
                        'url:' + scriptUrl + ': ' + error);
                }
            }

            const element = this.document.getElementById(scriptUrl);
            if (element) {
                cachedJsonpSrc = element.innerHTML;
                console.debug('SKIPPPED - loaded dataName/scriptUrl/varName from inline',
                    dataName, scriptUrl, varName);
                try {
                    const result = JSON.parse(cachedJsonpSrc);
                    me.addToCache(scriptUrl, cachedJsonpSrc);

                    return resolve(result);
                } catch (error) {
                    console.warn('SKIPPED inline-src - Exception while parsing ' +
                        'jsonPData: ' + dataName + ' ' +
                        'from ' + varName + ' ' +
                        'url:' + scriptUrl + ': ' + error);
                }
            }

            const script = document.createElement('script');
            script.onload = function () {
                if (!window[varName]) {
                    return reject('No jsonPData: ' + dataName + ' found on: ' + varName);
                }

                const jsonpSrc = window[varName]
                try {
                    const result = JSON.parse(jsonpSrc);
                    me.addToCache(scriptUrl, jsonpSrc);

                    return resolve(result);
                } catch (error) {
                    return reject('Exception while parsing ' +
                        'jsonPData: ' + dataName + ' ' +
                        'from ' + varName + ' ' +
                        'url:' + scriptUrl + ': ' + error);
                }
            };

            script.src = scriptUrl;

            document.head.appendChild(script);
        });

    }

    public addToCache(scriptUrl: string, data: string): void {
        if (data === undefined) {
            return;
        }

        this.fileJsonContainer[scriptUrl] = data;
    }

    public getFromCache(scriptUrl: string): string {
        return this.fileJsonContainer[scriptUrl]
            ? this.fileJsonContainer[scriptUrl]
            : undefined;
    }

}
