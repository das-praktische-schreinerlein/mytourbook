import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {ToastrService} from 'ngx-toastr';
import {StaticPagesDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/staticpages-data.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {AppState, GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {DataMode} from '../../../shared/tdoc-commons/model/datamode.enum';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
    private config;
    sections: PDocRecord[];
    availableDataModes: DataMode[] = [];
    pdocWritable = false;
    albumAllowed = false;
    public isExpanded = false;

    constructor(private route: ActivatedRoute, private toastr: ToastrService, private appService: GenericAppService,
                private pagesDataService: StaticPagesDataService, private pageUtils: PageUtils, private cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.appService.getAppState().subscribe(appState => {
            this.albumAllowed = false;
            this.pdocWritable = false;
            this.availableDataModes = [];

            if (appState === AppState.Ready) {
                this.config = this.appService.getAppConfig();
                if (this.config && this.config.availableDataModes && this.config.availableDataModes.length > 1) {
                    this.availableDataModes = this.config.availableDataModes;
                } else {
                    this.availableDataModes = [];
                }

                if (this.config && this.config['tdocMaxItemsPerAlbum'] > 0) {
                    this.albumAllowed = true;
                }

                if (environment.pdocWritable === true) {
                    this.pdocWritable = true;
                }

                me.cd.markForCheck();
            }
        });

        this.route.data.subscribe(
            (data: { pdocs: PDocRecord[] }) => {
                me.sections = [];
                this.pagesDataService.getById('menu', {forceLocalStore: true}).then(function onThemesFound(pdoc: PDocRecord) {
                    me.sections = me.getSubSections(pdoc);
                    me.cd.markForCheck();
                }).catch(function onNotFound(error) {
                    me.sections = [];
                    me.cd.markForCheck();
                    console.error('show getSection failed:', error);
                });
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
        return this.pagesDataService.getSubDocuments(pdoc);
    }

    doEndFullPage() {
        this.pageUtils.setGlobalStyle('.show-on-fullpage-block { display: none; }', 'fullPageStyle');
    }
}
