const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/projects.json');
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));

router.get('/', (req, res) => {
  const { status, category, employeeId } = req.query;
  let projects = readData();

  if (status && status !== 'all') projects = projects.filter(p => p.status === status);
  if (category && category !== 'all') projects = projects.filter(p => p.category === category);
  if (employeeId) projects = projects.filter(p => p.members.some(m => m.employeeId === employeeId));

  res.json(projects);
});

router.get('/:id', (req, res) => {
  const projects = readData();
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

module.exports = router;
