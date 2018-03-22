import {Headers, Http, RequestOptionsArgs} from '@angular/http';
import {BackendHttpResponse, BackendRequestOptionsArgs, MinimalHttpBackendClient} from '../../commons/services/minimal-http-backend-client';
import {Injectable} from '@angular/core';
import {isArray} from 'util';

@Injectable()
export class SimpleAngularBackendHttpClient extends MinimalHttpBackendClient {
    public static fixRequestOption(requestConfig: RequestOptionsArgs): void {
        // prevent angular from mapping '+' in params  to ' '
        if (requestConfig.method === 'get' && requestConfig.params !== undefined) {
            const params = [];
            for (const paramName in <{}>requestConfig.params) {
                const value = requestConfig.params[paramName];
                if (isArray(value)) {
                    for (const singleValue of value)  {
                        params.push(encodeURIComponent(paramName) + '=' + encodeURIComponent(singleValue));
                    }
                } else {
                    params.push(encodeURIComponent(paramName) + '=' + encodeURIComponent(value.toString()));
                }
            }

            if (params.length > 0) {
                if (requestConfig.url.indexOf('?') < 0) {
                    requestConfig.url += '?';
                } else if (!requestConfig.url.endsWith('&')) {
                    requestConfig.url += '&';
                }

                requestConfig.url += params.join('&');
                requestConfig.params = undefined;
            }
        }
    }

    constructor(private http: Http) {
        super();
    }

    makeHttpRequest(httpConfig: BackendRequestOptionsArgs): Promise<BackendHttpResponse> {
        const requestConfig: RequestOptionsArgs = {
            method: httpConfig.method.toLowerCase(),
            url: httpConfig.url,
            body: httpConfig.data,
            params: httpConfig.params,
            headers: new Headers(),
            withCredentials: true
        };

        SimpleAngularBackendHttpClient.fixRequestOption(requestConfig);

        let result, request;
        request = this.http.request(httpConfig.url, requestConfig);
        result = request.map((res) => {
            // console.log('response makeHttpRequest:' + httpConfig.url, res);
            return {
                headers: res.headers,
                method: httpConfig.method,
                data: res.json(),
                text: function () { return res.text(); },
                json: function () { return res.json(); },
                status: res.status,
                statusMsg: res.statusText
            } as BackendHttpResponse;
        });

        return result.toPromise();
    }
}
