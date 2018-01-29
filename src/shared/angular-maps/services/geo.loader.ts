import {GeoElement, GeoParser} from './geo.parser';
import {MinimalHttpBackendClient} from '../../commons/services/minimal-http-backend-client';
import {LogUtils} from '../../commons/utils/log.utils';

export class GeoLoader  {
    constructor(private http: MinimalHttpBackendClient, private parser: GeoParser) {}

    loadDataFromUrl(url: string, options): Promise<GeoElement[]> {
        const me = this;
        return new Promise<GeoElement[]>((resolve, reject) => {
            me.http.makeHttpRequest({ method: 'get', url: url, withCredentials: true })
                .then(function onLoaded(res: any) {
                    return resolve(me.parser.parse(res.text(), options));
            }).catch(function onError(error: any) {
                    console.error('loading geofeature failed:' + LogUtils.sanitizeLogMsg(url), error);
                    return reject(error);
                });
        });
    }

    loadData(src: string, options): Promise<GeoElement[]> {
        return new Promise<GeoElement[]>((resolve) => {
            return resolve(this.parser.parse(src, options));
        });
    }
}
