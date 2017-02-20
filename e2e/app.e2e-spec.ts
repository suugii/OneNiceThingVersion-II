import { NicethingV2Page } from './app.po';

describe('nicething-v2 App', () => {
  let page: NicethingV2Page;

  beforeEach(() => {
    page = new NicethingV2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
