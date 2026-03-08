import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleColors = {
    doctor: 'bg-blue-100 text-blue-700',
    patient: 'bg-green-100 text-green-700',
    admin: 'bg-purple-100 text-purple-700',
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="text-blue-700 text-xl">🏥</span>
        <span className="text-lg font-bold text-gray-800 tracking-wide">MediScript</span>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}>
              {user.role}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition"
        >
          <span>Sign out</span>
        </button>
      </div>
    </header>
  )
}

export default Navbar