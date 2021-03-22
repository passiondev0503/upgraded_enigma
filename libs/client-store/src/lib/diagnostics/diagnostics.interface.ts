import { StateToken } from '@ngxs/store';

export interface IDiagnosticsState {
  static: Record<string, string | number>[];
  dynamic: Record<string, string | number>[];
}

export const diagnosticsInitialState: IDiagnosticsState = {
  static: [],
  dynamic: [],
};

export const DIAGNOSTICS_STATE_TOKEN = new StateToken<IDiagnosticsState>('diagnostics');
