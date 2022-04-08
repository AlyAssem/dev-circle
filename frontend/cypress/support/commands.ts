// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject = any> {
    registerUser(
      username: string,
      email: string,
      password: string
    ): Chainable<null>;
  }
}

function registerUser(username: string, email: string, password: string) {
  cy.visit('http://localhost:3000/register');
  cy.get('input#userName').type(username);
  cy.get('input#email').type(email);
  cy.get('input#password').type(password);
  cy.get('input#confirmPassword').type(password);
  cy.get('button#registerBtn').click();
}

Cypress.Commands.add('registerUser', registerUser);
