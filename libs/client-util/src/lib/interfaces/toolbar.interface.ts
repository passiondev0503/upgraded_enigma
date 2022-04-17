export interface IToolbarButton {
  routerLink: { outlets: { [key: string]: string[] } }[];
  routeActive: () => boolean;
  click?: () => void;
  icon: string;
  title: string;
  requiresAuth: boolean;
}

export const toolbarButton = (
  click?: () => void,
  title = '',
  icon = '',
  requiresAuth = false,
  routeActive: () => boolean = () => false,
  routerLink: [] = [],
) => <IToolbarButton>{ title, icon, requiresAuth, routeActive, routerLink, click };

export interface IToolbarAnchor {
  href: string;
  icon: string;
  title: string;
}

export const toolbarAnchor = (title = '', icon = '', href = '') => <IToolbarAnchor>{ title, icon, href };
