import { useState, useEffect } from 'react'

export default function Analytics() {
  const [experiments, setExperiments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/experiments')
      .then(res => res.json())
      .then(setExperiments)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Generate mock fitness data
  const generateFitnessData = (experiment) => {
    const data = []
    let fitness = 0.1 + Math.random() * 0.2
    for (let i = 0; i <= experiment.progress; i++) {
      fitness = Math.min(1, fitness + (Math.random() - 0.3) * 0.1)
      data.push({ generation: i, fitness: fitness })
    }
    return data
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center" style={{ height: '50vh' }}>
          <div className="text-secondary">Loading analytics...</div>
        </div>
      </div>
    )
  }

  const completed = experiments.filter(e => e.status === 'completed')

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1>Analytics</h1>
          <p className="text-secondary mt-sm">Experiment performance insights</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-4 mb-lg">
        <div className="metric-card">
          <div className="metric-value">{experiments.length}</div>
          <div className="metric-label">Total Experiments</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{completed.length}</div>
          <div className="metric-label">Completed</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            {completed.length > 0 ? (completed.reduce((acc, e) => acc + e.progress, 0) / completed.length).toFixed(0) : 0}%
          </div>
          <div className="metric-label">Avg Fitness Score</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{experiments.filter(e => e.status === 'running').length}</div>
          <div className="metric-label">Running</div>
        </div>
      </div>

      {/* Fitness Charts */}
      <div className="flex flex-col gap-lg">
        <h2>Fitness Over Generations</h2>
        {experiments.slice(0, 3).map(exp => {
          const data = generateFitnessData(exp)
          const maxFitness = Math.max(...data.map(d => d.fitness))
          
          return (
            <div key={exp.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{exp.name}</h3>
                <span className={`badge ${exp.status === 'completed' ? 'badge-success' : 'badge-info'}`}>
                  {exp.status}
                </span>
              </div>
              
              {/* Simple bar chart visualization */}
              <div style={{ marginTop: '16px' }}>
                <div className="flex gap-sm" style={{ height: '120px', alignItems: 'flex-end' }}>
                  {data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 20)) === 0).map((d, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${d.fitness * 100}%`,
                        background: `linear-gradient(to top, var(--accent-primary), var(--accent-tertiary))`,
                        borderRadius: '2px 2px 0 0',
                        minHeight: '4px'
                      }}
                      title={`Gen ${d.generation}: ${(d.fitness * 100).toFixed(1)}%`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-sm text-muted" style={{ fontSize: '12px' }}>
                  <span>Generation 0</span>
                  <span>Generation {exp.generations}</span>
                </div>
              </div>

              <div className="grid grid-3 mt-lg">
                <div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Best Fitness</div>
                  <div className="text-success" style={{ fontSize: '20px', fontWeight: 600 }}>
                    {(maxFitness * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Population</div>
                  <div style={{ fontSize: '20px', fontWeight: 600 }}>{exp.populationSize}</div>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Mutation Rate</div>
                  <div style={{ fontSize: '20px', fontWeight: 600 }}>{(exp.mutationRate * 100).toFixed(0)}%</div>
                </div>
              </div>
            </div>
          )
        })}

        {experiments.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📈</div>
            <div className="empty-state-title">No experiments yet</div>
            <div className="empty-state-description">Run an experiment to see analytics</div>
          </div>
        )}
      </div>
    </div>
  )
}
