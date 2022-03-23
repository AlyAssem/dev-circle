# Dev-Circle Web Application

> PERN stack Social networking web application for developers to share posts, comment and like others' posts and have a knowledge sharing community, Built with React-Hooks, Typescript, Redux-toolkit, Tailwindcss, Nodejs, Expressjs,Postgres, TypeOrm, Socket.io (for real time notification).

Application Demo: https://hardcore-panini-35872f.netlify.app

## Features: It's still under development but the current implemented features are the following.

- Auto logout.(15 mins of idle, or expiration of access token which is 1h for security purposes)
- Real time notification system with socket.io.
- form validation using formik for frontend and express-validator for the backend.
- unit tests for the frontend and end to end tests for the backend services and their effects applied on a test database seperated from the development or production ones.
- Responsive web design.
- Authentication and authorization.(using JWT)
- CRUD operations for (posts & comments).

## Future-work:

- Implementing LRU cache algorithm with searching for posts of an individual user
- likes and comments on posts between users.
- multi-theme support.
- multi-language support.
- unit tests coverage throughout the whole project.
- using generators to create ids instead of UUIDV4.

## Used Technologies

### Front-End

- React, React-Hooks ,Redux, Redux-toolkit.
- Tailwindcss.
- Formik.
- Jest & Enzyme.(for unit testing)
- dotenv.

### Back-End:

- Nodejs & Express.
- express-async-handler
- express-validator
- JSON Web Token (JWT).
- dotenv.
- bcrypt.
- TypeOrm
- postgresql
- Jest & supertest.(for end to end tests)
