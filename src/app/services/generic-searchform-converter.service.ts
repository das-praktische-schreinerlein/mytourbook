import {GenericSearchForm} from '../model/forms/generic-searchform';
export interface GenericSearchFormSearchFormConverter<F extends GenericSearchForm> {
    searchFormToUrl(baseUrl: string, searchForm: F): string;
    paramsToSearchForm(params: any, searchForm: F): void;
}
