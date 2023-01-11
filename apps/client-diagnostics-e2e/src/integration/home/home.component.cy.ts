describe('home component', () => {
  beforeEach(() => cy.visit('/?path=/story/appdiagnosticshomepage--primary'));

  it('should render the component', () => {
    /**
     * Gets an iframe content.
     */
    const getIframe = () =>
      cy.get('iframe[id="storybook-preview-iframe"]').its('0.contentDocument.body').should('not.be.empty').then(cy.wrap);

    getIframe().find('app-diagnostics-home-page').should('exist');
  });
});
