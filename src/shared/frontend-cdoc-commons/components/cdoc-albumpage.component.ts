import {ChangeDetectorRef, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {FormBuilder} from '@angular/forms';
import {FileSystemFileEntry, UploadEvent} from 'ngx-file-drop';
import {IdCsvValidationRule, IdValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {CommonDocRecord} from '../../search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../../search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '../../search-commons/model/container/cdoc-searchresult';
import {CommonDocDataService} from '../../search-commons/services/cdoc-data.service';
import {Layout} from '../../angular-commons/services/layout.service';
import {CommonRoutingService, RoutingState} from '../../angular-commons/services/common-routing.service';
import {ErrorResolver} from '../resolver/error.resolver';
import {CommonDocRoutingService} from '../services/cdoc-routing.service';
import {GenericSearchFormSearchFormConverter} from '../../search-commons/services/generic-searchform.converter';
import {PageUtils} from '../../angular-commons/services/page.utils';
import {GenericTrackingService} from '../../angular-commons/services/generic-tracking.service';
import {CommonDocAlbumService} from '../services/cdoc-album.service';
import {AppState, GenericAppService} from '../../commons/services/generic-app.service';
import {Facets} from '../../search-commons/model/container/facets';
import {ResolvedData} from '../../angular-commons/resolver/resolver.utils';
import {AbstractCommonDocAlbumResolver} from '../resolver/abstract-cdoc-album.resolver';
import {BeanUtils} from '../../commons/utils/bean.utils';

export abstract class AbstractCDocAlbumpageComponent <R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> implements OnInit, OnDestroy {
    protected config;
    protected initialized = false;
    protected idCsvValidationRule = new IdCsvValidationRule(true);

    showLoadingSpinner = false;
    idValidationRule = new IdValidationRule(true);

    searchResult: S;
    listSearchResult: S;
    record: R;
    searchForm: F;
    listSearchForm: F;
    baseSearchUrl: string;
    baseSearchUrlDefault: string;
    baseAlbumUrl: string;
    mode = 'show';
    layout = Layout.FLAT;
    curRecordNr = 0;
    albumKey = 'Current';
    autoPlayAllowed = false;
    pauseAutoPlay = false;

    public editFormGroup = this.fb.group({
        albumIds: ''
    });

    constructor(protected route: ActivatedRoute, protected commonRoutingService: CommonRoutingService,
                protected errorResolver: ErrorResolver, protected cdocDataService: D,
                protected searchFormConverter: GenericSearchFormSearchFormConverter<F>,
                protected cdocRoutingService: CommonDocRoutingService, protected toastr: ToastsManager, vcr: ViewContainerRef,
                protected pageUtils: PageUtils, protected cd: ChangeDetectorRef, protected trackingProvider: GenericTrackingService,
                public fb: FormBuilder, protected cdocAlbumService: CommonDocAlbumService, protected appService: GenericAppService) {
        this.configureBaseSearchUrlDefault();
        this.configureBaseAlbumUrl();
        this.searchForm = cdocDataService.newSearchForm({});
        this.listSearchForm = cdocDataService.newSearchForm({});
        this.searchResult = cdocDataService.newSearchResult(this.searchForm, 0, [], new Facets());
        this.listSearchResult = cdocDataService.newSearchResult(this.listSearchForm, 0, [], new Facets());
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // reset initialized
        this.initialized = false;
        const me = this;

        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                this.config = this.appService.getAppConfig();
                if (!(this.getMaxAllowedItems(this.config) > 0)) {
                    console.warn('album not allowed');
                    this.record = undefined;
                    this.searchForm = undefined;
                    this.listSearchForm = undefined;

                    this.errorResolver.redirectAfterRouterError(ErrorResolver.ERROR_READONLY, undefined, this.toastr, undefined);
                    me.cd.markForCheck();
                    return;
                }

                me.configureComponent(this.config);

                this.route.data.subscribe(
                    (data: { searchForm: ResolvedData<F>, flgDoEdit: boolean, baseSearchUrl: ResolvedData<string> }) => {
                        me.commonRoutingService.setRoutingState(RoutingState.DONE);

                        me.configureProcessingOfResolvedData(this.config);
                        if (me.processError(data)) {
                            return;
                        }

                        me.baseSearchUrl = (data.baseSearchUrl.data ? data.baseSearchUrl.data : me.baseSearchUrl);

                        if (data.flgDoEdit === true) {
                            me.mode = 'edit';
                        }

                        // console.log('route: search for ', data);
                        this.searchForm = this.cdocDataService.cloneSanitizedSearchForm(data.searchForm.data);
                        this.listSearchForm = this.cdocDataService.cloneSanitizedSearchForm(data.searchForm.data);


                        me.setMetaTags();
                        this.trackingProvider.trackPageView();
                        me.setGlobalStyles();

                        me.curRecordNr = this.listSearchForm.pageNum;
                        return this.doSearch();
                    });
            }
        });
    }

    ngOnDestroy() {
    }

    onCurRecordChange(page: number) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        if (page < 1) {
            page = 1;
        }
        if (page > this.listSearchResult.recordCount) {
            page = 1;
        }
        this.curRecordNr = page;
        this.searchForm.pageNum = this.curRecordNr;
        this.listSearchForm.pageNum = this.curRecordNr;
        this.redictToSearch();

        return false;
    }

    onShowDoc(cdoc: R) {
        this.cdocRoutingService.navigateToShow(cdoc, this.cdocRoutingService.getLastSearchUrl());
        return false;
    }

    onPageChange(page: number) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.listSearchForm.pageNum = +page;
        this.loadListResult();
        this.cd.markForCheck();
        this.pageUtils.scrollToTop();

        return false;
    }

    onPerPageChange(perPage: number) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.listSearchForm.perPage = perPage;
        this.listSearchForm.pageNum = 1;
        if (perPage + '' === '1') {
            this.doShow();
        }
        this.loadListResult();
        this.cd.markForCheck();
        this.pageUtils.scrollToTop();

        return false;
    }

    onSortChange(sort: string) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.listSearchForm.sort = sort;
        this.listSearchForm.pageNum = 1;
        this.searchForm.sort = sort;
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
        this.pageUtils.scrollToTop();

        return false;
    }

    onPlayerStarted(cdoc: R) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.pauseAutoPlay = true;
    }

    onPlayerStopped(cdoc: R) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.pauseAutoPlay = false;
    }

    submitSave(event: Event): boolean {
        if (this.doSave() === true) {
            return this.doShow();
        }

        return false;
    }

    doEdit(): boolean {
        this.commonRoutingService.navigateByUrl([this.baseAlbumUrl + '/edit', this.albumKey, this.listSearchForm.sort, 10,
            Math.round(this.curRecordNr / 10) || 1].join('/'));
        return false;
    }

    doShow(): boolean {
        this.commonRoutingService.navigateByUrl([this.baseAlbumUrl + '/show', this.albumKey, this.listSearchForm.sort, 1,
            ((this.listSearchForm.pageNum - 1) * this.listSearchForm.perPage) + 1].join('/'));
        return false;
    }

    redictToSearch(): boolean {
        this.commonRoutingService.navigateByUrl([this.baseAlbumUrl + '/show', this.albumKey, this.listSearchForm.sort, 1,
            this.curRecordNr].join('/'));
        return false;
    }

    doSaveAsFile(): boolean {
        const albumEntry = { key: this.albumKey, ids: this.editFormGroup.getRawValue()['albumIds']};
        const blob = new Blob([JSON.stringify(albumEntry, null, 2)], {type : 'application/json'});
        const filename = this.albumKey + '.mytbalbum.json';
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            const e = document.createEvent('MouseEvents'),
                a = document.createElement('a');
            a.download = filename;
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            e.initEvent('click', true, false);
            a.dispatchEvent(e);
        }
        return true;
    }

    onFileSelected(event: any) {
        for (const file of event.srcElement.files) {
            this.processFile(file);
        }
    }

    onFileDropped(event: UploadEvent) {
        const me = this;
        for (const droppedFile of event.files) {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    me.processFile(file);
                });

                return;
            }
        }
    }

    onAlbumIntervalNext(): boolean {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        const me = this;
        if (me.pauseAutoPlay) {
            return false;
        }

        me.onCurRecordChange(me.curRecordNr + 1);
        this.redictToSearch();

        return false;
    }

    onAlbumIntervalStarted(): boolean {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        const me = this;
        me.listSearchForm.pageNum = me.curRecordNr;

        return false;
    }

    onAlbumReset(): boolean {
        this.editFormGroup.patchValue({albumIds:  ''});
        return this.doSave() && this.doShow();
    }

    protected abstract configureBaseSearchUrlDefault(): void;

    protected abstract configureBaseAlbumUrl();

    protected getMaxAllowedItems(config: {}): number {
       return -1;
    }

    protected configureComponent(config: {}): void {
        if (BeanUtils.getValue(config, 'permissions.allowAutoPlay') &&
            BeanUtils.getValue(config, 'components.cdoc-albumpage.allowAutoplay') + '' === 'true') {
            this.autoPlayAllowed = true;
        }
    }

    protected configureProcessingOfResolvedData(config: {}): void {
    }

    protected processError(data: { searchForm: ResolvedData<F>, flgDoEdit: boolean, baseSearchUrl: ResolvedData<string> }): boolean {
        const flgSearchFormError = ErrorResolver.isResolverError(data.searchForm);
        const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
        if (!flgSearchFormError && !flgBaseSearchUrlError) {
            return false;
        }

        let newUrl, msg, code;
        const errorCode = (flgSearchFormError ? data.searchForm.error.code : data.baseSearchUrl.error.code);
        let searchForm = undefined;
        if (flgSearchFormError) {
            if (data.searchForm.error.data) {
                searchForm = this.cdocDataService.createSanitizedSearchForm(data.searchForm.error.data);
            } else {
                searchForm = this.cdocDataService.newSearchForm({});
            }
        } else if (data.searchForm.data) {
            searchForm = data.searchForm.data;
        }

        switch (errorCode) {
            case AbstractCommonDocAlbumResolver.ERROR_INVALID_DOC_ID:
                code = ErrorResolver.ERROR_INVALID_DATA;
                this.baseSearchUrl = this.baseSearchUrlDefault;
                newUrl = this.searchFormConverter.searchFormToUrl(
                    this.baseSearchUrl + '/', this.cdocDataService.cloneSanitizedSearchForm(searchForm));
                msg = undefined;
                break;
            case GenericAppService.ERROR_APP_NOT_INITIALIZED:
                code = ErrorResolver.ERROR_APP_NOT_INITIALIZED;
                newUrl = undefined;
                msg = undefined;
                break;
            default:
                code = ErrorResolver.ERROR_OTHER;
                this.baseSearchUrl = this.baseSearchUrlDefault + '/';
                newUrl = undefined;
                msg = undefined;
        }

        this.errorResolver.redirectAfterRouterError(code, newUrl, this.toastr, msg);
        this.cd.markForCheck();
        return;
    }

    protected setMetaTags(): void {
        this.pageUtils.setTranslatedTitle('meta.title.prefix.cdocSearchPage',
            {}, 'Search');
        this.pageUtils.setTranslatedDescription('meta.desc.prefix.cdocSearchPage',
            {}, 'Search');
        this.pageUtils.setRobots(false, false);
        this.pageUtils.setMetaLanguage();
    }

    protected setGlobalStyles(): void {
        this.pageUtils.setGlobalStyle('', 'sectionStyle');
        this.pageUtils.setGlobalStyle('.hide-on-fullpage { display: none; } ' +
            '.show-on-fullpage-block { display: block; } ' +
            'body { background: #130b0b; } ' +
            '.image-content-container {background: #130b0b !IMPORTANT; border: none !IMPORTANT;} ', 'fullPageStyle');
    }

    protected processFile(file: File): boolean {
        const me = this;
        const reader = new FileReader();
        const maxLength = 10000000;
        if (file.size > maxLength) {
            me.toastr.warning('Die Album-Datei darf höchstes ' + maxLength / 1000000 + 'MB sein.', 'Oje!');
            return;
        }
        if (!file.name.toLowerCase().endsWith('.mytbalbum.json')) {
            me.toastr.warning('Es dürfen nur .mytbalbum.json Dateien geladen werden.', 'Oje!');
            return;
        }

        reader.onload = (function(theFile) {
            return function(e) {
                const src = e.target.result;
                const albumEntry = JSON.parse(src);
                me.editFormGroup.patchValue({albumIds:  albumEntry.ids || ''});
                return me.doSave() && me.doShow();
            };
        })(file);

        // Read in the file as a data URL.
        reader.readAsText(file);
    }

    protected doSave(): boolean {
        const ids = this.editFormGroup.getRawValue()['albumIds'];
        if (this.idCsvValidationRule.isValid(ids)) {
            this.cdocAlbumService.removeDocIds(this.albumKey);
            for (const id of ids.split(',')) {
                this.cdocAlbumService.addIdToAlbum(this.albumKey, id);
            }
            return true;
        } else {
            this.toastr.warning('Leider stimmt in der Liste was nicht. Hast du die Ids nur mit "," getrennt?', 'Oje!');
            return false;
        }
    }

    protected doSearch() {
        this.initialized = false;
        this.cdocRoutingService.setLastBaseUrl(this.baseSearchUrl);
        this.cdocRoutingService.setLastSearchUrl(this.route.toString());

        const ids = this.searchForm.moreFilter.replace(/id:/g, '').split(',');
        this.editFormGroup = this.fb.group({
            albumIds: [ids.join(',')]
        });

        const me = this;
        me.searchResult = this.cdocDataService.newSearchResult(me.searchForm, 0, [], undefined);
        me.listSearchResult = this.cdocDataService.newSearchResult(me.listSearchForm, 0, [], undefined);
        me.record = undefined;
        me.cd.markForCheck();
        if (ids.length <= 0 || ids[0] === '') {
            return;
        }

        me.showLoadingSpinner = true;
        me.cdocDataService.doMultiSearch(me.searchForm, ids).then(function doneSearch(cdocSearchResult: S) {
            me.initialized = true;
            me.searchResult = cdocSearchResult;
            me.loadListResult();
            me.loadRecord(me.curRecordNr);
            me.showLoadingSpinner = false;
            me.cd.markForCheck();
            me.pageUtils.scrollToTop();
        }).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch failed:', reason);
            me.showLoadingSpinner = false;
            me.cd.markForCheck();
        });
    }

    protected loadRecord(nr: number): void {
        this.curRecordNr = nr;
        this.pauseAutoPlay = false;
        if (this.searchResult !== undefined && this.searchResult.currentRecords.length >= nr) {
            this.record = this.searchResult.currentRecords[nr - 1];
        } else {
            this.record = undefined;
        }
    }

    protected loadListResult(): void {
        const listRecords = [];
        for (let i = (this.listSearchForm.pageNum - 1) * this.listSearchForm.perPage;
             (i < this.listSearchForm.pageNum * this.listSearchForm.perPage &&
                 i < this.searchResult.recordCount); i++) {
            listRecords.push(this.searchResult.currentRecords[i]);
        }
        const listCdocSearchResult = this.cdocDataService.newSearchResult(this.listSearchForm, this.searchResult.recordCount,
            listRecords, undefined);

        this.listSearchResult = listCdocSearchResult;
        this.curRecordNr = this.listSearchForm.pageNum;
    }
}
