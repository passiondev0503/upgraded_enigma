import { AppMessage, AppUserLoginCredentials, AppUserLogoutCredentials, IUser } from '@app/backend-interfaces';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AppAuthService } from '../service/auth.service';

@Controller()
export class AppAuthController {
  constructor(private readonly authService: AppAuthService) {}

  @Get('auth')
  public ping(): AppMessage {
    return this.authService.ping();
  }

  @Post('auth/login')
  public login(@Body() payload: AppUserLoginCredentials): Observable<IUser> {
    return this.authService.login(payload);
  }

  @Post('auth/logout')
  public logout(@Body() payload: AppUserLogoutCredentials): Observable<boolean> {
    return this.authService.logout(payload);
  }
}
