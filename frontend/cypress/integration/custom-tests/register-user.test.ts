/// <reference types="cypress" />

describe('register user.', () => {
  beforeEach(() => {
    cy.task('db:user-clear');
  });
  it('should visit register page.', () => {
    cy.visit('http://localhost:3000/register');
    cy.get('input#userName').type('test');
    cy.get('input#email').type('test@test.com');
    cy.get('input#password').type('123456789');
    cy.get('input#confirmPassword').type('123456789');
    cy.get('button#registerBtn').click();

    cy.location('pathname').should('eq', '/');
  });
});
