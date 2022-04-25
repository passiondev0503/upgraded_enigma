import { Test } from '@nestjs/testing';

import { AppDiagnosticsService } from './diagnostics.service';

describe('AppDiagnosticsService', () => {
  let service: AppDiagnosticsService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppDiagnosticsService],
    }).compile();

    service = app.get<AppDiagnosticsService>(AppDiagnosticsService);
  });

  describe('ping', () => {
    it('should return "Diagnostics service is online. Routes: diagnostics, diagnostics/static."', () => {
      expect(service.ping()).toEqual({
        message: 'Diagnostics service is online. Routes: diagnostics, diagnostics/static.',
      });
    });
  });
});
