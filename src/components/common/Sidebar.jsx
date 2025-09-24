import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { name: 'Dashboard', path: '/patient-dashboard', icon: '📊' },
    { name: 'Prescriptions', path: '/prescriptions', icon: '📋' },
    { name: 'OCR Upload', path: '/ocr-upload', icon: '📷' },
    { name: 'Teleconsultation', path: '/teleconsultation', icon: '📹' },
    { name: 'Chatbot', path: '/chatbot', icon: '🤖' },
    { name: 'Insurance & Pharmacy', path: '/insurance-pharmacy', icon: '🏥' },
  ]

  return (
    <div className="w-64 bg-white shadow-sm">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
          <h2 className="text-xl font-bold">Menu</h2>
        </div>
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
