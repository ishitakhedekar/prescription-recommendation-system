import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const PatientDashboard = () => {
  const { user } = useAuth()
  const [prescriptionCount, setPrescriptionCount] = useState(0)
  const [doctor, setDoctor] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rxRes, profileRes] = await Promise.all([
          API.get('/patients/prescriptions'),
          API.get('/patients/profile'),
        ])
        setPrescriptionCount(rxRes.data.count)
        setDoctor(profileRes.data.data.assignedDoctor)
      } catch (err) {
        console.error('Failed to load data')
      }
    }
    fetchData()
  }, [])

  const quickLinks = [
    { label: 'My Prescriptions', icon: '📋', path: '/patient/prescriptions', color: 'bg-green-50 border-green-200 text-green-700' },
    { label: 'Upload Prescription', icon: '📷', path: '/patient/ocr', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { label: 'Teleconsultation', icon: '📹', path: '/patient/teleconsultation', color: 'bg-purple-50 border-purple-200 text-purple-700' },
    { label: 'AI Chatbot', icon: '🤖', path: '/patient/chatbot', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
    { label: 'Insurance & Pharmacy', icon: '🏥', path: '/patient/insurance', color: 'bg-red-50 border-red-200 text-red-700' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name} 👋</h1>
        <p className="text-gray-500 mt-1">Here's your health summary.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center space-x-5">
          <span className="text-4xl">📋</span>
          <div>
            <p className="text-3xl font-bold text-green-700">{prescriptionCount}</p>
            <p className="text-sm text-gray-500">Total Prescriptions</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center space-x-5">
          <span className="text-4xl">👨‍⚕️</span>
          <div>
            <p className="text-lg font-bold text-blue-700">{doctor?.name || 'Not assigned'}</p>
            <p className="text-sm text-gray-500">Assigned Doctor</p>
            {doctor?.specialization && <p className="text-xs text-blue-400">{doctor.specialization}</p>}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {quickLinks.map((item) => (
            <Link key={item.label} to={item.path}>
              <div className={`border ${item.color} rounded-xl p-4 flex flex-col items-center space-y-2 hover:shadow-md transition cursor-pointer text-center`}>
                <span className="text-3xl">{item.icon}</span>
                <p className="text-sm font-medium">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard