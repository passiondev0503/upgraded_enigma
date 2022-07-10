import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IWorkspaceTimer } from '../../interfaces/workspace.interfaces';

@Component({
  selector: 'app-workspace-timer',
  templateUrl: './workspace-timer.component.html',
  styleUrls: ['./workspace-timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppWorkspaceTimerComponent {
  @Input() public data: IWorkspaceTimer = {
    id: 'wst',
    title: 'Timer',
    description: 'Workspace timer',
    session: 10,
    break: 5,
    iterations: 3,
  };

  private readonly progressSubject = new BehaviorSubject<number>(0);

  public readonly progress$ = this.progressSubject.asObservable();

  @Output() public readonly timeOut = new EventEmitter();

  @Output() public readonly shortenSession = new EventEmitter<number>();

  @Output() public readonly prolongSession = new EventEmitter<number>();

  @Output() public readonly shortenBreak = new EventEmitter<number>();

  @Output() public readonly prolongBreak = new EventEmitter<number>();

  @Output() public readonly pauseTimer = new EventEmitter<boolean>();

  @Output() public readonly resetTimer = new EventEmitter();

  @Output() public readonly endSession = new EventEmitter();

  public emitTimeOut() {
    this.timeOut.emit();
  }

  public emitShortenSession() {
    this.shortenSession.emit();
  }

  public emitProlongSession() {
    this.prolongSession.emit();
  }

  public emitShortenBreak() {
    this.shortenBreak.emit();
  }

  public emitProlongBreak() {
    this.prolongBreak.emit();
  }

  public emitPauseTimer() {
    this.pauseTimer.emit();
  }

  public emitResetTimer() {
    this.resetTimer.emit();
  }

  public emitEndSession() {
    this.endSession.emit();
  }
}
