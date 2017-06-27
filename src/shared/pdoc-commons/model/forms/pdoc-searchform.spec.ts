import {PDocSearchForm} from './pdoc-searchform';

describe('PDocSearchForm', () => {
    it('should create an instance', () => {
        expect(new PDocSearchForm({})).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const pdoc = new PDocSearchForm({
            fulltext: 'hello'
        });
        expect(pdoc.fulltext).toEqual('hello');
    });
});
