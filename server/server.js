const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const USERS_DATA_FILE = path.join(__dirname, 'data/users.json');
const POSTS_DATA_FILE = path.join(__dirname, 'data/posts.json');
const COMMENTS_DATA_FILE = path.join(__dirname, 'data/comments.json');

app.get('/', (req, res) => {
  res.send('API IS RUNNING...');
});

app.get('/api/users', (req, res) => {
  const data = fs.readFileSync(USERS_DATA_FILE);
  res.json({ users: JSON.parse(data) });
});

app.post('/api/users', async (req, res, next) => {
  const users = JSON.parse(fs.readFileSync(USERS_DATA_FILE));

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = {
      id: req.body.id,
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
    };

    const doesUserExist = users.some((user) => user.email === newUser.email);

    if (doesUserExist) {
      res.status(400);
      const error = new Error('User already exists');
      next(error);
    } else {
      users.push(newUser);
      fs.writeFileSync(USERS_DATA_FILE, JSON.stringify(users));

      const responseUser = { ...newUser };
      delete responseUser.password;

      res.status(201).json({ user: responseUser });
    }
  } catch (err) {
    throw new Error('Could not hash the user password');
  }
});

app.post('/api/users/login', async (req, res, next) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_DATA_FILE));

  const registeredUser = users.find((user) => user.email === email);

  try {
    const doesPasswordsMatch = await bcrypt.compare(
      password,
      registeredUser.password
    );

    if (registeredUser && doesPasswordsMatch) {
      delete registeredUser.password;
      res.json({ user: registeredUser });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (err) {
    throw new Error('Could not hash the user password');
  }
});

app.get('/api/posts', (req, res) => {
  const data = fs.readFileSync(POSTS_DATA_FILE);
  // using setTimeout so that the loader appears before loading data, like mocking a database.
  setTimeout(() => {
    res.json({ posts: JSON.parse(data) });
  }, 2000);
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

    res.json({ post: updatedPost });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

app.get('/api/posts/:id', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

  const foundPost = posts.find((post) => post.id === req.params.id);

  if (foundPost) {
    res.json({ post: foundPost });
  } else {
    res.status(404).json({ errorMessage: 'Post not found!' });
  }
});

app.delete('/api/posts/:id', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

  const postToDelete = posts.find((post) => post.id === req.params.id);

  // to update the json file.
  const filteredPosts = posts.filter((post) => post.id !== req.params.id);

  if (postToDelete) {
    fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(filteredPosts));
    res.json({ message: 'Post removed', postId: req.params.id });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

app.post('/api/posts/:postId/comments', (req, res) => {
  const { id, userId, text, createdAt } = req.body;

  const comments = JSON.parse(fs.readFileSync(COMMENTS_DATA_FILE));

  const newComment = {
    id,
    userId,
    postId: req.params.postId,
    text,
    createdAt,
  };

  const isNewCommentAlreadyWritten = comments.some(
    (comment) =>
      comment.userId === newComment.userId && comment.text === newComment.text
  );

  const isCommentWritteOnSamePost = comments.some(
    (comment) => comment.postId === newComment.postId
  );

  if (isNewCommentAlreadyWritten && isCommentWritteOnSamePost) {
    res.status(400);
    throw new Error('You have already written the comment');
  }

  comments.push(newComment);
  fs.writeFileSync(COMMENTS_DATA_FILE, JSON.stringify(comments));

  // increase the commentsCount for the relevant post.
  const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

  const commentedOnPostId = posts.findIndex(
    (post) => post.id === req.params.postId
  );

  const updatedPost = {
    ...posts[commentedOnPostId],
    commentsCount: posts[commentedOnPostId].commentsCount
      ? posts[commentedOnPostId].commentsCount + 1
      : 1,
  };

  posts[commentedOnPostId] = updatedPost;
  fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(posts));

  res.status(201).json({ comment: newComment });
});

app.get('/api/posts/:postId/comments', (req, res) => {
  const comments = fs.readFileSync(COMMENTS_DATA_FILE);
  const users = JSON.parse(fs.readFileSync(USERS_DATA_FILE));

  const postComments = JSON.parse(comments).filter(
    (comment) => comment.postId === req.params.postId
  );

  // populate userInfo for the comments
  const userPopulatedComments = postComments.map((comment) => {
    const commentUser = users.find((user) => user.id === comment.userId);
    return {
      ...comment,
      userInfo: {
        ...commentUser,
      },
    };
  });

  // using setTimeout so that the loader appears before loading data, like mocking a database.
  setTimeout(() => {
    res.json({ comments: userPopulatedComments });
  }, 2000);
});

app.put('/api/comments/:id', (req, res) => {
  const { text } = req.body;
  const { id } = req.params;

  const comments = JSON.parse(fs.readFileSync(COMMENTS_DATA_FILE));

  const foundCommentIndex = comments.findIndex((comment) => comment.id === id);
  if (foundCommentIndex !== -1) {
    const updatedComment = { ...comments[foundCommentIndex], text };

    comments[foundCommentIndex] = updatedComment;

    fs.writeFileSync(COMMENTS_DATA_FILE, JSON.stringify(comments));

    res.json({ comment: updatedComment });
  } else {
    res.status(404);
    throw new Error('Comment not found');
  }
});

app.delete('/api/comments/:id', (req, res) => {
  const comments = JSON.parse(fs.readFileSync(COMMENTS_DATA_FILE));

  const commentToDelete = comments.find(
    (comment) => comment.id === req.params.id
  );

  // to update the json file.
  const filteredComments = comments.filter(
    (comment) => comment.id !== req.params.id
  );

  if (commentToDelete) {
    fs.writeFileSync(COMMENTS_DATA_FILE, JSON.stringify(filteredComments));

    // decrease the commentsCount for the relevant post.
    const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

    const deletedCommentPostId = commentToDelete.postId;

    // the id in the array for the post that was commented on.
    const modifiedPostId = posts.findIndex(
      (post) => post.id === commentToDelete.postId
    );

    const commentedOnPost = posts.find(
      (post) => post.id === deletedCommentPostId
    );

    const updatedPost = {
      ...commentedOnPost,
      commentsCount: commentedOnPost.commentsCount - 1,
    };
    posts[modifiedPostId] = updatedPost;
    fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(posts));

    res.json({ message: 'Comment removed', commentId: req.params.id });
  } else {
    res.status(404);
    throw new Error('Comment not found');
  }
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
