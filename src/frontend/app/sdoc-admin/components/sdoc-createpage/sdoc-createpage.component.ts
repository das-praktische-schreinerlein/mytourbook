import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ActivatedRoute} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {Layout} from '../../../shared-sdoc/components/sdoc-list/sdoc-list.component';
import {SDocContentUtils} from '../../../shared-sdoc/services/sdoc-contentutils.service';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {ResolvedData} from '../../../../shared/angular-commons/resolver/resolver.utils';
import {ErrorResolver} from '../../../sections/resolver/error.resolver';
import {SectionsPDocRecordResolver} from '../../../sections/resolver/sections-pdoc-details.resolver';
import {IdValidationRule, KeywordValidationRule} from '../../../../shared/search-commons/model/forms/generic-validator.util';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {CommonRoutingService, RoutingState} from '../../../../shared/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocRecordCreateResolver} from '../../../shared-sdoc/resolver/sdoc-create.resolver';
import {AppState} from '../../../../shared/commons/services/generic-app.service';

@Component({
    selector: 'app-sdoc-createpage',
    templateUrl: './sdoc-createpage.component.html',
    styleUrls: ['./sdoc-createpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocCreatepageComponent implements OnInit, OnDestroy {
    private config;
    idValidationRule = new IdValidationRule(true);
    keywordsValidationRule = new KeywordValidationRule(true);
    public contentUtils: SDocContentUtils;
    public record: SDocRecord;
    public Layout = Layout;
    pdoc: PDocRecord;
    baseSearchUrl: string;
    tracks: SDocRecord[] = [];

    constructor(private route: ActivatedRoute, private sdocRoutingService: SDocRoutingService,
                private toastr: ToastsManager, vcr: ViewContainerRef, contentUtils: SDocContentUtils,
                private errorResolver: ErrorResolver, private pageUtils: PageUtils, private commonRoutingService: CommonRoutingService,
                private angularMarkdownService: AngularMarkdownService, private angularHtmlService: AngularHtmlService,
                private cd: ChangeDetectorRef, private trackingProvider: GenericTrackingService, private appService: GenericAppService,
                private platformService: PlatformService, private sdocDataService: SDocDataService) {
        this.contentUtils = contentUtils;
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                this.config = this.appService.getAppConfig();
                if (!(this.config && this.config['permissions'] && this.config['permissions']['sdocWritable'] === true)) {
                    console.warn('sdoc not writable');
                    this.record = undefined;
                    this.pdoc = undefined;
                    this.tracks = [];

                    this.errorResolver.redirectAfterRouterError(ErrorResolver.ERROR_READONLY, undefined, this.toastr, undefined);
                    me.cd.markForCheck();
                    return;
                }

                this.route.data.subscribe(
                (data: { record: ResolvedData<SDocRecord>, pdoc: ResolvedData<PDocRecord>, baseSearchUrl: ResolvedData<string> }) => {
                    me.commonRoutingService.setRoutingState(RoutingState.DONE);

                    const flgSDocError = ErrorResolver.isResolverError(data.record);
                    const flgPDocError = ErrorResolver.isResolverError(data.pdoc);
                    const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
                    if (!flgSDocError && !flgPDocError && !flgBaseSearchUrlError) {
                        me.record = data.record.data;
                        me.pdoc = (data.pdoc ? data.pdoc.data : undefined);
                        me.baseSearchUrl = data.baseSearchUrl.data;

                        if (me.record.gpsTrackBasefile || me.record.geoLoc !== undefined) {
                            me.tracks = [me.record];
                        } else {
                            me.tracks = [];
                        }

                        const recordName = me.keywordsValidationRule.sanitize(me.record.name);
                        if (me.pdoc) {
                            this.pageUtils.setTranslatedTitle('meta.title.prefix.sdocSectionShowPage',
                                {title: me.pdoc.heading, sdoc: recordName}, me.pdoc.heading + ' ' + recordName);
                            this.pageUtils.setTranslatedDescription('meta.desc.prefix.sdocSectionShowPage',
                                {title: me.pdoc.heading, teaser: me.pdoc.teaser, sdoc: recordName}, recordName);
                            this.pageUtils.setRobots(false, false);
                        } else {
                            me.pageUtils.setGlobalStyle('', 'sectionStyle');
                            this.pageUtils.setTranslatedTitle('meta.title.prefix.sdocShowPage',
                                {sdoc: recordName}, recordName);
                            this.pageUtils.setTranslatedDescription('meta.desc.prefix.sdocShowPage',
                                {sdoc: recordName}, recordName);
                            this.pageUtils.setRobots(false, false);
                        }
                        this.pageUtils.setMetaLanguage();

                        me.cd.markForCheck();

                        this.trackingProvider.trackPageView();
                        return;
                    }

                    let newUrl, msg, code;
                    let errorCode;
                    if (flgSDocError) {
                        errorCode = data.record.error.code;
                    } else {
                        errorCode = (flgPDocError ? data.pdoc.error.code : data.baseSearchUrl.error.code);
                    }
                    const sectionId = (flgPDocError ? data.pdoc.error.data : data.pdoc.data.id);
                    const sdocId = (flgSDocError ? data.record.error.data : data.record.data.id);
                    const sdocName = (flgSDocError ? 'name' : data.record.data.name);
                    switch (errorCode) {
                        case SectionsPDocRecordResolver.ERROR_INVALID_SECTION_ID:
                            code = ErrorResolver.ERROR_INVALID_ID;
                            if (sectionId && sectionId !== '') {
                                me.baseSearchUrl = ['sections', this.idValidationRule.sanitize(sectionId)].join('/');
                            } else {
                                me.baseSearchUrl = ['sdoc'].join('/');
                            }
                            newUrl = [me.baseSearchUrl,
                                'show',
                                this.idValidationRule.sanitize(sdocName),
                                this.idValidationRule.sanitize(sdocId)].join('/');
                            msg = undefined;
                            break;
                        case SectionsPDocRecordResolver.ERROR_UNKNOWN_SECTION_ID:
                            code = ErrorResolver.ERROR_UNKNOWN_ID;
                            me.baseSearchUrl = ['sdoc'].join('/');
                            newUrl = [me.baseSearchUrl,
                                'show',
                                this.idValidationRule.sanitize(sdocName),
                                this.idValidationRule.sanitize(sdocId)].join('/');
                            msg = undefined;
                            break;
                        case SDocRecordCreateResolver.ERROR_UNKNOWN_SDOC_TYPE:
                            code = ErrorResolver.ERROR_UNKNOWN_ID;
                            if (sectionId && sectionId !== '') {
                                me.baseSearchUrl = ['sections', this.idValidationRule.sanitize(sectionId)].join('/');
                            } else {
                                me.baseSearchUrl = ['sdoc'].join('/');
                            }
                            newUrl = [me.baseSearchUrl].join('/');
                            msg = undefined;
                            break;
                        case SectionsPDocRecordResolver.ERROR_READING_SECTION_ID:
                            code = ErrorResolver.ERROR_WHILE_READING;
                            me.baseSearchUrl = ['sdoc'].join('/');
                            newUrl = undefined;
                            msg = undefined;
                            break;
                        case GenericAppService.ERROR_APP_NOT_INITIALIZED:
                            code = ErrorResolver.ERROR_APP_NOT_INITIALIZED;
                            newUrl = undefined;
                            msg = undefined;
                            break;
                        default:
                            code = ErrorResolver.ERROR_OTHER;
                            me.baseSearchUrl = ['sdoc'].join('/');
                            newUrl = undefined;
                            msg = undefined;
                    }

                    this.errorResolver.redirectAfterRouterError(code, newUrl, this.toastr, msg);
                    me.cd.markForCheck();
                    return;
                });
            }
        });
    }

    ngOnDestroy() {
    }

    submitSave(values: {}) {
        const me = this;

        this.sdocDataService.add(values).then(function donCreated(sdoc: SDocRecord) {
                me.sdocRoutingService.navigateToShow(sdoc, '');
            },
            function errorCreate(reason: any) {
                console.error('create add failed:', reason);
                me.toastr.error('Es gibt leider Probleme bei der Speichern - am besten noch einmal probieren :-(', 'Oje!');
            }
        );
        return false;
    }

}