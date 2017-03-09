import { TestBed, inject } from '@angular/core/testing';
import { ImageCropService } from './image-crop.service';

describe('ImageCropService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageCropService]
    });
  });

  it('should ...', inject([ImageCropService], (service: ImageCropService) => {
    expect(service).toBeTruthy();
  }));
});
