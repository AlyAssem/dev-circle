/// <reference types="cypress" />
describe('posts', () => {
  beforeEach(() => {
    cy.task('db:user-clear');
    cy.task('db:post-clear');
  });

  describe('create a post', () => {
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

      // assert post exists.
      cy.get('div#posts-container').should('have.length', 1);

      // assert post title and content are correct.
      cy.get('div#posts-container')
        .first()
        .find('div#post-title')
        .should('have.text', title);

      cy.get('div#posts-container')
        .first()
        .find('div#post-content')
        .should('have.text', content);
    });
  });
});
