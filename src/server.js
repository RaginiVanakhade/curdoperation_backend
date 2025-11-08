const express = require('express');
const cors = require('cors');
const router = require('../routes/router'); // ✅ Import router

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', router); // ✅ Register routes

app.listen(3001, () => {
  console.log('✅ Server running on http://localhost:3001');
});
