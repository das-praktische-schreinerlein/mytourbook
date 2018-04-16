import {SDocVideoRecord} from './sdocvideo-record';

describe('SDocVideoRecord', () => {
    it('should create an instance', () => {
        expect(new SDocVideoRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const sdoc = new SDocVideoRecord({
            name: 'hello',
            fileName: 'video.mp4'
        });
        expect(sdoc.name).toEqual('hello');
        expect(sdoc.fileName).toEqual('video.mp4');
    });
});
