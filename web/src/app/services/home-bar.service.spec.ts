import { TestBed } from '@angular/core/testing';

import { HomeBarService } from './home-bar.service';

describe('HomeBarService', () => {
  let service: HomeBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
