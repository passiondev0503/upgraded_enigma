describe('navbar component', () => {
  beforeEach(() => cy.visit('/?path=/story/appnavbarcomponent--primary'));

  it('TODO: test', () => {
    /**
     * Gets an iframe content.
     */
    const getIframe = () =>
      cy.get('iframe[id="storybook-preview-iframe"]').its('0.contentDocument.body').should('not.be.empty').then(cy.wrap);

    getIframe().find('app-navbar').should('exist');
  });
});
