import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { BackendAuthService } from '../service/auth.service';
import { BackendUserService } from '../service/user.service';
import { BackendUserController } from './user.controller';

describe('BackendUserController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'jwtsecret',
        }),
      ],
      controllers: [BackendUserController],
      providers: [BackendUserService, BackendAuthService],
    }).compile();
  });

  it('TODO', () => {
    const appController = app.get<BackendUserController>(BackendUserController);
    expect(appController).toBeDefined();
  });

  test.todo('BackendUserController');
});
