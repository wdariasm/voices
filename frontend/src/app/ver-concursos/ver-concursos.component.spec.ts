import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerConcursosComponent } from './ver-concursos.component';

describe('VerConcursosComponent', () => {
  let component: VerConcursosComponent;
  let fixture: ComponentFixture<VerConcursosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerConcursosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerConcursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
