import { ComponentFixture, TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { AppSidebarState, chatbotActions, sidebarActions } from '@app/client-store';
import { getTestBedConfig, newTestBedMetadata } from '@app/client-unit-testing';
import { WINDOW } from '@app/client-util';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { AppToolbarComponent } from './toolbar.component';

describe('AppToolbarComponent', () => {
  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({
    imports: [NgxsModule.forFeature([AppSidebarState])],
    declarations: [AppToolbarComponent],
  });
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  let fixture: ComponentFixture<AppToolbarComponent>;
  let component: AppToolbarComponent;
  let store: Store;
  let storeSpy: {
    dispatch: jest.SpyInstance;
  };
  let win: Window;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppToolbarComponent);
        component = fixture.debugElement.componentInstance;

        store = TestBed.inject(Store);
        storeSpy = {
          dispatch: jest.spyOn(store, 'dispatch').mockImplementation((action: unknown) => of(null)),
        };

        win = TestBed.inject(WINDOW);

        fixture.detectChanges();
      });
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('toggleSidebar should call store dispatch', waitForAsync(() => {
    component.toggleSidebar();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(new sidebarActions.toggleSidebar());
  }));

  it('toggleMaterialTheme should emit an output event', () => {
    const outputSpy = jest.spyOn(component.darkThemeEnabled, 'emit');
    const event = true;
    component.toggleMaterialTheme(event);
    expect(outputSpy).toHaveBeenCalledWith(event);
  });

  it('toggleChatbot should call store dispatch', waitForAsync(() => {
    component.toggleChatbot();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(new chatbotActions.toggle());
  }));

  it('windowScrollHandler should set the fixedPosition value', () => {
    component.windowScrollHandler();
    const mod = 75;
    const expected = win.innerHeight + win.scrollY < win.document.body.offsetHeight - mod;
    expect(component.fixedPosition).toEqual(expected);
  });
});
