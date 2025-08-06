require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Leaderboard Schema
const scoreSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  score: { type: Number, required: true },
});
const Score = mongoose.model('Score', scoreSchema);

// POST /api/submit-score - submit or update score
app.post('/api/submit-score', async (req, res) => {
  const { address, score } = req.body;
  if (!address || typeof score !== 'number') {
    return res.status(400).json({ error: 'Address and score are required' });
  }
  try {
    // Upsert: update score if higher, else create
    const existing = await Score.findOne({ address });
    if (existing) {
      if (score > existing.score) {
        existing.score = score;
        await existing.save();
      }
      return res.json({ message: 'Score updated' });
    }
    const newScore = new Score({ address, score });
    await newScore.save();
    res.json({ message: 'Score submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/leaderboard - get top 10 scores
app.get('/api/leaderboard', async (req, res) => {
  try {
    const topScores = await Score.find({})
      .sort({ score: -1 })
      .limit(10)
      .lean()
      .exec();
    res.json(topScores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
