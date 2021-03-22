import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { AppClientMaterialModule } from '@upgraded-enigma/client-material';

import { AppWorkspaceWidgetComponent } from './workspace-widget.component';

describe('AppWorkspaceWidgetComponent', () => {
  let component: AppWorkspaceWidgetComponent;
  let fixture: ComponentFixture<AppWorkspaceWidgetComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        imports: [BrowserTestingModule, AppClientMaterialModule.forRoot()],
        declarations: [AppWorkspaceWidgetComponent],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(AppWorkspaceWidgetComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
