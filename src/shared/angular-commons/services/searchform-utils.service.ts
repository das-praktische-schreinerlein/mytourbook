import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';

@Injectable()
export class SearchFormUtils {

    constructor(private translateService: TranslateService) {
    }

    public getIMultiSelectOptionsFromExtractedFacetValuesList(values: any[][], withCount: boolean,
                                                              removements: RegExp[], translate: boolean): IMultiSelectOption[] {
        if (values === undefined) {
            return [];
        }

        const me = this;
        return values.map(function (value) {
            let name: string = value[1];
            if (name && translate) {
                name = me.translateService.instant(name) || name;
            }
            if (name && removements && (Array.isArray(removements))) {
                for (const replacement of removements) {
                    name = name.replace(replacement, '');
                }
            }
            if (name && translate) {
                name = me.translateService.instant(name) || name;
            }
            let label = value[0] + name;
            if (label && translate) {
                label = me.translateService.instant(label) || label;
            }

            const result = {id: value[2] + value[1], name: label, count: value[3]};
            if (withCount && value[3] > 0) {
                result.name += ' (' + value[3] + ')';
            }
            return result;
        });
    }
}
