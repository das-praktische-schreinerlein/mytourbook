import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PDocRecord} from '../../../shared/pdoc-commons/model/records/pdoc-record';
import {ToastsManager} from 'ng2-toastr';
import {PDocDataService} from '../../../shared/pdoc-commons/services/pdoc-data.service';
import {PageUtils} from '../../../shared/angular-commons/services/page.utils';
import {AppState, GenericAppService} from '../../../shared/commons/services/generic-app.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
    private config;
    sections: PDocRecord[];
    albumAllowed = false;
    public isExpanded = false;

    constructor(private route: ActivatedRoute, private toastr: ToastsManager, vcr: ViewContainerRef, private appService: GenericAppService,
                private pdocDataService: PDocDataService, private pageUtils: PageUtils, private cd: ChangeDetectorRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                this.config = this.appService.getAppConfig();
                if (this.config && this.config['sdocMaxItemsPerAlbum'] > 0) {
                    this.albumAllowed = true;
                    return;
                }

            }

            this.albumAllowed = false;
        });

        this.route.data.subscribe(
            (data: { pdocs: PDocRecord[] }) => {
                me.sections = [];
                this.pdocDataService.getById('menu', {forceLocalStore: true}).then(function onThemesFound(pdoc: PDocRecord) {
                    me.sections = me.getSubSections(pdoc);
                }).catch(function onNotFound(error) {
                    me.sections = [];
                    console.error('show getSection failed:', error);
                });
                me.cd.markForCheck();
            },
            (error: { reason: any }) => {
                me.sections = [];
                me.toastr.error('Es gibt leider Probleme beim Laden - am besten noch einmal probieren :-(', 'Oje!');
                console.error('show getSections failed:' + error.reason);
                me.cd.markForCheck();
            }
        );
    }

    getSubSections(pdoc: PDocRecord): PDocRecord[] {
        return this.pdocDataService.getSubDocuments(pdoc);
    }

    doEndFullPage() {
        this.pageUtils.setGlobalStyle('.show-on-fullpage-block { display: none; }', 'fullPageStyle');
    }
}
