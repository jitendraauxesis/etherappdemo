import { TestBed, inject } from '@angular/core/testing';

import { FileUtilService } from './file-util.service';

describe('FileUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileUtilService]
    });
  });

  it('should be created', inject([FileUtilService], (service: FileUtilService) => {
    expect(service).toBeTruthy();
  }));
});
