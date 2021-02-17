import { TestBed } from '@angular/core/testing';

import { WebpathService } from './webpath.service';

describe('WebpathService', () => {
  let service: WebpathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebpathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
