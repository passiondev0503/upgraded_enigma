import { getTitle } from '../support/app.po';

describe('documentation', () => {
  beforeEach(() => cy.visit('/'));

  it('should display expected page title', () => {
    // Function helper example, see `../support/app.po.ts` file
    getTitle().contains('Upgraded Enigma Documentation');
  });
});
