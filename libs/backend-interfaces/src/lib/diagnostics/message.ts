import { initializeClassProperties } from '../utils/class.util';

/**
 * Mostly used for diagnostics, e.g. for the ping endpoints.
 */
export class AppMessage {
  public message = '';

  constructor(input?: AppMessage) {
    initializeClassProperties<AppMessage>(this, input);
  }
}
