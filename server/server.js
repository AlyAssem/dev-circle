const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const USERS_DATA_FILE = path.join(__dirname, 'data/users.json');
const POSTS_DATA_FILE = path.join(__dirname, 'data/posts.json');

app.get('/', (req, res) => {
  res.send('API IS RUNNING...');
});

app.get('/api/users', (req, res) => {
  const data = fs.readFileSync(USERS_DATA_FILE);
  res.json(JSON.parse(data));
});

app.post('/api/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_DATA_FILE));
  const newUser = {
    id: req.body.id,
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  };

  const doesUserExist = users.some((user) => user.email === newUser.email);

  if (doesUserExist) {
    res.status(400);
    throw new Error('User already exists');
  }

  users.push(newUser);
  fs.writeFileSync(USERS_DATA_FILE, JSON.stringify(users));

  const responseUser = { ...newUser };
  delete responseUser.password;

  res.status(201).json({ user: responseUser });
});

app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_DATA_FILE));

  const registeredUser = users.find((user) => user.email === email);

  if (registeredUser && registeredUser.password === password) {
    delete registeredUser.password;
    res.json({ user: registeredUser });
  } else {
    res.status(401);
    throw new Error('Invalid Email or Password');
  }
});

app.get('/api/posts', (req, res) => {
  const data = fs.readFileSync(POSTS_DATA_FILE);
  res.json({ posts: JSON.parse(data) });
});

app.post('/api/posts', (req, res) => {
  const { id, postUserInfo, title, content } = req.body;
  const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

  const newPost = {
    id,
    postUserInfo,
    title,
    content,
  };

  const isNewPostAlreadyWritten = posts.some(
    (post) =>
      post.postUserInfo.id === newPost.postUserInfo.id && post.title === title
  );

  if (isNewPostAlreadyWritten) {
    res.status(400);
    throw new Error('Post already exists');
  }

  posts.push(newPost);
  fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(posts));

  // const responsePost = { ...newPost };
  // delete responsePost.postUserInfo;

  res.status(201).json({ post: newPost });
});

app.put('/api/posts/:id', (req, res) => {
  const { postUserInfo, title, content } = req.body;
  const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

  const foundPostIndex = posts.findIndex((post) => post.id === req.params.id);

  if (foundPostIndex !== -1) {
    if (posts[foundPostIndex].postUserInfo.id !== postUserInfo.id) {
      res.status(401);
      throw new Error('logged in user is not the post owner.');
    }
    const updatedPost = { ...posts[foundPostIndex], title, content };
    posts[foundPostIndex] = updatedPost;
    fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(posts));

    // delete updatedPost.postUserInfo;

    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

app.get('/api/posts/:id', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

  const foundPost = posts.find((post) => post.id === req.params.id);

  if (foundPost) {
    res.json(foundPost);
  } else {
    res.status(404).json({ errorMessage: 'Post not found!' });
  }
});

app.delete('/api/posts/:id', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

  const filteredPosts = posts.filter((post) => post.id !== req.params.id);

  fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(filteredPosts));
  res.json({ message: 'Post removed' });
});

const notFound = (req, res, next) => {
  console.log('NOT FOUND ERROR');
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    errorMessage: err.message,
  });
};

app.use(notFound);
app.use(errorHandler);

app.listen(5000, () => console.log('SERVER IS RUNNING ON PORT 5000'));
