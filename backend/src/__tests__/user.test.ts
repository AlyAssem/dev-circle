import { createTypeormConn } from '../utils/createTypeormConn';
import supertest from 'supertest';
import createServer from '../utils/createServer';
// import { registerUser } from '../controllers/userController';
// import * as userController from '../controllers/userController';

const app = createServer();
let testDBConnection: any;

describe('user', () => {
  beforeAll(async () => {
    testDBConnection = await createTypeormConn();
  });

  afterAll(async () => {
    await testDBConnection.close();
  });

  describe('user registration', () => {
    describe('given email and password are valid', () => {
      it('should return the user payload', async () => {
        const userPayload = {
          email: 'test@test.com',
          name: 'test',
        };

        const userInput = {
          email: 'test@test.com',
          name: 'test',
          password: '123456789',
        };

        const { statusCode, body } = await supertest(app)
          .post('/api/users')
          .send(userInput);

        expect(statusCode).toBe(201);

        expect(body.user).toEqual(expect.objectContaining(userPayload));
      });
    });

    describe('given email has an invalid format', () => {
      it('should return a 400 status code.', async () => {
        const userInput = {
          email: 'test email',
          name: 'test',
          password: '123456789',
        };

        const { statusCode } = await supertest(app)
          .post('/api/users')
          .send(userInput);

        expect(statusCode).toBe(400);
      });
    });

    describe('given password have length less than 8 which is invalid.', () => {
      it('should return a 400 status code.', async () => {
        const userInput = {
          email: 'test email',
          name: 'test',
          password: '123456',
        };

        const { statusCode } = await supertest(app)
          .post('/api/users')
          .send(userInput);

        expect(statusCode).toBe(400);
      });
    });
  });

  describe('user login', () => {
    describe('given the user is registered', () => {
      let userInput = {
        email: 'test@test.com',
        name: 'test',
        password: '123456789',
      };

      it('should return a 200 status code.', async () => {
        const { statusCode } = await supertest(app)
          .post('/api/users/login')
          .send(userInput);

        expect(statusCode).toBe(200);
      });

      it('should have a token in the response to authorize the user', async () => {
        const { body } = await supertest(app)
          .post('/api/users/login')
          .send(userInput);

        expect(body.user).toEqual(
          expect.objectContaining({ token: expect.any(String) })
        );
      });

      it('should not return password in the body.', async () => {
        const { body } = await supertest(app)
          .post('/api/users/login')
          .send(userInput);

        expect(body.user).not.toEqual(
          expect.objectContaining({ password: userInput.password })
        );
      });

      describe('and the password input is incorrect', () => {
        it('should return a 403 status code.', async () => {
          const invalidPasswordInput = { ...userInput, password: '123456788' };
          const { statusCode } = await supertest(app)
            .post('/api/users/login')
            .send(invalidPasswordInput);

          expect(statusCode).toBe(403);
        });
      });
    });

    describe('given the user is not registered', () => {
      const userInput = {
        email: 'test2@test.com',
        password: '123456789',
      };
      it('should return a 401 status code.', async () => {
        const { statusCode } = await supertest(app)
          .post('/api/users/login')
          .send(userInput);

        expect(statusCode).toBe(401);
      });
    });
  });
});
