import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Analytics = () => {
  const data = [
    { name: 'Amoxicillin', prescriptions: 400 },
    { name: 'Ibuprofen', prescriptions: 300 },
    { name: 'Paracetamol', prescriptions: 200 },
    { name: 'Aspirin', prescriptions: 100 },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Top Prescribed Drugs</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="prescriptions" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Analytics
