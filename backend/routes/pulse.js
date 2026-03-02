const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/pulse.json');
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const writeData = (d) => fs.writeFileSync(dataPath, JSON.stringify(d, null, 2));

router.get('/', (req, res) => {
  const data = readData();
  const moodCounts = { thriving: 0, good: 0, okay: 0, rough: 0 };
  data.checkins.forEach(c => { if (moodCounts[c.mood] !== undefined) moodCounts[c.mood]++; });
  const total = data.checkins.length;
  const score = total === 0 ? 0 : Math.round((moodCounts.thriving * 100 + moodCounts.good * 70 + moodCounts.okay * 40 + moodCounts.rough * 10) / total);
  res.json({ checkins: data.checkins, moodCounts, score, total, history: data.history });
});

router.post('/checkin', (req, res) => {
  const data = readData();
  const today = new Date().toISOString().split('T')[0];
  if (data.today !== today) { data.checkins = []; data.today = today; }
  const entry = { id: uuidv4(), ...req.body, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
  data.checkins.push(entry);
  writeData(data);
  res.status(201).json(entry);
});

module.exports = router;
