describe('info component', () => {
  beforeEach(() => cy.visit('/?path=/story/appdiagnosticsinfopage--primary'));

  it('should render the component', () => {
    /**
     * Gets an iframe content.
     */
    const getIframe = () =>
      cy.get('iframe[id="storybook-preview-iframe"]').its('0.contentDocument.body').should('not.be.empty').then(cy.wrap);

    getIframe().find('app-diagnostics-info-page').should('exist');
  });
});
