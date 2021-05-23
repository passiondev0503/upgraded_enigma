import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppMarkdownService } from '@upgraded-enigma/client-services';
import { TIMEOUT } from '@upgraded-enigma/client-util';
import { of, timer } from 'rxjs';
import { first, map } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHomeComponent {
  public readonly timer$ = timer(TIMEOUT.INSTANT, TIMEOUT.MEDIUM).pipe(
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
