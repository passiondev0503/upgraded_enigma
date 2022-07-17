import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { WINDOW, windowProvider } from '@app/client-util';

import { AppGlobalProgressBarComponent } from './global-progress-bar.component';

describe('AppGlobalProgressBarComponent', () => {
  let fixture: ComponentFixture<AppGlobalProgressBarComponent>;
  let component: AppGlobalProgressBarComponent;

  let win: Window;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule, NoopAnimationsModule, MatProgressBarModule],
      providers: [windowProvider],
      declarations: [AppGlobalProgressBarComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppGlobalProgressBarComponent);
        component = fixture.componentInstance;
        win = TestBed.inject(WINDOW);
        fixture.detectChanges();
      });
  }));

  it('should initialize correctly', () => {
    expect(component).toBeDefined();
    expect(component.progressBar instanceof MatProgressBar).toBeTruthy();
    if (typeof component.progressBar !== 'undefined') {
      expect((<HTMLElement>component.progressBar._elementRef.nativeElement).style.width).toEqual(`${win.document.body.clientWidth}px`);
    }
  });
});
