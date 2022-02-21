import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppMarkdownService } from '@app/client-services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { of, timer } from 'rxjs';
import { first, map } from 'rxjs/operators';

const timeout = {
  start: 0,
  interval: 2000,
};

@UntilDestroy()
@Component({
  selector: 'app-diagnostics-home',
  templateUrl: './diagnostics-home.component.html',
  styleUrls: ['./diagnostics-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDiagnosticsHomeComponent {
  public readonly timer$ = timer(timeout.start, timeout.interval).pipe(
    map(num => `Until destroyed ${num}`),
    untilDestroyed(this),
  );

  public readonly markedInstructions$ = of('').pipe(
    first(),
    map(() => {
      const title = '# Upgraded Enigma: Organizer and Productivity tools \n\n';
      const usageInstructions =
        '## Usage instructions \n\n - log in (if there is no account it will be created for you first);\n - all configurations are local, i.e. stored on your computer (lose your configuration file, and you will have to start over);\n - generate a pair of encryption keys to safeguard your data when you are not using the app (lose your keys, and if your data is encrypted it will be inaccessible);';
      return this.markdown.process(`${title}\n${usageInstructions}`);
    }),
  );

  constructor(private readonly markdown: AppMarkdownService) {}
}
