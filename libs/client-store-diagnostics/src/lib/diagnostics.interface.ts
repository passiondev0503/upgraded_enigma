export type TDiagnosticsDataResponse = Record<string, string | number>[];

export interface IDiagnosticsStateModel {
  staticData: Record<string, string | number>[];
  dynamicData: Record<string, string | number>[];
}

export interface IDiagnosticsState {
  diagnostics: IDiagnosticsStateModel;
}

export const featureName: keyof IDiagnosticsState = 'diagnostics';
