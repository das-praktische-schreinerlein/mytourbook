import {Injectable} from '@angular/core';
import {isArray} from 'util';
import {
    KeywordsState,
    StructuredKeywordState
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {SuggesterEnvironment, SuggesterService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/suggester.service';

export interface TourDocNameSuggesterEnvironment extends SuggesterEnvironment {
    optionsSelectSubTypeActiontype: IMultiSelectOption[]
    optionsSelectLocId: IMultiSelectOption[]
    personsFound: StructuredKeywordState[]
}

@Injectable()
export class TourDocNameSuggesterService implements SuggesterService {

    constructor(protected searchFormUtils: SearchFormUtils) {
    }

    public suggest(form: {}, environment: TourDocNameSuggesterEnvironment): Promise<string> {
        let suggestion = '';

        let actiontype = form['subtype'];
        if (actiontype !== undefined) {
            if (!isArray(actiontype)) {
                actiontype = [actiontype];
            }
            const selectedActionTypes = this.searchFormUtils.extractSelected(environment.optionsSelectSubTypeActiontype, actiontype);
            if (selectedActionTypes.length > 0) {
                suggestion += selectedActionTypes[0].name;
            }
        }
        if (environment.personsFound.length > 0) {
            const persons = [];
            environment.personsFound.forEach(personGroup => {
                personGroup.keywords.forEach(person => {
                    if (person.state === KeywordsState.SET) {
                        persons.push(person.keyword);
                    }
                });
            });

            suggestion += ' mit ' + persons.join(', ');
        }

        let locId = form['locId'];
        if (locId !== undefined) {
            if (!isArray(locId)) {
                locId = [locId];
            }
            const selectedLocIds = this.searchFormUtils.extractSelected(environment.optionsSelectLocId, locId);
            if (selectedLocIds.length > 0) {
                suggestion += ' bei ' + selectedLocIds[0].name.replace(/.* -> /g, '').replace(/ \(\d+\)/, '');
            }
        }

        if (form['datestart'] !== undefined && form['dateend'] !== undefined) {
            suggestion += ' ' + DateUtils.formatDateRange((new Date(form['datestart'])),
                (new Date(form['dateend'])));
        }

        return new Promise<string>(resolve => {
            resolve(suggestion);
        });
    }

}
