import {PDocRecord} from './pdoc-record';

describe('PDocRecord', () => {
    it('should create an instance', () => {
        expect(new PDocRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const pdoc = new PDocRecord({
            name: 'hello',
            type: 'PAGE'
        });
        expect(pdoc.name).toEqual('hello');
        expect(pdoc.type).toEqual('PAGE');
    });
});
