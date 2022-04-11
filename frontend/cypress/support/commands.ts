/// <reference types="cypress" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  'registerUser',
  (username: string, email: string, password: string) => {
    cy.visit('http://localhost:3000/register');
    cy.get('input#userName').type(username);
    cy.get('input#email').type(email);
    cy.get('input#password').type(password);
    cy.get('input#confirmPassword').type(password);
    cy.get('button#registerBtn').click();
  }
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Cypress.Commands.add('loginUser', (email: string, password: string) => {
  cy.visit('http://localhost:3000/login');
  cy.get('input#email').type(email);
  cy.get('input#password').type(password);
  cy.get('button#login-button').click();
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Cypress.Commands.add('createPost', (title: string, content: string) => {
  //   open create post modal.
  cy.get('button#createPost-button').click();

  //   create a post.
  cy.get('input#post-title').type(title);
  cy.get('textarea#post-content').type(content);
  cy.get('button#modal-action').click();
});
