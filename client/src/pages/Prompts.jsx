import { useState, useEffect } from 'react'

export default function Prompts() {
  const [prompts, setPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDiff, setShowDiff] = useState(null)
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    tags: '',
    teamId: '1',
    createdBy: '1'
  })

  useEffect(() => {
    fetchPrompts()
  }, [])

  const fetchPrompts = () => {
    fetch('/api/prompts')
      .then(res => res.json())
      .then(setPrompts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    }
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        fetchPrompts()
        setShowModal(false)
        setFormData({ name: '', content: '', tags: '', teamId: '1', createdBy: '1' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdate = async (id) => {
    try {
      await fetch(`/api/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedPrompt, createdBy: '1' })
      })
      fetchPrompts()
      setSelectedPrompt(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return
    try {
      await fetch(`/api/prompts/${id}`, { method: 'DELETE' })
      fetchPrompts()
    } catch (err) {
      console.error(err)
    }
  }

  const computeDiff = (oldContent, newContent) => {
    const oldLines = oldContent.split('\n')
    const newLines = newContent.split('\n')
    const diff = []
    
    let i = 0, j = 0
    while (i < oldLines.length || j < newLines.length) {
      if (i >= oldLines.length) {
        diff.push({ type: 'added', content: newLines[j] })
        j++
      } else if (j >= newLines.length) {
        diff.push({ type: 'removed', content: oldLines[i] })
        i++
      } else if (oldLines[i] === newLines[j]) {
        diff.push({ type: 'unchanged', content: oldLines[i] })
        i++
        j++
      } else {
        diff.push({ type: 'removed', content: oldLines[i] })
        diff.push({ type: 'added', content: newLines[j] })
        i++
        j++
      }
    }
    return diff
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center" style={{ height: '50vh' }}>
          <div className="text-secondary">Loading prompts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1>Prompts</h1>
          <p className="text-secondary mt-sm">Manage and version your prompt templates</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Prompt</button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className="tab active">All Prompts</button>
        <button className="tab">Templates</button>
        <button className="tab">Archived</button>
      </div>

      {/* Prompts List */}
      {prompts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-title">No prompts yet</div>
          <div className="empty-state-description">Create your first prompt template</div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Create Prompt</button>
        </div>
      ) : (
        <div className="flex flex-col gap-md">
          {prompts.map(prompt => (
            <div key={prompt.id} className="card">
              <div className="flex items-center justify-between">
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-md">
                    <h3>{prompt.name}</h3>
                    <span className="badge badge-info">v{prompt.version}</span>
                    {prompt.tags.map(tag => (
                      <span key={tag} className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="code-block mt-md" style={{ maxHeight: '100px', overflow: 'hidden' }}>
                    {prompt.content}
                  </div>
                  <div className="flex gap-lg mt-md" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Updated: {new Date(prompt.updatedAt).toLocaleDateString()}</span>
                    <span>{prompt.versions.length} versions</span>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <button className="btn btn-secondary btn-sm" onClick={() => setSelectedPrompt(prompt)}>
                    Edit
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowDiff(prompt)}>
                    History
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(prompt.id)}>
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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Prompt</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Prompt Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Customer Support Prompt"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Prompt Content</label>
                <textarea
                  className="form-input"
                  placeholder="Enter your prompt template..."
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  required
                  style={{ minHeight: '150px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., support, customer-service"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Prompt</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedPrompt && (
        <div className="modal-overlay" onClick={() => setSelectedPrompt(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Prompt - v{selectedPrompt.version + 1}</h2>
              <button className="modal-close" onClick={() => setSelectedPrompt(null)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Prompt Content</label>
              <textarea
                className="form-input"
                value={selectedPrompt.content}
                onChange={e => setSelectedPrompt({ ...selectedPrompt, content: e.target.value })}
                style={{ minHeight: '200px', fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <p className="text-muted" style={{ fontSize: '12px', marginBottom: 'var(--space-md)' }}>
              Saving will create a new version (v{selectedPrompt.version + 1})
            </p>
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setSelectedPrompt(null)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={() => handleUpdate(selectedPrompt.id)}>Save as New Version</button>
            </div>
          </div>
        </div>
      )}

      {/* Version History / Diff Modal */}
      {showDiff && (
        <div className="modal-overlay" onClick={() => setShowDiff(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Version History - {showDiff.name}</h2>
              <button className="modal-close" onClick={() => setShowDiff(null)}>×</button>
            </div>
            <div className="flex flex-col gap-lg">
              {showDiff.versions.slice().reverse().map((version, idx) => {
                const prevVersion = idx < showDiff.versions.length - 1 ? showDiff.versions[showDiff.versions.length - 2 - idx] : null
                const diff = prevVersion ? computeDiff(prevVersion.content, version.content) : null
                
                return (
                  <div key={version.version} className="card" style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="flex items-center justify-between mb-md">
                      <div className="flex items-center gap-md">
                        <span className="badge badge-info">v{version.version}</span>
                        <span className="text-muted" style={{ fontSize: '12px' }}>
                          {new Date(version.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {idx === 0 && <span className="badge badge-success">Latest</span>}
                    </div>
                    {diff ? (
                      <div className="code-block" style={{ background: 'var(--bg-primary)' }}>
                        {diff.map((line, i) => (
                          <div key={i} className={`diff-line ${line.type === 'added' ? 'diff-added' : line.type === 'removed' ? 'diff-removed' : ''}`}>
                            {line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}
                            {line.content}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="code-block" style={{ background: 'var(--bg-primary)' }}>
                        {version.content}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
