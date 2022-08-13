import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppHttpHandlersService } from '@app/client-store-http-progress';

@Injectable({
  providedIn: 'root',
})
export class AppServerStaticDataService {
  constructor(private readonly http: HttpClient, private readonly handlers: AppHttpHandlersService) {}

  /**
   * Gets serverstatic diagnostic data.
   */
  public staticData() {
    const endpoint = this.handlers.getEndpoint('diagnostics/static');
    return this.handlers.pipeHttpResponse<Record<string, string | number>[]>(this.http.get<Record<string, string | number>[]>(endpoint));
  }
}
