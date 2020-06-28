import "@testing-library/cypress/add-commands";

Cypress.Commands.add("createBirthday", (birthday) => {
  cy.visit("/");

  cy.findByPlaceholderText("Name of the person").type(birthday);

  cy.findByRole("button").click();

  cy.location("pathname").should("match", /\/birthday\/\w/gm);
});

Cypress.Commands.add("goToBirthday", (birthday) => {
  cy.visit(`/birthday/${birthday}`);
  cy.location("pathname").should("match", /\/birthday\/\w/gm);
});
