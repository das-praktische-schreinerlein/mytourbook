import {TourDocSearchForm} from '../shared/tdoc-commons/model/forms/tdoc-searchform';
import {
    IdCsvValidationRule,
    KeywordValidationRule,
    NumberValidationRule,
    SimpleFilePathValidationRule,
    SolrValidationRule,
    ValidationRule,
    WhiteListValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export class TourDocExportManagerUtils {
    public static createExportValidationRules(): {[key: string]: ValidationRule} {
        return {
            exportDir: new SimpleFilePathValidationRule(false),
            exportName: new SimpleFilePathValidationRule(false),
            ignoreErrors: new NumberValidationRule(false, 1, 999999999, 10),
            parallel: new NumberValidationRule(false, 1, 99, 10),
            force: new WhiteListValidationRule(false, [true, false, 'true', 'false'], false)
        };
    }

    public static createTourDocSearchFormValidationRules(): {[key: string]: ValidationRule} {
        return {
            pageNum: new NumberValidationRule(false, 1, 999999999, 1),
            actiontype: new IdCsvValidationRule(false),
            fulltext: new SolrValidationRule(false),
            persons: new KeywordValidationRule(false),
            where: new KeywordValidationRule(false),
            when: new KeywordValidationRule(false),
            playlists: new KeywordValidationRule(false),
            personalRateOverall: new KeywordValidationRule(false),
            rateMinFilter: new NumberValidationRule(false, 0, 15, undefined),
            showNonBlockedOnly: new WhiteListValidationRule(false, [
                'showall',
                'nonblocked_meonly',
                'nonblocked_innerfamily',
                'nonblocked_family',
                'nonblocked_friends',
                'nonblocked_nonpublic',
                'blocked_meonly',
                'blocked_innerfamily',
                'blocked_family',
                'blocked_friends',
                'blocked_nonpublic',
                'nonblocked_public',
                'nonblocked'], undefined)
        };
    }

    public static createTourDocSearchForm(type: string, argv: {}): Promise<TourDocSearchForm> {
        const pageNum = Number.parseInt(argv['pageNum'], 10);
        const actiontype = argv['actiontype'];
        const fulltext = argv['fulltext'];
        const persons = argv['persons'];
        const where = argv['where'];
        const when = argv['when'];
        const personalRateOverall = argv['personalRateOverall'];
        const playlists = argv['playlists'];

        const searchForm = new TourDocSearchForm({
            type: type,
            where: where,
            when: when,
            actiontype: actiontype,
            fulltext: fulltext,
            persons: persons,
            personalRateOverall: personalRateOverall,
            playlists: playlists,
            sort: 'dateAsc',
            pageNum: Number.isInteger(pageNum) ? pageNum : 1
        });

        const rateMinFilter = argv['rateMinFilter'];
        if (rateMinFilter !== undefined && Number.isInteger(rateMinFilter)) {
            const rateFilters = [];
            for (let i = Number.parseInt(rateMinFilter, 10); i >= 0 && i <= 15; i++) {
                rateFilters.push(i + '');
            }
            if (rateFilters.length > 0) {
                searchForm.personalRateOverall = rateFilters.join(',');
            }
        }

        const blockedFilters = argv['showNonBlockedOnly'] + '';
        if (blockedFilters !== undefined && blockedFilters.toLowerCase() !== 'showall') {
            let blockedValues: string[] = undefined;
            for (const blockedFilter of blockedFilters.split(',')) {
                switch (blockedFilter) {
                    case 'nonblocked_meonly':
                        blockedValues = ['null', '0',
                            '1', '2', '3', '4', '5',
                            '6', '7', '8', '9', '10',
                            '11', '12', '13', '14', '15',
                            '16', '17', '18', '19', '20',
                            '21', '22', '23', '24', '25'];
                        break;
                    case 'nonblocked_innerfamily':
                        blockedValues = ['null', '0',
                            '1', '2', '3', '4', '5',
                            '6', '7', '8', '9', '10',
                            '11', '12', '13', '14', '15',
                            '16', '17', '18', '19', '20'];
                        break;
                    case 'nonblocked_family':
                        blockedValues = ['null', '0',
                            '1', '2', '3', '4', '5',
                            '6', '7', '8', '9', '10',
                            '11', '12', '13', '14', '15'];
                        break;
                    case 'nonblocked_friends':
                        blockedValues = ['null', '0',
                            '1', '2', '3', '4', '5',
                            '6', '7', '8', '9', '10'];
                        break;
                    case 'nonblocked_nonpublic':
                        blockedValues = ['null', '0',
                            '1', '2', '3', '4', '5'];
                        break;
                    case 'blocked_meonly':
                        blockedValues.push('21', '22', '23', '24', '25');
                        break;
                    case 'blocked_innerfamily':
                        blockedValues.push('16', '17', '18', '19', '20');
                        break;
                    case 'blocked_family':
                        blockedValues.push('11', '12', '13', '14', '15');
                        break;
                    case 'blocked_friends':
                        blockedValues.push('6', '7', '8', '9', '10');
                        break;
                    case 'blocked_nonpublic':
                        blockedValues.push('1', '2', '3', '4', '5');
                        break;
                    case 'nonblocked_public':
                    case 'nonblocked':
                        blockedValues = ['null', '0'];
                        break
                    default:
                        console.error(' invalid parameter - usage: --showNonBlockedOnly FILTER', argv);
                        return Promise.reject(' missing parameter - usage: --showNonBlockedOnly');
                }
            }

            if (blockedValues && blockedValues.length > 0) {
                searchForm.moreFilter = searchForm.moreFilter
                    ? searchForm.moreFilter + '_,_'
                    : '';
                searchForm.moreFilter = searchForm.moreFilter + 'blocked_i:' + blockedValues.join(',');
            }

        }
        return Promise.resolve(searchForm);
    }

}
