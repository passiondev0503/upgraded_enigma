import { Test, TestingModule } from '@nestjs/testing';

import { AppDiagnosticsService } from '../service/diagnostics.service';
import { AppDiagnosticsController } from './diagnostics.controller';

describe('AppDiagnosticsController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppDiagnosticsController],
      providers: [AppDiagnosticsService],
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
