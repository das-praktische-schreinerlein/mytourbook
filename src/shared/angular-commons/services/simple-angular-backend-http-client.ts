import {Headers, Http, RequestOptionsArgs} from '@angular/http';
import {BackendHttpResponse, BackendRequestOptionsArgs, MinimalHttpBackendClient} from '../../commons/services/minimal-http-backend-client';
import {Injectable} from '@angular/core';

@Injectable()
export class SimpleAngularBackendHttpClient extends MinimalHttpBackendClient {
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
    }}
