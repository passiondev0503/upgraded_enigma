import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { IWorkspace } from '../../interfaces/workspace.interfaces';

@Component({
  selector: 'app-workspace-widget',
  templateUrl: './workspace-widget.component.html',
  styleUrls: ['./workspace-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppWorkspaceWidgetComponent {
  @Input() public data: IWorkspace = {
    id: '',
    title: '',
    tags: [],
    description: '',
    image: '',
    url: '',
  };

  @Output() public readonly deleteWorkspace = new EventEmitter<IWorkspace>();

  @Output() public readonly editWorkspace = new EventEmitter<IWorkspace>();

  @Output() public readonly openWorkspace = new EventEmitter<IWorkspace>();

  public deleteHandler() {
    this.deleteWorkspace.emit(this.data);
  }

  public editHandler() {
    this.editWorkspace.emit(this.data);
  }

  public openHandler() {
    this.openWorkspace.emit(this.data);
  }
}
