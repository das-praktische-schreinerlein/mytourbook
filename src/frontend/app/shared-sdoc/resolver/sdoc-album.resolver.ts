import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {IdValidationRule} from '../../../shared/search-commons/model/forms/generic-validator.util';
import {ResolvedData, ResolverError} from '../../../shared/angular-commons/resolver/resolver.utils';
import {LogUtils} from '../../../shared/commons/utils/log.utils';
import {SDocSearchForm, SDocSearchFormFactory} from '../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {IdCsvValidationRule} from '../../../shared/search-commons/model/forms/generic-validator.util';
import {SDocAlbumService} from '../services/sdoc-album.service';

@Injectable()
export class SDocAlbumResolver implements Resolve<ResolvedData<SDocSearchForm>> {
    static ERROR_INVALID_SDOC_SEARCHFORM = 'ERROR_INVALID_SDOC_SEARCHFORM';
    static ERROR_INVALID_SDOC_ID = 'ERROR_INVALID_SDOC_ID';
    idValidationRule = new IdValidationRule(true);
    idCsvValidationRule = new IdCsvValidationRule(false);

    constructor(private appService: GenericAppService, private sdocAlbumService: SDocAlbumService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<SDocSearchForm>> {
        const result: ResolvedData<SDocSearchForm> = {
            route: route,
            state: state
        };

        return new Promise<ResolvedData<SDocSearchForm>>((resolve) => {
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    const albumKey = route.params['album'];
                    if (!this.idValidationRule.isValid(albumKey)) {
                        console.warn('warning no id for album:', LogUtils.sanitizeLogMsg(albumKey));
                        result.error = new ResolverError(SDocAlbumResolver.ERROR_INVALID_SDOC_ID, albumKey, undefined);
                        return resolve(result);
                    }

                    let ids = this.sdocAlbumService.getDocIds(albumKey).join(',');
                    if (ids === undefined || ids.length === 0) {
                        ids = route.params['ids'] || '';
                    }

                    if (!this.idCsvValidationRule.isValid(ids)) {
                        console.warn('warning no ids for sdoc:', LogUtils.sanitizeLogMsg(ids));
                        result.error = new ResolverError(SDocAlbumResolver.ERROR_INVALID_SDOC_ID, ids, undefined);
                        return resolve(result);
                    }

                    const perPage = route.params['perPage'];
                    const pageNum = route.params['pageNum'];
                    const sort = route.params['sort'];

                    ids = this.idCsvValidationRule.sanitize(ids);
                    const searchForm = SDocSearchFormFactory.createSanitized( {
                        moreFilter: 'id:' + ids,
                        sort: sort,
                        perPage: perPage,
                        pageNum: pageNum});
                    result.data = searchForm;
                    return resolve(result);
                } else if (appState === AppState.Failed) {
                    result.error = new ResolverError(GenericAppService.ERROR_APP_NOT_INITIALIZED, undefined, undefined);
                    return resolve(result);
                }
            });
        });
    }
}
