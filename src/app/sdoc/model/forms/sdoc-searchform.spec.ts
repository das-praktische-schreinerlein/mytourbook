import {SDocSearchForm} from './sdoc-searchform';

describe('SDocSearchForm', () => {
    it('should create an instance', () => {
        expect(new SDocSearchForm({})).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const sdoc = new SDocSearchForm({
            fulltext: 'hello'
        });
        expect(sdoc.fulltext).toEqual('hello');
    });
});
