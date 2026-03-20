import React, { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'
import API from '../../api/axios'

const COLORS = ['#1d4ed8', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#be123c', '#ca8a04', '#475569']

const Analytics = () => {
  const [stats, setStats] = useState(null)
  const [topDrugs, setTopDrugs] = useState([])
  const [overTime, setOverTime] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, drugsRes, timeRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/analytics/top-drugs'),
          API.get('/admin/analytics/prescriptions-over-time'),
        ])
        setStats(statsRes.data.data)
        setTopDrugs(drugsRes.data.data)
        setOverTime(timeRes.data.data)
      } catch (err) {
        console.error('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-sm text-gray-400">Loading analytics...</p>
    </div>
  )

  const pieData = stats ? [
    { name: 'Doctors', value: stats.totalDoctors },
    { name: 'Patients', value: stats.totalPatients },
  ] : []

  const statusData = stats ? [
    { name: 'Active', value: stats.activePrescriptions },
    { name: 'Other', value: stats.totalPrescriptions - stats.activePrescriptions },
  ] : []

  return (
    <div className="space-y-8">

      {/* Stat summary cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Doctors', value: stats.totalDoctors, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: '👨‍⚕️' },
            { label: 'Patients', value: stats.totalPatients, color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: '👥' },
            { label: 'Total Prescriptions', value: stats.totalPrescriptions, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: '📋' },
            { label: 'Active Prescriptions', value: stats.activePrescriptions, color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: '✅' },
          ].map((s) => (
            <div key={s.label} className={`border ${s.bg} rounded-xl p-4 flex items-center space-x-3`}>
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescriptions over time */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">📈 Prescriptions Over Time</h3>
        {overTime.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Not enough data yet — create some prescriptions first.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={overTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="prescriptions" stroke="#1d4ed8" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top drugs */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">💊 Top Prescribed Drugs</h3>
        {topDrugs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No prescription data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topDrugs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="prescriptions" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">👥 User Breakdown</h3>
          {pieData.every(d => d.value === 0) ? (
            <p className="text-sm text-gray-400 text-center py-8">No user data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">📋 Prescription Status</h3>
          {statusData.every(d => d.value === 0) ? (
            <p className="text-sm text-gray-400 text-center py-8">No prescription data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  )
}

export default Analytics