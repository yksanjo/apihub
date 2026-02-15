const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory data store
const db = {
  users: [
    { id: '1', email: 'admin@gepa.io', name: 'Admin User', avatar: 'A', role: 'admin' }
  ],
  teams: [
    { id: '1', name: 'Core Team', members: ['1'], createdAt: '2024-01-15T10:00:00Z' }
  ],
  experiments: [
    {
      id: '1',
      name: 'Prompt Optimization v2',
      description: 'Optimizing customer support prompts',
      objective: 'Maximize response quality',
      populationSize: 50,
      generations: 100,
      mutationRate: 0.15,
      status: 'running',
      progress: 67,
      teamId: '1',
      createdBy: '1',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-25T15:30:00Z'
    },
    {
      id: '2',
      name: 'Code Generation Fine-tune',
      description: 'Improving code completion prompts',
      objective: 'Increase accuracy',
      populationSize: 100,
      generations: 200,
      mutationRate: 0.1,
      status: 'completed',
      progress: 100,
      teamId: '1',
      createdBy: '1',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-18T12:00:00Z'
    },
    {
      id: '3',
      name: 'Sentiment Analysis Test',
      description: 'Testing sentiment classification prompts',
      objective: 'Optimize F1 score',
      populationSize: 30,
      generations: 50,
      mutationRate: 0.2,
      status: 'pending',
      progress: 0,
      teamId: '1',
      createdBy: '1',
      createdAt: '2024-01-25T14:00:00Z',
      updatedAt: '2024-01-25T14:00:00Z'
    }
  ],
  prompts: [
    {
      id: '1',
      name: 'Customer Support Prompt',
      content: 'You are a helpful customer support agent. Respond to the following inquiry with empathy and accuracy.',
      version: 3,
      versions: [
        { version: 1, content: 'You are a customer support agent.', createdAt: '2024-01-01T10:00:00Z', createdBy: '1' },
        { version: 2, content: 'You are a helpful customer support agent. Respond accurately.', createdAt: '2024-01-10T10:00:00Z', createdBy: '1' },
        { version: 3, content: 'You are a helpful customer support agent. Respond to the following inquiry with empathy and accuracy.', createdAt: '2024-01-20T10:00:00Z', createdBy: '1' }
      ],
      tags: ['support', 'customer-service'],
      teamId: '1',
      createdBy: '1',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      name: 'Code Review Prompt',
      content: 'Analyze the following code for bugs, performance issues, and best practices. Provide detailed feedback.',
      version: 2,
      versions: [
        { version: 1, content: 'Review this code for bugs.', createdAt: '2024-01-05T10:00:00Z', createdBy: '1' },
        { version: 2, content: 'Analyze the following code for bugs, performance issues, and best practices. Provide detailed feedback.', createdAt: '2024-01-15T10:00:00Z', createdBy: '1' }
      ],
      tags: ['code', 'review'],
      teamId: '1',
      createdBy: '1',
      createdAt: '2024-01-05T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ],
  abTests: [
    {
      id: '1',
      name: 'Greeting Variants Test',
      description: 'Testing different greeting styles',
      status: 'running',
      variants: [
        { id: 'a', name: 'Formal', content: 'Good day, how may I assist you?', allocation: 50 },
        { id: 'b', name: 'Casual', content: 'Hey there! What can I help you with?', allocation: 50 }
      ],
      metrics: [
        { name: 'Engagement Rate', variantA: 0.45, variantB: 0.62 },
        { name: 'Resolution Time', variantA: 120, variantB: 95 }
      ],
      winner: null,
      teamId: '1',
      createdBy: '1',
      createdAt: '2024-01-18T10:00:00Z',
      updatedAt: '2024-01-25T12:00:00Z'
    },
    {
      id: '2',
      name: 'Prompt Length Test',
      description: 'Comparing short vs long prompts',
      status: 'completed',
      variants: [
        { id: 'a', name: 'Short', content: 'Summarize this text.', allocation: 33 },
        { id: 'b', name: 'Medium', content: 'Please provide a brief summary of the following text.', allocation: 33 },
        { id: 'c', name: 'Long', content: 'Analyze the following text and provide a comprehensive summary covering all key points.', allocation: 34 }
      ],
      metrics: [
        { name: 'User Satisfaction', variantA: 0.55, variantB: 0.72, variantC: 0.68 }
      ],
      winner: 'b',
      teamId: '1',
      createdBy: '1',
      createdAt: '2024-01-08T10:00:00Z',
      updatedAt: '2024-01-22T10:00:00Z'
    }
  ],
  activities: [
    { id: '1', type: 'experiment', action: 'created', target: 'Prompt Optimization v2', userId: '1', teamId: '1', createdAt: '2024-01-20T10:00:00Z' },
    { id: '2', type: 'prompt', action: 'updated', target: 'Customer Support Prompt', userId: '1', teamId: '1', createdAt: '2024-01-20T10:00:00Z' },
    { id: '3', type: 'abtest', action: 'completed', target: 'Prompt Length Test', userId: '1', teamId: '1', createdAt: '2024-01-22T10:00:00Z' },
    { id: '4', type: 'experiment', action: 'started', target: 'Sentiment Analysis Test', userId: '1', teamId: '1', createdAt: '2024-01-25T14:00:00Z' }
  ]
};

// Helper functions
const getTeamData = (teamId) => {
  return {
    experiments: db.experiments.filter(e => e.teamId === teamId),
    prompts: db.prompts.filter(p => p.teamId === teamId),
    abTests: db.abTests.filter(t => t.teamId === teamId),
    activities: db.activities.filter(a => a.teamId === teamId)
  };
};

// API Routes

// Dashboard stats
app.get('/api/dashboard', (req, res) => {
  const teamId = req.query.teamId || '1';
  const data = getTeamData(teamId);
  
  const activeExperiments = data.experiments.filter(e => e.status === 'running').length;
  const completedExperiments = data.experiments.filter(e => e.status === 'completed').length;
  const totalTests = data.abTests.length;
  const completedTests = data.abTests.filter(t => t.status === 'completed').length;
  
  res.json({
    metrics: {
      activeExperiments,
      completedExperiments,
      successRate: completedExperiments > 0 ? Math.round((completedExperiments / (activeExperiments + completedExperiments)) * 100) : 0,
      activeTests: data.abTests.filter(t => t.status === 'running').length,
      completedTests,
      totalPrompts: data.prompts.length,
      teamMembers: 1
    },
    recentExperiments: data.experiments.slice(0, 5),
    recentActivity: data.activities.slice(0, 10)
  });
});

// Experiments
app.get('/api/experiments', (req, res) => {
  const teamId = req.query.teamId || '1';
  res.json(db.experiments.filter(e => e.teamId === teamId));
});

app.get('/api/experiments/:id', (req, res) => {
  const experiment = db.experiments.find(e => e.id === req.params.id);
  if (!experiment) return res.status(404).json({ error: 'Experiment not found' });
  res.json(experiment);
});

app.post('/api/experiments', (req, res) => {
  const experiment = {
    id: uuidv4(),
    ...req.body,
    status: 'pending',
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.experiments.push(experiment);
  res.status(201).json(experiment);
});

app.put('/api/experiments/:id', (req, res) => {
  const index = db.experiments.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Experiment not found' });
  
  db.experiments[index] = {
    ...db.experiments[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(db.experiments[index]);
});

app.delete('/api/experiments/:id', (req, res) => {
  const index = db.experiments.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Experiment not found' });
  
  db.experiments.splice(index, 1);
  res.status(204).send();
});

// Prompts
app.get('/api/prompts', (req, res) => {
  const teamId = req.query.teamId || '1';
  res.json(db.prompts.filter(p => p.teamId === teamId));
});

app.get('/api/prompts/:id', (req, res) => {
  const prompt = db.prompts.find(p => p.id === req.params.id);
  if (!prompt) return res.status(404).json({ error: 'Prompt not found' });
  res.json(prompt);
});

app.post('/api/prompts', (req, res) => {
  const prompt = {
    id: uuidv4(),
    ...req.body,
    version: 1,
    versions: [{
      version: 1,
      content: req.body.content,
      createdAt: new Date().toISOString(),
      createdBy: req.body.createdBy || '1'
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.prompts.push(prompt);
  res.status(201).json(prompt);
});

app.put('/api/prompts/:id', (req, res) => {
  const index = db.prompts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Prompt not found' });
  
  const newVersion = req.body.content && req.body.content !== db.prompts[index].content
    ? {
        version: db.prompts[index].version + 1,
        content: req.body.content,
        createdAt: new Date().toISOString(),
        createdBy: req.body.createdBy || '1'
      }
    : null;
  
  if (newVersion) {
    db.prompts[index].versions.push(newVersion);
    db.prompts[index].version = newVersion.version;
  }
  
  db.prompts[index] = {
    ...db.prompts[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(db.prompts[index]);
});

app.delete('/api/prompts/:id', (req, res) => {
  const index = db.prompts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Prompt not found' });
  
  db.prompts.splice(index, 1);
  res.status(204).send();
});

// A/B Tests
app.get('/api/abtests', (req, res) => {
  const teamId = req.query.teamId || '1';
  res.json(db.abTests.filter(t => t.teamId === teamId));
});

app.get('/api/abtests/:id', (req, res) => {
  const test = db.abTests.find(t => t.id === req.params.id);
  if (!test) return res.status(404).json({ error: 'Test not found' });
  res.json(test);
});

app.post('/api/abtests', (req, res) => {
  const test = {
    id: uuidv4(),
    ...req.body,
    status: 'draft',
    winner: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.abTests.push(test);
  res.status(201).json(test);
});

app.put('/api/abtests/:id', (req, res) => {
  const index = db.abTests.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Test not found' });
  
  db.abTests[index] = {
    ...db.abTests[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(db.abTests[index]);
});

app.delete('/api/abtests/:id', (req, res) => {
  const index = db.abTests.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Test not found' });
  
  db.abTests.splice(index, 1);
  res.status(204).send();
});

// Teams
app.get('/api/teams', (req, res) => {
  res.json(db.teams);
});

app.get('/api/teams/:id', (req, res) => {
  const team = db.teams.find(t => t.id === req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  
  const teamMembers = db.users.filter(u => team.members.includes(u.id));
  const data = getTeamData(team.id);
  
  res.json({
    ...team,
    members: teamMembers,
    ...data
  });
});

// Activity
app.get('/api/activity', (req, res) => {
  const teamId = req.query.teamId || '1';
  res.json(db.activities.filter(a => a.teamId === teamId).slice(0, 20));
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`GEPA Optimizer Hub API running on port ${PORT}`);
});
