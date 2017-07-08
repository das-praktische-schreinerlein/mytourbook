import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {ToastsManager} from 'ng2-toastr';
import {PDocDataService} from '../../../../shared/pdoc-commons/services/pdoc-data.service';
import {FormBuilder} from '@angular/forms';
import {ResolvedData} from '../../../../shared/angular-commons/resolver/resolver.utils';
import {ErrorResolver} from '../../resolver/error.resolver';
import {IdValidationRule} from '../../../../shared/search-commons/model/forms/generic-validator.util';

@Component({
    selector: 'app-sectionbar',
    templateUrl: './sectionbar.component.html',
    styleUrls: ['./sectionbar.component.css']
})
export class SectionBarComponent implements OnInit {
    idValidationRule = new IdValidationRule(true);
    pdoc: PDocRecord;
    sections: PDocRecord[] = [];

    public themeFormGroup = this.fb.group({
        theme: undefined
    });

    constructor(public fb: FormBuilder, private route: ActivatedRoute, private pdocDataService: PDocDataService,
                private router: Router, private errorResolver: ErrorResolver, private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.route.data.subscribe(
            (data: { pdoc: ResolvedData<PDocRecord>}) => {
                if (ErrorResolver.isResolverError(data.pdoc)) {
                    // an error occured
                    me.pdoc = undefined;
                    me.themeFormGroup.patchValue({'theme': undefined});
                    me.sections = [];
                    return;
                }

                me.pdoc = data.pdoc.data;
                me.themeFormGroup.patchValue({'theme': me.pdoc.theme});
                this.pdocDataService.getById('sections', {forceLocalStore: true}).then(function onThemesFound(pdoc: PDocRecord) {
                        me.sections = me.getSubSections(pdoc);
                    }).catch(function onNotFound(error) {
                        console.error('show getSection failed:', error);
                    });
            }
        );
    }

    onThemeChange() {
        let url = this.router.url;
        url = url.replace('sections/' + this.pdoc.id,
            'sections/' + this.idValidationRule.sanitize(this.themeFormGroup.getRawValue()['theme']));
        this.router.navigateByUrl(url);
        return false;
    }

    getSubSections(pdoc: PDocRecord): PDocRecord[] {
        return this.pdocDataService.getSubDocuments(pdoc);
    }

}
