import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AppAuthenticatedGuard } from '@upgraded-enigma/client-store';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () => import('@upgraded-enigma/client-diagnostics').then(mod => mod.AppClientDiagnosticsModule),
  },
  {
    path: 'user',
    loadChildren: () => import('@upgraded-enigma/client-user').then(mod => mod.AppClientUserModule),
  },
  {
    path: 'workspaces',
    canActivate: [AppAuthenticatedGuard],
    loadChildren: () => import('@upgraded-enigma/client-workspaces').then(mod => mod.AppClientWorkspacesModule),
  },
  {
    path: 'chatbot',
    loadChildren: () => import('@upgraded-enigma/client-chatbot').then(mod => mod.AppClientChatbotModule),
  },
  {
    path: '',
    outlet: 'sidebar',
    loadChildren: () => import('@upgraded-enigma/client-sidebar').then(mod => mod.AppClientSidebarModule),
  },
  {
    path: '',
    outlet: 'chatbot',
    loadChildren: () => import('@upgraded-enigma/client-chatbot').then(mod => mod.AppClientChatbotWidgetModule),
  },
  { path: '**', redirectTo: '' },
];

/**
 * Application routing module.
 */
@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
