import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './Signup'
import Login from './Login'
import Dashboard from './pages/Dashboard'
import ProjectDetail from './pages/ProjectDetail'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public Routes - Only accessible when NOT logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<Login isAdmin={true} />} />
          </Route>

          {/* Protected Routes - Only accessible when logged in */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
            </Route>
          </Route>

          {/* Default redirect to signup if not logged in, or dashboard if logged in */}
          <Route path="/" element={<Navigate to="/signup" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
