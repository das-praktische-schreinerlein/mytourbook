import {Record} from 'js-data';

export class BaseEntityRecord extends Record {
    id: string;

    toString(useWrapper, includeId) {
        useWrapper = typeof useWrapper === 'boolean' ? useWrapper : true;
        includeId = typeof includeId === 'boolean' ? includeId : true;
        return (useWrapper ? '{\n' : '') +
            (includeId ? 'id: ' + this.id + ',\n' : '') +
            (useWrapper ? '\n}' : '');
    }
}
