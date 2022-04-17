import { initializeClassProperties } from '../utils/class.util';

/**
 * Mostly used for diagnostics, e.g. for the ping endpoints.
 */
export class Message {
  public message = '';

  constructor(input?: Message) {
    initializeClassProperties<Message>(this, input);
  }
}
