import { TestBed } from '@angular/core/testing';

import { GrabacionService } from './grabacion.service';

describe('LocutorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GrabacionService = TestBed.get(GrabacionService);
    expect(service).toBeTruthy();
  });
});
