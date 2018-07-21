import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {ToastsManager} from 'ng2-toastr';
import {PDocDataService} from '../../../../shared/pdoc-commons/services/pdoc-data.service';
import {FormBuilder} from '@angular/forms';
import {ResolvedData} from '../../../../shared/angular-commons/resolver/resolver.utils';
import {ErrorResolver} from '../../../../shared/frontend-commons/resolver/error.resolver';
import {IdValidationRule} from '../../../../shared/search-commons/model/forms/generic-validator.util';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';

@Component({
    selector: 'app-sectionbar',
    templateUrl: './sectionbar.component.html',
    styleUrls: ['./sectionbar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionBarComponent implements OnInit {
    idValidationRule = new IdValidationRule(true);
    pdoc: PDocRecord;
    sections: PDocRecord[] = [];

    public themeFormGroup = this.fb.group({
        theme: undefined
    });

    constructor(public fb: FormBuilder, private route: ActivatedRoute, private pdocDataService: PDocDataService,
                private commonRoutingService: CommonRoutingService, private errorResolver: ErrorResolver, private toastr: ToastsManager,
                private router: Router, vcr: ViewContainerRef, private pageUtils: PageUtils, private cd: ChangeDetectorRef) {
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
                    me.cd.markForCheck();
                    return;
                }

                me.pdoc = data.pdoc.data;
                me.themeFormGroup.patchValue({'theme': me.pdoc.theme});

                me.pageUtils.setGlobalStyle(me.pdoc.css, 'sectionStyle');

                me.cd.markForCheck();
                this.pdocDataService.getById('menu', {forceLocalStore: true}).then(function onThemesFound(pdoc: PDocRecord) {
                        me.sections = me.getSubSections(pdoc);
                    me.cd.markForCheck();
                    }).catch(function onNotFound(error) {
                        me.sections = [];
                        me.cd.markForCheck();
                        console.error('show getSection failed:', error);
                    });
            }
        );
    }

    onThemeChange() {
        let url = this.router.url;
        const newUrl = '/sections/' + this.idValidationRule.sanitize(this.themeFormGroup.getRawValue()['theme']);
        url = url.replace('\/sections\/' + this.pdoc.id, newUrl);
        url = url.replace('\/pages\/' + this.pdoc.id, newUrl);
        this.commonRoutingService.navigateByUrl(url);
        return false;
    }

    getSubSections(pdoc: PDocRecord): PDocRecord[] {
        return this.pdocDataService.getSubDocuments(pdoc);
    }

}
