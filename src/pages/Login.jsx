import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await API.post('/auth/login', { email, password })
      const { token, user } = res.data
      login(user, token)
      if (user.role === 'patient') navigate('/patient-dashboard')
      else if (user.role === 'doctor') navigate('/doctor-dashboard')
      else if (user.role === 'admin') navigate('/admin-dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 flex-col justify-between p-12">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-700 text-xl">🏥</span>
            </div>
            <span className="text-white text-xl font-bold tracking-wide">MediScript</span>
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Digital Prescriptions.<br />
            <span className="text-blue-200">Simplified.</span>
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Manage patient prescriptions, medical history, and healthcare workflows — all in one secure platform.
          </p>
          <div className="flex space-x-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-blue-300 text-sm">Doctors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">10k+</p>
              <p className="text-blue-300 text-sm">Patients</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">50k+</p>
              <p className="text-blue-300 text-sm">Prescriptions</p>
            </div>
          </div>
        </div>
        <p className="text-blue-400 text-sm">© 2026 MediScript. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-700 font-semibold hover:underline">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login