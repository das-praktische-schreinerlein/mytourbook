import {GenericSearchForm} from '../model/forms/generic-searchform';
import {HumanReadableFilter} from '../../angular-commons/services/searchform-utils.service';

export interface GenericSearchFormSearchFormConverter<F extends GenericSearchForm> {
    searchFormToUrl(baseUrl: string, searchForm: F): string;
    paramsToSearchForm(params: any, defaults: {}, searchForm: F): void;
    isValid(searchForm: F): boolean;
    newSearchForm(valzes: {}): F;
    searchFormToHumanReadableFilter(searchForm: F): HumanReadableFilter[];
    getHrdIds(): {};
}
