import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { BackendAuthService } from './auth.service';
import { BackendUserService } from './user.service';

describe('BackendAuthService', () => {
  let service: BackendAuthService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'jwtsecret',
        }),
      ],
      providers: [BackendAuthService, BackendUserService],
    }).compile();

    service = app.get<BackendAuthService>(BackendAuthService);
  });

  describe('ping', () => {
    it('should return "Auth service is online. Public methods: login, logout, signup."', () => {
      expect(service.ping()).toEqual({
        message: 'Auth service is online. Public methods: login, logout, signup.',
      });
    });
  });
});
