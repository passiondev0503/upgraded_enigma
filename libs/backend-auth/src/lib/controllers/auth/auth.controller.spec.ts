import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { authModuleProviders } from '../../backend-auth.module';
import { AppAuthController } from './auth.controller';

describe('AppAuthController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'jwtsecret',
        }),
      ],
      controllers: [AppAuthController],
      providers: [...authModuleProviders],
    }).compile();
  });

  describe('ping', () => {
    it('should return "Auth service is online. Public methods: login, logout, signup."', () => {
      const appController = app.get<AppAuthController>(AppAuthController);
      expect(appController.ping()).toEqual({
        message: 'Auth service is online. Public methods: login, logout, signup.',
      });
    });
  });
});
