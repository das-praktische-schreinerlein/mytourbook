import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ActivatedRoute} from '@angular/router';
import {SDocSearchForm, SDocSearchFormFactory} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {Facets} from '../../../../shared/search-commons/model/container/facets';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {ResolvedData} from '../../../../shared/angular-commons/resolver/resolver.utils';
import {ErrorResolver} from '../../../sections/resolver/error.resolver';
import {IdCsvValidationRule, IdValidationRule} from '../../../../shared/search-commons/model/forms/generic-validator.util';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {CommonRoutingService, RoutingState} from '../../../../shared/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {SDocAlbumResolver} from '../../../shared-sdoc/resolver/sdoc-album.resolver';
import {Layout} from '../../../shared-sdoc/components/sdoc-list/sdoc-list.component';
import {FormBuilder} from '@angular/forms';
import {SDocAlbumService} from '../../../shared-sdoc/services/sdoc-album.service';
import {DateUtils} from '../../../../shared/commons/utils/date.utils';

@Component({
    selector: 'app-sdoc-albumpage',
    templateUrl: './sdoc-albumpage.component.html',
    styleUrls: ['./sdoc-albumpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocAlbumpageComponent implements OnInit, OnDestroy {
    private initialized = false;
    private idCsvValidationRule = new IdCsvValidationRule(true);

    showLoadingSpinner = false;
    idValidationRule = new IdValidationRule(true);

    searchResult: SDocSearchResult;
    listSearchResult: SDocSearchResult;
    record: SDocRecord;
    searchForm: SDocSearchForm;
    listSearchForm: SDocSearchForm;
    baseSearchUrl = '/sdoc/';
    mode = 'show';
    layout = Layout.FLAT;
    curRecordNr = 0;
    albumKey = 'Current';
    albumRunning = false;
    albumInterval = undefined;
    albumIntervalTimeout = 5;

    public editFormGroup = this.fb.group({
        albumSdocIds: ''
    });
    public albumFormGroup = this.fb.group({
        albumIntervalTimeout: [5]
    });

    constructor(private route: ActivatedRoute, private commonRoutingService: CommonRoutingService, private errorResolver: ErrorResolver,
                private sdocDataService: SDocDataService, private searchFormConverter: SDocSearchFormConverter,
                private sdocRoutingService: SDocRoutingService, private toastr: ToastsManager, vcr: ViewContainerRef,
                private pageUtils: PageUtils, private cd: ChangeDetectorRef, private trackingProvider: GenericTrackingService,
                public fb: FormBuilder, private sdocAlbumService: SDocAlbumService) {
        this.searchForm = new SDocSearchForm({});
        this.listSearchForm = new SDocSearchForm({});
        this.searchResult = new SDocSearchResult(this.searchForm, 0, [], new Facets());
        this.listSearchResult = new SDocSearchResult(this.listSearchForm, 0, [], new Facets());
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // reset initialized
        this.initialized = false;
        const me = this;

        this.route.data.subscribe(
            (data: { searchForm: ResolvedData<SDocSearchForm>, flgDoEdit: boolean, baseSearchUrl: ResolvedData<string> }) => {
                me.commonRoutingService.setRoutingState(RoutingState.DONE);

                const flgSearchFormError = ErrorResolver.isResolverError(data.searchForm);
                const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
                if (!flgSearchFormError && !flgBaseSearchUrlError) {
                    me.baseSearchUrl = (data.baseSearchUrl.data ? data.baseSearchUrl.data : me.baseSearchUrl);

                    if (data.flgDoEdit === true) {
                        me.mode = 'edit';
                    }

                    // console.log('route: search for ', data);
                    this.searchForm = SDocSearchFormFactory.cloneSanitized(data.searchForm.data);
                    this.listSearchForm = SDocSearchFormFactory.cloneSanitized(data.searchForm.data);

                    me.pageUtils.setGlobalStyle('', 'sectionStyle');
                    this.pageUtils.setTranslatedTitle('meta.title.prefix.sdocSearchPage',
                        {}, 'Search');
                    this.pageUtils.setTranslatedDescription('meta.desc.prefix.sdocSearchPage',
                        {}, 'Search');
                    this.pageUtils.setRobots(false, false);
                    this.pageUtils.setMetaLanguage();

                    this.trackingProvider.trackPageView();

                    this.pageUtils.setGlobalStyle('.hide-on-fullpage { display: none; } ' +
                        '.show-on-fullpage-block { display: block; } ' +
                        'body { background: #130b0b; } ' +
                        '.image-content-container {background: #130b0b !IMPORTANT; border: none !IMPORTANT;} ', 'fullPageStyle');

                    me.curRecordNr = this.listSearchForm.pageNum;
                    return this.doSearch();
                }

                let newUrl, msg, code;
                const errorCode = (flgSearchFormError ? data.searchForm.error.code : data.baseSearchUrl.error.code);
                let searchForm = undefined;
                if (flgSearchFormError) {
                    if (data.searchForm.error.data) {
                        searchForm = SDocSearchFormFactory.createSanitized(data.searchForm.error.data);
                    } else {
                        searchForm = new SDocSearchForm({});
                    }
                } else if (data.searchForm.data) {
                    searchForm = data.searchForm.data;
                }

                switch (errorCode) {
                    case SDocAlbumResolver.ERROR_INVALID_SDOC_SEARCHFORM:
                        code = ErrorResolver.ERROR_INVALID_DATA;
                        me.baseSearchUrl = ['sdoc'].join('/');
                        newUrl = this.searchFormConverter.searchFormToUrl(
                            this.baseSearchUrl + '/', SDocSearchFormFactory.cloneSanitized(searchForm));
                        msg = undefined;
                        break;
                    case GenericAppService.ERROR_APP_NOT_INITIALIZED:
                        code = ErrorResolver.ERROR_APP_NOT_INITIALIZED;
                        newUrl = undefined;
                        msg = undefined;
                        break;
                    default:
                        code = ErrorResolver.ERROR_OTHER;
                        me.baseSearchUrl = ['sdoc'].join('/') + '/';
                        newUrl = undefined;
                        msg = undefined;
                }

                this.errorResolver.redirectAfterRouterError(code, newUrl, this.toastr, msg);
                me.cd.markForCheck();
                return;
            }
        );
    }

    ngOnDestroy() {
    }

    onCurRecordChange(page: number) {
        if (page < 1) {
            page = 1;
        }
        if (page >= this.listSearchResult.recordCount) {
            page = 1;
        }
        this.curRecordNr = page;
        this.loadRecord(this.curRecordNr);
        this.cd.markForCheck();
        return false;
    }

    onShowSDoc(sdoc: SDocRecord) {
        this.sdocRoutingService.navigateToShow(sdoc, this.sdocRoutingService.getLastSearchUrl());
        return false;
    }

    onPageChange(page: number) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.listSearchForm.pageNum = +page;
        // console.log('onPageChange: redirect to page', page);
        this.loadListResult();
        this.cd.markForCheck();

        return false;
    }

    onPerPageChange(perPage: number) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.listSearchForm.perPage = perPage;
        // console.log('onPerPageChange: redirect to perPage', perPage);
        if (perPage + '' === '1') {
            this.doShow();
        }
        this.loadListResult();
        this.cd.markForCheck();

        return false;
    }

    onSortChange(sort: string) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.listSearchForm.sort = sort;
        // console.log('onSortChange: redirect to sort', sort);
        this.doSearch();

        return false;
    }

    onLayoutChange(layout: Layout) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.layout = layout;
        if (layout.toString() === Layout.PAGE.toString()) {
            this.doShow();
        } else if (this.listSearchForm.perPage === 1) {
            this.onPerPageChange(10);
        }

        this.loadListResult();
        this.cd.markForCheck();

        return false;
    }

    submitSave(event: Event): boolean {
        const ids = this.editFormGroup.getRawValue()['albumSdocIds'];
        if (this.idCsvValidationRule.isValid(ids)) {
            this.sdocAlbumService.removeSdocIds(this.albumKey);
            for (const id of ids.split(',')) {
                this.sdocAlbumService.addIdToAlbum(this.albumKey, id);
            }
            this.doShow();
        }

        return false;
    }

    doEdit(): boolean {
        this.commonRoutingService.navigateByUrl(['sdoc/album/edit', this.albumKey, this.listSearchForm.sort, 10,
            Math.round(this.curRecordNr / 10) || 1].join('/'));
        return false;
    }

    doShow(): boolean {
        this.commonRoutingService.navigateByUrl(['sdoc/album/show', this.albumKey, this.listSearchForm.sort, 1,
            this.listSearchForm.pageNum * this.listSearchForm.perPage].join('/'));
        return false;
    }

    onAlbumIntervalTimeoutChange(event: Event): boolean {
        const timeout = event.target['value'];
        if (timeout > 1) {
            this.albumIntervalTimeout = timeout;
            this.doRunAlbum(false);
            this.doRunAlbum(true);
        } else {
            console.warn('illegal Interval:' + timeout, event);
        }

        return false;
    }

    doRunAlbum(run: boolean): boolean {
        const me = this;
        if (run && !this.albumRunning && this.albumInterval === undefined) {
            this.albumInterval = setInterval(() => {
                me.onCurRecordChange(me.curRecordNr + 1);
                this.searchForm.pageNum = this.curRecordNr;
                this.listSearchForm.pageNum = this.curRecordNr;
            }, (me.albumIntervalTimeout ? me.albumIntervalTimeout : 999999) * 1000);
            me.listSearchForm.pageNum = me.curRecordNr;
            this.albumRunning = true;
        } else {
            if (this.albumInterval) {
                clearInterval(this.albumInterval);
            }
            this.albumInterval = undefined;
            this.albumRunning = false;
        }

        return false;
    }

    private doSearch() {
        this.sdocRoutingService.setLastBaseUrl(this.baseSearchUrl);
        this.sdocRoutingService.setLastSearchUrl(this.route.toString());

        const ids = this.searchForm.moreFilter.replace(/id:/g, '').split(',');
        this.editFormGroup = this.fb.group({
            albumSdocIds: [ids.join(',')]
        });

        const me = this;
        me.searchResult = new SDocSearchResult(me.searchForm, 0, [], undefined);
        me.listSearchResult = new SDocSearchResult(me.listSearchForm, 0, [], undefined);
        me.record = undefined;
        me.cd.markForCheck();
        if (ids.length <= 0 || ids[0] === '') {
            return;
        }

        me.showLoadingSpinner = true;
        const idTypeMap = {};
        for (const id of ids) {
            let [type] = id.split('_');
            type = type.toLowerCase();
            if (idTypeMap[type] === undefined) {
                idTypeMap[type] = { ids: [], records: {}};
            }
            idTypeMap[type]['ids'].push(id);
        }

        const promises: Promise<SDocSearchResult>[] = [];
        for (const type in idTypeMap) {
            for (let page = 1; page <= (idTypeMap[type]['ids'].length / 99) + 1; page ++) {
                const typeSearchForm = new SDocSearchForm({});
                typeSearchForm.moreFilter = 'id:' + idTypeMap[type]['ids'].join(',');
                typeSearchForm.type = type;
                typeSearchForm.perPage = 99;
                typeSearchForm.pageNum = page;
                typeSearchForm.sort = 'dateAsc';
                promises.push(this.sdocDataService.search(typeSearchForm, {
                    showFacets: false,
                    loadTrack: true,
                    showForm: false
                }));
            }
        }

        Promise.all(promises).then(function doneSearch(sdocSearchResults: SDocSearchResult[]) {
            const records: SDocRecord[] = [];
            sdocSearchResults.forEach(sdocSearchResult => {
                for (const sdoc of sdocSearchResult.currentRecords) {
                    let [type] = sdoc.id.split('_');
                    type = type.toLowerCase();
                    idTypeMap[type]['records'][sdoc.id] = sdoc;
                }
            });
            for (const id of ids) {
                let [type] = id.split('_');
                type = type.toLowerCase();
                if (idTypeMap[type]['records'][id] !== undefined) {
                    records.push(idTypeMap[type]['records'][id]);
                }
            }

            if (me.listSearchForm.sort === 'dateAsc') {
                records.sort((a, b) => {
                    const dateA = DateUtils.parseDate(a['dateshow']);
                    const dateB = DateUtils.parseDate(b['dateshow']);
                    const nameA = (dateA !== undefined ? dateA.getTime() : 0);
                    const nameB = (dateB !== undefined ? dateB.getTime() : 0);

                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    return 0;
                });
            }

            const sdocSearchResult = new SDocSearchResult(me.searchForm, records.length, records, undefined);
            me.initialized = true;
            me.searchResult = sdocSearchResult;
            me.loadListResult();
            me.loadRecord(me.curRecordNr);
            me.showLoadingSpinner = false;
            me.cd.markForCheck();
        }).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch failed:', reason);
            me.showLoadingSpinner = false;
            me.cd.markForCheck();
        });
    }

    private loadRecord(nr: number): void {
        this.curRecordNr = nr;
        if (this.searchResult !== undefined && this.searchResult.currentRecords.length >= nr) {
            this.record = this.searchResult.currentRecords[nr - 1];
        } else {
            this.record = undefined;
        }
    }

    private loadListResult(): void {
        const listRecords = [];
        for (let i = (this.listSearchForm.pageNum - 1) * this.listSearchForm.perPage;
             (i < this.listSearchForm.pageNum * this.listSearchForm.perPage &&
            i < this.searchResult.recordCount); i++) {
            listRecords.push(this.searchResult.currentRecords[i]);
        }
        const listSdocSearchResult = new SDocSearchResult(this.listSearchForm, this.searchResult.recordCount, listRecords, undefined);

        this.listSearchResult = listSdocSearchResult;
        this.curRecordNr = this.listSearchForm.pageNum;
    }
}
