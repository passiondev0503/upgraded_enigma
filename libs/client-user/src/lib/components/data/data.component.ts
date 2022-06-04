import { ChangeDetectionStrategy, Component, HostBinding, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { AppUserState, IUserPassword, userActions } from '@app/client-store';
import { Store } from '@ngxs/store';
import { TBarChartData } from '@rfprodz/d3-charts';
import { of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppUserDataComponent {
  constructor(private readonly fb: FormBuilder, private readonly store: Store) {
    void this.getUser().subscribe();
    void this.getExportedPasswordsList().subscribe();
  }

  @HostBinding('class.mat-body-1') protected matBody = true;

  /**
   * Currently logged in user object.
   */
  public readonly user$ = this.store.select(AppUserState.model);

  /**
   * Currently logged in user object.
   */
  public readonly chartData$ = this.store.select(AppUserState.model).pipe(
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
  public readonly exportedPasswordFiles$ = this.store.select(AppUserState.model).pipe(map(model => model.exportedPasswordFiles));

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
      // sort if value has changed
      this.sortValue = val;
      this.performSorting(val);
    }
  }

  /**
   * Datepicker view child reference.
   */
  @ViewChild('datePicker') private readonly datePicker!: MatDatepicker<string>;

  /**
   * Gets currently logged in user.
   */
  private getUser() {
    return this.store.dispatch(new userActions.getUser());
  }

  /**
   * Get exported passwords list.
   */
  public getExportedPasswordsList() {
    return this.store.dispatch(new userActions.listExportedPasswordFiles());
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
    const formData = <IUserPassword>this.form.value;
    void this.store
      .dispatch(new userActions.addPassword(formData))
      .pipe(
        concatMap(() => this.getUser()),
        tap(() => {
          this.resetPasswordForm();
        }),
      )
      .subscribe();
  }

  /**
   * Deletes user password.
   *
   * @param id local model array index
   */
  public deletePassword(id: number): void {
    void this.store
      .selectOnce(AppUserState.model)
      .pipe(
        concatMap(user => {
          const formData = (user.passwords ?? [])[id];
          return typeof formData !== 'undefined'
            ? this.store.dispatch(new userActions.deletePassword(formData)).pipe(
                concatMap(() => this.getUser()),
                tap(() => {
                  this.resetPasswordForm();
                }),
              )
            : of(null);
        }),
      )
      .subscribe();
  }

  /**
   * Encrypts user passwords with user public RSA key.
   */
  public encryptPasswords(): void {
    void this.store
      .dispatch(new userActions.encryptPasswords())
      .pipe(concatMap(() => this.getUser()))
      .subscribe();
  }

  /**
   * Decrypts user passwords with user private RSA key.
   */
  public decryptPasswords(): void {
    void this.store
      .dispatch(new userActions.decryptPasswords())
      .pipe(concatMap(() => this.getUser()))
      .subscribe();
  }

  /**
   * Export user passwords encrypted with keypair.
   * TODO: let user save file to an arbitrary path.
   */
  public exportPasswords(): void {
    void this.store
      .dispatch(new userActions.exportPasswords())
      .pipe(concatMap(() => this.getExportedPasswordsList()))
      .subscribe();
  }

  /**
   * Resolves if DOM element should be hidden or not.
   *
   * @param index element array index
   */
  public hideElement$ = (index: number) =>
    this.store.selectOnce(AppUserState.model).pipe(
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
      .selectOnce(AppUserState.model)
      .pipe(
        tap(user => {
          const sorted = { ...user, passwords: [...(user.passwords ?? [])] };
          if (val === 'timestamp') {
            sorted.passwords.sort((a, b) => b[val] - a[val]);
          } else if (val === '') {
            /*
             *	sort by name if sorting is set to none
             */
            sorted.passwords.sort((a, b) => a.name.localeCompare(b.name));
          }
          void this.store.dispatch(new userActions.setState(sorted));
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
