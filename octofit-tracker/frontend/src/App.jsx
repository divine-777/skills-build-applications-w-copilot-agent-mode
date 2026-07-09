import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import logo from '../../docs/octofitapp-small.png'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'

function App() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME
  const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api'

  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-white border-bottom">
        <div className="container py-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <img src={logo} alt="OctoFit logo" width="48" height="48" />
            <div>
              <h1 className="h4 mb-0">OctoFit Tracker</h1>
              <p className="mb-0 text-secondary small">React 19 presentation tier</p>
            </div>
          </div>
          <nav className="d-flex flex-wrap gap-2">
            <NavLink className="btn btn-outline-primary btn-sm" to="/users">Users</NavLink>
            <NavLink className="btn btn-outline-primary btn-sm" to="/teams">Teams</NavLink>
            <NavLink className="btn btn-outline-primary btn-sm" to="/activities">Activities</NavLink>
            <NavLink className="btn btn-outline-primary btn-sm" to="/leaderboard">Leaderboard</NavLink>
            <NavLink className="btn btn-outline-primary btn-sm" to="/workouts">Workouts</NavLink>
          </nav>
        </div>
      </header>

      <main className="container py-4">
        <div className="alert alert-info" role="alert">
          Define VITE_CODESPACE_NAME in .env.local for Codespaces URLs.
          Example: VITE_CODESPACE_NAME=your-codespace-name
          <br />
          Safe fallback when undefined: {apiBaseUrl}
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
