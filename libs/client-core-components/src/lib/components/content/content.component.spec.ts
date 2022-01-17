import { ComponentFixture, TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { AppSidebarState, sidebarActions } from '@app/client-store';
import { getTestBedConfig, newTestBedMetadata } from '@app/client-unit-testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { AppContentComponent } from './content.component';

describe('AppContentComponent', () => {
  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({
    imports: [NgxsModule.forFeature([AppSidebarState])],
    declarations: [AppContentComponent],
  });
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  let fixture: ComponentFixture<AppContentComponent>;
  let component: AppContentComponent;
  let store: Store;
  let storeSpy: {
    dispatch: jest.SpyInstance;
  };

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule(testBedConfig)
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(AppContentComponent);
          component = fixture.debugElement.componentInstance;

          store = TestBed.inject(Store);
          storeSpy = {
            dispatch: jest.spyOn(store, 'dispatch').mockImplementation((action: unknown) => of(null)),
          };

          fixture.detectChanges();
        });
    }),
  );

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('sidebarCloseHandler should call store dispatch', () => {
    component.sidebarCloseHandler();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(new sidebarActions.closeSidebar());
  });

  it('sidebarOpenHandler should call store dispatch', () => {
    component.sidebarOpenHandler();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(new sidebarActions.openSidebar());
  });
});
