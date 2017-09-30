import {GeoElement, GeoParser} from './geo.parser';
import {MinimalHttpBackendClient} from '../../commons/services/minimal-http-backend-client';

export class GeoLoader  {
    constructor(private http: MinimalHttpBackendClient, private parser: GeoParser) {}

    loadDataFromUrl(url: string, options): Promise<GeoElement[]> {
        const me = this;
        return new Promise<GeoElement[]>((resolve, reject) => {
            me.http.makeHttpRequest({ method: 'get', url: url, withCredentials: true })
                .then(function onLoaded(res: any) {
                    resolve(me.parser.parse(res.text(), options));
                    return;
            }).catch(function onError(error: any) {
                    console.error('loading geofeature failed:' + url, error);
                    reject(error);
                });
        });
    }

    loadData(src: string, options): Promise<GeoElement[]> {
        return new Promise<GeoElement[]>((resolve) => {
            resolve(this.parser.parse(src, options));
        });
    }
}
