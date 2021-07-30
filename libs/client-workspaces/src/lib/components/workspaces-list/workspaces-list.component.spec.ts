import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppClientMaterialModule } from '@app/client-material';
import { AppTestingComponent } from '@app/client-unit-testing';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';

import { AppWorkspaceWidgetComponent } from '../workspace-widget/workspace-widget.component';
import { AppWorkspacesListComponent } from './workspaces-list.component';

describe('AppWorkspacesListComponent', () => {
  let component: AppWorkspacesListComponent;
  let fixture: ComponentFixture<AppWorkspacesListComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        imports: [
          BrowserTestingModule,
          RouterTestingModule.withRoutes([
            {
              path: 'workspaces',
              component: AppTestingComponent,
            },
          ]),
          NgxsModule.forRoot([]),
          NgxsRouterPluginModule.forRoot(),
          AppClientMaterialModule.forRoot(),
        ],
        declarations: [AppWorkspacesListComponent, AppWorkspaceWidgetComponent],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(AppWorkspacesListComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
