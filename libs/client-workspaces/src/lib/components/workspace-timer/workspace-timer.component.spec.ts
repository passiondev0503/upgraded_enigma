import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { AppClientMaterialModule } from '@app/client-material';

import { AppWorkspaceTimerComponent } from './workspace-timer.component';

describe('AppWorkspaceTimerComponent', () => {
  let component: AppWorkspaceTimerComponent;
  let fixture: ComponentFixture<AppWorkspaceTimerComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [BrowserTestingModule, AppClientMaterialModule.forRoot()],
      declarations: [AppWorkspaceTimerComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppWorkspaceTimerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
