import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAtHandComponent } from './stock-at-hand.component';

describe('StockAtHandComponent', () => {
  let component: StockAtHandComponent;
  let fixture: ComponentFixture<StockAtHandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAtHandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockAtHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
