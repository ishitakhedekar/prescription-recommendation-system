import React, { useState, useEffect } from 'react'
import API from '../../api/axios'

const PatientHistory = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get('/doctors/patients')
        setPatients(res.data.data)
      } catch (err) {
        setError('Failed to load patients')
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [])

  if (loading) return <p className="text-sm text-gray-500">Loading patients...</p>
  if (error) return <p className="text-sm text-red-500">{error}</p>
  if (patients.length === 0) return <p className="text-sm text-gray-500">No patients assigned yet.</p>

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div key={patient._id} className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold">{patient.name}</h3>
          <p className="text-sm text-gray-600">Email: {patient.email}</p>
          <p className="text-sm text-gray-600">Gender: {patient.gender || 'N/A'}</p>
          <p className="text-sm text-gray-600">Blood Group: {patient.bloodGroup || 'N/A'}</p>
          {patient.allergies?.length > 0 && (
            <p className="text-sm text-red-500">Allergies: {patient.allergies.join(', ')}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default PatientHistory