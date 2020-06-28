declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
    */
    createBirthday(name: string): Chainable<string>
    goToBirthday(name: string): Chainable<string>
  }
}
