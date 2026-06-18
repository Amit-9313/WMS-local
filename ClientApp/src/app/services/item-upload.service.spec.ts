import { TestBed } from '@angular/core/testing';

import { ItemUploadService } from './item-upload.service';

describe('ItemUploadService', () => {
  let service: ItemUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
