import { TestBed, inject } from '@angular/core/testing';

import { PouchactivityService } from './pouchactivity.service';

describe('PouchactivityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PouchactivityService]
    });
  });

  it('should be created', inject([PouchactivityService], (service: PouchactivityService) => {
    expect(service).toBeTruthy();
  }));
});
