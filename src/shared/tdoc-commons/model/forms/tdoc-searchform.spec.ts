import {TourDocSearchForm} from './tdoc-searchform';

describe('TourDocSearchForm', () => {
    it('should create an instance', () => {
        expect(new TourDocSearchForm({})).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const tdoc = new TourDocSearchForm({
            fulltext: 'hello'
        });
        expect(tdoc.fulltext).toEqual('hello');
    });
});
