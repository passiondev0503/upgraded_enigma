import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
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
  private readonly dataSubject = new BehaviorSubject<IWorkspace>({
    id: 'xx',
    title: 'title',
    tags: ['tag1'],
    description: 'description',
    image: 'assets/img/avatar_placeholder.png',
    url: 'https://duckduckgo.com',
    timers: [
      {
        id: 'wst',
        title: 'Timer',
        description: 'Workspace timer',
        session: 10,
        break: 5,
        iterations: 3,
      },
    ],
  });

  public readonly data$ = this.dataSubject.asObservable();

  constructor(private readonly router: Router) {}

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
    void this.router.navigate(['/workspaces']);
  }
}
