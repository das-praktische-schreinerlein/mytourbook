import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {ToastsManager} from 'ng2-toastr';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchFormConverter} from '../../../sdoc/services/sdoc-searchform-converter.service';
import {Layout} from '../../../shared-sdoc/components/sdoc-list/sdoc-list.component';

@Component({
    selector: 'app-sectionpage',
    templateUrl: './section-page.component.html',
    styleUrls: ['./section-page.component.css']
})
export class SectionPageComponent implements OnInit {
    pdoc: PDocRecord = new PDocRecord();
    baseSearchUrl = '';
    public Layout = Layout;

    constructor(private route: ActivatedRoute,
                private router: Router, private searchFormConverter: SDocSearchFormConverter,
                private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.route.data.subscribe(
            (data: { pdoc: PDocRecord, baseSearchUrl: string }) => {
                me.pdoc = data.pdoc;
                me.baseSearchUrl = data.baseSearchUrl;

            },
            (error: {reason: any}) => {
                me.toastr.error('Es gibt leider Probleme bei der Lesen - am besten noch einmal probieren :-(', 'Oops!');
                console.error('show getById failed:' + error.reason);
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
            filters['perPage'] = 3;
        }

        return filters;
    }

    getToSearchUrl() {
        return this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, new SDocSearchForm({theme: this.pdoc.theme}));
    }
    submitToSearch() {
        const url = this.getToSearchUrl();
        console.log('submitToSearch: redirect to ', url);

        this.router.navigateByUrl(url);
        return false;
    }
}
