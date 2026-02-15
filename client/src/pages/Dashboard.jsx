import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center" style={{ height: '50vh' }}>
          <div className="text-secondary">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  const { metrics, recentExperiments, recentActivity } = data

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1>Dashboard</h1>
          <p className="text-secondary mt-sm">Overview of your optimization workspace</p>
        </div>
        <button className="btn btn-primary">+ New Experiment</button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-4 mb-lg">
        <div className="metric-card">
          <div className="metric-value">{metrics.activeExperiments}</div>
          <div className="metric-label">Active Experiments</div>
          <div className="metric-change positive">🟢 Running</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.completedExperiments}</div>
          <div className="metric-label">Completed</div>
          <div className="metric-change">{metrics.successRate}% success rate</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.activeTests}</div>
          <div className="metric-label">Active A/B Tests</div>
          <div className="metric-change">{metrics.completedTests} completed</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.totalPrompts}</div>
          <div className="metric-label">Prompt Templates</div>
          <div className="metric-change">{metrics.teamMembers} team members</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Recent Experiments */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Experiments</h3>
            <a href="/experiments" className="btn btn-ghost btn-sm">View All</a>
          </div>
          <div className="flex flex-col gap-md">
            {recentExperiments.map(exp => (
              <div key={exp.id} className="flex items-center justify-between" style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{exp.name}</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>{exp.objective}</div>
                </div>
                <div className="flex items-center gap-md">
                  <span className={`badge ${exp.status === 'completed' ? 'badge-success' : exp.status === 'running' ? 'badge-info' : 'badge-warning'}`}>
                    {exp.status}
                  </span>
                  {exp.status === 'running' && (
                    <div style={{ width: '60px' }}>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${exp.progress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="flex flex-col">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'experiment' ? '🧬' : activity.type === 'prompt' ? '📝' : '🔀'}
                </div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>{activity.action}</strong> {activity.target}
                  </div>
                  <div className="activity-time">
                    {new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Chart Placeholder */}
      <div className="card mt-lg">
        <div className="card-header">
          <h3 className="card-title">Performance Trends</h3>
        </div>
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
          <div className="text-muted">
            📈 Chart visualization would appear here with experiment performance data
          </div>
        </div>
      </div>
    </div>
  )
}
