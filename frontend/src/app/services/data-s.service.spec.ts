import { TestBed } from '@angular/core/testing';

import { DataSService } from './data-s.service';

describe('DataSService', () => {
  let service: DataSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
