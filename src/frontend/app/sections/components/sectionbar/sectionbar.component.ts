import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {PDocDataService} from '../../../../shared/pdoc-commons/services/pdoc-data.service';
import {FormBuilder} from '@angular/forms';

@Component({
    selector: 'app-sectionbar',
    templateUrl: './sectionbar.component.html',
    styleUrls: ['./sectionbar.component.css']
})
export class SectionBarComponent implements OnInit {
    pdoc: PDocRecord;
    sections: PDocRecord[] = [];

    public themeFormGroup = this.fb.group({
        theme: undefined
    });

    constructor(public fb: FormBuilder, private route: ActivatedRoute, private pdocDataService: PDocDataService,
                private router: Router, private searchFormConverter: SDocSearchFormConverter,
                private sDocRoutingService: SDocRoutingService, private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.route.data.subscribe(
            (data: { pdoc: PDocRecord }) => {
                me.pdoc = data.pdoc;
                if (me.pdoc !== undefined) {
                    me.themeFormGroup.patchValue({'theme': me.pdoc.theme});
                }
                this.pdocDataService.getById('sections', {forceLocalStore: true}).then(function onThemesFound(pdoc: PDocRecord) {
                        me.sections = me.getSubSections(pdoc);
                    }
                ).catch(function onNotFound(error) {
                        console.error('show getSection failed:', error);
                    }
                );
            },
            (error: {reason: any}) => {
                me.toastr.error('Es gibt leider Probleme bei der Lesen - am besten noch einmal probieren :-(', 'Oops!');
                console.error('show getById failed:' + error.reason);
            }
        );
    }

    onThemeChange() {
        let url = this.router.url;
        url = url.replace('sections/' + this.pdoc.id, 'sections/' + this.themeFormGroup.getRawValue()['theme']);
        this.router.navigateByUrl(url);
        return false;
    }

    getSubSections(pdoc: PDocRecord): PDocRecord[] {
        return this.pdocDataService.getSubDocuments(pdoc);
    }

}
