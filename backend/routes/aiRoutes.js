const express = require('express');
const { getTutorReply, getAssessmentLevel, explainOrTranslate } = require('../services/llmClient');
const User = require('../models/User');

const router = express.Router();

// Burst limiter (per-minute) to avoid spikes
const rateState = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 20;

// Daily usage limits (soft limits, reset every 24h)
const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000;
const DAILY_LIMITS = {
  chat: 30,
  explain: 20,
  assess: 3,
};

// Optional daily totals for future analytics
const dailyTotals = new Map(); // key: `${endpoint}:${day}`, value: count

// Daily usage tracking per identifier (userId or IP)
const dailyUsage = new Map(); // key: `${identifier}:${endpoint}`, value: { count, resetAt }

function getIdentifier(req) {
  return req.user?.id || req.ip || 'unknown';
}

function isRateLimited(identifier) {
  const now = Date.now();
  const entry = rateState.get(identifier) || { count: 0, resetAt: now + WINDOW_MS };

  if (now > entry.resetAt) {
    rateState.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  rateState.set(identifier, entry);
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

function checkDailyLimit(identifier, endpoint, limit) {
  const key = `${identifier}:${endpoint}`;
  const now = Date.now();
  const entry = dailyUsage.get(key) || { count: 0, resetAt: now + DAILY_WINDOW_MS };

  if (now > entry.resetAt) {
    dailyUsage.set(key, { count: 1, resetAt: now + DAILY_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  dailyUsage.set(key, entry);
  return entry.count > limit;
}

function incrementDailyTotal(endpoint) {
  const dayKey = `${endpoint}:${new Date().toISOString().slice(0, 10)}`;
  const current = dailyTotals.get(dayKey) || 0;
  dailyTotals.set(dayKey, current + 1);
}

router.post('/chat', async (req, res) => {
  const { message, targetLanguage = 'the target language', level = 'beginner' } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 500) {
    return res.status(400).json({ error: 'Message too long' });
  }

  const identifier = getIdentifier(req);
  if (isRateLimited(identifier)) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }
  if (checkDailyLimit(identifier, 'chat', DAILY_LIMITS.chat)) {
    return res.status(429).json({ error: 'Daily AI usage limit reached. Try again tomorrow.' });
  }

  try {
    const reply = await getTutorReply({ message, targetLanguage, level });
    incrementDailyTotal('chat');
    res.json({ reply });
  } catch (error) {
    console.error('AI chat error:', error.message);
    res.status(500).json({ error: 'Failed to get AI reply' });
  }
});

router.post('/assess', async (req, res) => {
  const { answers, targetLanguage = 'the target language', learningGoal } = req.body || {};

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Answers are required' });
  }

  const identifier = getIdentifier(req);
  if (checkDailyLimit(identifier, 'assess', DAILY_LIMITS.assess)) {
    return res.status(429).json({ error: 'Daily AI usage limit reached. Try again tomorrow.' });
  }

  try {
    const level = await getAssessmentLevel({ answers, targetLanguage });

    // Derive user from auth middleware if available; ignore userId from body to prevent spoofing.
    const userIdFromAuth = req.user?.id;

    if (userIdFromAuth) {
      const update = {
        targetLanguage,
        proficiencyLevel: level,
      };
      if (learningGoal) {
        update.learningGoal = learningGoal;
      }
      await User.findByIdAndUpdate(userIdFromAuth, update, { new: true });
    }

    incrementDailyTotal('assess');
    res.json({ level });
  } catch (error) {
    console.error('AI assess error:', error.message);
    res.status(500).json({ error: 'Failed to assess level' });
  }
});

router.post('/explain', async (req, res) => {
  const { text, targetLanguage = 'English' } = req.body || {};
  const mode = req.body?.mode ? String(req.body.mode).toLowerCase() : 'explain';

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  if (text.length > 1000) {
    return res.status(400).json({ error: 'Text too long' });
  }
  if (!['explain', 'translate'].includes(mode)) {
    return res.status(400).json({ error: 'Mode must be explain or translate' });
  }

  const identifier = getIdentifier(req);
  if (checkDailyLimit(identifier, 'explain', DAILY_LIMITS.explain)) {
    return res.status(429).json({ error: 'Daily AI usage limit reached. Try again tomorrow.' });
  }

  try {
    const result = await explainOrTranslate({ text, targetLanguage, mode });
    incrementDailyTotal('explain');
    res.json({ result });
  } catch (error) {
    console.error('AI explain error:', error.message);
    res.status(500).json({ error: 'Failed to process text' });
  }
});

module.exports = router;

