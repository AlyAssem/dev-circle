/// <reference types="cypress" />

describe('user', () => {
  beforeEach(() => {
    cy.task('db:user-clear');
  });

  describe('register user.', () => {
    it('should enter home page, and have the correct user data in the localstorage.', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cy.registerUser('test', 'test@test.com', '123456789');

      // check if the user enters the home page.
      cy.location('pathname').should('eq', '/');

      // after the user is routed to the home page.
      cy.url()
        .should('not.contain', '/register')
        .should(() => {
          // check if the localstorage has the registered user info.
          expect(JSON.parse(localStorage.getItem('userInfo'))).to.contain({
            name: 'test',
            email: 'test@test.com',
          });

          // check if the localstorage contains the user token.
          expect(JSON.parse(localStorage.getItem('userInfo'))).to.have.property(
            'token'
          );
        });
    });
  });

  describe('login user.', () => {
    it('should enter home page, and have the correct user data in the localstorage.', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cy.registerUser('test', 'test@test.com', '123456789');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cy.loginUser('test@test.com', '123456789');

      // check if the user enters the home page.
      cy.location('pathname').should('eq', '/');

      // after the user is routed to the home page.
      cy.url()
        .should('not.contain', '/login')
        .should(() => {
          // check if the localstorage has the registered user info.
          expect(JSON.parse(localStorage.getItem('userInfo'))).to.contain({
            name: 'test',
            email: 'test@test.com',
          });

          // check if the localstorage contains the user token.
          expect(JSON.parse(localStorage.getItem('userInfo'))).to.have.property(
            'token'
          );
        });
    });
  });
});
