# Dev-Circle Web Application
> A web application for developers to share posts, comment and like others' posts and have a knowledge sharing community, Built with React-Hooks, Typescript, Redux-toolkit, Tailwindcss, nodejs(A simple backend with  json files as mock data to handle frontend services).

## Features: It's still under development but the current implemented features are the following.

- Real time notification system with socket.io.
- Register && login.
- CRUD operations for posts.
- form validation using formik.
- unit tests for user registeration 

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

### Back-End: Used a simple backend with no architecture in mind just to handle the frontend services
- Nodejs & Express.
- bcrypt.js.
- Json for storing data.
