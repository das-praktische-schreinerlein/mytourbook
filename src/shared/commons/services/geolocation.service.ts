import {GeoCoder} from 'geo-coder';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {utils} from 'js-data';

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
                    // console.log('Geolocation service: ' + error.message);
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

    public doLocationSearch(selector: string, value: string): Promise<any> {
        const inputEl = document.querySelector(selector);
        if (!inputEl || inputEl === undefined || inputEl === null) {
            return utils.reject('element not found');
        }
        const listEl = this.prepareResultList(inputEl);

        return this.doSearch(inputEl, listEl, value);
    }

    private prepareResultList(inputEl): any {
        let listEl: any;
        if (inputEl.nextSibling && inputEl.nextSibling.className === 'geocode-autocomplete') {
            listEl = inputEl.nextSibling;
        } else {
            listEl = document.createElement('ul');
            listEl.className = 'geocode-autocomplete';
            inputEl.parentNode.insertBefore(listEl, inputEl.nextSibling);
        }

        return listEl;
    }

    private doSearch(inputEl, listEl, value): Promise<any> {
        listEl.style.display = '';
        while (listEl.firstChild) {
            listEl.removeChild(listEl.firstChild);
        }

        const me = this;
        return new Promise<any>((resolve, reject) => {
            me.geoCoder.geocode(value).then((result: any) => {
                result.forEach(el => {
                    const liEl = document.createElement('li');
                    liEl.addEventListener('click', clickEvent => {
                        const customEvent = new CustomEvent('place_changed', {
                            detail: el,
                            bubbles: true,
                            cancelable: true
                        });

                        inputEl.value = el.formatted;
                        listEl.style.display = 'none';
                        resolve(customEvent);
                    });

                    liEl.innerHTML = el.formatted;
                    listEl.appendChild(liEl);
                });
            });
        });
    }
}
