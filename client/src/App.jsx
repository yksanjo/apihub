import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Experiments from './pages/Experiments'
import Analytics from './pages/Analytics'

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-logo">
            <div className="navbar-logo-icon">🧬</div>
            <span>EvolutionaryEngine</span>
          </div>
          <div className="navbar-nav">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Dashboard
            </NavLink>
            <NavLink to="/experiments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Experiments
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Analytics
            </NavLink>
          </div>
          <div className="navbar-user">
            <div className="user-avatar">E</div>
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
              <NavLink to="/analytics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <span className="sidebar-icon">📈</span>
                Analytics
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
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
