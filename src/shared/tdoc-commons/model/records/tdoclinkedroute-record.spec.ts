import {TourDocLinkedRouteRecord} from './tdoclinkedroute-record';

describe('TourDocLinkedRouteRecord', () => {
    it('should create an instance', () => {
        expect(new TourDocLinkedRouteRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const tdoc = new TourDocLinkedRouteRecord({
            name: 'hello',
            full: true
        });
        expect(tdoc.name).toEqual('hello');
        expect(tdoc.full).toEqual(true);

        const tdoc2 = new TourDocLinkedRouteRecord({
            name: 'hello',
            full: false
        });
        expect(tdoc2.name).toEqual('hello');
        expect(tdoc2.full).toEqual(false);
    });
});
