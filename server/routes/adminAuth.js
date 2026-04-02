import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

// Check if email exists
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    res.json({ exists: !!admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await admin.save();

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET || 'secret');
    res.json({ token, adminId: admin._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(400).json({ error: 'Admin not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET || 'secret');
    res.json({ token, adminId: admin._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
