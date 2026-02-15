import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Experiments from './pages/Experiments'
import Prompts from './pages/Prompts'
import ABTests from './pages/ABTests'
import Team from './pages/Team'

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-logo">
            <div className="navbar-logo-icon">⚡</div>
            <span>GEPA</span>
          </div>
          <div className="navbar-nav">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Dashboard
            </NavLink>
            <NavLink to="/experiments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Experiments
            </NavLink>
            <NavLink to="/prompts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Prompts
            </NavLink>
            <NavLink to="/ab-tests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              A/B Tests
            </NavLink>
            <NavLink to="/team" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Team
            </NavLink>
          </div>
          <div className="navbar-user">
            <div className="user-avatar">A</div>
          </div>
        </nav>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Workspace</div>
            <nav className="sidebar-nav">
              <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
                <span className="sidebar-icon">📊</span>
                Overview
              </NavLink>
              <NavLink to="/experiments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <span className="sidebar-icon">🧬</span>
                Experiments
              </NavLink>
              <NavLink to="/prompts" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <span className="sidebar-icon">📝</span>
                Prompts
              </NavLink>
              <NavLink to="/ab-tests" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <span className="sidebar-icon">🔀</span>
                A/B Tests
              </NavLink>
            </nav>
          </div>
          
          <div className="sidebar-section">
            <div className="sidebar-title">Collaboration</div>
            <nav className="sidebar-nav">
              <NavLink to="/team" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <span className="sidebar-icon">👥</span>
                Team
              </NavLink>
            </nav>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Quick Actions</div>
            <nav className="sidebar-nav">
              <button className="sidebar-link" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }} onClick={() => window.location.href = '/experiments?new=true'}>
                <span className="sidebar-icon">➕</span>
                New Experiment
              </button>
              <button className="sidebar-link" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }} onClick={() => window.location.href = '/ab-tests?new=true'}>
                <span className="sidebar-icon">🧪</span>
                New A/B Test
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/ab-tests" element={<ABTests />} />
            <Route path="/team" element={<Team />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
