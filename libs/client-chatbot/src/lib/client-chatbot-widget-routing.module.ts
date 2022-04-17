import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AppChatbotWidgetRootComponent } from './components/chatbot-widget-root/chatbot-widget-root.component';

/**
 * The chatbot widget module routes.
 */
const chatbotWidgetRoutes: Route[] = [
  {
    path: 'root',
    component: AppChatbotWidgetRootComponent,
  },
];

/**
 * The chatbot widget module routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(chatbotWidgetRoutes)],
  exports: [RouterModule],
})
export class AppClientChatbotWidgetRoutingModule {}
