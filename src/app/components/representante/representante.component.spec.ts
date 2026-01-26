import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentanteComponent } from './representante.component';

describe('RepresentanteComponent', () => {
  let component: RepresentanteComponent;
  let fixture: ComponentFixture<RepresentanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepresentanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepresentanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
