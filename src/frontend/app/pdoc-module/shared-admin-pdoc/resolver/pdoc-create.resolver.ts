import {Injectable} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {CommonDocRecordCreateResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/cdoc-create.resolver';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {ResolvedData} from '@dps/mycms-frontend-commons/dist/angular-commons/resolver/resolver.utils';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';

@Injectable()
export class PDocRecordCreateResolver extends CommonDocRecordCreateResolver<PDocRecord, PDocSearchForm,
    PDocSearchResult, PDocDataService> {
    private myAppService: GenericAppService;
    constructor(appService: GenericAppService, dataService: PDocDataService) {
        super(appService, dataService);
        this.myAppService = appService;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<PDocRecord>> {
        const res = super.resolve(route, state);
            res.then(value => {
                if (value.data !== undefined) {
                    const name = value.data.name;
                    if (name !== undefined && name !== null ) {
                        value.data.name = StringUtils.doReplacements(name, this.getNameReplacements());
                    }
                }

                return value;
            });

        return res;
    }

    protected configureDefaultFieldToSet(type: string, fields: string[]): void {
        switch (type.toLowerCase()) {
            case 'page':
                fields.push('css', 'flags', 'langkeys', 'profiles', 'subtype', 'subSectionIds', 'theme');
                break;
        }
    }

    protected copyDefaultFields(type: string, pdoc: PDocRecord, values: {}): void {
        switch (type.toLowerCase()) {
            case 'page':
                if (values['keywords'] === undefined || values['keywords'] === null || values['keywords'] === '') {
                    values['keywords'] = 'KW_TODOKEYWORDS';
                }
        }

        switch (type.toLowerCase()) {
            case 'page':
                if (values['descTxt'] === undefined || values['descTxt'] === null || values['descTxt'] === '') {
                    values['descTxt'] = 'TODODESC';
                }
        }
    }

    protected setDefaultFields(type: string, values: {}): void {
    }

    protected getNameReplacements(): [RegExp, string][] {
        return this.getCommonReplacements('components.pdoc-create-resolver.nameReplacements');
    }

    protected getCommonReplacements(configKey: string): [RegExp, string][] {
        const config = this.myAppService.getAppConfig();
        const value = BeanUtils.getValue(config, configKey);

        return StringUtils.createReplacementsFromConfigArray(value);
    }
}
