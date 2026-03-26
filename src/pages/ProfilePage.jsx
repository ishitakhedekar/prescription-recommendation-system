import React from 'react'
import { useAuth } from '../context/AuthContext'
import DoctorProfile from '../components/profile/DoctorProfile'
import PatientProfile from '../components/profile/PatientProfile'
import AdminProfile from '../components/profile/AdminProfile'
import ChangePassword from '../components/profile/ChangePassword'

const ProfilePage = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">View and update your personal information.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {user?.role === 'doctor' && <DoctorProfile />}
        {user?.role === 'patient' && <PatientProfile />}
        {user?.role === 'admin' && <AdminProfile />}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <ChangePassword />
      </div>
    </div>
  )
}

export default ProfilePage