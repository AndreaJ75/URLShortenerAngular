import { TestBed } from '@angular/core/testing';

import { UrlCreationService } from './url-creation.service';

describe('UrlCreationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UrlCreationService = TestBed.get(UrlCreationService);
    expect(service).toBeTruthy();
  });
});
