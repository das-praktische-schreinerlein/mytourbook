import {Injectable} from '@angular/core';
import {TourDocDataService} from '../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {
    CommonDocListSuggesterConfiguration,
    CommonDocListSuggesterEnvironment,
    CommonDocListSuggesterService
} from './common-doc-list-suggester.service';
import {TourDocSearchForm} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

export interface TourDocNewsSuggesterConfiguration extends CommonDocListSuggesterConfiguration {
    tripListItemTemplate: string;
    tripTrackListItemTemplate: string;
}

@Injectable()
export class TourDocNewsDescSuggesterService extends CommonDocListSuggesterService<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {

    constructor(protected tourDocDataService: TourDocDataService, protected appService: GenericAppService) {
        super(tourDocDataService);
    }

    public suggest(form: {}, environment: CommonDocListSuggesterEnvironment): Promise<string> {
        return new Promise<string>((resolve) => {
            let suggestion = 'TODODESC\n\n\n';
            let tracks: TourDocRecord[] = [];
            const tripTracks: TourDocRecord[] = [];
            let trips: TourDocRecord[] = [];

            const searchForm = this.createListItemSearchForm(form, environment);
            this.appendFiltersToListItemSearchForm(searchForm, form, environment);
            searchForm.type = 'TRACK';

            return this.tourDocDataService.search(searchForm).then(searchResult => {
                if (searchResult && searchResult.recordCount > 0) {
                    tracks = searchResult.currentRecords;
                }

                searchForm.type = 'TRIP';
                return this.tourDocDataService.search(searchForm);
            }).then(searchResult => {
                if (searchResult && searchResult.recordCount > 0) {
                    trips = searchResult.currentRecords;
                }

                suggestion += this.generateHeading(form, environment);
                if (trips.length > 0) {
                    suggestion += '\n**Trips:**\n';
                    suggestion += trips.map(trip => {
                            return this.generateTripListItem(trip, form, environment) +
                                tracks.map((track) => {
                                    if (track.tripId === trip.tripId) {
                                        tripTracks.push(track);
                                        return this.generateTripTrackListItem(track, form, environment);
                                    } else {
                                        return '';
                                    }
                                }).join('');
                        }).join('') +
                        '\n';
                }

                if (tracks.length > 0) {
                    suggestion += '\n**Tracks:**\n';
                    suggestion += tracks.map(track => {
                            if (tripTracks.includes(track)) {
                                return '';
                            }

                            return this.generateListItem(track, form, environment);
                        }).join('') +
                        '\n';
                }

                suggestion += this.generateFooter(form, environment);

                return resolve(suggestion);
            }).catch(reason => {
                console.error('cant suggest desc' , reason);
                suggestion += this.generateHeading(form, environment);
                suggestion += this.generateListFallback(form, environment);
                suggestion += this.generateFooter(form, environment);

                return resolve(suggestion);
            });
        });
    }

    protected appendFiltersToListItemSearchForm(searchForm: TourDocSearchForm, form: {}, environment: CommonDocListSuggesterEnvironment) {
        searchForm.sort = 'dateAsc';
        searchForm.perPage = 99;
        searchForm.type = 'TRACK';
        searchForm.moreFilter = 'news_id_is:' + (form['id'] ? form['id'].replace(/[-a-zA-Z_]+/g, '') : 999999999999999);
    }

    protected getConfiguration(environment: CommonDocListSuggesterEnvironment): TourDocNewsSuggesterConfiguration {
        return BeanUtils.getValue(this.appService.getAppConfig(), 'components.tdoc-news-desc-suggester') || {
            nameReplacements: this.DEFAULT_NAME_REPLACEMENTS,
            listItemTemplate: '- [{{LISTITEM.name}}](sections/start/show/track/{{LISTITEM.id}})\n',
            listItemsFallbackTemplate: '',
            tripListItemTemplate: '- [{{LISTITEM.name}}](sections/start/show/trip/{{LISTITEM.id}})\n',
            tripTrackListItemTemplate: '  - [{{LISTITEM.name}}](sections/start/show/track/{{LISTITEM.id}})\n',
            footerTemplate: '\nSo, auf zum nächsten Schwung :-)\n\n' +
                'Grüße an Alle und gehabt euch wohl\n\n*Euer Micha*\n',
            headingTemplate: '**Moin Sonnens,**\n\n' +
                'und wie schon wieder neue Bilder...\n\n' +
                'BlimBlamBlum\n\n'
        };
    }

    protected generateTripListItem(item: TourDocRecord, form: {}, environment: CommonDocListSuggesterEnvironment): string {
        const template: string = this.getConfiguration(environment).tripListItemTemplate
            || '- [{{LISTITEM.name}}](sections/start/show/trip/{{LISTITEM.id}})\n';

        return this.doReplacements(
            template.replace('{{LISTITEM.id}}', item.id).replace('{{LISTITEM.name}}', item.name),
            form, environment);
    }

    protected generateTripTrackListItem(item: TourDocRecord, form: {}, environment: CommonDocListSuggesterEnvironment): string {
        const template: string = this.getConfiguration(environment).tripTrackListItemTemplate
            || '  - [{{LISTITEM.name}}](sections/start/show/track/{{LISTITEM.id}})\n';

        return this.doReplacements(
            template.replace('{{LISTITEM.id}}', item.id).replace('{{LISTITEM.name}}', item.name),
            form, environment);
    }
}
