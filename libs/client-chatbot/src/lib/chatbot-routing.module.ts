import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AppChatbotRootComponent } from './components/chatbot-root/chatbot-root.component';

/**
 * The chatbot module routes.
 */
const chatbotRoutes: Route[] = [
  {
    path: '',
    component: AppChatbotRootComponent,
  },
];

/**
 * The charbot module routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(chatbotRoutes)],
  exports: [RouterModule],
})
export class AppChatbotRoutingModule {}
