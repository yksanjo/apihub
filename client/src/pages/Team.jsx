import { useState, useEffect } from 'react'

export default function Team() {
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('members')

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = () => {
    fetch('/api/teams/1')
      .then(res => res.json())
      .then(setTeam)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center" style={{ height: '50vh' }}>
          <div className="text-secondary">Loading team...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1>Team Workspace</h1>
          <p className="text-secondary mt-sm">Collaborate with your team members</p>
        </div>
        <button className="btn btn-primary">+ Invite Member</button>
      </div>

      {/* Team Header */}
      <div className="card mb-lg" style={{ background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)', border: '1px solid var(--accent-primary)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-lg">
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 700
            }}>
              {team.name.charAt(0)}
            </div>
            <div>
              <h2>{team.name}</h2>
              <p className="text-secondary">{team.members?.length || 1} members</p>
            </div>
          </div>
          <div className="flex gap-lg">
            <div className="metric-card" style={{ padding: '12px 24px', textAlign: 'center' }}>
              <div className="metric-value" style={{ fontSize: '24px' }}>{team.experiments?.length || 0}</div>
              <div className="metric-label">Experiments</div>
            </div>
            <div className="metric-card" style={{ padding: '12px 24px', textAlign: 'center' }}>
              <div className="metric-value" style={{ fontSize: '24px' }}>{team.prompts?.length || 0}</div>
              <div className="metric-label">Prompts</div>
            </div>
            <div className="metric-card" style={{ padding: '12px 24px', textAlign: 'center' }}>
              <div className="metric-value" style={{ fontSize: '24px' }}>{team.abTests?.length || 0}</div>
              <div className="metric-label">A/B Tests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button 
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Team Members</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.members?.map(member => (
                  <tr key={member.id}>
                    <td>
                      <div className="flex items-center gap-md">
                        <div className="user-avatar">{member.avatar || member.name?.charAt(0) || 'U'}</div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{member.name}</div>
                          <div className="text-muted" style={{ fontSize: '12px' }}>{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${member.role === 'admin' ? 'badge-info' : 'badge-warning'}`}>
                        {member.role}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">Active</span>
                    </td>
                    <td className="text-muted">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Team Activity</h3>
          </div>
          <div className="flex flex-col">
            {team.activities?.length > 0 ? team.activities.map(activity => (
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
            )) : (
              <div className="empty-state">
                <div className="empty-state-title">No activity yet</div>
                <div className="empty-state-description">Team activity will appear here</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-2">
          <div className="card">
            <h3 className="card-title mb-lg">Team Settings</h3>
            <div className="form-group">
              <label className="form-label">Team Name</label>
              <input type="text" className="form-input" defaultValue={team.name} />
            </div>
            <div className="form-group">
              <label className="form-label">Default Experiment Settings</label>
              <div className="grid grid-3">
                <div>
                  <label className="form-label">Population Size</label>
                  <input type="number" className="form-input" defaultValue="50" />
                </div>
                <div>
                  <label className="form-label">Generations</label>
                  <input type="number" className="form-input" defaultValue="100" />
                </div>
                <div>
                  <label className="form-label">Mutation Rate</label>
                  <input type="number" className="form-input" defaultValue="0.15" step="0.05" />
                </div>
              </div>
            </div>
            <button className="btn btn-primary">Save Settings</button>
          </div>

          <div className="card">
            <h3 className="card-title mb-lg">Danger Zone</h3>
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px' }}>
              <h4 style={{ color: 'var(--error)', marginBottom: '8px' }}>Delete Team</h4>
              <p className="text-secondary mb-md" style={{ fontSize: '13px' }}>
                Once you delete a team, there is no going back. All experiments, prompts, and A/B tests will be permanently deleted.
              </p>
              <button className="btn btn-danger">Delete Team</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
