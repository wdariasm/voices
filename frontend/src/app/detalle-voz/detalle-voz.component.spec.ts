import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleVozComponent } from './detalle-voz.component';

describe('DetalleVozComponent', () => {
  let component: DetalleVozComponent;
  let fixture: ComponentFixture<DetalleVozComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleVozComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleVozComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
