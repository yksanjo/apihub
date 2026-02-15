import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Prompts from './pages/Prompts'
import Templates from './pages/Templates'
import Team from './pages/Team'

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-logo">
            <div className="navbar-logo-icon">📝</div>
            <span>PromptLab</span>
          </div>
          <div className="navbar-nav">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Dashboard
            </NavLink>
            <NavLink to="/prompts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Prompts
            </NavLink>
            <NavLink to="/templates" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Templates
            </NavLink>
            <NavLink to="/team" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Team
            </NavLink>
          </div>
          <div className="navbar-user">
            <div className="user-avatar">P</div>
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
              <NavLink to="/prompts" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <span className="sidebar-icon">📝</span>
                Prompts
              </NavLink>
              <NavLink to="/templates" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <span className="sidebar-icon">📋</span>
                Templates
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
              <button className="sidebar-link" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }} onClick={() => window.location.href = '/prompts?new=true'}>
                <span className="sidebar-icon">➕</span>
                New Prompt
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/team" element={<Team />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
