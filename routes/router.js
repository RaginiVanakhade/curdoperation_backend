const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// ✅ Login API route
router.post('/login', (req, res) => {
  const sql = "SELECT * FROM LOGIN WHERE EMAIL = ? AND PASSWORD = ?";
  const values = [req.body.email, req.body.password];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ message: "Login failed" });
    }

    if (data.length > 0) {
      return res.json({ message: "Login success", data });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
});



// ✅ Create User
router.post('/create', (req, res) => {
  const { id, name, email, age, mobile, work, address } = req.body;
  if (!id || !name || !email || !age || !mobile || !work || !address) {
    return res.status(422).json({ message: 'Please fill all the data' });
  }

  const sql =
    'INSERT INTO USER (ID, NAME, EMAIL, AGE, MOBILE_NO, WORK, ADDRESS) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [id, name, email, age, mobile, work, address], (err, result) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ message: 'User creation failed' });
    }
    return res.status(201).json({ message: 'User created successfully' });
  });
});

// ✅ Get all users
router.get('/users', (req, res) => {
  db.query('SELECT * FROM USER', (err, data) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ message: 'Error fetching users' });
    }
    return res.json(data);
  });
});

// ✅ Update user
router.put('/update/:id', (req, res) => {
  const { name, email, age, mobile, work, address } = req.body;
  const sql =
    'UPDATE USER SET NAME=?, EMAIL=?, AGE=?, MOBILE_NO=?, WORK=?, ADDRESS=? WHERE ID=?';
  db.query(sql, [name, email, age, mobile, work, address, req.params.id], (err) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ message: 'Error updating user' });
    }
    return res.json({ message: 'User updated successfully' });
  });
});

// ✅ Delete user
router.delete('/delete/:id', (req, res) => {
  const sql = 'DELETE FROM USER WHERE ID=?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ message: 'Error deleting user' });
    }
    return res.json({ message: 'User deleted successfully' });
  });
});


module.exports = router;
