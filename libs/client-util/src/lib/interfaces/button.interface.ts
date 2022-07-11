import { Router } from '@angular/router';

export interface IRouterButton {
  routerLink: { outlets: { [key: string]: string[] } }[];
  routeActive: () => boolean;
  click?: () => void;
  icon: string;
  title: string;
  requiresAuth: boolean;
}

/**
 * Router button object factory.
 * @param title button title
 * @param icon button icon, see here https://fonts.google.com/icons
 * @param routeActive returns whether the router path is activated
 * @param routerLink router link
 * @param requiresAuth indicates in the button is available only to authenticated users
 * @param click button element click handler
 * @returns router button object
 */
export const routerButton = (
  title: string,
  icon: string,
  routeActive: Router['isActive'],
  routerLink: { outlets: { [key: string]: string[] } }[],
  requiresAuth: boolean,
  click?: () => void,
) => <IRouterButton>{ title, icon, routeActive, routerLink, requiresAuth, click };

export interface IAnchorButton {
  href: string;
  icon: string;
  title: string;
}

/**
 * Anchor button object factory.
 * @param title button title
 * @param icon button icon, see here https://fonts.google.com/icons
 * @param href link href
 * @returns anchor button object
 */
export const anchorButton = (title: string, icon: string, href: string) => <IAnchorButton>{ title, icon, href };
