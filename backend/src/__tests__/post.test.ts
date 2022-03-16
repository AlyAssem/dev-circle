import supertest from 'supertest';
import { createTypeormConn } from '../utils/createTypeormConn';
import createServer from '../utils/createServer';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import generateToken from '../utils/generateToken';

const app = createServer();
let testDBConnection: any;

describe('post', () => {
  let user: User;
  let post: Post;
  let token: string;
  beforeAll(async () => {
    testDBConnection = await createTypeormConn();
  });

  afterAll(async () => {
    await testDBConnection.close();
  });

  beforeEach(async () => {
    // register a user to the test db.
    user = User.create({
      name: 'post_owner',
      email: 'post@post.com',
      password: '123456789',
    });
    await user.save();

    post = Post.create({
      title: 'test post',
      content: 'test content',
      user,
    });

    await post.save();
  });

  afterEach(async () => {
    await User.delete({});
    await Post.delete({});
  });

  describe('create post', () => {
    describe('given the user is not registered', () => {
      it('should return an unauthorized status code 401.', async () => {
        const { statusCode } = await supertest(app)
          .post('/api/posts')
          .send(post);

        expect(statusCode).toBe(401);
      });
    });

    describe('given the user is registered', () => {
      describe('and the post is not already posted', () => {
        it('should return a status code of 201.', async () => {
          // remove the post from db to make sure it's not posted.
          await Post.remove(post);

          // generate a token for registered user for him to be authorized.
          token = generateToken(user.id);

          const { statusCode } = await supertest(app)
            .post('/api/posts')
            .auth(token, { type: 'bearer' })
            .send(post);

          expect(statusCode).toBe(201);
        });
      });

      describe('and the post is already posted', () => {
        it('should return a status code of 409.', async () => {
          // generate a token for registered user for him to be authorized.
          token = generateToken(user.id);

          const alreadyPostedPost = {
            id: post.id,
            title: 'test post',
            content: 'test content',
          };

          const { statusCode } = await supertest(app)
            .post('/api/posts')
            .auth(token, { type: 'bearer' })
            .send(alreadyPostedPost);

          expect(statusCode).toBe(409);
        });
      });
    });
  });

  describe('update post', () => {
    describe('given post exists', () => {
      describe('and loggedin user is the post owner', () => {
        it('should send a status code of 200, and updated post with the new updated title.', async () => {
          // generate a token for registered user for him to be authorized.
          token = generateToken(user.id);

          const postPayload = {
            title: 'new post title',
            content: 'test content',
          };

          const { statusCode, body } = await supertest(app)
            .put(`/api/posts/${post.id}`)
            .auth(token, { type: 'bearer' })
            .send(postPayload);

          expect(statusCode).toBe(200);
          expect(body.post).toEqual(
            expect.objectContaining({ title: 'new post title' })
          );
        });
      });

      describe('and loggedin user is not the post owner', () => {
        it('should send a status code of 401, unauthorized to update a post you dont own', async () => {
          const user = User.create({
            name: 'not_post_owner',
            email: 'post@post.com',
            password: '123456789',
          });
          await user.save();

          // generate an auth token for user
          const token = generateToken(user.id);

          const { statusCode } = await supertest(app)
            .put(`/api/posts/${post.id}`)
            .auth(token, { type: 'bearer' })
            .send({ title: 'new post title', content: 'post content' });

          expect(statusCode).toBe(401);
        });
      });
    });

    describe('given post does not exist', () => {
      it('should send a status code 404, not found.', async () => {
        const randomPost = {
          id: 'bcffa73c-62e9-4436-953d-3eca240daed3',
          title: 'random',
          content: 'this is a random post not stored in db',
          like_count: 0,
          comment_count: 0,
          created_at: '2022-03-16T14:04:03.285Z',
          updated_at: '2022-03-16T14:04:03.285Z',
        };

        const { statusCode } = await supertest(app)
          .put(`/api/posts/${randomPost.id}`)
          .auth(token, { type: 'bearer' })
          .send(randomPost);

        expect(statusCode).toBe(404);
      });
    });
  });

  describe('delete post', () => {
    describe('given post exists', () => {
      describe('and loggedin user is the post owner', () => {
        it('should send a status code of 200, a message mentioning removing the post, and return the deleted post id.', async () => {
          // generate a token for registered user for him to be authorized.
          token = generateToken(user.id);

          const { statusCode, body } = await supertest(app)
            .delete(`/api/posts/${post.id}`)
            .auth(token, { type: 'bearer' });

          expect(statusCode).toBe(200);
          expect(body.message).toBe('Post removed');
          expect(body.postId).toBe(post.id);
        });
      });

      describe('and loggedin user is not the post owner', () => {
        it('should send a status code of 401, unauthorized to delete a post you dont own', async () => {
          const user = User.create({
            name: 'not_post_owner',
            email: 'post@post.com',
            password: '123456789',
          });
          await user.save();

          // generate an auth token for user
          const token = generateToken(user.id);

          const { statusCode } = await supertest(app)
            .delete(`/api/posts/${post.id}`)
            .auth(token, { type: 'bearer' });

          expect(statusCode).toBe(401);
        });
      });
    });

    describe('given post does not exist', () => {
      it('should send a status code 404, not found.', async () => {
        const randomPost = {
          id: 'bcffa73c-62e9-4436-953d-3eca240daed3',
          title: 'random',
          content: 'this is a random post not stored in db',
          like_count: 0,
          comment_count: 0,
          created_at: '2022-03-16T14:04:03.285Z',
          updated_at: '2022-03-16T14:04:03.285Z',
        };

        const { statusCode } = await supertest(app)
          .delete(`/api/posts/${randomPost.id}`)
          .auth(token, { type: 'bearer' });

        expect(statusCode).toBe(404);
      });
    });
  });
});
