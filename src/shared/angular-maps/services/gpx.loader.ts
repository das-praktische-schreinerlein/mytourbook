import {Http} from '@angular/http';
import {GeoElement, GpxParser} from './gpx.parser';

export class GpxLoader  {
    constructor(private http: Http, private gpxParser: GpxParser) {}

    loadGpx(url: string, options): Promise<GeoElement[]> {
        return new Promise<GeoElement[]>((resolve, reject) => {
            this.http.request(url).subscribe(
                res => {
                    resolve(this.gpxParser.parseGpx(res.text(), options));
                },
                error => {
                    console.error('loading gpx-failed failed:' + url, error);
                    reject(error);
                });
        });
    }
}
