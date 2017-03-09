import { TestBed, inject } from '@angular/core/testing';
import { ImageResizeExactService } from './image-resize-exact.service';

describe('ImageResizeExactService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageResizeExactService]
    });
  });

  it('should ...', inject([ImageResizeExactService], (service: ImageResizeExactService) => {
    expect(service).toBeTruthy();
  }));
});
