import { anchorButton, routerButton } from './button.interface';

describe('button.interface', () => {
  it('routerButton should return an object with expected properties', () => {
    const title = 'title';
    const icon = 'icon';
    const routeActive = () => true;
    const routerLink = [{ outlets: { primary: [''], sidebar: [] } }];
    const requiresAuth = false;
    const button = routerButton(title, icon, routeActive, routerLink, requiresAuth);
    expect(button.title).toEqual(title);
    expect(button.icon).toEqual(icon);
    expect(button.routeActive).toEqual(routeActive);
    expect(button.routerLink).toEqual(routerLink);
    expect(button.requiresAuth).toEqual(requiresAuth);
  });

  it('anchorButton should return an object with expected properties', () => {
    const title = 'title';
    const icon = 'icon';
    const href = 'href';
    const anchor = anchorButton(title, icon, href);
    expect(anchor.title).toEqual(title);
    expect(anchor.icon).toEqual(icon);
    expect(anchor.href).toEqual(href);
  });
});
