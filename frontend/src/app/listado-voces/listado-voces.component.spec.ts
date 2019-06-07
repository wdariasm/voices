import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoVocesComponent } from './listado-voces.component';

describe('ListadoVocesComponent', () => {
  let component: ListadoVocesComponent;
  let fixture: ComponentFixture<ListadoVocesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoVocesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoVocesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
