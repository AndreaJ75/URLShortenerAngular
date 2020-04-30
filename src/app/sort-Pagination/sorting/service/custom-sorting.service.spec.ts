import { TestBed } from '@angular/core/testing';

import { CustomSortingService } from './custom-sorting.service';

describe('CustomSortingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomSortingService = TestBed.get(CustomSortingService);
    expect(service).toBeTruthy();
  });
});
