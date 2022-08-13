import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { IUserState, userActions, userSelectors } from '@app/client-store-user';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppUserProfileComponent {
  public user$ = this.store.select(userSelectors.userState);

  private readonly showModalSubject = new BehaviorSubject<boolean>(false);

  public readonly showModal$ = this.showModalSubject.asObservable();

  constructor(private readonly store: Store<IUserState>) {}

  @HostBinding('class.mat-body-1') protected matBody = true;

  /**
   * Generates private/public RSA keys for a user.
   */
  public generateKeypair(encryptionEnabled = true): void {
    if (!encryptionEnabled) {
      this.store.dispatch(userActions.generateKeypair());
      this.store.dispatch(userActions.getUser({ payload: { save: false } }));
    }
  }
}
