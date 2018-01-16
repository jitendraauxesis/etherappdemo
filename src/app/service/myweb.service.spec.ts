import { TestBed, inject } from '@angular/core/testing';

import { MywebService } from './myweb.service';

describe('MywebService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MywebService]
    });
  });

  it('should be created', inject([MywebService], (service: MywebService) => {
    expect(service).toBeTruthy();
  }));
});
