import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, from, of, switchMap, tap } from 'rxjs';

import { IChatMessage } from '../../interfaces/chat.interface';
import { AppElizaService } from '../../services/eliza/eliza.service';

@Component({
  selector: 'app-chatbot-widget-root',
  templateUrl: './chatbot-widget-root.component.html',
  styleUrls: ['./chatbot-widget-root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppChatbotWidgetRootComponent {
  public readonly messages$ = this.eliza.messages$;

  private readonly nextUserMessageSubject = new BehaviorSubject<IChatMessage | null>(null);

  public readonly respond$ = this.nextUserMessageSubject.asObservable().pipe(
    switchMap(message => {
      if (message !== null && !message.bot) {
        const text = message.text;
        return from(this.eliza.getResponse(text));
      }
      return of(null);
    }),
    tap(response => {
      if (response !== null) {
        if (typeof response.reply !== 'undefined') {
          this.botResponse(response.reply);
        } else if (typeof response.final !== 'undefined') {
          this.botResponse(response.final);
          this.form.disable();
        }
      }
    }),
  );

  public readonly form = this.fb.group({
    message: [''],
  });

  constructor(private readonly fb: FormBuilder, private readonly eliza: AppElizaService) {}

  public resetBot() {
    this.eliza.reset();
    this.form.enable();
  }

  public userMessage() {
    const message: IChatMessage = { bot: false, text: this.form.controls.message.value ?? '' };
    this.nextUserMessageSubject.next(message);
    this.eliza.nextMessage(message);
    this.form.reset();
  }

  public botResponse(text: string) {
    const message: IChatMessage = { bot: true, text };
    this.eliza.nextMessage(message);
  }
}
