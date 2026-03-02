const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/journeys.json');
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));

router.get('/', (req, res) => res.json(readData()));
router.get('/:employeeId', (req, res) => {
  const journey = readData().find(j => j.employeeId === req.params.employeeId);
  if (!journey) return res.status(404).json({ error: 'Journey not found' });
  res.json(journey);
});

module.exports = router;
