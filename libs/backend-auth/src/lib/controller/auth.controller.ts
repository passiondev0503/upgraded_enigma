import { IUser, Message, UserLoginCredentialsPayload, UserLogoutCredentialsPayload } from '@app/backend-interfaces';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';

import { BackendAuthService } from '../service/auth.service';

@Controller()
export class BackendAuthController {
  constructor(private readonly authService: BackendAuthService) {}

  @Get('auth')
  public ping(): Message {
    return this.authService.ping();
  }

  @Post('auth/login')
  public login(@Body() payload: UserLoginCredentialsPayload): Observable<IUser> {
    return this.authService.login(payload);
  }

  @Post('auth/logout')
  public logout(@Body() payload: UserLogoutCredentialsPayload): Observable<boolean> {
    return this.authService.logout(payload);
  }
}
