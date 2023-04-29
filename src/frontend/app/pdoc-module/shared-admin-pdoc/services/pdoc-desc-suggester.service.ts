import {Injectable} from '@angular/core';
import {SuggesterService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/suggester.service';
import {
    CommonDocListSuggesterEnvironment
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-list-suggester.service';
import {PDocPageDescSuggesterService} from './pdoc-page-desc-suggester.service';

@Injectable()
export class PDocDescSuggesterService implements SuggesterService {

    constructor(protected pageSuggesterService: PDocPageDescSuggesterService) {
    }

    public suggest(form: {}, environment: CommonDocListSuggesterEnvironment): Promise<string> {
        const type = form['type'];
        if (type !== undefined) {
            switch (type) {
                case 'PAGE':
                    return this.pageSuggesterService.suggest(form, environment);
            }
        }

        const suggestion = 'TODODESC\n\n\n';
        return new Promise<string>((resolve) => {
            return resolve(suggestion);
        });
    }
}
