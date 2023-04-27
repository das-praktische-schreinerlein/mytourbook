import {Injectable} from '@angular/core';
import {isArray} from 'util';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {SuggesterEnvironment, SuggesterService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/suggester.service';

export interface PDocNameSuggesterEnvironment extends SuggesterEnvironment {
    optionsSelectSubTypePageType: IMultiSelectOption[]
    optionsSelectPageId: IMultiSelectOption[]
}

@Injectable()
export class PDocNameSuggesterService implements SuggesterService {

    constructor(protected searchFormUtils: SearchFormUtils) {
    }

    public suggest(form: {}, environment: PDocNameSuggesterEnvironment): Promise<string> {
        let suggestion = '';

        let actiontype = form['subtype'];
        if (actiontype !== undefined) {
            if (!isArray(actiontype)) {
                actiontype = [actiontype];
            }
            const selectedActionTypes = this.searchFormUtils.extractSelected(environment.optionsSelectSubTypePageType, actiontype);
            if (selectedActionTypes.length > 0) {
                suggestion += selectedActionTypes[0].name;
            }
        }

        return new Promise<string>(resolve => {
            resolve(suggestion);
        });
    }

}
