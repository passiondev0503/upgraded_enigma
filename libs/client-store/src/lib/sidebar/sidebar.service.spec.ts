import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { getTestBedConfig, newTestBedMetadata } from '@upgraded-enigma/client-unit-testing';

import { AppSidebarModule } from './sidebar.module';
import { AppSidebarService } from './sidebar.service';

describe('AppSidebarService', () => {
  let service: AppSidebarService;

  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({
    imports: [AppSidebarModule],
  });
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule(testBedConfig)
        .compileComponents()
        .then(() => {
          service = TestBed.inject(AppSidebarService);
        });
    }),
  );

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
