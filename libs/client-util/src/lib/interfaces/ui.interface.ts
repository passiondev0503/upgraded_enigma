export interface IButton {
  routerLink: string[];
  routeActive: () => boolean;
  icon: string;
  title: string;
  requiresAuth: boolean;
  click?(): void;
}

export interface IAnchor {
  href: string;
  icon: string;
  title: string;
}
