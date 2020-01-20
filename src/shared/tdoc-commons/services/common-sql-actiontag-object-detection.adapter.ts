import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {KeywordValidationRule, NumberValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {utils} from 'js-data';
import {ObjectDetectionState} from '@dps/mycms-commons/dist/commons/model/objectdetection-model';
import {CommonSqlObjectDetectionAdapter} from './common-sql-object-detection.adapter';

export interface ObjectsActionTagForm extends ActionTagForm {
    payload: {
        detector: string;
        objectkey: string;
        precision: number;
        set: boolean;
    };
}

export interface ObjectsStateActionTagForm extends ActionTagForm {
    state: string;
}

export interface ObjectsKeyActionTagForm extends ActionTagForm {
    action: string;
    detector: string;
    objectcategory: string;
    objectkey: string;
    objectname: string;
    state: string;
}

export class CommonSqlActionTagObjectDetectionAdapter {

    private readonly keywordValidationRule = new KeywordValidationRule(true);
    private readonly precisionValidationRule = new NumberValidationRule(true, 0, 1, 1);
    private readonly commonSqlObjectDetectionAdapter: CommonSqlObjectDetectionAdapter;

    constructor(commonSqlObjectDetectionAdapter: CommonSqlObjectDetectionAdapter) {
        this.commonSqlObjectDetectionAdapter = commonSqlObjectDetectionAdapter;
    }

    public executeActionTagObjects(table: string, id: number, actionTagForm: ObjectsActionTagForm, opts: any): Promise<any> {
        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        const objectKey = actionTagForm.payload.objectkey;
        const precision = actionTagForm.payload.precision || 1;
        const detector = actionTagForm.payload.detector || 'playlist';

        if (!this.keywordValidationRule.isValid(objectKey)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' objectkey not valid');
        }
        if (!this.keywordValidationRule.isValid(detector)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' detector not valid');
        }
        if (!this.precisionValidationRule.isValid(precision)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' precision not valid');
        }

        return this.commonSqlObjectDetectionAdapter.setObjects(table, id, objectKey, precision, detector, actionTagForm.payload.set, opts);
    }

    public executeActionTagObjectsState(table: string, id: number, actionTagForm: ObjectsStateActionTagForm, opts: any): Promise<any> {
        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }

        const state = actionTagForm.payload.state;
        if (!this.keywordValidationRule.isValid(state)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' state not valid');
        }

        return this.commonSqlObjectDetectionAdapter.setObjectsState(table, id, state, opts);
    }

    public executeActionTagObjectsKey(table: string, id: number, actionTagForm: ObjectsKeyActionTagForm, opts: any): Promise<any> {
        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }

        const objectname = actionTagForm.payload.objectname;
        const objectcategory = actionTagForm.payload.objectcategory;
        const state = actionTagForm.payload.state;
        const action = actionTagForm.payload.action;
        const objectkey = actionTagForm.payload.objectkey;
        const detector = actionTagForm.payload.detector;
        if (!this.keywordValidationRule.isValid(detector)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' detector not valid');
        }
        if (!this.keywordValidationRule.isValid(objectkey)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' objectkey not valid');
        }
        if (!this.keywordValidationRule.isValid(action)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' action not valid');
        }
        if (!this.keywordValidationRule.isValid(state)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' state not valid');
        }
        if (state !== ObjectDetectionState.RUNNING_MANUAL_CORRECTED && state !== ObjectDetectionState.RUNNING_MANUAL_DETAILED) {
            return utils.reject('actiontag ' + actionTagForm.key + ' state not allowed');
        }

        if (action === 'changeObjectKeyForRecord') {
            // NOOP
        } else if (action === 'changeObjectLabelForObjectKey'
            || action === 'createNewObjectKeyAndObjectLabel'
            || action === 'createObjectLabelForObjectKey') {
            if (!this.keywordValidationRule.isValid(objectname)) {
                return utils.reject('actiontag ' + actionTagForm.key + ' objectname not valid');
            }
            // insert object_name if not exists
            if (action === 'createNewObjectKeyAndObjectLabel' || action === 'createObjectLabelForObjectKey') {
                if (!this.keywordValidationRule.isValid(objectcategory)) {
                    return utils.reject('actiontag ' + actionTagForm.key + ' objectcategory not valid');
                }
            }
        } else {
            return utils.reject('actiontag ' + actionTagForm.key + ' action unknown');
        }

        return this.commonSqlObjectDetectionAdapter.updateObjectsKey(table, id, detector, objectkey, objectname, objectcategory, action,
            state, opts);
    }

}
