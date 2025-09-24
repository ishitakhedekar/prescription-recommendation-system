import React, { useState } from 'react'

const PatientHistory = () => {
  const [patients] = useState([
    { id: 1, name: 'John Doe', lastVisit: '2023-10-01', prescriptions: ['Amoxicillin', 'Ibuprofen'] },
    { id: 2, name: 'Jane Smith', lastVisit: '2023-10-05', prescriptions: ['Paracetamol'] },
  ])

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div key={patient.id} className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold">{patient.name}</h3>
          <p className="text-sm text-gray-600">Last Visit: {patient.lastVisit}</p>
          <p className="text-sm text-gray-600">Prescriptions: {patient.prescriptions.join(', ')}</p>
        </div>
      ))}
    </div>
  )
}

export default PatientHistory
