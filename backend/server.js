import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { createServer } from 'http';
import SocketServer from './socketServer.js';

dotenv.config();

const app = express();
app.use(express.json());

const __dirname = path.resolve(); // Because ES6 modules is used we cant use __dirname like in nodejs

const USERS_DATA_FILE = path.join(__dirname, '/backend/data/users.json');
const POSTS_DATA_FILE = path.join(__dirname, '/backend/data/posts.json');
const COMMENTS_DATA_FILE = path.join(__dirname, '/backend/data/comments.json');
const LIKES_DATA_FILE = path.join(__dirname, '/backend/data/likes.json');
const NOTIFICATIONS_DATA_FILE = path.join(
  __dirname,
  '/backend/data/notifications.json'
);

// socket configs.
const httpServer = createServer(app);
// eslint-disable-next-line import/order
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  SocketServer(socket);
});

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

app.post('/api/users/login', (req, res, next) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_DATA_FILE));

  const registeredUser = users.find((user) => user.email === email);

  if (registeredUser) {
    bcrypt
      .compare(password, registeredUser.password)
      .then((isMatch) => {
        let isPasswordInvalid = false;

        if (isMatch) {
          delete registeredUser.password;
          res.json({ user: registeredUser });
        } else {
          isPasswordInvalid = true;
        }

        // if the compare between the 2 passwords was not match
        if (isPasswordInvalid) {
          res.status(401);
          throw new Error('Invalid password');
        }
      })
      .catch((err) => {
        // let the custom error middleware handle it.
        next(err);
      });
  } else {
    // if the user is not registered with the given email.
    res.status(401);
    throw new Error('Invalid email');
  }
});

app.get('/api/users/:userId/likedPosts', async (req, res, next) => {
  // set likedPosts as an array for the authenticated user
  const likesData = JSON.parse(fs.readFileSync(LIKES_DATA_FILE));

  const userLikedPosts = likesData.filter(
    (likeObj) => likeObj.userId === req.params.userId
  );

  const likedPostsIds = userLikedPosts.map((likeObj) => likeObj.postId);

  return res.json({
    userLikedPosts: likedPostsIds,
  });
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
    likesCount: 0,
    commentsCount: 0,
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

app.post('/api/posts/:postId/like', (req, res) => {
  const likesData = JSON.parse(fs.readFileSync(LIKES_DATA_FILE));
  const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

  const isPostLikedByUser = likesData.some(
    (likeObj) =>
      likeObj.userId === req.body.userId && likeObj.postId === req.params.postId
  );

  if (!isPostLikedByUser) {
    likesData.push({
      userId: req.body.userId,
      postId: req.params.postId,
    });
    fs.writeFileSync(LIKES_DATA_FILE, JSON.stringify(likesData));

    // increment the liked post likesCount.
    const likedPostId = posts.findIndex(
      (post) => post.id === req.params.postId
    );

    const updatedPost = {
      ...posts[likedPostId],
      likesCount: posts[likedPostId].likesCount + 1,
    };

    posts[likedPostId] = updatedPost;
    fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(posts));

    return res.status(201).json({ post: posts[likedPostId] });
  }
  return res.status(400).json({ error: 'Post already liked' });
});

app.post('/api/posts/:postId/unlike', (req, res) => {
  const likesData = JSON.parse(fs.readFileSync(LIKES_DATA_FILE));
  const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

  const isPostLikedByUser = likesData.some(
    (likeObj) =>
      likeObj.userId === req.body.userId && likeObj.postId === req.params.postId
  );

  if (!isPostLikedByUser) {
    return res.status(400).json({ error: 'Post is not liked' });
  }

  const likeToDeleteIndex = likesData.findIndex(
    (likeObj) =>
      likeObj.userId === req.body.userId && likeObj.postId === req.params.postId
  );

  // remove the like from the data && update the LIKES_DATA_FILE.
  const updatedLikesData = [...likesData];
  updatedLikesData.splice(likeToDeleteIndex, 1);

  fs.writeFileSync(LIKES_DATA_FILE, JSON.stringify(updatedLikesData));

  // decrement the liked post likesCount && update the POSTS_DATA_FILE.
  const likedPostId = posts.findIndex((post) => post.id === req.params.postId);

  const updatedPost = {
    ...posts[likedPostId],
    likesCount: posts[likedPostId].likesCount - 1,
  };

  posts[likedPostId] = updatedPost;
  fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(posts));

  return res.status(201).json({ post: posts[likedPostId] });
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
    commentsCount: posts[commentedOnPostId].commentsCount + 1,
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

app.get('/api/notifications', (req, res) => {
  const notifications = JSON.parse(fs.readFileSync(NOTIFICATIONS_DATA_FILE));
  res.json({ notifications });
});

app.post('/api/notifications', (req, res) => {
  const { id, content } = req.body;

  const notificationsData = JSON.parse(
    fs.readFileSync(NOTIFICATIONS_DATA_FILE)
  );

  const doesNotificationExist = notificationsData.some(
    (notification) => notification.id === id || notification.content === content
  );
  if (!doesNotificationExist) {
    notificationsData.push({
      id,
      content,
    });
  } else {
    return res
      .status(400)
      .json({ error: 'Notification has already been sent' });
  }

  fs.writeFileSync(NOTIFICATIONS_DATA_FILE, JSON.stringify(notificationsData));

  return res.status(201).json({ success: 'Notification sent' });
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

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
