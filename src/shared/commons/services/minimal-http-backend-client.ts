export interface BackendRequestOptionsArgs {
    method: string;
    url: string;
    data?: {};
    params?: any;
    withCredentials?: boolean | null;
}

export interface BackendHttpResponse {
    headers: any[];
    method: string;
    data: {};
    status: number;
    statusMsg: string;
    json(): any;
    text(encodingHint?: 'legacy' | 'iso-8859'): string;
}

export abstract class MinimalHttpBackendClient {
    abstract makeHttpRequest(httpConfig: BackendRequestOptionsArgs): Promise<BackendHttpResponse>;
}
