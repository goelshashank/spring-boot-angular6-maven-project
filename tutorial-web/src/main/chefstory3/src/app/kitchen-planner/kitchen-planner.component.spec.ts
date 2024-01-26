import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenPlannerComponent } from './kitchen-planner.component';

describe('KitchenPlannerComponent', () => {
  let component: KitchenPlannerComponent;
  let fixture: ComponentFixture<KitchenPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KitchenPlannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitchenPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
