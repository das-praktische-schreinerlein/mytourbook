import {Injectable} from '@angular/core';
import {SuggesterService} from './suggester.service';
import {TourDocTripDescSuggesterService} from './tdoc-trip-desc-suggester.service';
import {TourDocLocationDescSuggesterService} from './tdoc-location-desc-suggester.service';
import {TourDocNewsDescSuggesterService} from './tdoc-news-desc-suggester.service';
import {CommonDocListSuggesterEnvironment} from './common-doc-list-suggester.service';
import {TourDocTrackDescSuggesterService} from './tdoc-track-desc-suggester.service';
import {TourDocRouteDescSuggesterService} from './tdoc-route-desc-suggester.service';

@Injectable()
export class TourDocDescSuggesterService implements SuggesterService {

    constructor(protected locationSuggesterService: TourDocLocationDescSuggesterService,
                protected newsSuggesterService: TourDocNewsDescSuggesterService,
                protected routeSuggesterService: TourDocRouteDescSuggesterService,
                protected trackSuggesterService: TourDocTrackDescSuggesterService,
                protected tripSuggesterService: TourDocTripDescSuggesterService) {
    }

    public suggest(form: {}, environment: CommonDocListSuggesterEnvironment): Promise<string> {
        const type = form['type'];
        if (type !== undefined) {
            switch (type) {
                case 'LOCATION':
                    return this.locationSuggesterService.suggest(form, environment);
                case 'NEWS':
                    return this.newsSuggesterService.suggest(form, environment);
                case 'ROUTE':
                    return this.routeSuggesterService.suggest(form, environment);
                case 'TRACK':
                    return this.trackSuggesterService.suggest(form, environment);
                case 'TRIP':
                    return this.tripSuggesterService.suggest(form, environment);
            }
        }

        const suggestion = 'TODODESC\n\n\n';
        return new Promise<string>((resolve) => {
            return resolve(suggestion);
        });
    }
}
