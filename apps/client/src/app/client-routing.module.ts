import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AppAuthenticatedGuard } from '@app/client-store';

/**
 * The client application routes.
 */
const clientRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('@app/client-diagnostics').then(mod => mod.AppClientDiagnosticsModule),
  },
  {
    path: 'user',
    loadChildren: () => import('@app/client-user').then(mod => mod.AppClientUserModule),
  },
  {
    path: 'workspaces',
    canActivate: [AppAuthenticatedGuard],
    loadChildren: () => import('@app/client-workspaces').then(mod => mod.AppClientWorkspacesModule),
  },
  {
    path: 'chatbot',
    canActivate: [AppAuthenticatedGuard],
    loadChildren: () => import('@app/client-chatbot').then(mod => mod.AppClientChatbotModule),
  },
  {
    path: '',
    outlet: 'sidebar',
    loadChildren: () => import('@app/client-sidebar').then(mod => mod.AppClientSidebarModule),
  },
  {
    path: '',
    outlet: 'chatbot',
    loadChildren: () => import('@app/client-chatbot').then(mod => mod.AppClientChatbotWidgetModule),
  },
  { path: '**', redirectTo: '' },
];

/**
 * The client application routing module.
 */
@NgModule({
  imports: [
    RouterModule.forRoot(clientRoutes, {
      initialNavigation: 'enabledBlocking',
      onSameUrlNavigation: 'reload',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppClientRoutingModule {}
