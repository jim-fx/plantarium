describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });

  it('successfully computes', () => {
    cy.visit('/');
    cy.get('#node-view-0-2 #value').type('3');
    cy.get('#node-view-0-2 #value').click();
    cy.get('#node-view-0-2 #value').type('4');
    cy.get('#node-view-0-2 #value').click({ force: true });
    cy.get('#node-view-0-3 #value').click({ force: true });
    cy.get('#node-view-0-3 #value').type('{backspace}');
    cy.get('#node-view-0-3 #value').type('16');
    cy.get('.nodesystem-transform').click({ force: true });
    cy.get('#node-view-0-0 > :nth-child(4)').should('contain.text', '3744');
  });

  it('creates a node', () => {
    cy.visit('/');
    cy.get('#node-view-0-2').click();
    cy.get('body').type('{shift}a');
    cy.focused().type('boolean');
    cy.get('body').type('{enter}');
  });
});
