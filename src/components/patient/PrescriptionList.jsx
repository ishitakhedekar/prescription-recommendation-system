import React, { useState } from 'react'

const PrescriptionList = () => {
  const [prescriptions] = useState([
    { id: 1, date: '2023-10-01', doctor: 'Dr. Smith', medication: 'Amoxicillin', dosage: '500mg' },
    { id: 2, date: '2023-10-05', doctor: 'Dr. Johnson', medication: 'Ibuprofen', dosage: '200mg' },
  ])

  return (
    <div className="space-y-4">
      {prescriptions.map((prescription) => (
        <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold">{prescription.medication}</h3>
          <p className="text-sm text-gray-600">Doctor: {prescription.doctor}</p>
          <p className="text-sm text-gray-600">Date: {prescription.date}</p>
          <p className="text-sm text-gray-600">Dosage: {prescription.dosage}</p>
        </div>
      ))}
    </div>
  )
}

export default PrescriptionList
