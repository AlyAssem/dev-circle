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
    email: req.body.email,
    password: req.body.password,
  };
  users.push(newUser);
  fs.writeFileSync(DATA_FILE, JSON.stringify(users));

  res.status(201).json(users);
});

app.listen(5000, () => console.log('SERVER IS RUNNING ON PORT 5000'));
