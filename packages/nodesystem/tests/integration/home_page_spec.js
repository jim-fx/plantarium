describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });

  it('successfully computes', () => {
    cy.visit('/');
    cy.get('#node-view-0-2 plant-number').invoke('attr', 'value', '4');
    cy.get('#node-view-0-3 plant-number').invoke('attr', 'value', '16');
    cy.get('#node-view-0-0 p').should('contain.text', '64');
  });

  it('creates a node', () => {
    cy.visit('/');
    cy.get('#node-view-0-2').click();
    cy.get('body').type('{shift}a');
    cy.focused().type('boolean');
    cy.get('body').type('{enter}');
  });
});
