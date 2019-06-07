import { TestBed } from '@angular/core/testing';

import { ConcursoService } from './concurso.service';

describe('ConcursoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConcursoService = TestBed.get(ConcursoService);
    expect(service).toBeTruthy();
  });
});
