import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { AppUserState, userActions } from '@app/client-store';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppUserProfileComponent {
  public user$ = this.store.select(AppUserState.model).pipe(map(user => user));

  private readonly showModalSubject = new BehaviorSubject<boolean>(false);

  public readonly showModal$ = this.showModalSubject.asObservable();

  constructor(private readonly store: Store) {}

  @HostBinding('class.mat-body-1') protected matBody1 = true;

  /**
   * Gets user status.
   */
  private getUserStatus() {
    void this.store.dispatch(new userActions.getUser()).subscribe();
  }

  /**
   * Generates private/public RSA keys for a user.
   */
  public generateKeypair(encryptionEnabled = true): void {
    if (!encryptionEnabled) {
      void this.store
        .dispatch(new userActions.generateKeypair())
        .pipe(
          tap(() => {
            this.getUserStatus();
          }),
        )
        .subscribe();
    }
  }
}
