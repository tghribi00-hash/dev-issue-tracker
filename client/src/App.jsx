import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Layers,
  ArrowRight,
  RotateCcw,
  Tag
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const INITIAL_FALLBACK_ISSUES = [
  {
    id: 'ISSUE-101',
    title: 'Fix race condition in JWT token refresh rotation',
    description: 'Concurrent API calls cause intermittent 401 Unauthorized errors when refresh token is rotated.',
    status: 'in-progress',
    priority: 'high',
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

export default function App() {
  const [issues, setIssues] = useState(INITIAL_FALLBACK_ISSUES);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    labels: ''
  });

  // Fetch issues from Express API
  const fetchIssues = async () => {
    try {
      const res = await fetch(`${API_BASE}/issues`);
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
        setIsBackendConnected(true);
      } else {
        setIsBackendConnected(false);
      }
    } catch {
      setIsBackendConnected(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Update Status
  const handleStatusChange = async (id, nextStatus) => {
    if (isBackendConnected) {
      try {
        await fetch(`${API_BASE}/issues/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus })
        });
      } catch (err) {
        console.warn('Backend update failed, applying locally:', err);
      }
    }
    // Optimistic local state update
    setIssues(prev =>
      prev.map(item => (item.id === id ? { ...item, status: nextStatus } : item))
    );
  };

  // Delete Issue
  const handleDelete = async (id) => {
    if (isBackendConnected) {
      try {
        await fetch(`${API_BASE}/issues/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Backend delete failed, applying locally:', err);
      }
    }
    setIssues(prev => prev.filter(item => item.id !== id));
  };

  // Create Issue
  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const parsedLabels = formData.labels
      .split(',')
      .map(l => l.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      labels: parsedLabels
    };

    if (isBackendConnected) {
      try {
        const res = await fetch(`${API_BASE}/issues`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          setIssues(prev => [created, ...prev]);
        }
      } catch (err) {
        console.warn('Backend create failed, fallback to local:', err);
      }
    } else {
      const mockCreated = {
        id: `ISSUE-${Math.floor(100 + Math.random() * 900)}`,
        title: formData.title,
        description: formData.description,
        status: 'todo',
        priority: formData.priority,
        labels: parsedLabels.length ? parsedLabels : ['general'],
        author: 'local-dev',
        createdAt: new Date().toISOString()
      };
      setIssues(prev => [mockCreated, ...prev]);
    }

    setFormData({ title: '', description: '', priority: 'medium', labels: '' });
    setIsModalOpen(false);
  };

  // Filtered Issues Calculation
  const filteredIssues = issues.filter(issue => {
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.labels.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Summary Metrics
  const totalCount = issues.length;
  const todoCount = issues.filter(i => i.status === 'todo').length;
  const inProgressCount = issues.filter(i => i.status === 'in-progress').length;
  const doneCount = issues.filter(i => i.status === 'done').length;

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="brand-title">IssueFlow</h1>
            <p className="brand-subtitle">
              Professional Engineering Task & Issue Management System
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ 
            fontSize: '0.8rem', 
            padding: '4px 10px', 
            borderRadius: '20px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: isBackendConnected ? 'var(--accent-green)' : 'var(--text-muted)'
          }}>
            <span style={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              backgroundColor: isBackendConnected ? 'var(--accent-green)' : 'var(--text-muted)' 
            }} />
            {isBackendConnected ? 'Node.js API Connected' : 'Local Standalone Mode'}
          </span>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> New Issue
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Issues</span>
          <span className="stat-value">{totalCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label" style={{ color: '#8b949e' }}>To Do</span>
          <span className="stat-value" style={{ color: '#8b949e' }}>{todoCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label" style={{ color: '#d29922' }}>In Progress</span>
          <span className="stat-value" style={{ color: '#d29922' }}>{inProgressCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label" style={{ color: '#3fb950' }}>Resolved</span>
          <span className="stat-value" style={{ color: '#3fb950' }}>{doneCount}</span>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="controls-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search issues by keyword, title, or label..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <button 
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'todo' ? 'active' : ''}`}
            onClick={() => setStatusFilter('todo')}
          >
            To Do ({todoCount})
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setStatusFilter('in-progress')}
          >
            In Progress ({inProgressCount})
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'done' ? 'active' : ''}`}
            onClick={() => setStatusFilter('done')}
          >
            Done ({doneCount})
          </button>

          <select 
            className="filter-btn"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ outline: 'none' }}
          >
            <option value="all">Priority: All</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </section>

      {/* Issues Feed */}
      <main className="issues-list">
        {filteredIssues.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={36} style={{ marginBottom: 12, opacity: 0.5 }} />
            <h3>No issues matched your criteria</h3>
            <p>Try clearing your search query or status filter.</p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div key={issue.id} className="issue-card">
              <div className="issue-main">
                <div className="issue-header">
                  <span className="issue-id">{issue.id}</span>
                  <span className={`badge badge-${issue.status}`}>
                    {issue.status === 'done' && <CheckCircle2 size={12} />}
                    {issue.status === 'in-progress' && <Clock size={12} />}
                    {issue.status === 'todo' && <AlertCircle size={12} />}
                    {issue.status.replace('-', ' ')}
                  </span>
                  <span className={`badge badge-${issue.priority}`}>
                    {issue.priority}
                  </span>
                  <h3 className="issue-title">{issue.title}</h3>
                </div>

                <p className="issue-description">{issue.description}</p>

                <div className="issue-meta">
                  {issue.labels.map((label, idx) => (
                    <span key={idx} className="label-pill">
                      #{label}
                    </span>
                  ))}
                  <span className="issue-author">
                    opened by <strong>@{issue.author}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="issue-actions">
                {issue.status === 'todo' && (
                  <button 
                    className="action-btn"
                    onClick={() => handleStatusChange(issue.id, 'in-progress')}
                    title="Move to In Progress"
                  >
                    Start <ArrowRight size={14} />
                  </button>
                )}

                {issue.status === 'in-progress' && (
                  <button 
                    className="action-btn"
                    onClick={() => handleStatusChange(issue.id, 'done')}
                    title="Mark Resolved"
                    style={{ color: 'var(--accent-green)' }}
                  >
                    Resolve <CheckCircle2 size={14} />
                  </button>
                )}

                {issue.status === 'done' && (
                  <button 
                    className="action-btn"
                    onClick={() => handleStatusChange(issue.id, 'todo')}
                    title="Reopen Issue"
                  >
                    Reopen <RotateCcw size={14} />
                  </button>
                )}

                <button 
                  className="action-btn action-btn-danger"
                  onClick={() => handleDelete(issue.id)}
                  title="Delete Issue"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {/* New Issue Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Engineering Issue</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIssue} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Redis caching layer for user sessions"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details, steps to reproduce, or technical scope..."
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags / Labels (comma separated)</label>
                  <input
                    type="text"
                    placeholder="react, api, backend"
                    className="form-input"
                    value={formData.labels}
                    onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
