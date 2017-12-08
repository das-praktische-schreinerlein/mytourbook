import { MyTourBookPage } from './app.po';

describe('image-import-editor-app App', function() {
  let page: MyTourBookPage;

  beforeEach(() => {
    page = new MyTourBookPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    // expect(page.getParagraphText()).toEqual('app works!');
  });
});
