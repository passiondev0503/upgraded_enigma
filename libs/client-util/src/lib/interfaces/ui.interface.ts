export interface IButton {
  routerLink: string[];
  icon: string;
  title: string;
  requiresAuth: boolean;
  click?(): void;
}
