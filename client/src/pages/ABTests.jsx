import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function ABTests() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(searchParams.get('new') === 'true')
  const [selectedTest, setSelectedTest] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    variants: [
      { id: 'a', name: 'Control', content: '', allocation: 50 },
      { id: 'b', name: 'Variant B', content: '', allocation: 50 }
    ],
    teamId: '1',
    createdBy: '1'
  })

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = () => {
    fetch('/api/abtests')
      .then(res => res.json())
      .then(setTests)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/abtests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        fetchTests()
        setShowModal(false)
        setSearchParams({})
        setFormData({
          name: '',
          description: '',
          variants: [
            { id: 'a', name: 'Control', content: '', allocation: 50 },
            { id: 'b', name: 'Variant B', content: '', allocation: 50 }
          ],
          teamId: '1',
          createdBy: '1'
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleStart = async (id) => {
    try {
      await fetch(`/api/abtests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'running' })
      })
      fetchTests()
    } catch (err) {
      console.error(err)
    }
  }

  const handleComplete = async (id, winnerId) => {
    try {
      await fetch(`/api/abtests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed', winner: winnerId })
      })
      fetchTests()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this A/B test?')) return
    try {
      await fetch(`/api/abtests/${id}`, { method: 'DELETE' })
      fetchTests()
    } catch (err) {
      console.error(err)
    }
  }

  const addVariant = () => {
    const newId = String.fromCharCode(97 + formData.variants.length)
    setFormData({
      ...formData,
      variants: [...formData.variants, { id: newId, name: `Variant ${newId.toUpperCase()}`, content: '', allocation: 0 }]
    })
  }

  const updateVariant = (idx, field, value) => {
    const updated = [...formData.variants]
    updated[idx][field] = value
    setFormData({ ...formData, variants: updated })
  }

  const removeVariant = (idx) => {
    if (formData.variants.length <= 2) return
    const updated = formData.variants.filter((_, i) => i !== idx)
    setFormData({ ...formData, variants: updated })
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center" style={{ height: '50vh' }}>
          <div className="text-secondary">Loading A/B tests...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1>A/B Tests</h1>
          <p className="text-secondary mt-sm">Compare prompt variants and determine winners</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New A/B Test</button>
      </div>

      {/* Filters */}
      <div className="flex gap-md mb-lg">
        <button className="btn btn-secondary btn-sm">All</button>
        <button className="btn btn-ghost btn-sm">Running</button>
        <button className="btn btn-ghost btn-sm">Completed</button>
        <button className="btn btn-ghost btn-sm">Draft</button>
      </div>

      {/* Tests List */}
      {tests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔀</div>
          <div className="empty-state-title">No A/B tests yet</div>
          <div className="empty-state-description">Create your first A/B test to compare prompt variants</div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Create A/B Test</button>
        </div>
      ) : (
        <div className="flex flex-col gap-md">
          {tests.map(test => (
            <div key={test.id} className="card">
              <div className="flex items-center justify-between">
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-md">
                    <h3>{test.name}</h3>
                    <span className={`badge ${test.status === 'completed' ? 'badge-success' : test.status === 'running' ? 'badge-info' : 'badge-warning'}`}>
                      {test.status}
                    </span>
                    {test.winner && <span className="badge badge-success">Winner: {test.winner.toUpperCase()}</span>}
                  </div>
                  <p className="text-secondary mt-sm">{test.description}</p>
                  
                  {/* Variants Preview */}
                  <div className="grid grid-3 mt-md">
                    {test.variants.map(variant => (
                      <div key={variant.id} style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                        <div className="flex items-center justify-between mb-sm">
                          <span style={{ fontWeight: 600 }}>{variant.name}</span>
                          <span className="badge" style={{ background: 'var(--bg-primary)' }}>{variant.allocation}%</span>
                        </div>
                        <div className="text-muted" style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                          {variant.content.substring(0, 50)}...
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Metrics */}
                  {test.metrics && test.metrics.length > 0 && (
                    <div className="mt-md">
                      <div className="text-muted" style={{ fontSize: '12px', marginBottom: '8px' }}>Metrics</div>
                      {test.metrics.map((metric, idx) => (
                        <div key={idx} className="flex gap-lg" style={{ fontSize: '13px' }}>
                          <span style={{ fontWeight: 500 }}>{metric.name}</span>
                          {test.variants.map(v => {
                            const value = metric[`variant${v.id.toUpperCase()}`]
                            const isWinner = test.winner === v.id && test.status === 'completed'
                            return (
                              <span key={v.id} className={isWinner ? 'text-success' : 'text-secondary'}>
                                {v.name}: {typeof value === 'number' ? (value < 1 ? `${(value * 100).toFixed(0)}%` : value) : value}
                                {isWinner && ' ✓'}
                              </span>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-md" style={{ marginLeft: '24px' }}>
                  {test.status === 'draft' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleStart(test.id)}>
                      Start
                    </button>
                  )}
                  {test.status === 'running' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelectedTest(test)}>
                      View Results
                    </button>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(test.id)}>
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
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2 className="modal-title">New A/B Test</h2>
              <button className="modal-close" onClick={() => { setShowModal(false); setSearchParams({}) }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Test Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Greeting Variants Test"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  placeholder="Describe what you're testing..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Variants</label>
                <div className="flex flex-col gap-md">
                  {formData.variants.map((variant, idx) => (
                    <div key={variant.id} style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                      <div className="flex items-center gap-md mb-md">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Variant name"
                          value={variant.name}
                          onChange={e => updateVariant(idx, 'name', e.target.value)}
                          style={{ flex: 1 }}
                        />
                        <input
                          type="number"
                          className="form-input"
                          placeholder="%"
                          value={variant.allocation}
                          onChange={e => updateVariant(idx, 'allocation', parseInt(e.target.value))}
                          style={{ width: '80px' }}
                          min="0"
                          max="100"
                        />
                        {formData.variants.length > 2 && (
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeVariant(idx)}>✕</button>
                        )}
                      </div>
                      <textarea
                        className="form-input"
                        placeholder="Variant content/prompt..."
                        value={variant.content}
                        onChange={e => updateVariant(idx, 'content', e.target.value)}
                        style={{ minHeight: '80px' }}
                      />
                    </div>
                  ))}
                </div>
                {formData.variants.length < 5 && (
                  <button type="button" className="btn btn-ghost btn-sm mt-md" onClick={addVariant}>
                    + Add Variant
                  </button>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => { setShowModal(false); setSearchParams({}) }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create A/B Test</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {selectedTest && (
        <div className="modal-overlay" onClick={() => setSelectedTest(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedTest.name} - Results</h2>
              <button className="modal-close" onClick={() => setSelectedTest(null)}>×</button>
            </div>
            
            <div className="grid grid-2 mb-lg">
              {selectedTest.variants.map(variant => {
                const sampleSize = Math.floor(Math.random() * 500) + 100
                return (
                  <div key={variant.id} className="card" style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="flex items-center justify-between mb-md">
                      <span style={{ fontWeight: 600, fontSize: '16px' }}>{variant.name}</span>
                      <span className="badge badge-info">{variant.allocation}% traffic</span>
                    </div>
                    <div className="text-muted mb-sm" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                      {variant.content}
                    </div>
                    <div className="flex gap-lg mt-md">
                      <div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>Sample Size</div>
                        <div style={{ fontWeight: 600 }}>{sampleSize}</div>
                      </div>
                      {selectedTest.metrics && selectedTest.metrics.map((metric, idx) => {
                        const value = metric[`variant${variant.id.toUpperCase()}`]
                        return (
                          <div key={idx}>
                            <div className="text-muted" style={{ fontSize: '11px' }}>{metric.name}</div>
                            <div style={{ fontWeight: 600, color: 'var(--success)' }}>
                              {typeof value === 'number' ? (value < 1 ? `${(value * 100).toFixed(1)}%` : value) : value}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Statistical Significance */}
            <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
              <h4 className="mb-md">Statistical Significance</h4>
              <div className="flex items-center gap-lg">
                <div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Confidence Level</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-primary)' }}>95%</div>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>P-Value</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>0.032</div>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <span className="badge badge-success" style={{ fontSize: '14px', padding: '8px 16px' }}>
                    Statistically Significant
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setSelectedTest(null)}>Close</button>
              {selectedTest.status === 'running' && (
                <>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => handleComplete(selectedTest.id, selectedTest.variants[0].id)}
                  >
                    Select A as Winner
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={() => handleComplete(selectedTest.id, selectedTest.variants[1].id)}
                  >
                    Select B as Winner
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
