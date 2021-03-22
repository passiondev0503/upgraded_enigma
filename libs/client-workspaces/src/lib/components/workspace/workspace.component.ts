import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';

import { IWorkspace } from '../../interfaces/workspace.interfaces';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppWorkspaceComponent {
  /**
   * @note prototype
   * @note TODO: get this asyncronously from store.
   */
  private readonly data = new BehaviorSubject<IWorkspace>({
    id: 'xx',
    title: 'title',
    tags: ['tag1'],
    description: 'description',
    image: 'assets/img/avatar_placeholder.png',
    url: 'https://duckduckgo.com',
  });

  public readonly data$ = this.data.asObservable();

  constructor(private readonly store: Store) {}

  public deleteHandler() {
    /**
     * @note TODO
     */
  }

  public editHandler() {
    /**
     * @note TODO
     */
  }

  public backHandler() {
    void this.store.dispatch(new Navigate(['/workspaces', 'item']));
  }
}
