import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AppAuthenticatedGuard } from '@app/client-store-user';

/**
 * The client application routes.
 */
const clientRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('@app/client-diagnostics').then(mod => mod.AppDiagnosticsModule),
  },
  {
    path: 'user',
    loadChildren: () => import('@app/client-user').then(mod => mod.AppUserModule),
  },
  {
    path: 'workspaces',
    canActivate: [AppAuthenticatedGuard],
    loadChildren: () => import('@app/client-workspaces').then(mod => mod.AppWorkspacesModule),
  },
  {
    path: 'chatbot',
    canActivate: [AppAuthenticatedGuard],
    loadChildren: () => import('@app/client-chatbot').then(mod => mod.AppChatbotModule),
  },
  {
    path: '',
    outlet: 'sidebar',
    loadChildren: () => import('@app/client-sidebar').then(mod => mod.AppSidebarModule),
  },
  {
    path: '',
    outlet: 'chatbot',
    loadChildren: () => import('@app/client-chatbot').then(mod => mod.AppChatbotWidgetModule),
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
