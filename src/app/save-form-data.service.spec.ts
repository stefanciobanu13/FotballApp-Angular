import { TestBed } from '@angular/core/testing';

import { SaveFormDataService } from './save-form-data.service';

describe('SaveFormDataService', () => {
  let service: SaveFormDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveFormDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
