import { AppMessage, AppUserLoginCredentials, AppUserLogoutCredentials, IUser } from '@app/backend-interfaces';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Observable } from 'rxjs';

import type { IAuthService } from '../../interfaces/auth.interface';
import { AUTH_SERVICE_TOKEN } from '../../services/auth/auth.service';

@Controller()
export class AppAuthController {
  constructor(@Inject(AUTH_SERVICE_TOKEN) private readonly authService: IAuthService) {}

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
