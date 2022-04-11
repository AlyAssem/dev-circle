declare namespace Cypress {
  interface Chainable {
    registerUser(
      username: string,
      email: string,
      password: string
    ): Chainable<Element>;
    loginUser(email: string, password: string): Chainable<Element>;
    createPost(title: string, content: string): Chainable<Element>;
  }
}
