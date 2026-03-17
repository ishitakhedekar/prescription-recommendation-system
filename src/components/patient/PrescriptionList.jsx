import React, { useState, useEffect } from 'react'
import API from '../../api/axios'

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await API.get('/patients/prescriptions')
        setPrescriptions(res.data.data)
      } catch (err) {
        setError('Failed to load prescriptions')
      } finally {
        setLoading(false)
      }
    }
    fetchPrescriptions()
  }, [])

  if (loading) return <p className="text-sm text-gray-500">Loading prescriptions...</p>
  if (error) return <p className="text-sm text-red-500">{error}</p>
  if (prescriptions.length === 0) return <p className="text-sm text-gray-500">No prescriptions yet.</p>

  return (
    <div className="space-y-4">
      {prescriptions.map((rx) => (
        <div key={rx._id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">{rx.diagnosis}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              rx.status === 'active' ? 'bg-green-100 text-green-700' :
              rx.status === 'completed' ? 'bg-gray-100 text-gray-600' :
              'bg-red-100 text-red-600'
            }`}>
              {rx.status}
            </span>
          </div>
          <p className="text-sm text-gray-600">Doctor: {rx.doctor?.name || 'N/A'}</p>
          <p className="text-sm text-gray-600">Date: {new Date(rx.createdAt).toLocaleDateString()}</p>
          {rx.medications?.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-500 uppercase">Medications</p>
              {rx.medications.map((med, i) => (
                <div key={i} className="text-sm text-gray-700 mt-1">
                  • {med.name} {med.dosage} — {med.frequency} for {med.duration}
                </div>
              ))}
            </div>
          )}
          {rx.notes && <p className="text-sm text-gray-500 mt-2 italic">{rx.notes}</p>}
        </div>
      ))}
    </div>
  )
}

export default PrescriptionList