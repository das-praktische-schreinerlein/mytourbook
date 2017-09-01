import {GeoCoder} from 'geo-coder';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

export class GeoLocationService {
    private geoCoder = new GeoCoder({ provider: 'osm', lang: 'de-DE' });

    constructor() {
    }

    public getCurrentPosition(): Observable<Position> {
        return new Observable((observer: Observer<Position>) => {
            navigator.geolocation.getCurrentPosition(
                (position: Position) => {
                    observer.next(position);
                    observer.complete();
                },
                (error: PositionError) => {
                    console.log('Geolocation service: ' + error.message);
                    observer.error(error);
                }
            );
        });
    }

    public doReverseLookup(lat: any, lon: any): Promise<string> {
        if (! (lat && lon)) {
            return Promise.reject('no coordinates - lat:' + lat + ' lon:' + lon);
        }

        return this.geoCoder.reverse(lat, lon).then(result => {
            return Promise.resolve(result);
        });
    }

    public initGeoCodeAutoCompleteField(selector: string): Observable<any> {
        const result = new Subject<any>();
        const inputEl = document.querySelector(selector);
        if (!inputEl || inputEl === undefined || inputEl === null) {
            return result;
        }

        this.geoCoder.autocomplete(inputEl);
        inputEl.removeEventListener('place_changed');
        inputEl.addEventListener('place_changed', (event: any) => {
            result.next(event);
        });

        return result;
    }
}
