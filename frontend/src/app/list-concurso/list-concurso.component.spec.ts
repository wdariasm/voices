import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConcursoComponent } from './list-concurso.component';

describe('ListConcursoComponent', () => {
  let component: ListConcursoComponent;
  let fixture: ComponentFixture<ListConcursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListConcursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConcursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
