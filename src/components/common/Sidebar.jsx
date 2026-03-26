import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const doctorMenu = [
  { name: 'Dashboard', path: '/doctor-dashboard', icon: '📊' },
  { name: 'My Patients', path: '/doctor/patients', icon: '👥' },
  { name: 'Prescriptions', path: '/doctor/prescriptions', icon: '📋' },
  { name: 'Drug Checker', path: '/doctor/drug-checker', icon: '💊' }, 
  { name: 'My Profile', path: '/profile', icon: '👤' },
]

const patientMenu = [
  { name: 'Dashboard', path: '/patient-dashboard', icon: '📊' },
  { name: 'My Prescriptions', path: '/patient/prescriptions', icon: '📋' },
  { name: 'OCR Upload', path: '/patient/ocr', icon: '📷' },
  { name: 'Teleconsultation', path: '/patient/teleconsultation', icon: '📹' },
  { name: 'AI Chatbot', path: '/patient/chatbot', icon: '🤖' },
  { name: 'Insurance & Pharmacy', path: '/patient/insurance', icon: '🏥' },
  { name: 'My Profile', path: '/profile', icon: '👤' },
]

const adminMenu = [
  { name: 'Dashboard', path: '/admin-dashboard', icon: '📊' },
  { name: 'User Management', path: '/admin/users', icon: '👥' },
  { name: 'Analytics', path: '/admin/analytics', icon: '📈' },
  { name: 'My Profile', path: '/profile', icon: '👤' },
]

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

  const menuItems =
    user?.role === 'doctor' ? doctorMenu :
    user?.role === 'admin' ? adminMenu :
    patientMenu

  const roleGradients = {
    doctor: 'from-blue-700 to-blue-800',
    patient: 'from-green-600 to-green-700',
    admin: 'from-purple-700 to-purple-800',
  }

  return (
    <div className="w-64 bg-white shadow-md flex flex-col h-full border-r border-gray-100">
      <div className={`bg-gradient-to-b ${roleGradients[user?.role] || 'from-blue-700 to-blue-800'} px-6 py-5`}>
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white text-lg">
            {user?.role === 'doctor' ? '👨‍⚕️' : user?.role === 'admin' ? '⚙️' : '👤'}
          </div>
          <div>
            <p className="text-white font-semibold text-sm truncate max-w-32">{user?.name}</p>
            <p className="text-blue-200 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
              }`}
            >
              <span className="mr-3 text-base">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">MediScript © 2026</p>
      </div>
    </div>
  )
}

export default Sidebar