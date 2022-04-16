/// <reference types="cypress" />

describe('posts', () => {
  beforeEach(() => {
    cy.task('db:user-clear');
    cy.task('db:post-clear');
  });

  describe('create a post', () => {
    describe('given there was no post', () => {
      it('should have 1 post rendered with the correct title and content.', () => {
        const title = 'test title';
        const content = 'test content';
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cy.registerUser('test', 'test@test.com', '123456789');

        // open modal and create a post.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cy.createPost(title, content);

        // assert the created post exists.
        cy.get('div#posts-container div#post-card').should('have.length', 1);

        // assert post title and content are correct.
        cy.get('div#posts-container')
          .first()
          .find('div#post-title')
          .should('have.text', title);

        cy.get('div#posts-container')
          .first()
          .find('div#post-content')
          .should('have.text', content);

        // assert the toast for post create is shown.
        cy.get('div[role=alert]').should('have.text', 'SuccessPost created');
      });
    });
  });

  describe('edit a post', () => {
    describe('given only 1 post was created.', () => {
      it('should change the post title and render the new post data.', () => {
        const title = 'test title';
        const content = 'test content';
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cy.registerUser('test', 'test@test.com', '123456789');

        // open modal and create a post.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cy.createPost(title, content);

        // edit post title.
        const newTitle = 'edited title';
        cy.get('button#edit-post-icon').click();
        cy.get('input#post-title').clear().type(newTitle);
        cy.get('button#modal-action').click();

        // assert post title was updated for the post.
        cy.get('div#posts-container')
          .first()
          .find('div#post-title')
          .should('have.text', newTitle);

        // assert the toast for post update is shown.
        cy.get('div[role=alert]').should('have.text', 'SuccessPost updated');
      });
    });
  });

  describe('delete a post', () => {
    describe('given only 1 post was created', () => {
      it('should empty the posts list', () => {
        const title = 'test title';
        const content = 'test content';
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cy.registerUser('test', 'test@test.com', '123456789');

        // open modal and create a post.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cy.createPost(title, content);

        // intercepting the delete post request at network layer.
        cy.intercept('DELETE', '**/api/posts/*').as('deletePost');

        // delete first post in the list.
        cy.get('div#posts-container')
          .first()
          .find('button#delete-post-icon')
          .click();

        // assert post was deleted successfully.
        cy.wait('@deletePost').its('response.statusCode').should('eq', 200);

        // assert posts list is emptied.
        cy.get('div#posts-container div#post-card').should('not.exist');

        // assert the toast for post removal is shown.
        cy.get('div#post-delete-success').should(
          'have.text',
          'SuccessPost removed'
        );
      });
    });
  });

  describe('click like icon', () => {
    describe('given the post was not liked by user', () => {
      it.only('should have the filled like button and increase the like count.', () => {
        const title = 'test title';
        const content = 'test content';
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cy.registerUser('test', 'test@test.com', '123456789');

        // open modal and create a post.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cy.createPost(title, content);

        // like first post in the list.
        cy.get('div#posts-container')
          .first()
          .find('button#like-button')
          .click();

        // assert like count increased to be 1.
        cy.get('span#like-count').should('have.text', '1');

        // dislike first post in list.
        cy.get('div#posts-container')
          .first()
          .find('button#like-button')
          .click();

        // assert like count decreased to be 0.
        cy.get('span#like-count').should('have.text', '0');
      });
    });
  });
});
