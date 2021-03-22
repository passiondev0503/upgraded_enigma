import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@upgraded-enigma/client-util';

import { AppHttpHandlersService } from '../../http-api/http-handlers.service';

@Injectable({
  providedIn: 'root',
})
export class AppServerStaticDataService {
  constructor(
    private readonly http: HttpClient,
    @Inject(WINDOW) private readonly window: Window,
    private readonly handlers: AppHttpHandlersService,
  ) {}

  /**
   * Service endpoints.
   */
  private readonly endpoints = {
    static: this.window.location.origin + '/api/diagnostics/static',
  };

  /**
   * Gets serverstatic diagnostic data.
   */
  public getData() {
    return this.handlers.pipeHttpResponse<Record<string, string | number>[]>(
      this.http.get<Record<string, string | number>[]>(this.endpoints.static),
    );
  }
}
