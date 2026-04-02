import express from 'express';
import Response from '../models/Response.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify user token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Submit form response
router.post('/submit', verifyToken, async (req, res) => {
  try {
    const { email, responses, city, name } = req.body;
    const userId = req.userId;
    const io = req.app.get('io');

    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    const response = new Response({
      userId,
      email,
      name,
      city,
      responses,
      submittedAt: new Date()
    });

    await response.save();

    // Emit real-time event to all connected admins
    io.emit('new-submission', {
      userId: userId,
      email: email,
      name: name,
      city: city,
      submittedAt: response.submittedAt
    });

    res.json({ message: 'Response submitted successfully', responseId: response._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users who submitted
router.get('/users', async (req, res) => {
  try {
    const responses = await Response.find().select('userId email name city submittedAt').sort({ submittedAt: -1 });
    const uniqueUsers = [];
    const seen = new Set();

    responses.forEach(r => {
      if (!seen.has(r.userId.toString())) {
        seen.add(r.userId.toString());
        uniqueUsers.push({
          userId: r.userId,
          email: r.email,
          name: r.name,
          city: r.city,
          submittedAt: r.submittedAt
        });
      }
    });

    res.json(uniqueUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all distinct cities
router.get('/cities', async (req, res) => {
  try {
    const cities = await Response.distinct('city');
    res.json(cities.sort());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's latest response
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await Response.findOne({ userId }).sort({ submittedAt: -1 });

    if (!response) {
      return res.status(404).json({ error: 'No response found for this user' });
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all responses for a user (history)
router.get('/user-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const responses = await Response.find({ userId }).sort({ submittedAt: -1 });

    if (responses.length === 0) {
      return res.status(404).json({ error: 'No responses found for this user' });
    }

    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
