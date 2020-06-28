import { getRandomNumber } from "../util";

const setPerson = (name: string = `Test user ${getRandomNumber()}`) => {
  cy.findByPlaceholderText('Insert the name')
    .type(name);

  cy.findByLabelText('Add').click();

  cy.findByText(name).should('exist');

  return name;
}


describe('Birthday', () => {
  beforeEach(() => {
    cy.goToBirthday('5d004dda-2ea1-411d-b24f-2a6cbe54e6f0');
  })

  it('sets own name', () => {
    const name = setPerson();

    cy.findByText(name).should('exist');
    cy.findAllByLabelText('Trash').should('exist');

    cy.reload();

    cy.findByPlaceholderText('Insert the name').should('not.exist');
  })

  it('mark himself as contributed', () => {
    const name = setPerson();

    cy.findByPlaceholderText('Insert the name').should('not.exist');
    cy.findAllByLabelText('Trash').should('exist');

    cy.findByTestId(`checkbox-${name}`, { timeout: 5000 }).should('exist')
      .and('not.be.checked')
      .click({ force: true });

    cy.findByTestId(`checkbox-${name}`, { timeout: 5000 }).should('be.checked')
  })

  it('deletes itself', () => {
    const name = setPerson();

    cy.findAllByLabelText('Trash').should('exist');
    cy.findByTestId(`delete-${name}`).click();

    cy.findByText(name).should('not.exist');
  })

  it('creates a gift', () => {
    setPerson();

    cy.findAllByRole('button').findByText('I have a gift idea').click();

    const itemName = `Item ${getRandomNumber()}`
    cy.findByPlaceholderText('Name of the item').type(itemName);

    cy.findByTestId('add-gift', { timeout: 3000 }).should('exist').click();

    cy.findByText(itemName).should('exist');
  })

  it('deletes a gift', () => {
    setPerson();

    cy.findAllByRole('button').findByText('I have a gift idea').click();

    const itemName = `Item ${getRandomNumber()}`
    cy.findByPlaceholderText('Name of the item').type(itemName);

    cy.findByTestId('add-gift', { timeout: 3000 }).should('exist').click();

    cy.findByText(itemName).should('exist');

    cy.findByTestId(`delete-${itemName}`).click();

    cy.findByText(itemName).should('not.exist');
  })

  it('upvotes a gift', () => {
    setPerson();

    cy.findAllByRole('button').findByText('I have a gift idea').click();

    const itemName = `Item ${getRandomNumber()}`
    cy.findByPlaceholderText('Name of the item').type(itemName);

    cy.findByTestId('add-gift').should('exist').click();

    cy.findByTestId(`upvote-${itemName}`).should('exist').click();

    cy.findByTestId(`count-${itemName}`).contains('(1)').should('exist');
  })

  it('adds another person', () => {
    setPerson();

    cy.findByText('Add another person').should('exist').click();
    setPerson(`guest-${getRandomNumber()}`);
  })
})
