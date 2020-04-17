import { TestBed } from '@angular/core/testing';

import { UrlManagementService } from './url-management.service';

describe('UrlCreationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UrlManagementService = TestBed.get(UrlManagementService);
    expect(service).toBeTruthy();
  });
});
