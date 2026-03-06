import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Sidebar from './components/common/Sidebar'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/common/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import ProfilePage from './pages/ProfilePage'

import DoctorDashboard from './pages/DoctorDashboard'
import PatientDashboard from './pages/PatientDashboard'
import AdminDashboard from './pages/AdminDashboard'

import PatientHistory from './components/doctor/PatientHistory'
import CreatePrescription from './components/doctor/CreatePrescription'
import PrescriptionList from './components/patient/PrescriptionList'
import OCRUpload from './components/patient/OCRUpload'
import Teleconsultation from './components/patient/Teleconsultation'
import Chatbot from './components/patient/Chatbot'
import InsurancePharmacy from './components/patient/InsurancePharmacy'
import UserManagement from './components/admin/UserManagement'
import Analytics from './components/admin/Analytics'

function App() {
  const { user } = useAuth()

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {user && <Sidebar />}
        <div className="flex-1 flex flex-col overflow-hidden">
          {user && <Navbar />}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Profile — all roles */}
              <Route path="/profile" element={<ProtectedRoute allowedRoles={['doctor', 'patient', 'admin']}><ProfilePage /></ProtectedRoute>} />

              {/* Doctor */}
              <Route path="/doctor-dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
              <Route path="/doctor/patients" element={<ProtectedRoute allowedRoles={['doctor']}><PatientHistory /></ProtectedRoute>} />
              <Route path="/doctor/prescriptions" element={<ProtectedRoute allowedRoles={['doctor']}><CreatePrescription /></ProtectedRoute>} />

              {/* Patient */}
              <Route path="/patient-dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
              <Route path="/patient/prescriptions" element={<ProtectedRoute allowedRoles={['patient']}><PrescriptionList /></ProtectedRoute>} />
              <Route path="/patient/ocr" element={<ProtectedRoute allowedRoles={['patient']}><OCRUpload /></ProtectedRoute>} />
              <Route path="/patient/teleconsultation" element={<ProtectedRoute allowedRoles={['patient']}><Teleconsultation /></ProtectedRoute>} />
              <Route path="/patient/chatbot" element={<ProtectedRoute allowedRoles={['patient']}><Chatbot /></ProtectedRoute>} />
              <Route path="/patient/insurance" element={<ProtectedRoute allowedRoles={['patient']}><InsurancePharmacy /></ProtectedRoute>} />

              {/* Admin */}
              <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><Analytics /></ProtectedRoute>} />

              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App