import {SuggesterEnvironment, SuggesterService} from './suggester.service';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {CommonDocDataService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-data.service';
import {CommonDocSearchForm} from '@dps/mycms-commons/src/search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '@dps/mycms-commons/src/search-commons/model/container/cdoc-searchresult';
import {TourDocStringUtils} from './tdoc-string-utils';

// tslint:disable-next-line:no-empty-interface
export interface CommonDocListSuggesterEnvironment extends SuggesterEnvironment {
}

export interface CommonDocListSuggesterConfiguration {
    headingTemplate: string;
    footerTemplate: string;
    listItemTemplate: string;
    listItemsFallbackTemplate: string;
    nameReplacements?: [RegExp, string][];
}

export abstract class CommonDocListSuggesterService<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>> implements SuggesterService {

    protected DEFAULT_NAME_REPLACEMENTS: [RegExp, string][] = [
        [/ \d\d\.\d\d\.\d\d\d\d/, ''],
        [/mit .*? (durch |von |ab |bei |in |nach )+/, '$1']
    ];

    protected constructor(protected commonDocDataService: CommonDocDataService<R, F, S>) {
    }

    public suggest(form: {}, environment: CommonDocListSuggesterEnvironment): Promise<string> {
        return new Promise<string>((resolve) => {
            let suggestion = 'TODODESC\n\n\n';
            let listItems: R[] = [];
            const searchForm = this.createListItemSearchForm(form, environment);
            this.appendFiltersToListItemSearchForm(searchForm, form, environment);

            return this.commonDocDataService.search(searchForm, {
                showForm: false,
                loadTrack: false,
                showFacets: false
            }).then(searchResult => {
                if (searchResult && searchResult.recordCount > 0) {
                    listItems = searchResult.currentRecords;
                }

                suggestion += this.generateHeading(form, environment);

                if (listItems.length > 0) {
                    suggestion += '\n' +
                        listItems.map(listItem => {
                            return this.generateListItem(listItem, form, environment);
                        }).join('') +
                        '\n\n';
                }

                suggestion += this.generateFooter(form, environment);

                return resolve(suggestion);
            }).catch(reason => {
                console.error('cant suggest desc' , reason);
                suggestion += this.generateHeading(form, environment);

                suggestion += '\n' +
                    this.generateListFallback(form, environment) +
                    '\n\n';

                suggestion += this.generateFooter(form, environment);

                return resolve(suggestion);
            });
        });
    }

    protected abstract getConfiguration(environment: CommonDocListSuggesterEnvironment): CommonDocListSuggesterConfiguration;

    protected abstract appendFiltersToListItemSearchForm(searchForm: F, form: {}, environment: CommonDocListSuggesterEnvironment);

    protected generateHeading(form: {}, environment: CommonDocListSuggesterEnvironment): string {
        const template: string = this.getConfiguration(environment).headingTemplate
            || '**Was für ein Trip**\n\n';
        return this.doReplacements(template, form, environment);
    }

    protected generateFooter(form: {}, environment: CommonDocListSuggesterEnvironment): string {
        const template: string = this.getConfiguration(environment).footerTemplate
            || '\nMehr dazu auf den nächsten Seiten\n';
        return this.doReplacements(template, form, environment);
    }

    protected generateListFallback(form: {}, environment: CommonDocListSuggesterEnvironment): string {
        const template: string = this.getConfiguration(environment).listItemsFallbackTemplate
            || '- [Track1](sections/start/show/track/TRACK_1)\n' +
            '- [Track2](sections/start/show/track/TRACK_2)\n' +
            '- [Track3](sections/start/show/track/TRACK_3)\n';

        return this.doReplacements(template, form, environment);
    }

    protected generateListItem(item: R, form: {}, environment: CommonDocListSuggesterEnvironment): string {
        const template: string = this.getConfiguration(environment).listItemTemplate
            || '- [{{LISTITEM.name}}](sections/start/show/track/{{LISTITEM.id}})\n';

        return this.doReplacements(
            template.replace('{{LISTITEM.id}}', item.id).replace('{{LISTITEM.name}}', item.name),
            form, environment);
    }

    protected createListItemSearchForm(form: {}, environment: CommonDocListSuggesterEnvironment): F {
        return this.commonDocDataService.newSearchForm({
            sort: 'dateAsc',
            perPage: 99
        });
    }

    protected doReplacements(template: string, form: {}, environment: CommonDocListSuggesterEnvironment): string {
        return this.doNameReplacements(this.replaceDefaultPlaceholder(template, form, environment), form, environment);
    }

    protected replaceDefaultPlaceholder(template: string, form: {}, environment: CommonDocListSuggesterEnvironment): string {
        return template.replace('{{MAINITEM.id}}', form['id'])
            .replace('{{MAINITEM.name}}', form['name']);
    }


    protected getCommonReplacements(environment: CommonDocListSuggesterEnvironment): [RegExp, string][] {
        return TourDocStringUtils.createReplacementsFromConfigArray(this.getConfiguration(environment).nameReplacements);
    }

    protected doNameReplacements(template: string, form: {}, environment: CommonDocListSuggesterEnvironment): string {
        return TourDocStringUtils.doReplacements(template, this.getCommonReplacements(environment));
    }
}
