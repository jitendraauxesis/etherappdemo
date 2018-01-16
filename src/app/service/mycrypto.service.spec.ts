import { TestBed, inject } from '@angular/core/testing';

import { MycryptoService } from './mycrypto.service';

describe('MycryptoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MycryptoService]
    });
  });

  it('should be created', inject([MycryptoService], (service: MycryptoService) => {
    expect(service).toBeTruthy();
  }));
});
