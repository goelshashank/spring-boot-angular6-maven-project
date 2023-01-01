import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AuthComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AuthComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Angular10SocialLogin'`, () => {
    const fixture = TestBed.createComponent(AuthComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Angular10SocialLogin');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AuthComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('Angular10SocialLogin app is running!');
  });
});
