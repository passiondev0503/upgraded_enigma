import { TCypressCustomCommands } from '../support/config/commands.config';

declare const cy: TCypressCustomCommands;

describe('upgraded-enigma', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.setViewportSize('default');
  });

  it('should have one app-root html element', () => {
    cy.getAppRoot().should('have.length', 1);
  });

  it('should have one app-index html element', () => {
    cy.getAppIndex().should('have.length', 1);
  });

  it('should have two mat-toolbar html elements', () => {
    const expectedLength = 2;
    cy.getToolbars().should('have.length', expectedLength);
  });

  it('first toolbar should have 6 buttons', () => {
    const expectedLength = 6;
    cy.getTopToolbar().get('button').should('have.length', expectedLength);
  });

  it('last toolbar should have 6 buttons', () => {
    const expectedLength = 6;
    cy.getBottomToolbar().get('button').should('have.length', expectedLength);
  });

  it('first toolbar button should trigger sidebar', () => {
    cy.getSidenav().should('not.be.visible');
    cy.getBottomToolbar().find('button').first().click();
    cy.getSidenav().should('be.visible');
    cy.getBottomToolbar().find('button').first().click();
    cy.getSidenav().should('not.be.visible');
  });
});
