import { Test } from '@nestjs/testing';
import { exec } from 'child_process';

import { AppDiagnosticsService, CHILD_PROCESS_EXEC } from './diagnostics.service';

describe('AppDiagnosticsService', () => {
  let service: AppDiagnosticsService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        AppDiagnosticsService,
        {
          provide: CHILD_PROCESS_EXEC,
          useValue: exec,
        },
      ],
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
