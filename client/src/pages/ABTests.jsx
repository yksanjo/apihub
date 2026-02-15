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

  const handleDelete = async (id) => {
    if (!confirm('Delete this test?')) return
    try {
      await fetch(`/api/abtests/${id}`, { method: 'DELETE' })
      fetchTests()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center" style={{ height: '50vh' }}>
          <div className="text-secondary">Loading tests...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1>A/B Tests</h1>
          <p className="text-secondary mt-sm">Compare prompt variants</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Test</button>
      </div>

      {/* Tests List */}
      {tests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔀</div>
          <div className="empty-state-title">No tests yet</div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Create Test</button>
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
                </div>
                <div className="flex items-center gap-md" style={{ marginLeft: '24px' }}>
                  {test.status === 'draft' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleStart(test.id)}>Start</button>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(test.id)}>Delete</button>
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
              <h2 className="modal-title">New A/B Test</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Test Name</label>
                <input type="text" className="form-input" placeholder="e.g., Greeting Test" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" placeholder="What are you testing?" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Test</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
