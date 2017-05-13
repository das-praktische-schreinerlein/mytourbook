import {Track} from './track';

describe('Track', () => {
  it('should create an instance', () => {
    expect(new Track()).toBeTruthy();
  });

  it('should accept values in the constructor', () => {
    const track = new Track({
      name: 'hello',
      type: 1
    });
    expect(track.name).toEqual('hello');
    expect(track.type).toEqual(1);
  });
});
