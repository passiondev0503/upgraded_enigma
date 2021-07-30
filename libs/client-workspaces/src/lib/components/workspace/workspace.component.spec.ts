import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppClientMaterialModule } from '@app/client-material';
import { AppTestingComponent } from '@app/client-unit-testing';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';

import { AppWorkspaceComponent } from './workspace.component';

describe('AppWorkspaceComponent', () => {
  let component: AppWorkspaceComponent;
  let fixture: ComponentFixture<AppWorkspaceComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        imports: [
          BrowserTestingModule,
          RouterTestingModule.withRoutes([
            {
              path: 'workspaces/item',
              component: AppTestingComponent,
            },
          ]),
          NgxsModule.forRoot([]),
          NgxsRouterPluginModule.forRoot(),
          AppClientMaterialModule.forRoot(),
        ],
        declarations: [AppWorkspaceComponent],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(AppWorkspaceComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
