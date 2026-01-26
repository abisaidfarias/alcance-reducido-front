import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistribuidorSelectorComponent } from './distribuidor-selector.component';

describe('DistribuidorSelectorComponent', () => {
  let component: DistribuidorSelectorComponent;
  let fixture: ComponentFixture<DistribuidorSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistribuidorSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistribuidorSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
