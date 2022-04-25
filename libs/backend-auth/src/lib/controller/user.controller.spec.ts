import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AppAuthService } from '../service/auth.service';
import { AppUserService } from '../service/user.service';
import { AppUserController } from './user.controller';

describe('AppUserController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'jwtsecret',
        }),
      ],
      controllers: [AppUserController],
      providers: [AppUserService, AppAuthService],
    }).compile();
  });

  it('TODO', () => {
    const appController = app.get<AppUserController>(AppUserController);
    expect(appController).toBeDefined();
  });

  test.todo('AppUserController');
});
