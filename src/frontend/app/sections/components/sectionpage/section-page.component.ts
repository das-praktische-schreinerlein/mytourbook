import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {ToastsManager} from 'ng2-toastr';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {Layout} from '../../../shared-sdoc/components/sdoc-list/sdoc-list.component';
import {PDocDataService} from '../../../../shared/pdoc-commons/services/pdoc-data.service';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {ResolvedData} from '../../../../shared/angular-commons/resolver/resolver.utils';
import {ErrorResolver} from '../../resolver/error.resolver';
import {SectionsPDocRecordResolver} from '../../resolver/sections-pdoc-details.resolver';
import {IdValidationRule} from '../../../../shared/search-commons/model/forms/generic-validator.util';
import {SDocSearchFormFactory} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';

@Component({
    selector: 'app-sectionpage',
    templateUrl: './section-page.component.html',
    styleUrls: ['./section-page.component.css']
})
export class SectionPageComponent implements OnInit {
    idValidationRule = new IdValidationRule(true);
    pdoc: PDocRecord = new PDocRecord();
    baseSearchUrl = '';
    sections: PDocRecord[] = [];
    public Layout = Layout;

    constructor(private route: ActivatedRoute, private pdocDataService: PDocDataService,
                private router: Router, private searchFormConverter: SDocSearchFormConverter,
                private errorResolver: ErrorResolver, private sDocRoutingService: SDocRoutingService,
                private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.route.data.subscribe(
            (data: { pdoc: ResolvedData<PDocRecord>, baseSearchUrl: ResolvedData<string> }) => {
                const flgPDocError = ErrorResolver.isResolverError(data.pdoc);
                const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
                if (!flgPDocError && !flgBaseSearchUrlError) {
                    me.pdoc = data.pdoc.data;
                    me.baseSearchUrl = data.baseSearchUrl.data;
                    me.sections =  me.getSubSections(me.pdoc);
                    me.sDocRoutingService.setLastBaseUrl(me.baseSearchUrl);
                    me.sDocRoutingService.setLastSearchUrl(me.getToSearchUrl());
                    return;
                }

                me.pdoc = undefined;
                let newUrl, msg, code;
                const errorCode = (flgPDocError ? data.pdoc.error.code : data.baseSearchUrl.error.code);
                const sectionId = (flgPDocError ? data.pdoc.error.data : data.baseSearchUrl.error.data);
                switch (errorCode) {
                    case SectionsPDocRecordResolver.ERROR_INVALID_SECTION_ID:
                        code = ErrorResolver.ERROR_INVALID_ID;
                        me.baseSearchUrl = ['sections', this.idValidationRule.sanitize(sectionId)].join('/');
                        newUrl = [me.baseSearchUrl].join('/');
                        msg = undefined;
                        break;
                    case SectionsPDocRecordResolver.ERROR_UNKNOWN_SECTION_ID:
                        code = ErrorResolver.ERROR_UNKNOWN_ID;
                        me.baseSearchUrl = ['sections', 'start'].join('/');
                        newUrl = [me.baseSearchUrl].join('/');
                        msg = undefined;
                        break;
                    case SectionsPDocRecordResolver.ERROR_READING_SECTION_ID:
                        code = ErrorResolver.ERROR_WHILE_READING;
                        me.baseSearchUrl = ['sections', 'start'].join('/');
                        newUrl = undefined;
                        msg = undefined;
                        break;
                    default:
                        code = ErrorResolver.ERROR_OTHER;
                        me.baseSearchUrl = ['sections', 'start'].join('/');
                        newUrl = undefined;
                        msg = undefined;
                }

                this.errorResolver.redirectAfterRouterError(code, newUrl, this.toastr, msg);
                return;
            }
        );
    }

    getFiltersForType(record: PDocRecord, type: string): any {
        const filters = {
            type: type
        };

        filters['theme'] = record.theme;
        if (type === 'IMAGE') {
            filters['perPage'] = 6;
        } else {
            filters['perPage'] = 5;
        }

        return filters;
    }

    onShow(record: PDocRecord) {
        this.router.navigateByUrl('sections/' + record.id);
        return false;
    }

    getToSearchUrl() {
        return this.searchFormConverter.searchFormToUrl(this.baseSearchUrl,
            SDocSearchFormFactory.createSanitized({theme: this.pdoc.theme}));
    }

    submitToSearch() {
        const url = this.getToSearchUrl();
        console.log('submitToSearch: redirect to ', url);

        this.router.navigateByUrl(url);
        return false;
    }

    getSubSections(pdoc: PDocRecord): PDocRecord[] {
        return this.pdocDataService.getSubDocuments(pdoc);
    }
}
