import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {ToastsManager} from 'ng2-toastr';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {Layout} from '../../../shared-sdoc/components/sdoc-list/sdoc-list.component';
import {PDocDataService} from '../../../../shared/pdoc-commons/services/pdoc-data.service';

@Component({
    selector: 'app-sectionpage',
    templateUrl: './section-page.component.html',
    styleUrls: ['./section-page.component.css']
})
export class SectionPageComponent implements OnInit {
    pdoc: PDocRecord = new PDocRecord();
    baseSearchUrl = '';
    sections: PDocRecord[] = [];
    public Layout = Layout;

    constructor(private route: ActivatedRoute, private pdocDataService: PDocDataService,
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
                me.sections = me.pdoc !== undefined ? me.getSubSections(me.pdoc) : [];

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

    onShow(record: PDocRecord) {
        this.router.navigateByUrl('sections/' + record.id);
        return false;
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

    getSubSections(pdoc: PDocRecord): PDocRecord[] {
        const sections: PDocRecord[] = [];
        const ids = pdoc.subSectionIds !== undefined ? pdoc.subSectionIds.split(/,/) : [];
        for (let id of ids) {
            const section = this.pdocDataService.getByIdFromLocalStore(id);
            if (section !== undefined) {
                sections.push(section);
            } else {
                console.error('getSubSections: section not found:' + id);
            }
        }

        return sections;
    }
}
