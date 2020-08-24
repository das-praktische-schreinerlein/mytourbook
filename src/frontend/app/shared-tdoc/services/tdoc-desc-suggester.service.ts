import {Injectable} from '@angular/core';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {SuggesterEnvironment, SuggesterService} from './suggester.service';
import {TourDocDataService} from '../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';

// tslint:disable-next-line:no-empty-interface
export interface TourDocDescSuggesterEnvironment extends SuggesterEnvironment {
}

@Injectable()
export class TourDocDescSuggesterService implements SuggesterService {

    constructor(protected searchFormUtils: SearchFormUtils, protected tourDocDataService: TourDocDataService) {
    }

    public suggest(form: {}, environment: TourDocDescSuggesterEnvironment): Promise<string> {
        const type = form['type'];
        if (type !== undefined) {
            switch (type) {
                case 'LOCATION':
                    return this.suggestLocation(form, environment);
                case 'NEWS':
                    return this.suggestNews(form, environment);
                case 'TRIP':
                    return this.suggestTrip(form, environment);
            }
        }

        const suggestion = 'TODODESC\n\n\n';
        return new Promise<string>((resolve) => {
            return resolve(suggestion);
        });
    }

    protected suggestNews(form: {}, environment: TourDocDescSuggesterEnvironment): Promise<string> {
        return new Promise<string>((resolve) => {
            let suggestion = 'TODODESC\n\n\n';
            let tracks: TourDocRecord[] = [];
            const tripTracks: TourDocRecord[] = [];
            let trips: TourDocRecord[] = [];

            const searchForm = this.tourDocDataService.newSearchForm({
                sort: 'dateAsc',
                perPage: 99
            });
            searchForm.type = 'TRACK';
            searchForm.moreFilter = 'news_id_is:' + (form['id'] ? form['id'].replace(/[-a-zA-Z_]+/g, '') : 999999999999999);

            return this.tourDocDataService.search(searchForm).then(searchResult => {
                if (searchResult && searchResult.recordCount > 0) {
                    tracks = searchResult.currentRecords;
                }

                searchForm.type = 'TRIP';
                return this.tourDocDataService.search(searchForm);
            }).then(searchResult => {
                if (searchResult && searchResult.recordCount > 0) {
                    trips = searchResult.currentRecords;
                }

                suggestion += this.generateNewsHeading(form, environment);
                if (trips.length > 0) {
                    suggestion += '<p><b>Trips:</b></p>\n';
                    suggestion += '<ul>\n' +
                        trips.map(trip => {
                            return '  <li><a href="sections/start/show/track/' + trip.id + '">' +
                                trip.name + '</a>\n' +
                                '  <ul>\n' +
                                tracks.map((track) => {
                                    if (track.tripId === trip.tripId) {
                                        tripTracks.push(track);
                                        return '    <li><a href="sections/start/show/track/' + track.id + '">' +
                                            track.name + '</a></li>\n';
                                    } else {
                                        return '';
                                    }
                                }).join('') +
                                '  </ul>\n' +
                                '</li>';
                        }).join('\n') +
                        '</ul>\n\n';
                }

                if (tracks.length > 0) {
                    suggestion += '<p><b>Tracks:</b></p>\n';
                    suggestion += '<ul>\n' +
                        tracks.map(track => {
                            if (tripTracks.includes(track)) {
                                return '';
                            }

                            return '  <li><a href="sections/start/show/track/' + track.id + '">' +
                                track.name + '</a></li>\n';
                        }).join('') +
                        '</ul>\n<br />\n\n';
                }

                suggestion += this.generateNewsFooter(form, environment);

                return resolve(suggestion);
            }).catch(reason => {
                console.error('cant suggest desc' , reason);
                suggestion += this.generateNewsHeading(form, environment);

                suggestion += '<ul>\n' +
                    '  <li><a href="sections/start/show/trip/TRIP_502">Dolomiten 2015</a>\n' +
                    '    <ul>\n' +
                    '      <li><a href="sections/start/show/track/TRACK_2623">Dolomiten 2015 Track1</a></li>\n' +
                    '      <li><a href="sections/start/show/track/TRACK_2623">Dolomiten 2015 Track2</a></li>\n' +
                    '      <li><a href="sections/start/show/track/TRACK_2623">Dolomiten 2015 Track3</a></li>\n' +
                    '    </ul>\n' +
                    '  </li>\n' +
                    '</ul>\n\n';

                suggestion += '<p><b>Tracks:</b></p>\n';
                suggestion += '<ul>\n' +
                    '  <li><a href="sections/start/show/track/TRACK_2623">Dolomiten 2015 Track1</a></li>\n' +
                    '  <li><a href="sections/start/show/track/TRACK_2623">Dolomiten 2015 Track2</a></li>\n' +
                    '  <li><a href="sections/start/show/track/TRACK_2623">Dolomiten 2015 Track3</a></li>\n' +
                    '</ul>\n<br />\n\n';

                suggestion += this.generateNewsFooter(form, environment);

                return resolve(suggestion);
            });
        });
    }

    protected suggestTrip(form: {}, environment: TourDocDescSuggesterEnvironment): Promise<string> {
        return new Promise<string>((resolve) => {
            let suggestion = 'TODODESC\n\n\n';
            let tracks: TourDocRecord[] = [];

            const searchForm = this.tourDocDataService.newSearchForm({
                sort: 'dateAsc',
                perPage: 99
            });
            searchForm.type = 'TRACK';
            searchForm.moreFilter = 'trip_id_is:' + (form['id'] ? form['id'].replace(/[-a-zA-Z_]+/g, '') : 999999999999999);

            return this.tourDocDataService.search(searchForm).then(searchResult => {
                if (searchResult && searchResult.recordCount > 0) {
                    tracks = searchResult.currentRecords;
                }

                suggestion += this.generateTripHeading(form, environment);

                if (tracks.length > 0) {
                    suggestion += '<ul>\n' +
                        tracks.map(track => {
                            return '  <li><a href="sections/start/show/track/' + track.id + '">' +
                                track.name + '</a></li>\n';
                        }).join('') +
                        '</ul>\n<br />\n\n';
                }

                suggestion += this.generateTripFooter(form, environment);

                return resolve(suggestion);
            }).catch(reason => {
                console.error('cant suggest desc' , reason);
                suggestion += this.generateTripHeading(form, environment);

                suggestion += '<ul>\n' +
                    '  <li><a href="sections/start/show/track/TRACK_2623">Dolomiten 2015 Track1</a></li>\n' +
                    '  <li><a href="sections/start/show/track/TRACK_2623">Dolomiten 2015 Track2</a></li>\n' +
                    '  <li><a href="sections/start/show/track/TRACK_2623">Dolomiten 2015 Track3</a></li>\n' +
                    '</ul>\n<br />\n\n';

                suggestion += this.generateTripFooter(form, environment);

                return resolve(suggestion);
            });
        });
    }

    protected suggestLocation(form: {}, environment: TourDocDescSuggesterEnvironment): Promise<string> {
        return new Promise<string>((resolve) => {
            let suggestion = 'TODODESC\n\n\n';
            let routes: TourDocRecord[] = [];

            const searchForm = this.tourDocDataService.newSearchForm({
                sort: 'ratePers',
                perPage: 10
            });
            searchForm.type = 'ROUTE';
            searchForm.where = '' + (form['id'] ? form['name'] : 'XXXXXXXX');

            return this.tourDocDataService.search(searchForm).then(searchResult => {
                if (searchResult && searchResult.recordCount > 0) {
                    routes = searchResult.currentRecords;
                }

                suggestion += this.generateLocationHeading(form, environment);

                if (routes.length > 0) {
                    suggestion += '<p><b>Routenempfehlungen:</b></p>\n';
                    suggestion += '<ul>\n' +
                        routes.map(route => {
                            return '  <li><a href="sections/start/show/route/' + route.id + '">' +
                                route.name + '</a></li>\n';
                        }).join('') +
                        '</ul>\n<br />\n\n';
                }

                suggestion += this.generateLocationFooter(form, environment);

                return resolve(suggestion);
            }).catch(reason => {
                console.error('cant suggest desc' , reason);
                suggestion += this.generateLocationHeading(form, environment);

                suggestion += '<p><b>Routen:</b></p>\n';
                suggestion += '<ul>\n' +
                    '  <li><a href="sections/start/show/track/TRACK_2623">Dolomiten 2015 Track1</a></li>\n' +
                    '  <li><a href="sections/start/show/track/TRACK_2623">Dolomiten 2015 Track2</a></li>\n' +
                    '  <li><a href="sections/start/show/track/TRACK_2623">Dolomiten 2015 Track3</a></li>\n' +
                    '</ul>\n<br />\n\n';

                suggestion += this.generateLocationFooter(form, environment);

                return resolve(suggestion);
            });
        });
    }

    protected generateNewsHeading(form: {}, environment: TourDocDescSuggesterEnvironment): string {
        return '<p><b>Moin Sonnens,</b></p>\n' +
            '<p>und wie schon wieder neue Bilder...</p>\n' +
            '<p>BlimBlamBlum</p>\n\n';
    }

    protected generateNewsFooter(form: {}, environment: TourDocDescSuggesterEnvironment): string {
        return '<p>So, auf zum nächsten Schwung :-)</p>\n' +
            '<p>Grüße an Alle und gehabt euch wohl<br />&nbsp<br/><b>Euer Micha</b></p>\n';
    }

    protected generateTripHeading(form: {}, environment: TourDocDescSuggesterEnvironment): string {
        return '<p><b>Was für ein Trip</b></p>\n\n';
    }

    protected generateTripFooter(form: {}, environment: TourDocDescSuggesterEnvironment): string {
        return '<p>Mehr dazu auf den nächsten Seiten</p>\n';
    }

    protected generateLocationHeading(form: {}, environment: TourDocDescSuggesterEnvironment): string {
        return '<p>' + form['name'] + ' als Teil der TODO_PARENTREGION liegt umgeben von TODO_NACHBARN.</p>\n\n' +
            '<p>Mit seinen wunderschönen Bergen, Wäldern, Seen, Museen lädt es geradezu für einen Besuch ein</p>\n\n';
    }

    protected generateLocationFooter(form: {}, environment: TourDocDescSuggesterEnvironment): string {
        return '<p>Aber am Besten ihr schaut selbst :-)</p>\n';
    }
}
