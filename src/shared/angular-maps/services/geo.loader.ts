import {Http} from '@angular/http';
import {GeoParser, GeoElement} from './geo.parser';

export class GeoLoader  {
    constructor(private http: Http, private parser: GeoParser) {}

    loadDataFromUrl(url: string, options): Promise<GeoElement[]> {
        return new Promise<GeoElement[]>((resolve, reject) => {
            this.http.request(url).subscribe(
                res => {
                    resolve(this.parser.parse(res.text(), options));
                },
                error => {
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
