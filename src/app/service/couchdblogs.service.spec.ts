import { TestBed, inject } from '@angular/core/testing';

import { CouchdblogsService } from './couchdblogs.service';

describe('CouchdblogsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CouchdblogsService]
    });
  });

  it('should be created', inject([CouchdblogsService], (service: CouchdblogsService) => {
    expect(service).toBeTruthy();
  }));
});
