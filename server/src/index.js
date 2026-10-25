const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory issue datastore initialized with realistic engineering issues
let issues = [
  {
    id: 'ISSUE-101',
    title: 'Fix race condition in JWT token refresh rotation',
    description: 'Concurrent API calls cause intermittent 401 Unauthorized errors when refresh token is rotated.',
    status: 'in-progress', // 'todo' | 'in-progress' | 'done'
    priority: 'high',      // 'low' | 'medium' | 'high'
    labels: ['security', 'auth', 'node.js'],
    author: 'alex-dev',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'ISSUE-102',
    title: 'Migrate Spring Boot microservice to Java 25 virtual threads',
    description: 'Benchmark I/O throughput improvement using virtual threads (Project Loom) on payments gateway.',
    status: 'todo',
    priority: 'medium',
    labels: ['java', 'spring-boot', 'performance'],
    author: 'sarah-eng',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'ISSUE-103',
    title: 'Implement optimistic UI updates in React issue board',
    description: 'Prevent layout shift and display instant card dragging feedback before server acknowledgment.',
    status: 'done',
    priority: 'low',
    labels: ['react', 'frontend', 'ux'],
    author: 'jordan-ui',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'ISSUE-104',
    title: 'Implement database connection pooling & retry backoff',
    description: 'Add exponential backoff strategy for transient connection drops during high-traffic bursts.',
    status: 'todo',
    priority: 'high',
    labels: ['database', 'reliability', 'node.js'],
    author: 'marcus-backend',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

let nextId = 105;

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime(), timestamp: new Date() });
});

// Summary Statistics
app.get('/api/stats', (req, res) => {
  const total = issues.length;
  const todo = issues.filter(i => i.status === 'todo').length;
  const inProgress = issues.filter(i => i.status === 'in-progress').length;
  const done = issues.filter(i => i.status === 'done').length;
  const highPriority = issues.filter(i => i.priority === 'high').length;

  res.json({
    total,
    todo,
    inProgress,
    done,
    highPriority,
    completionRate: total > 0 ? Math.round((done / total) * 100) : 0
  });
});

// GET all issues (supports search, status, priority filters)
app.get('/api/issues', (req, res) => {
  let result = [...issues];
  const { status, priority, search } = req.query;

  if (status && status !== 'all') {
    result = result.filter(issue => issue.status === status);
  }

  if (priority && priority !== 'all') {
    result = result.filter(issue => issue.priority === priority);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(issue => 
      issue.title.toLowerCase().includes(q) || 
      issue.description.toLowerCase().includes(q) ||
      issue.labels.some(label => label.toLowerCase().includes(q))
    );
  }

  // Sort: newest first
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(result);
});

// POST a new issue
app.post('/api/issues', (req, res) => {
  const { title, description, priority = 'medium', labels = [] } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newIssue = {
    id: `ISSUE-${nextId++}`,
    title: title.trim(),
    description: (description || '').trim(),
    status: 'todo',
    priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
    labels: Array.isArray(labels) ? labels : labels.split(',').map(l => l.trim()).filter(Boolean),
    author: 'current-user',
    createdAt: new Date().toISOString()
  };

  issues.unshift(newIssue);
  res.status(201).json(newIssue);
});

// PATCH update an issue (e.g. status transition)
app.patch('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const issue = issues.find(i => i.id === id);

  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  const { status, priority, title, description, labels } = req.body;

  if (status && ['todo', 'in-progress', 'done'].includes(status)) {
    issue.status = status;
  }
  if (priority && ['low', 'medium', 'high'].includes(priority)) {
    issue.priority = priority;
  }
  if (title) issue.title = title;
  if (description !== undefined) issue.description = description;
  if (labels && Array.isArray(labels)) issue.labels = labels;

  res.json(issue);
});

// DELETE an issue
app.delete('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const index = issues.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  const [deleted] = issues.splice(index, 1);
  res.json({ message: 'Issue removed successfully', issue: deleted });
});

app.listen(PORT, () => {
  console.log(`[IssueFlow API] Server running on http://localhost:${PORT}`);
});
