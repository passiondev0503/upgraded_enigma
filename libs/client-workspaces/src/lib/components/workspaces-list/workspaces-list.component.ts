import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { IWorkspace } from '../../interfaces/workspace.interfaces';

@Component({
  selector: 'app-workspaces-list',
  templateUrl: './workspaces-list.component.html',
  styleUrls: ['./workspaces-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppWorkspacesListComponent {
  /**
   * @note prototype
   * @note TODO: get this asyncronously from store.
   */
  private readonly widgetsSubject = new BehaviorSubject<IWorkspace[]>([
    {
      id: 'xx',
      title: 'title',
      tags: ['tag1'],
      description: 'description',
      image: 'assets/img/avatar_placeholder.png',
      url: 'https://duckduckgo.com',
      timers: [],
    },
    {
      id: 'xx1',
      title: 'title1',
      tags: ['tag2'],
      description: 'description 1',
      image: 'assets/img/avatar_placeholder.png',
      url: 'https://duckduckgo.com',
      timers: [],
    },
    {
      id: 'xx2',
      title: 'title2',
      tags: ['tag3'],
      description: 'description 2',
      image: 'assets/img/avatar_placeholder.png',
      url: 'https://duckduckgo.com',
      timers: [],
    },
  ]);

  public readonly widgets$ = this.widgetsSubject.asObservable();

  constructor(private readonly router: Router) {}

  public deleteHandler(event: IWorkspace) {
    /**
     * @note TODO
     */
  }

  public editHandler(event: IWorkspace) {
    /**
     * @note TODO
     */
  }

  public openHandler(event: IWorkspace) {
    void this.router.navigate(['/workspaces', 'item', event.id]);
  }
}
