import { getRandomNumber } from "../util";

describe('Home', () => {
  it('open the page and creates a birthday', () => {
    let birthday = `test-${getRandomNumber()}`
    cy.createBirthday(birthday);
  })
})
