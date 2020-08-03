import {TourDocRouteRecord} from './tdocroute-record';

describe('TourDocRouteRecord', () => {
    it('should create an instance', () => {
        expect(new TourDocRouteRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const tdoc = new TourDocRouteRecord({
            name: 'hello',
            full: true
        });
        expect(tdoc.name).toEqual('hello');
        expect(tdoc.full).toEqual(true);

        const tdoc2 = new TourDocRouteRecord({
            name: 'hello',
            full: false
        });
        expect(tdoc2.name).toEqual('hello');
        expect(tdoc2.full).toEqual(false);
    });
});
