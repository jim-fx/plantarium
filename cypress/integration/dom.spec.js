describe("My First Test", function() {
  it('finds the content "type"', function() {
    cy.visit("http://localhost:8080");

    cy.wait(1000);

    cy.contains("branch").click();
  });
});
