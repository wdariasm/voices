import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor.service';

describe('Auth.InterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthInterceptor = TestBed.get(AuthInterceptor);
    expect(service).toBeTruthy();
  });
});
