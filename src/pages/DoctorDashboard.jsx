import React from 'react'
import CreatePrescription from '../components/doctor/CreatePrescription'
import PatientHistory from '../components/doctor/PatientHistory'
import DrugInteractionChecker from '../components/doctor/DrugInteractionChecker'

const DoctorDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create Prescription</h2>
          <CreatePrescription />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Patient History</h2>
          <PatientHistory />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Drug Interaction Checker</h2>
          <DrugInteractionChecker />
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
