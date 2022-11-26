import { ChangeDetectionStrategy, Component, HostBinding, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSelectionList } from '@angular/material/list';
import { IUserPassword, IUserState, userActions, userSelectors } from '@app/client-store-user';
import { Store } from '@ngrx/store';
import { TBarChartData } from '@rfprodz/client-d3-charts';
import { first, map, shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppUserDataComponent {
  constructor(private readonly fb: FormBuilder, private readonly store: Store<IUserState>) {
    this.getUser();
    this.getExportedPasswordsList();
  }

  @HostBinding('class.mat-body-1') protected matBody = true;

  /**
   * Currently logged in user object.
   */
  public readonly user$ = this.store.select(userSelectors.userState).pipe(shareReplay());

  /**
   * Currently logged in user object.
   */
  public readonly chartData$ = this.user$.pipe(
    map(model => {
      return (model.passwords ?? [])
        .map(item => ({
          name: item.name,
          date: new Date(item.timestamp).toISOString().replace(/T.*$/, ''),
        }))
        .reduce((accumulator: TBarChartData, data) => {
          const node = accumulator.find(item => item.title) ?? {
            title: data.date,
            value: 0,
          };
          node.value += 1;
          accumulator.push(node);
          return accumulator;
        }, []);
    }),
  );

  /**
   * Exported passwords list.
   */
  public readonly exportedPasswordFiles$ = this.user$.pipe(map(model => model.exportedPasswordFiles));

  /**
   * New password form.
   */
  public form = this.fb.group({
    name: ['', Validators.compose([Validators.required])],
    password: ['', Validators.compose([Validators.required])],
    timestamp: [0],
  });

  /**
   * Datepicker date.
   */
  public pickedDate: string = new Date().toISOString();

  /**
   * Filters search value.
   */
  private searchValue = '';

  /**
   * Filters search query getter.
   */
  public get searchQuery(): string {
    return this.searchValue;
  }

  /**
   * Filters search query setter.
   *
   * @param val search value to be set
   */
  public set searchQuery(val: string) {
    this.searchValue = val;
  }

  /**
   * Filters sort value.
   */
  private sortValue = '';

  /**
   * Filters sort value getter.
   */
  public get sortByCriterion(): string {
    return this.sortValue;
  }

  /**
   * Filters search value setter.
   *
   * @param val sort value to be set
   */
  public set sortByCriterion(val: string) {
    if (this.sortValue !== val) {
      this.sortValue = val;
      this.performSorting(val);
    }
  }

  /**
   * Datepicker view child reference.
   */
  @ViewChild('datePicker') private readonly datePicker!: MatDatepicker<string>;

  /**
   * Passwords list view child reference.
   */
  @ViewChild('passwordsList') private readonly passwordsList!: MatSelectionList;

  /**
   * Gets currently logged in user.
   */
  private getUser() {
    this.store.dispatch(userActions.getUser({ payload: { save: false } }));
  }

  /**
   * Get exported passwords list.
   */
  public getExportedPasswordsList() {
    this.store.dispatch(userActions.listExportedPasswordFiles());
  }

  /**
   * Resets new password form.
   */
  private resetPasswordForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      timestamp: [0],
    });
  }

  /**
   * Adds user password.
   */
  public addPassword(): void {
    const payload = <IUserPassword>this.form.value;
    this.store.dispatch(userActions.addPassword({ payload }));
    this.getUser();
    this.resetPasswordForm();
  }

  /**
   * Delete selected password.
   */
  public deletePasswords(): void {
    const names = this.passwordsList.selectedOptions.selected.map(item => <string>item.value);
    void this.store
      .select(userSelectors.userState)
      .pipe(
        first(),
        tap(user => {
          const passwords = (user.passwords ?? []).filter(item => names.includes(item.name));
          for (let i = 0, max = passwords.length; i < max; i += 1) {
            const payload = passwords[i];
            this.store.dispatch(userActions.deletePassword({ payload }));
          }
          this.getUser();
          this.resetPasswordForm();
        }),
      )
      .subscribe();
  }

  /**
   * Encrypts user passwords with user public RSA key.
   */
  public encryptPasswords(): void {
    this.store.dispatch(userActions.encryptPasswords());
    this.getUser();
  }

  /**
   * Decrypts user passwords with user private RSA key.
   */
  public decryptPasswords(): void {
    this.store.dispatch(userActions.decryptPasswords());
    this.getUser();
  }

  /**
   * Export user passwords encrypted with keypair.
   * @note TODO: let user save file to an arbitrary path.
   */
  public exportPasswords(): void {
    this.store.dispatch(userActions.exportPasswords());
    this.getExportedPasswordsList();
  }

  /**
   * Resolves if DOM element should be hidden or not.
   *
   * @param index element array index
   */
  public hideElement$ = (index: number) =>
    this.store.select(userSelectors.userState).pipe(
      first(),
      map(user => {
        const passwords = user.passwords ?? [];
        if (typeof user.status !== 'undefined' && passwords.length > 0) {
          const result = Boolean(passwords[index].name.includes(this.searchValue));
          return this.searchValue ? !result : false;
        }
        return false;
      }),
    );

  /**
   * Sorts data model by property.
   *
   * @param val property which values should be used to sort model
   */
  private performSorting(val: string): void {
    void this.store
      .select(userSelectors.userState)
      .pipe(
        first(),
        tap(user => {
          const sorted = { ...user, passwords: [...(user.passwords ?? [])] };
          if (val === 'timestamp') {
            sorted.passwords.sort((a, b) => b[val] - a[val]);
          } else if (val === 'name' || val === '') {
            /*
             *	sort by name if sorting is set to none
             */
            sorted.passwords.sort((a, b) => a.name.localeCompare(b.name));
          }
          this.store.dispatch(userActions.setState({ payload: sorted }));
        }),
      )
      .subscribe();
  }

  /**
   * Shows datepicker.
   */
  public showDatePicker(): void {
    this.datePicker.open();
  }
}
