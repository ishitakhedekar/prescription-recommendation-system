import React from 'react'
import PrescriptionList from '../components/patient/PrescriptionList'
import OCRUpload from '../components/patient/OCRUpload'
import Teleconsultation from '../components/patient/Teleconsultation'
import Chatbot from '../components/patient/Chatbot'
import InsurancePharmacy from '../components/patient/InsurancePharmacy'

const PatientDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Prescriptions</h2>
          <PrescriptionList />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">OCR Upload</h2>
          <OCRUpload />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Teleconsultation</h2>
          <Teleconsultation />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">AI Chatbot</h2>
          <Chatbot />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Insurance & Pharmacy</h2>
          <InsurancePharmacy />
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
