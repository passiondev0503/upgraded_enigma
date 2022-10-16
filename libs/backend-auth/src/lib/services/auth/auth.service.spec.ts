import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { authModuleProviders } from '../../backend-auth.module';
import { AppAuthService } from './auth.service';

describe('AppAuthService', () => {
  let service: AppAuthService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'jwtsecret',
        }),
      ],
      providers: [...authModuleProviders],
    }).compile();

    service = app.get<AppAuthService>(AppAuthService);
  });

  describe('ping', () => {
    it('should return "Auth service is online. Public methods: login, logout, signup."', () => {
      expect(service.ping()).toEqual({
        message: 'Auth service is online. Public methods: login, logout, signup.',
      });
    });
  });
});
