import { Test, TestingModule } from '@nestjs/testing';

import { diagnosticsModuleProviders } from '../backend-diagnostics.module';
import { AppDiagnosticsController } from './diagnostics.controller';

describe('AppDiagnosticsController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppDiagnosticsController],
      providers: [...diagnosticsModuleProviders],
    }).compile();
  });

  describe('ping', () => {
    it('should return "Diagnostics service is online. Routes: diagnostics, diagnostics/static."', () => {
      const appController = app.get<AppDiagnosticsController>(AppDiagnosticsController);
      expect(appController.ping()).toEqual({
        message: 'Diagnostics service is online. Routes: diagnostics, diagnostics/static.',
      });
    });
  });
});
