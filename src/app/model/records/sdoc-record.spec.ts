import {SDocRecord} from './sdoc-record';

describe('SDocRecord', () => {
    it('should create an instance', () => {
        expect(new SDocRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const sdoc = new SDocRecord({
            name: 'hello',
            type: 1
        });
        expect(sdoc.name).toEqual('hello');
        expect(sdoc.type).toEqual(1);
    });
});
