const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('./db/connection');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Mavericks Backend Running');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});