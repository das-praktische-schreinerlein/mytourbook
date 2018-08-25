import {TourDocVideoRecord} from './tdocvideo-record';

describe('TourDocVideoRecord', () => {
    it('should create an instance', () => {
        expect(new TourDocVideoRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const tdoc = new TourDocVideoRecord({
            name: 'hello',
            fileName: 'video.mp4'
        });
        expect(tdoc.name).toEqual('hello');
        expect(tdoc.fileName).toEqual('video.mp4');
    });
});
