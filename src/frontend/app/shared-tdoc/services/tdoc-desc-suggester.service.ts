import {Injectable} from '@angular/core';
import {isArray} from 'util';
import {
    KeywordsState,
    StructuredKeywordState
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {SuggesterEnvironment, SuggesterService} from './suggester.service';

export interface TourDocDescSuggesterEnvironment extends SuggesterEnvironment {
}

@Injectable()
export class TourDocDescSuggesterService implements SuggesterService {

    constructor(protected searchFormUtils: SearchFormUtils) {
    }

    public suggest(form: {}, environment: TourDocDescSuggesterEnvironment): string {
        let suggestion = 'TODODESC';

        const type = form['type'];
        if (type !== undefined) {
            switch (type) {
                case 'NEWS':
                    suggestion += '<p><b>Moin Sonnens,</b></p>\n' +
                        '<p>und wie schon wieder neue Bilder...</p>\n' +
                        '<p>BlimBlamBlum</p>\n\n';

                    suggestion += '<p><b>Trips:</b></p>\n';
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
                        '</ul>\n\n';

                    suggestion += '<p>So, auf zum nächsten Schwung :-)</p>\n';
                    suggestion += '<p>Grüße an Alle und gehabt euch wohl<br />&nbsp<br/><b>Euer Micha</b></p>\n';

                    break;
            }
        }

        return suggestion;
    }

}
