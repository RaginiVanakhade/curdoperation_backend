import db from "../database/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  const { name, phone, password } = req.body;

  db.query(`SELECT * FROM users WHERE phone = ?`, [phone], async (err, results) => {
    if (results.length > 0) return res.status(400).json({ msg: "Phone already exists" });

    const password_hash = await bcrypt.hash(password, 10);

    db.query(
      `INSERT INTO users (name, phone, password_hash) VALUES (?, ?, ?)`,
      [name, phone, password_hash],
      (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ msg: "Signup successful" });
      }
    );
  });
};

export const login = async (req, res) => {
  const { phone, password } = req.body;

  db.query(`SELECT * FROM users WHERE phone = ?`, [phone], async (err, results) => {
    if (results.length === 0) return res.status(400).json({ msg: "User not found" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({ msg: "Login success", token, user });
  });
};

export const forgotPassword = async (req, res) => {
  const { phone } = req.body;

  db.query(`SELECT * FROM users WHERE phone = ?`, [phone], async (err, results) => {
    if (results.length === 0) return res.status(400).json({ msg: "User not found" });

    const user = results[0];

    const otp = Math.floor(100000 + Math.random() * 900000);

    await sendEmail(
      user.email,
      "WhatsApp Reset Password",
      `Your OTP Code is: ${otp}`
    );

    res.json({ msg: "OTP sent to your email", otp });
  });
};
