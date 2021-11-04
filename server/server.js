const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data/users.json');

app.get('/', (req, res) => {
  res.send('API IS RUNNING...');
});

app.get('/api/users', (req, res) => {
  const data = fs.readFileSync(DATA_FILE);
  res.json(JSON.parse(data));
});

app.post('/api/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync(DATA_FILE));
  const newUser = {
    id: req.body.id,
    userName: req.body.userName,
    email: req.body.email,
  };
  users.push(newUser);
  fs.writeFileSync(DATA_FILE, JSON.stringify(users));

  if (req.body.password) {
    res.status(401);
    throw new Error('password should not be sent');
  }

  res.status(201).json({ user: newUser });
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
