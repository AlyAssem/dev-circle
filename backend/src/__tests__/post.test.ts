import supertest from 'supertest';
import { createTypeormConn } from '../utils/createTypeormConn';
import createServer from '../utils/createServer';
import { User } from '../entities/User';
import generateToken from '../utils/generateToken';

const app = createServer();
let testDBConnection: any;

describe('post', () => {
  beforeAll(async () => {
    testDBConnection = await createTypeormConn();
  });

  afterAll(async () => {
    await testDBConnection.close();
  });

  describe('create post', () => {
    const post = {
      title: 'test post',
      content: 'test content',
    };
    describe('given the user is not registered', () => {
      it('should return an unauthorized status code 401.', async () => {
        const { statusCode } = await supertest(app)
          .post('/api/posts')
          .send(post);

        expect(statusCode).toBe(401);
      });
    });

    describe('given the user is registered', () => {
      let user;
      let token: string;

      beforeAll(async () => {
        // register a user to the test db.
        user = User.create({
          name: 'post_test_user',
          email: 'post@post.com',
          password: '123456789',
        });
        await user.save();

        // generate a token for registered user for him to be authorized.
        token = generateToken(user.id);
      });

      it('should return a status code of 201.', async () => {
        const { statusCode } = await supertest(app)
          .post('/api/posts')
          .auth(token, { type: 'bearer' })
          .send(post);

        expect(statusCode).toBe(201);
      });

      describe('and the post is already posted', () => {
        it('should return a status code of 409.', async () => {
          const { statusCode } = await supertest(app)
            .post('/api/posts')
            .auth(token, { type: 'bearer' })
            .send(post);

          expect(statusCode).toBe(409);
        });
      });
    });
  });
});
