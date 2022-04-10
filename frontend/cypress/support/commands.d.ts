declare namespace Cypress {
  interface Chainable {
    registerUser(
      username: string,
      email: string,
      password: string
    ): Chainable<Element>;
    loginUser(email: string, password: string): Chainable<Element>;
  }
}
