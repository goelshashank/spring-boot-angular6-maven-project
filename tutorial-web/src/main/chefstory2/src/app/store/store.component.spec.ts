import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreComponent } from './store.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        StoreComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(StoreComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'chefstory'`, () => {
    const fixture = TestBed.createComponent(StoreComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('chefstory');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(StoreComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('chefstory app is running!');
  });
});
