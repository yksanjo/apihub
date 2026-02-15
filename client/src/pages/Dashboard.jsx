import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/abtests')
      .then(res => res.json())
      .then(data => {
        setTests(data)
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

  const running = tests.filter(t => t.status === 'running').length
  const completed = tests.filter(t => t.status === 'completed').length

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1>Dashboard</h1>
          <p className="text-secondary mt-sm">Your A/B testing workspace</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href = '/tests?new=true'}>+ New Test</button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-4 mb-lg">
        <div className="metric-card">
          <div className="metric-value">{tests.length}</div>
          <div className="metric-label">Total Tests</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{running}</div>
          <div className="metric-label">Running</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{completed}</div>
          <div className="metric-label">Completed</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{tests.filter(t => t.winner).length}</div>
          <div className="metric-label">Winners Found</div>
        </div>
      </div>

      {/* Recent Tests */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Tests</h3>
          <a href="/tests" className="btn btn-ghost btn-sm">View All</a>
        </div>
        <div className="flex flex-col gap-md">
          {tests.slice(0, 5).map(test => (
            <div key={test.id} className="flex items-center justify-between" style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
              <div>
                <div style={{ fontWeight: 500 }}>{test.name}</div>
                <div className="text-muted" style={{ fontSize: '12px' }}>{test.variants?.length} variants</div>
              </div>
              <div className="flex items-center gap-md">
                <span className={`badge ${test.status === 'completed' ? 'badge-success' : test.status === 'running' ? 'badge-info' : 'badge-warning'}`}>
                  {test.status}
                </span>
                {test.winner && <span className="badge badge-success">Winner: {test.winner.toUpperCase()}</span>}
              </div>
            </div>
          ))}
          {tests.length === 0 && (
            <div className="text-muted" style={{ textAlign: 'center', padding: '20px' }}>
              No tests yet. Create your first A/B test!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
