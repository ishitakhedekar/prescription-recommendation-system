import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const DoctorDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ patients: 0, prescriptions: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, prescriptionsRes] = await Promise.all([
          API.get('/doctors/patients'),
          API.get('/doctors/prescriptions'),
        ])
        setStats({
          patients: patientsRes.data.count,
          prescriptions: prescriptionsRes.data.count,
        })
      } catch (err) {
        console.error('Failed to load stats')
      }
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Assigned Patients', value: stats.patients, icon: '👥', color: 'bg-blue-50 border-blue-200', text: 'text-blue-700', link: '/doctor/patients' },
    { label: 'Prescriptions Issued', value: stats.prescriptions, icon: '📋', color: 'bg-green-50 border-green-200', text: 'text-green-700', link: '/doctor/prescriptions' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good morning, {user?.name} 👋</h1>
        <p className="text-gray-500 mt-1">Here's an overview of your practice today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card) => (
          <Link to={card.link} key={card.label}>
            <div className={`border ${card.color} rounded-xl p-6 flex items-center space-x-5 hover:shadow-md transition cursor-pointer`}>
              <div className="text-4xl">{card.icon}</div>
              <div>
                <p className={`text-3xl font-bold ${card.text}`}>{card.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/doctor/prescriptions" className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl p-5 flex items-center space-x-3 transition">
            <span className="text-2xl">✍️</span>
            <div>
              <p className="font-semibold">New Prescription</p>
              <p className="text-blue-200 text-xs">Create for a patient</p>
            </div>
          </Link>
          <Link to="/doctor/patients" className="bg-white border border-gray-200 hover:border-blue-300 text-gray-800 rounded-xl p-5 flex items-center space-x-3 transition">
            <span className="text-2xl">👥</span>
            <div>
              <p className="font-semibold">View Patients</p>
              <p className="text-gray-400 text-xs">See assigned patients</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard