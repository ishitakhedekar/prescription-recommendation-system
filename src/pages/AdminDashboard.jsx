import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalPrescriptions: 0, activePrescriptions: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/stats')
        setStats(res.data.data)
      } catch (err) {
        console.error('Failed to load stats')
      }
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Total Doctors', value: stats.totalDoctors, icon: '👨‍⚕️', color: 'bg-blue-50 border-blue-200', text: 'text-blue-700', link: '/admin/users' },
    { label: 'Total Patients', value: stats.totalPatients, icon: '👥', color: 'bg-green-50 border-green-200', text: 'text-green-700', link: '/admin/users' },
    { label: 'Total Prescriptions', value: stats.totalPrescriptions, icon: '📋', color: 'bg-purple-50 border-purple-200', text: 'text-purple-700', link: '/admin/analytics' },
    { label: 'Active Prescriptions', value: stats.activePrescriptions, icon: '✅', color: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', link: '/admin/analytics' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard ⚙️</h1>
        <p className="text-gray-500 mt-1">System overview and management.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link to={card.link} key={card.label}>
            <div className={`border ${card.color} rounded-xl p-6 flex items-center space-x-4 hover:shadow-md transition cursor-pointer`}>
              <span className="text-3xl">{card.icon}</span>
              <div>
                <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/admin/users" className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl p-5 flex items-center space-x-3 transition">
            <span className="text-2xl">👥</span>
            <div>
              <p className="font-semibold">Manage Users</p>
              <p className="text-blue-200 text-xs">Assign doctors, activate/deactivate accounts</p>
            </div>
          </Link>
          <Link to="/admin/analytics" className="bg-white border border-gray-200 hover:border-blue-300 text-gray-800 rounded-xl p-5 flex items-center space-x-3 transition">
            <span className="text-2xl">📈</span>
            <div>
              <p className="font-semibold">View Analytics</p>
              <p className="text-gray-400 text-xs">Prescription trends and stats</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard