import {IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {isArray} from 'util';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';

export class TourDocFileUtils {
    public static normalizeCygwinPath(path: string): string {
        if (!path) {
            return path;
        }

        path = path.replace(/^\/cygdrive\/([a-z])\//g, '$1:/');

        return path;
    }

    public static parseRecordSourceFromJson(json: string): any[] {
        let data = JSON.parse(json);
        const records = [];
        const idValidator = new IdValidationRule(true);
        const mapping = {
            // facets
            rate_pers_ausdauer_is: 'rate_pers_ausdauer_i',
            rate_pers_bildung_is: 'rate_pers_bildung_i',
            rate_pers_gesamt_is: 'rate_pers_gesamt_i',
            rate_pers_kraft_is: 'rate_pers_kraft_i',
            rate_pers_mental_is: 'rate_pers_mental_i',
            rate_pers_motive_is: 'rate_pers_motive_i',
            rate_pers_schwierigkeit_is: 'rate_pers_schwierigkeit_i',
            rate_pers_wichtigkeit_is: 'rate_pers_wichtigkeit_i',
            loc_lochirarchie_txt: 'loc_lochirarchie_s',
            track_id_is: 'track_id_i',
            route_id_is: 'route_id_i',
            loc_id_is: 'loc_id_i',
            trip_id_is: 'trip_id_i',
            news_id_is: 'news_id_i'
        };

        if (data.tdocs) {
            data = data.tdocs;
        }
        if (!isArray(data)) {
            throw new Error('no valid data to import: no array of tdocs');
        }
        data.forEach(record => {
            for (const fieldName in mapping) {
                record[fieldName] = record[mapping[fieldName]];
            }
            record['id'] = idValidator.sanitize(record['id'] + '');
            record['subtype_s'] = record['subtype_s'] ? record['subtype_s'].replace(/[-a-zA-Z_]+/g, '') : '';

            // clean keywords
            record['keywords_txt'] = (record['keywords_txt'] !== undefined ?
                record['keywords_txt'].replace(/^,/g, '').replace(/,$/g, '').replace(/,,/g, ',') : '');

            // calc facets
            record['data_tech_alt_asc_facet_is'] = Math.ceil(Number.parseFloat(record['data_tech_alt_asc_i']) / 500) * 500 + '';
            record['data_tech_alt_max_facet_is'] = Math.ceil(Number.parseFloat(record['data_tech_alt_max_i']) / 500) * 500 + '';
            record['data_tech_dist_facets_fs'] = Math.ceil(Number.parseFloat(record['data_tech_dist_f']) / 5) * 5 + '';
            record['data_tech_dur_facet_fs'] = Math.ceil(Number.parseFloat(record['data_tech_dur_f']) / 2) * 2 + '';

            for (const dateField of ['datestart_dt', 'dateend_dt', 'dateshow_dt']) {
                if (record[dateField] !== undefined && record[dateField] !== '') {
                    record[dateField] = DateUtils.parseDateStringWithLocaltime(record[dateField]);
                }
            }

            records.push(record);
        });

        return records;
    }
}
