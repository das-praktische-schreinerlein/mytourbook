import {ExportProcessingResult} from '@dps/mycms-commons/dist/search-commons/services/cdoc-export.service';
import {CommonDocPdfResultListDecorator} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-pdf-resultlist-decorator';
import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocDataTechRecord} from '../shared/tdoc-commons/model/records/tdocdatatech-record';
import {TourDocRateTechRecord} from '../shared/tdoc-commons/model/records/tdocratetech-record';

export class TourDocPdfResultListDecorator extends CommonDocPdfResultListDecorator {

    public generatePdfResultListLstEntry(generateResult: ExportProcessingResult<TourDocRecord>): string {
        return super.generatePdfResultListLstEntry(generateResult)
            + '\t'
            + this.generatePdfResultListHtmlDetailListe(generateResult).replace('\t', ' ');
    }

    public generatePdfResultListHtmlEntry(generateResult: ExportProcessingResult<TourDocRecord>): string {
        return super.generatePdfResultListHtmlEntry(generateResult) + this.generatePdfResultListHtmlDetailListe(generateResult);
    }

    protected generatePdfResultListHtmlDetailListe(generateResult: ExportProcessingResult<TourDocRecord>): string {
        const rtype = generateResult.record.type;
        let detailsRes = '';
        if (rtype.toLowerCase() === 'route') {
            const tdocdatatech: TourDocDataTechRecord = generateResult.record['tdocdatatech'];
            if (tdocdatatech !== undefined) {
                let details = '';
                if (tdocdatatech.dur > 0) {
                    details += `<div class="entry"><div class="label">&#x231A;:</div><div class="value">$tdocdatatech.dur h</div></div>`
                        .replace('$tdocdatatech.dur',
                            tdocdatatech.dur.toLocaleString('de-de', {minimumFractionDigits: 1, maximumFractionDigits: 1}));
                }
                if (tdocdatatech.dist > 0) {
                    details += `<div class="entry"><div class="label">&#x2194;:</div><div class="value">$tdocdatatech.dist km</div></div>`
                        .replace('$tdocdatatech.dist',
                            tdocdatatech.dist.toLocaleString('de-de', {minimumFractionDigits: 1, maximumFractionDigits: 1}));
                }
                if (tdocdatatech.altMax > 0) {
                    details += `<div class="entry"><div class="label">max:</div><div class="value">$tdocdatatech.altMax m</div></div>`
                        .replace('$tdocdatatech.altMax', tdocdatatech.altMax.toFixed(0));
                }
                if (tdocdatatech.altAsc > 0) {
                    details += `<div class="entry"><div class="label">&#x2197;:</div><div class="value">$tdocdatatech.altAsc Hm</div></div>`
                        .replace('$tdocdatatech.altAsc', tdocdatatech.altAsc.toFixed(0));
                }
                if (tdocdatatech.sections !== undefined && tdocdatatech.sections.length > 0) {
                    details += `<div class="entry"><div class="label">Etappen:</div><div class="value">$tdocdatatech.sections</div></div>`
                        .replace('$tdocdatatech.sections', tdocdatatech.sections + '');
                }

                if (details !== '') {
                    detailsRes += `<div class='bookmark_line bookmark_line_details bookmark_line_datatech'><div class='bookmark_details'><div class="techvaluetable techvaluetableflat datatechvaluetableflat">`;
                    detailsRes += details;
                    detailsRes += `</div></div></div>`;
                }
            }

            const tdocratetech: TourDocRateTechRecord = generateResult.record['tdocratetech'];
            if (tdocratetech !== undefined) {
                let details = '';
                /**
                 if (tdocratetech.overall !== undefined && tdocratetech.overall.length > 0) {
                 details += `<div class="entry"><div class="label">Overall:</div><div class="value">$tdocratetech.overall</div></div>`
                 .replace('tdocratetech.overall', tdocratetech.overall + '');
                 }
                 */
                if (tdocratetech.bergtour !== undefined && tdocratetech.bergtour.length > 0) {
                    details += `<div class="entry"><div class="label">Bergtour:</div><div class="value">$tdocratetech.bergtour</div></div>`
                        .replace('tdocratetech.bergtour', tdocratetech.bergtour + '');
                }
                if (tdocratetech.klettern !== undefined && tdocratetech.klettern.length > 0) {
                    details += `<div class="entry"><div class="label">Klettern:</div><div class="value">$tdocratetech.klettern</div></div>`
                        .replace('tdocratetech.klettern', tdocratetech.klettern + '');
                }
                if (tdocratetech.ks !== undefined && tdocratetech.ks.length > 0) {
                    details += `<div class="entry"><div class="label">Klettersteig:</div><div class="value">$tdocratetech.ks</div></div>`
                        .replace('tdocratetech.ks', tdocratetech.ks + '');
                }
                if (tdocratetech.gletscher !== undefined && tdocratetech.gletscher.length > 0) {
                    details += `<div class="entry"><div class="label">Gletscher:</div><div class="value">$tdocratetech.gletscher</div></div>`
                        .replace('tdocratetech.gletscher', tdocratetech.gletscher + '');
                }
                if (tdocratetech.firn !== undefined && tdocratetech.firn.length > 0) {
                    details += `<div class="entry"><div class="label">Firn:</div><div class="value">$tdocratetech.firn</div></div>`
                        .replace('tdocratetech.firn', tdocratetech.firn + '');
                }
                if (tdocratetech.schneeschuh !== undefined && tdocratetech.schneeschuh.length > 0) {
                    details += `<div class="entry"><div class="label">Schneeschuh:</div><div class="value">$tdocratetech.schneeschuh</div></div>`
                        .replace('tdocratetech.schneeschuh', tdocratetech.schneeschuh + '');
                }

                if (details !== '') {
                    detailsRes += `<div class='bookmark_line bookmark_line_details bookmark_line_ratetech'><div class='bookmark_details'><div class="techvaluetable techvaluetableflat datatechvaluetableflat">`;
                    detailsRes += details;
                    detailsRes += `</div></div></div>`;
                }
            }

        }

        return detailsRes;
    }
}
