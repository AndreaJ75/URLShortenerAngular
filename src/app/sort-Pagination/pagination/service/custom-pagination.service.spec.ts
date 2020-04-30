import { TestBed } from '@angular/core/testing';

import { CustomPaginationService } from './custom-pagination.service';

describe('CustomPaginationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomPaginationService = TestBed.get(CustomPaginationService);
    expect(service).toBeTruthy();
  });
});
