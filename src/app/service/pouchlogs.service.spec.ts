import { TestBed, inject } from '@angular/core/testing';

import { PouchlogsService } from './pouchlogs.service';

describe('PouchlogsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PouchlogsService]
    });
  });

  it('should be created', inject([PouchlogsService], (service: PouchlogsService) => {
    expect(service).toBeTruthy();
  }));
});
