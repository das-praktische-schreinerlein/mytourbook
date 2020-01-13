import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {KeywordValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {utils} from 'js-data';
import {CommonSqlKeywordAdapter} from './common-sql-keyword.adapter';

export interface KeywordActionTagForm extends ActionTagForm {
    payload: {
        keywordAction: 'set' | 'unset'
        keywords: string;
    };
}

export class CommonDocSqlActionTagKeywordAdapter {

    private keywordValidationRule = new KeywordValidationRule(true);
    private readonly commonSqlKeywordAdapter: CommonSqlKeywordAdapter;

    constructor(commonSqlKeywordAdapter: CommonSqlKeywordAdapter) {
        this.commonSqlKeywordAdapter = commonSqlKeywordAdapter;
    }

    public executeActionTagKeyword(table: string, id: number, actionTagForm: KeywordActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }

        const keywords = actionTagForm.payload.keywords;
        if (!this.keywordValidationRule.isValid(keywords)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' keywords not valid');
        }
        const keywordAction = actionTagForm.payload.keywordAction;
        if (keywordAction !== 'set' && keywordAction !== 'unset') {
            return utils.reject('actiontag ' + actionTagForm.key + ' keywordAction not valid');
        }

        if (keywordAction === 'set') {
            return this.commonSqlKeywordAdapter.setGenericKeywords(table, id, keywords, opts, false);
        } else {
            return this.commonSqlKeywordAdapter.unsetGenericKeywords(table, id, keywords, opts);
        }
    }

}
