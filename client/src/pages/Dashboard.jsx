import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/prompts')
      .then(res => res.json())
      .then(prompts => {
        setData({
          metrics: {
            totalPrompts: prompts.length,
            versions: prompts.reduce((acc, p) => acc + (p.versions?.length || 1), 0),
            avgVersion: prompts.length > 0 ? (prompts.reduce((acc, p) => acc + (p.version || 1), 0) / prompts.length).toFixed(1) : 0
          },
          recentPrompts: prompts.slice(0, 5)
        })
      })
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

  const { metrics, recentPrompts } = data || { metrics: {}, recentPrompts: [] }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1>Dashboard</h1>
          <p className="text-secondary mt-sm">Your prompt engineering workspace</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href = '/prompts?new=true'}>+ New Prompt</button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-4 mb-lg">
        <div className="metric-card">
          <div className="metric-value">{metrics.totalPrompts}</div>
          <div className="metric-label">Total Prompts</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.versions}</div>
          <div className="metric-label">Total Versions</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.avgVersion}</div>
          <div className="metric-label">Avg. Version</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">1</div>
          <div className="metric-label">Team Members</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Recent Prompts */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Prompts</h3>
            <a href="/prompts" className="btn btn-ghost btn-sm">View All</a>
          </div>
          <div className="flex flex-col gap-md">
            {recentPrompts.map(prompt => (
              <div key={prompt.id} className="flex items-center justify-between" style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{prompt.name}</div>
                  <div className="text-muted" style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                    {prompt.content?.substring(0, 60)}...
                  </div>
                </div>
                <span className="badge badge-info">v{prompt.version}</span>
              </div>
            ))}
            {recentPrompts.length === 0 && (
              <div className="text-muted" style={{ textAlign: 'center', padding: '20px' }}>
                No prompts yet. Create your first prompt!
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="flex flex-col gap-md">
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => window.location.href = '/templates'}>
              📋 Browse Templates
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => window.location.href = '/prompts?new=true'}>
              ➕ Create New Prompt
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              📤 Import Prompts
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
