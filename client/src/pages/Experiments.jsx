import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Experiments() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [experiments, setExperiments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(searchParams.get('new') === 'true')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    objective: '',
    populationSize: 50,
    generations: 100,
    mutationRate: 0.15,
    teamId: '1',
    createdBy: '1'
  })

  useEffect(() => {
    fetchExperiments()
  }, [])

  const fetchExperiments = () => {
    fetch('/api/experiments')
      .then(res => res.json())
      .then(setExperiments)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        fetchExperiments()
        setShowModal(false)
        setSearchParams({})
        setFormData({
          name: '',
          description: '',
          objective: '',
          populationSize: 50,
          generations: 100,
          mutationRate: 0.15,
          teamId: '1',
          createdBy: '1'
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experiment?')) return
    try {
      await fetch(`/api/experiments/${id}`, { method: 'DELETE' })
      fetchExperiments()
    } catch (err) {
      console.error(err)
    }
  }

  const handleStart = async (id) => {
    try {
      await fetch(`/api/experiments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'running' })
      })
      fetchExperiments()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center" style={{ height: '50vh' }}>
          <div className="text-secondary">Loading experiments...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1>Experiments</h1>
          <p className="text-secondary mt-sm">Manage your evolutionary optimization experiments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Experiment</button>
      </div>

      {/* Filters */}
      <div className="flex gap-md mb-lg">
        <button className="btn btn-secondary btn-sm">All</button>
        <button className="btn btn-ghost btn-sm">Running</button>
        <button className="btn btn-ghost btn-sm">Completed</button>
        <button className="btn btn-ghost btn-sm">Pending</button>
      </div>

      {/* Experiments List */}
      {experiments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🧬</div>
          <div className="empty-state-title">No experiments yet</div>
          <div className="empty-state-description">Create your first evolutionary optimization experiment</div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Create Experiment</button>
        </div>
      ) : (
        <div className="flex flex-col gap-md">
          {experiments.map(exp => (
            <div key={exp.id} className="card">
              <div className="flex items-center justify-between">
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-md">
                    <h3>{exp.name}</h3>
                    <span className={`badge ${exp.status === 'completed' ? 'badge-success' : exp.status === 'running' ? 'badge-info' : 'badge-warning'}`}>
                      {exp.status}
                    </span>
                  </div>
                  <p className="text-secondary mt-sm">{exp.description}</p>
                  <div className="flex gap-lg mt-md" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Population: {exp.populationSize}</span>
                    <span>Generations: {exp.generations}</span>
                    <span>Mutation: {exp.mutationRate * 100}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  {exp.status === 'running' && (
                    <div style={{ width: '120px' }}>
                      <div className="flex justify-between mb-sm" style={{ fontSize: '12px' }}>
                        <span className="text-muted">Progress</span>
                        <span className="text-accent">{exp.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${exp.progress}%` }}></div>
                      </div>
                    </div>
                  )}
                  {exp.status === 'pending' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleStart(exp.id)}>
                      Start
                    </button>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(exp.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setSearchParams({}) }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Experiment</h2>
              <button className="modal-close" onClick={() => { setShowModal(false); setSearchParams({}) }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Experiment Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Prompt Optimization v2"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  placeholder="Describe the experiment objectives..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Objective</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Maximize response quality"
                  value={formData.objective}
                  onChange={e => setFormData({ ...formData, objective: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-3">
                <div className="form-group">
                  <label className="form-label">Population Size</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.populationSize}
                    onChange={e => setFormData({ ...formData, populationSize: parseInt(e.target.value) })}
                    min="10"
                    max="1000"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Generations</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.generations}
                    onChange={e => setFormData({ ...formData, generations: parseInt(e.target.value) })}
                    min="10"
                    max="1000"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mutation Rate</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.mutationRate}
                    onChange={e => setFormData({ ...formData, mutationRate: parseFloat(e.target.value) })}
                    min="0"
                    max="1"
                    step="0.05"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => { setShowModal(false); setSearchParams({}) }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Experiment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
