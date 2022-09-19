import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Meta, Title } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/client-material';
import { AppRouteSerializer } from '@app/client-util-ngrx';
import { NavigationActionTiming, routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { MarkdownModule, MarkdownModuleConfig, MarkedOptions } from 'ngx-markdown';
import { of, tap } from 'rxjs';

import { testingProviders } from '../../../testing/testing-providers.mock';
import { DOC_APP_ENV, IDocAppEnvironment } from '../../interfaces/environment.interface';
import { AppDocMarkdownReferenceComponent } from '../md-reference/md-reference.component';
import { AppDocMarkdownReferenceTreeComponent } from '../md-reference-tree/md-reference-tree.component';
import { AppDocRootComponent } from './root.component';

describe('AppDocRootComponent', () => {
  const markdownModuleConfig: MarkdownModuleConfig = {
    markedOptions: {
      provide: MarkedOptions,
      useValue: {
        gfm: true,
        breaks: false,
        pedantic: false,
        smartLists: true,
        smartypants: false,
      },
    },
  };

  const testBedConfig: TestModuleMetadata = {
    imports: [
      NoopAnimationsModule,
      HttpClientTestingModule,
      RouterTestingModule,
      AppMaterialModule.forRoot(),
      FlexLayoutModule,
      StoreModule.forRoot({ router: routerReducer }),
      MarkdownModule.forRoot(markdownModuleConfig),
      StoreRouterConnectingModule.forRoot({
        serializer: AppRouteSerializer,
        navigationActionTiming: NavigationActionTiming.PostActivation,
      }),
    ],
    declarations: [AppDocRootComponent, AppDocMarkdownReferenceTreeComponent, AppDocMarkdownReferenceComponent],
    providers: [...testingProviders],
  };

  let fixture: ComponentFixture<AppDocRootComponent>;
  let component: AppDocRootComponent;

  let setTitleSpy: jest.SpyInstance;
  let updateTagSpy: jest.SpyInstance;

  let title: Title;
  let meta: Meta;

  let env: IDocAppEnvironment;

  let bpObserver: BreakpointObserver;
  let bpObserverSpy: jest.SpyInstance;

  const configureEnvironment = async (bpState?: BreakpointState) => {
    await TestBed.configureTestingModule(testBedConfig).compileComponents();

    title = TestBed.inject(Title);
    meta = TestBed.inject(Meta);

    setTitleSpy = jest.spyOn(title, 'setTitle');
    updateTagSpy = jest.spyOn(meta, 'updateTag');

    bpObserver = TestBed.inject(BreakpointObserver);
    bpObserverSpy = jest.spyOn(bpObserver, 'observe');
    if (typeof bpState !== 'undefined') {
      bpObserverSpy.mockReturnValue(of(<BreakpointState>{ ...bpState }));
    }

    fixture = TestBed.createComponent(AppDocRootComponent);
    component = fixture.debugElement.componentInstance;

    env = TestBed.inject(DOC_APP_ENV);

    fixture.detectChanges();
  };

  it('should initialize correctly', async () => {
    await configureEnvironment();
    expect(component).toBeDefined();
    expect(setTitleSpy).toHaveBeenCalledWith(env.appName);
    expect(updateTagSpy).toHaveBeenCalledWith({ description: env.description });
  });

  describe('config$: sidebar closed', () => {
    it('extra small viewport: ', async () => {
      const breakpoints: BreakpointState['breakpoints'] = {};
      breakpoints[Breakpoints.XSmall] = true;
      breakpoints[Breakpoints.Small] = false;
      breakpoints[Breakpoints.Medium] = false;
      breakpoints[Breakpoints.Large] = false;
      breakpoints[Breakpoints.XLarge] = false;

      await configureEnvironment({ breakpoints, matches: true });

      void component.config$
        .pipe(
          tap(result => {
            expect(result.sidenavOpen).toBeFalsy();
          }),
        )
        .subscribe();
    });

    it('small viewport', async () => {
      const breakpoints: BreakpointState['breakpoints'] = {};
      breakpoints[Breakpoints.XSmall] = false;
      breakpoints[Breakpoints.Small] = true;
      breakpoints[Breakpoints.Medium] = false;
      breakpoints[Breakpoints.Large] = false;
      breakpoints[Breakpoints.XLarge] = false;

      await configureEnvironment({ breakpoints, matches: true });

      void component.config$
        .pipe(
          tap(result => {
            expect(result.sidenavOpen).toBeFalsy();
          }),
        )
        .subscribe();
    });
  });

  describe('config$: sidebar open', () => {
    it('medium viewport', async () => {
      const breakpoints: BreakpointState['breakpoints'] = {};
      breakpoints[Breakpoints.XSmall] = false;
      breakpoints[Breakpoints.Small] = false;
      breakpoints[Breakpoints.Medium] = true;
      breakpoints[Breakpoints.Large] = false;
      breakpoints[Breakpoints.XLarge] = false;

      await configureEnvironment({ breakpoints, matches: true });

      void component.config$
        .pipe(
          tap(result => {
            expect(result.sidenavOpen).toBeTruthy();
          }),
        )
        .subscribe();
    });

    it('large viewport', async () => {
      const breakpoints: BreakpointState['breakpoints'] = {};
      breakpoints[Breakpoints.XSmall] = false;
      breakpoints[Breakpoints.Small] = false;
      breakpoints[Breakpoints.Medium] = false;
      breakpoints[Breakpoints.Large] = true;
      breakpoints[Breakpoints.XLarge] = false;

      await configureEnvironment({ breakpoints, matches: true });

      void component.config$
        .pipe(
          tap(result => {
            expect(result.sidenavOpen).toBeTruthy();
          }),
        )
        .subscribe();
    });

    it('extra large viewport', async () => {
      const breakpoints: BreakpointState['breakpoints'] = {};
      breakpoints[Breakpoints.XSmall] = false;
      breakpoints[Breakpoints.Small] = false;
      breakpoints[Breakpoints.Medium] = false;
      breakpoints[Breakpoints.Large] = false;
      breakpoints[Breakpoints.XLarge] = true;

      await configureEnvironment({ breakpoints, matches: true });

      void component.config$
        .pipe(
          tap(result => {
            expect(result.sidenavOpen).toBeTruthy();
          }),
        )
        .subscribe();
    });
  });
});
