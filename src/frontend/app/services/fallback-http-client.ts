import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class FallbackHttpClient {

    constructor(private http: HttpClient) {
    }

    public loadJsonPData(scriptUrl: string, varName: string, dataName: string): Promise<{}> {
        return new Promise<string>((resolve, reject) => {
            const script = document.createElement('script');
            script.onload = function () {
                if (!window[varName]) {
                    return reject('No jsonPData: ' + dataName + ' found on: ' + varName);
                }

                const jsonpSrc = window[varName]
                let result;
                try {
                    result = JSON.parse(jsonpSrc);
                } catch (error) {
                    return reject('Exception while parsing ' +
                        'jsonPData: ' + dataName + ' ' +
                        'from ' + varName + ' ' +
                        'url:' + scriptUrl + ': ' + error);
                }

                return resolve(result);
            };
            script.src = scriptUrl;

            document.head.appendChild(script);
        });

    }

}
