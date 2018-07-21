import {GenericSearchForm} from '../model/forms/generic-searchform';

export interface GenericSearchFormSearchFormConverter<F extends GenericSearchForm> {
    searchFormToUrl(baseUrl: string, searchForm: F): string;
    paramsToSearchForm(params: any, defaults: {}, searchForm: F): void;
    isValid(searchForm: F): boolean;
    newSearchForm(valzes: {}): F;
}
