import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

import { diagnosticsActions } from './diagnostics.actions';
import { AppServerStaticDataService } from './services/server-static-data-api.service';

@Injectable({
  providedIn: 'root',
})
export class AppDiagnosticsEffects {
  public readonly staticData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(diagnosticsActions.staticData.type),
      mergeMap(() => this.api.staticData()),
      map(payload => diagnosticsActions.staticDataSuccess({ payload })),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly api: AppServerStaticDataService) {}
}
